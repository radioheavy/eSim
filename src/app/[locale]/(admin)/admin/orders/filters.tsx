'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { clsx } from 'clsx'

const statuses = [
  { value: 'all', label: 'Tümü' },
  { value: 'waiting', label: 'Bekliyor' },
  { value: 'sent', label: 'Gönderildi' },
  { value: 'problematic', label: 'Sorunlu' },
]

interface OrderFiltersProps {
  activeStatus?: string
  search?: string
}

export function OrderFilters({ activeStatus, search }: OrderFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/orders?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => updateParams('status', s.value === 'all' ? '' : s.value)}
            className={clsx(
              'px-4 py-2 border-3 border-black font-bold text-sm uppercase tracking-wider transition-all duration-100 cursor-pointer',
              (activeStatus || 'all') === s.value
                ? 'bg-black text-white'
                : 'bg-white hover:bg-[#FFE500]'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <input
          type="text"
          defaultValue={search}
          placeholder="Sipariş no, isim veya e-posta ara..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParams('search', (e.target as HTMLInputElement).value)
            }
          }}
          className="w-full px-4 py-2 border-3 border-black font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#FFE500]"
        />
      </div>
    </div>
  )
}
