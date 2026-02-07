import Link from 'next/link'
import { Wifi, Clock, CreditCard } from 'lucide-react'
import type { Package } from '@/lib/types'
import { formatPrice } from '@/lib/utils/format'
import { Card } from '@/components/ui/card'

interface PackageCardProps {
  pkg: Package & { country?: { name_tr: string; flag_emoji: string } }
  availableStock?: number
}

export function PackageCard({ pkg, availableStock }: PackageCardProps) {
  const outOfStock = availableStock !== undefined && availableStock <= 0

  return (
    <Card hover={!outOfStock} className={outOfStock ? 'opacity-60' : ''}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{pkg.country?.flag_emoji}</span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {pkg.country?.name_tr}
        </span>
      </div>

      <h3 className="font-black text-xl uppercase tracking-tight">{pkg.name}</h3>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Wifi size={16} className="shrink-0" />
          <span className="font-bold">{pkg.data_amount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="shrink-0" />
          <span className="font-bold">{pkg.duration_days} gün</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CreditCard size={16} className="shrink-0" />
          <span className="font-black text-lg">{formatPrice(pkg.price_tr)}</span>
        </div>
      </div>

      <div className="mt-5">
        {outOfStock ? (
          <span className="inline-block w-full text-center py-3 bg-gray-200 text-gray-500 font-black text-sm uppercase border-3 border-gray-300">
            STOKTA YOK
          </span>
        ) : (
          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-block w-full text-center py-3 bg-black text-white font-black text-sm uppercase tracking-wider border-3 border-black hover:bg-[#FFE500] hover:text-black transition-all duration-100"
          >
            SATIN AL
          </Link>
        )}
      </div>
    </Card>
  )
}
