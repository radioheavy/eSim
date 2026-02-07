import type { Package } from '@/lib/types'
import { PackageCard } from './package-card'

interface PackageGridProps {
  packages: (Package & { country?: { name_tr: string; flag_emoji: string }; available_stock?: number })[]
}

export function PackageGrid({ packages }: PackageGridProps) {
  if (packages.length === 0) {
    return (
      <div className="border-3 border-black p-12 text-center">
        <p className="font-black text-xl uppercase">Sonuç bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-3 border-black">
      {packages.map((pkg, i) => (
        <div
          key={pkg.id}
          className={`border-b-3 border-black last:border-b-0 sm:[&:nth-child(2n)]:border-l-3 lg:[&:nth-child(2n)]:border-l-0 lg:[&:nth-child(3n+2)]:border-l-3 lg:[&:nth-child(3n+3)]:border-l-3 ${
            i < packages.length - 1 ? '' : ''
          }`}
        >
          <PackageCard pkg={pkg} availableStock={pkg.available_stock} />
        </div>
      ))}
    </div>
  )
}
