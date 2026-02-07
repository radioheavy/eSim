import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('stock_summary')
    .select('*')
    .order('country_name')

  if (error) {
    return NextResponse.json({ error: 'Stok verisi alınamadı' }, { status: 500 })
  }

  return NextResponse.json({ stock: data })
}
