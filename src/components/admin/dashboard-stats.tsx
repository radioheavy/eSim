import { Card } from '@/components/ui/card'
import type { DashboardStats } from '@/lib/types'

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Bugünkü Siparişler', value: stats.todayOrders, bg: 'bg-[#FFE500]' },
    { label: 'Bekleyen', value: stats.waitingOrders, bg: 'bg-yellow-300' },
    { label: 'Gönderilen', value: stats.sentOrders, bg: 'bg-green-400' },
    { label: 'Düşük Stok', value: stats.lowStockPackages.length, bg: 'bg-red-400' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className={card.bg}>
          <p className="text-xs font-bold uppercase tracking-wider">{card.label}</p>
          <p className="font-black text-4xl mt-2">{card.value}</p>
        </Card>
      ))}
    </div>
  )
}
