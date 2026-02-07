import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: pkg, error } = await supabase
    .from('packages')
    .select('*, country:countries(*)')
    .eq('id', id)
    .single()

  if (error || !pkg) {
    return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 })
  }

  return NextResponse.json(pkg)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()
  const body = await request.json()

  const { error } = await supabase
    .from('packages')
    .update(body)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
