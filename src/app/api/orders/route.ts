import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderEmail } from '@/lib/email/send-order-email'
import { isMockMode } from '@/lib/supabase/mock-data'

// Rate limiting: simple in-memory store
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 1000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.timestamp > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Çok fazla istek. Lütfen bekleyin.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { customer_name, customer_email, customer_phone, package_id } = body

    // Validate
    if (!customer_name?.trim() || !customer_email?.trim() || !package_id) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
    }

    // Mock mode: return fake order
    if (isMockMode) {
      const mockOrderNum = `ESM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
      return NextResponse.json({ order_number: mockOrderNum, order_id: 'mock-' + Date.now() })
    }

    // Sanitize
    const sanitizedName = customer_name.trim().slice(0, 200)
    const sanitizedEmail = customer_email.trim().toLowerCase().slice(0, 200)
    const sanitizedPhone = customer_phone?.trim().slice(0, 20) || null

    const supabase = createAdminClient()

    // Check package exists and is active
    const { data: pkg } = await supabase
      .from('packages')
      .select('*, country:countries(name_tr)')
      .eq('id', package_id)
      .eq('is_active', true)
      .single()

    if (!pkg) {
      return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 })
    }

    // Create order first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        package_id,
        customer_name: sanitizedName,
        customer_email: sanitizedEmail,
        customer_phone: sanitizedPhone,
        status: 'waiting',
      })
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })
    }

    // Atomic QR assignment
    const { data: qrId, error: qrError } = await supabase
      .rpc('assign_qr_to_order', { p_package_id: package_id, p_order_id: order.id })

    if (qrError || !qrId) {
      // No stock - update order as problematic
      await supabase
        .from('orders')
        .update({ status: 'problematic' })
        .eq('id', order.id)

      return NextResponse.json(
        { error: 'Bu paket için stok kalmadı', code: 'out_of_stock' },
        { status: 400 }
      )
    }

    // Get QR code path
    const { data: qrCode } = await supabase
      .from('qr_codes')
      .select('image_path')
      .eq('id', qrId)
      .single()

    // Send email (non-blocking, we don't fail the order if email fails)
    try {
      await sendOrderEmail({
        orderId: order.id,
        customerName: sanitizedName,
        customerEmail: sanitizedEmail,
        orderNumber: order.order_number,
        packageName: pkg.name,
        dataAmount: pkg.data_amount,
        durationDays: pkg.duration_days,
        countryName: pkg.country?.name_tr || '',
        qrImagePath: qrCode?.image_path || '',
      })
    } catch (emailErr) {
      console.error('Email send error:', emailErr)
      // Order is still created, just email failed
    }

    return NextResponse.json({
      order_number: order.order_number,
      order_id: order.id,
    })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Report endpoint
  if (searchParams.get('report') === 'true') {
    if (isMockMode) {
      return NextResponse.json({
        dailyOrders: [
          { date: '2025-02-01', count: 3 }, { date: '2025-02-02', count: 5 },
          { date: '2025-02-03', count: 2 }, { date: '2025-02-04', count: 7 },
          { date: '2025-02-05', count: 4 }, { date: '2025-02-06', count: 6 },
          { date: '2025-02-07', count: 3 },
        ],
        countryRevenue: [
          { country: 'Türkiye', revenue: 2549.93, orders: 8 },
          { country: 'Avrupa', revenue: 3599.91, orders: 9 },
          { country: 'ABD', revenue: 1749.95, orders: 5 },
          { country: 'Japonya', revenue: 1149.96, orders: 4 },
        ],
      })
    }

    const start = searchParams.get('start') || ''
    const end = searchParams.get('end') || ''
    const supabase = createAdminClient()

    const { data: orders } = await supabase
      .from('orders')
      .select('created_at, package:packages(price_tr, country:countries(name_tr))')
      .gte('created_at', `${start}T00:00:00`)
      .lte('created_at', `${end}T23:59:59`)
      .order('created_at')

    // Daily orders aggregation
    const dailyMap = new Map<string, number>()
    const countryMap = new Map<string, { revenue: number; orders: number }>()

    for (const order of orders || []) {
      const date = order.created_at.split('T')[0]
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)

      const countryName = (order.package as any)?.country?.name_tr || 'Bilinmiyor'
      const price = (order.package as any)?.price_tr || 0
      const existing = countryMap.get(countryName) || { revenue: 0, orders: 0 }
      countryMap.set(countryName, {
        revenue: existing.revenue + price,
        orders: existing.orders + 1,
      })
    }

    return NextResponse.json({
      dailyOrders: Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })),
      countryRevenue: Array.from(countryMap.entries())
        .map(([country, data]) => ({ country, ...data }))
        .sort((a, b) => b.revenue - a.revenue),
    })
  }

  return NextResponse.json({ error: 'Bad request' }, { status: 400 })
}
