import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'
import { StockUploadForm } from '@/components/admin/stock-upload-form'
import { Card } from '@/components/ui/card'

export default async function StockUploadPage() {
  const supabase = await createServerSupabase()

  const { data: packages } = await supabase
    .from('packages')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="space-y-6">
      <Link
        href="/admin/stock"
        className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-[#FFE500] transition-colors"
      >
        <ArrowLeft size={16} /> Stok
      </Link>

      <h1 className="font-black text-3xl uppercase tracking-tight">Stok Yükle</h1>

      <div className="max-w-xl">
        <Card>
          <StockUploadForm packages={packages || []} />
        </Card>
      </div>
    </div>
  )
}
