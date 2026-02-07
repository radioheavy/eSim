'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import Link from 'next/link'
import type { Country } from '@/lib/types'

export function CountrySearch() {
  const t = useTranslations()
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [results, setResults] = useState<Country[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/packages?countries_only=true')
      .then((r) => r.json())
      .then((data) => setCountries(data.countries || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    const q = query.toLowerCase()
    const filtered = countries.filter(
      (c) => c.name_tr.toLowerCase().includes(q) || c.name_en.toLowerCase().includes(q)
    )
    setResults(filtered)
    setOpen(filtered.length > 0)
  }, [query, countries])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('hero.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-3 border-3 border-black bg-white text-black font-medium placeholder:text-gray-400 focus:outline-none focus:border-black"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-3 border-t-0 border-black z-10 max-h-60 overflow-y-auto">
          {results.map((country) => (
            <Link
              key={country.id}
              href={`/packages?country=${country.slug}`}
              className="flex items-center gap-2 px-4 py-3 hover:bg-[#FFE500] transition-colors border-b border-gray-200 last:border-b-0"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">{country.flag_emoji}</span>
              <span className="font-bold">{country.name_tr}</span>
              {country.is_region && (
                <span className="ml-auto text-xs font-bold uppercase bg-black text-white px-1.5 py-0.5">
                  Bölge
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
