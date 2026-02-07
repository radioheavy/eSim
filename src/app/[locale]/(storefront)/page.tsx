export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/storefront/hero-section'
import { PackageGrid } from '@/components/storefront/package-grid'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function HomePage() {
  const supabase = createAdminClient()

  const { data: packages } = await supabase
    .from('packages')
    .select('*, country:countries(name_tr, flag_emoji)')
    .eq('is_active', true)
    .limit(6)

  // Get stock counts
  const { data: stockData } = await supabase
    .from('stock_summary')
    .select('package_id, available')

  const stockMap = new Map(stockData?.map((s) => [s.package_id, s.available]) || [])

  const packagesWithStock = (packages || []).map((pkg) => ({
    ...pkg,
    available_stock: stockMap.get(pkg.id) ?? 0,
  }))

  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight mb-8">
          Popüler Paketler
        </h2>
        <PackageGrid packages={packagesWithStock} />
      </section>
    </>
  )
}
