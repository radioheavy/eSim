'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { CountrySearch } from './country-search'

export function HeroSection() {
  const t = useTranslations()

  return (
    <section className="border-b-3 border-black bg-[#FFE500] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h1 className="font-black text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl font-medium max-w-xl">
          {t('hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl">
          <CountrySearch />
        </div>
        <Link
          href="/packages"
          className="inline-block mt-6 px-8 py-4 bg-black text-white font-black text-lg uppercase tracking-wider border-3 border-black hover:bg-white hover:text-black transition-all duration-100"
        >
          {t('hero.cta')}
        </Link>
      </div>
      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>
    </section>
  )
}
