import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { sendOrderEmail } from '@/lib/email/send-order-email'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, package:packages(*, country:countries(name_tr)), qr_code:qr_codes(image_path)')
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
  }

  if (!order.qr_code?.image_path) {
    return NextResponse.json({ error: 'QR kod atanmamış' }, { status: 400 })
  }

  try {
    await sendOrderEmail({
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      orderNumber: order.order_number,
      packageName: order.package?.name || '',
      dataAmount: order.package?.data_amount || '',
      durationDays: order.package?.duration_days || 0,
      countryName: order.package?.country?.name_tr || '',
      qrImagePath: order.qr_code.image_path,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend email error:', err)
    return NextResponse.json({ error: 'E-posta gönderilemedi' }, { status: 500 })
  }
}
