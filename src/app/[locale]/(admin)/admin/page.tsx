import { createServerSupabase } from '@/lib/supabase/server'
import { DashboardStatsCards } from '@/components/admin/dashboard-stats'
import { OrderTable } from '@/components/admin/order-table'
import type { DashboardStats } from '@/lib/types'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    { count: todayOrders },
    { count: waitingOrders },
    { count: sentOrders },
    { data: lowStockData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString()),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waiting'),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent'),
    supabase
      .from('stock_summary')
      .select('*')
      .lt('available', 5),
    supabase
      .from('orders')
      .select('*, package:packages(name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const stats: DashboardStats = {
    todayOrders: todayOrders || 0,
    waitingOrders: waitingOrders || 0,
    sentOrders: sentOrders || 0,
    lowStockPackages: lowStockData || [],
    recentOrders: recentOrders || [],
  }

  return (
    <div className="space-y-8">
      <h1 className="font-black text-3xl uppercase tracking-tight">Panel</h1>

      <DashboardStatsCards stats={stats} />

      {stats.lowStockPackages.length > 0 && (
        <div className="bg-red-50 border-3 border-red-500 p-4">
          <h3 className="font-black text-sm uppercase text-red-600 mb-2">Düşük Stok Uyarısı</h3>
          <ul className="space-y-1">
            {stats.lowStockPackages.map((s) => (
              <li key={s.package_id} className="text-sm font-bold">
                {s.flag_emoji} {s.package_name} — <span className="text-red-600">{s.available} adet kaldı</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-black text-xl uppercase tracking-tight mb-4">Son Siparişler</h2>
        <OrderTable orders={stats.recentOrders} />
      </div>
    </div>
  )
}
