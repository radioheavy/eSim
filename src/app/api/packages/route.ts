import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = createAdminClient()

  // Countries only endpoint (for search)
  if (searchParams.get('countries_only') === 'true') {
    const { data: countries } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name_tr')

    return NextResponse.json({ countries })
  }

  const { data: packages } = await supabase
    .from('packages')
    .select('*, country:countries(name_tr, flag_emoji)')
    .eq('is_active', true)
    .order('price_tr')

  return NextResponse.json({ packages })
}
