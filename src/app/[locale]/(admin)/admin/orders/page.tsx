import { createServerSupabase } from '@/lib/supabase/server'
import { OrderTable } from '@/components/admin/order-table'
import { OrderFilters } from './filters'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const { status, search } = await searchParams
  const supabase = await createServerSupabase()

  let query = supabase
    .from('orders')
    .select('*, package:packages(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`
    )
  }

  const { data: orders } = await query

  return (
    <div className="space-y-6">
      <h1 className="font-black text-3xl uppercase tracking-tight">Siparişler</h1>

      <OrderFilters activeStatus={status} search={search} />

      <OrderTable orders={orders || []} />
    </div>
  )
}
