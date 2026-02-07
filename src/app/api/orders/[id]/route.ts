import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, package:packages(*, country:countries(*)), qr_code:qr_codes(*)')
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const body = await request.json()

  const { status } = body

  if (!['waiting', 'sent', 'problematic'].includes(status)) {
    return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 })
  }

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
