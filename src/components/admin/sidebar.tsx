'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  ShoppingCart,
  Database,
  BarChart3,
  Mail,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Siparişler', icon: ShoppingCart },
  { href: '/admin/stock', label: 'Stok', icon: Database },
  { href: '/admin/reports', label: 'Raporlar', icon: BarChart3 },
  { href: '/admin/email-templates', label: 'E-posta', icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 border-r-3 border-black bg-white min-h-screen flex flex-col shrink-0">
      <div className="p-4 border-b-3 border-black">
        <Link href="/admin" className="font-black text-xl tracking-tighter">
          eSIM<span className="text-black bg-[#FFE500] px-1 ml-0.5">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 font-bold text-sm uppercase tracking-wider transition-all duration-100',
                isActive
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-[#FFE500]'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t-3 border-black p-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 font-bold text-sm uppercase tracking-wider text-red-600 hover:bg-red-600 hover:text-white transition-all w-full cursor-pointer"
        >
          <LogOut size={18} />
          Çıkış
        </button>
      </div>
    </aside>
  )
}
