import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'
import { StockTable } from '@/components/admin/stock-table'

export default async function AdminStockPage() {
  const supabase = await createServerSupabase()

  const { data: stockData } = await supabase
    .from('stock_summary')
    .select('*')
    .order('country_name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-black text-3xl uppercase tracking-tight">Stok Yönetimi</h1>
        <Link
          href="/admin/stock/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-black text-sm uppercase tracking-wider border-3 border-black hover:bg-[#FFE500] hover:text-black transition-all"
        >
          <Plus size={16} /> Stok Yükle
        </Link>
      </div>

      <StockTable stockData={stockData || []} />
    </div>
  )
}
