export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import { PackageGrid } from '@/components/storefront/package-grid'
import { PackageFilters } from './filters'

export const metadata = {
  title: 'eSIM Paketleri | eSIM Türkiye',
  description: 'Tüm eSIM seyahat paketlerini keşfedin',
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams
  const supabase = createAdminClient()

  // Fetch countries for filter
  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('name_tr')

  // Fetch packages
  let query = supabase
    .from('packages')
    .select('*, country:countries(name_tr, flag_emoji, slug)')
    .eq('is_active', true)
    .order('price_tr')

  if (country) {
    const { data: countryData } = await supabase
      .from('countries')
      .select('id')
      .eq('slug', country)
      .single()

    if (countryData) {
      query = query.eq('country_id', countryData.id)
    }
  }

  const { data: packages } = await query

  // Stock counts
  const { data: stockData } = await supabase
    .from('stock_summary')
    .select('package_id, available')

  const stockMap = new Map(stockData?.map((s) => [s.package_id, s.available]) || [])

  const packagesWithStock = (packages || []).map((pkg) => ({
    ...pkg,
    available_stock: stockMap.get(pkg.id) ?? 0,
  }))

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tight mb-2">
        eSIM PAKETLERİ
      </h1>
      <p className="text-lg font-medium text-gray-600 mb-8">
        Gideceğin ülkeyi seç, anında bağlan
      </p>

      <PackageFilters countries={countries || []} activeCountry={country} />

      <div className="mt-8">
        <PackageGrid packages={packagesWithStock} />
      </div>
    </section>
  )
}
