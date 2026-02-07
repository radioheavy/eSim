'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const t = useTranslations()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b-3 border-black bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-black text-xl tracking-tighter">
          eSIM<span className="text-[#FFE500] bg-black px-1 ml-0.5">TR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-bold text-sm uppercase tracking-wider hover:text-[#FFE500] transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/packages" className="font-bold text-sm uppercase tracking-wider hover:text-[#FFE500] transition-colors">
            {t('nav.packages')}
          </Link>
        </nav>

        <button
          className="md:hidden p-2 border-2 border-black cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t-3 border-black bg-white">
          <nav className="flex flex-col">
            <Link
              href="/"
              className="px-4 py-3 font-bold text-sm uppercase tracking-wider border-b-2 border-black hover:bg-black hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/packages"
              className="px-4 py-3 font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.packages')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
