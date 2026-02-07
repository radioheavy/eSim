'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import type { Country } from '@/lib/types'

interface PackageFiltersProps {
  countries: Country[]
  activeCountry?: string
}

export function PackageFilters({ countries, activeCountry }: PackageFiltersProps) {
  const regions = countries.filter((c) => c.is_region)
  const nonRegions = countries.filter((c) => !c.is_region)

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/packages"
        className={clsx(
          'px-4 py-2 border-3 border-black font-bold text-sm uppercase tracking-wider transition-all duration-100',
          !activeCountry ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#FFE500]'
        )}
      >
        Tümü
      </Link>
      {regions.map((c) => (
        <Link
          key={c.id}
          href={`/packages?country=${c.slug}`}
          className={clsx(
            'px-4 py-2 border-3 border-black font-bold text-sm uppercase tracking-wider transition-all duration-100',
            activeCountry === c.slug ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#FFE500]'
          )}
        >
          {c.flag_emoji} {c.name_tr}
        </Link>
      ))}
      {nonRegions.map((c) => (
        <Link
          key={c.id}
          href={`/packages?country=${c.slug}`}
          className={clsx(
            'px-4 py-2 border-3 border-black font-bold text-sm uppercase tracking-wider transition-all duration-100',
            activeCountry === c.slug ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#FFE500]'
          )}
        >
          {c.flag_emoji} {c.name_tr}
        </Link>
      ))}
    </div>
  )
}
