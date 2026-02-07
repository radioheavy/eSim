export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wifi, Clock, CreditCard, Radio } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils/format'
import { OrderForm } from '@/components/storefront/order-form'
import { Card } from '@/components/ui/card'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createAdminClient()
  const { data: pkg } = await supabase
    .from('packages')
    .select('name, description_tr')
    .eq('slug', slug)
    .single()

  if (!pkg) return { title: 'Paket Bulunamadı' }

  return {
    title: `${pkg.name} | eSIM Türkiye`,
    description: pkg.description_tr,
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: pkg } = await supabase
    .from('packages')
    .select('*, country:countries(name_tr, flag_emoji)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!pkg) notFound()

  // Check stock
  const { data: stockData } = await supabase
    .from('stock_summary')
    .select('available')
    .eq('package_id', pkg.id)
    .single()

  const available = stockData?.available ?? 0

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/packages"
        className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-[#FFE500] transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Paketler
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Package Info */}
        <Card className="lg:border-r-0">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{pkg.country?.flag_emoji}</span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
                {pkg.country?.name_tr}
              </p>
              <h1 className="font-black text-3xl uppercase tracking-tight">{pkg.name}</h1>
            </div>
          </div>

          <p className="text-gray-600 font-medium mb-6">{pkg.description_tr}</p>

          <div className="space-y-4 border-t-3 border-black pt-6">
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
              <div className="flex items-center gap-3">
                <Wifi size={20} />
                <span className="font-bold uppercase text-sm">Veri</span>
              </div>
              <span className="font-black text-lg">{pkg.data_amount}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
              <div className="flex items-center gap-3">
                <Clock size={20} />
                <span className="font-bold uppercase text-sm">Süre</span>
              </div>
              <span className="font-black text-lg">{pkg.duration_days} gün</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
              <div className="flex items-center gap-3">
                <Radio size={20} />
                <span className="font-bold uppercase text-sm">Operatör</span>
              </div>
              <span className="font-black text-lg">{pkg.operator_name}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <span className="font-bold uppercase text-sm">Fiyat</span>
              </div>
              <span className="font-black text-2xl">{formatPrice(pkg.price_tr)}</span>
            </div>
          </div>

          {pkg.features && Object.keys(pkg.features).length > 0 && (
            <div className="mt-6 border-t-3 border-black pt-6">
              <h3 className="font-black text-sm uppercase tracking-wider mb-3">Özellikler</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pkg.features).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-3 py-1 border-2 border-black text-sm font-bold"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Order Form */}
        <Card>
          {available > 0 ? (
            <OrderForm pkg={pkg} />
          ) : (
            <div className="text-center py-12">
              <p className="font-black text-2xl uppercase text-red-500">STOKTA YOK</p>
              <p className="mt-2 text-gray-600">Bu paket için stok kalmadı.</p>
              <Link
                href="/packages"
                className="inline-block mt-6 px-6 py-3 bg-black text-white font-black uppercase tracking-wider border-3 border-black hover:bg-[#FFE500] hover:text-black transition-all"
              >
                DİĞER PAKETLERİ GÖR
              </Link>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
