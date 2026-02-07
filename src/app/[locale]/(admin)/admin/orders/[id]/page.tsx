import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { OrderStatusBadge } from '@/components/admin/order-status-badge'
import { formatDate } from '@/lib/utils/format'
import { formatPrice } from '@/lib/utils/format'
import { OrderActions } from './actions'
import type { OrderStatus, EmailLog } from '@/lib/types'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: order } = await supabase
    .from('orders')
    .select('*, package:packages(*, country:countries(name_tr, flag_emoji)), qr_code:qr_codes(image_path)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: emailLogs } = await supabase
    .from('email_logs')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-[#FFE500] transition-colors"
      >
        <ArrowLeft size={16} /> Siparişler
      </Link>

      <div className="flex items-center gap-4">
        <h1 className="font-black text-3xl uppercase tracking-tight">{order.order_number}</h1>
        <OrderStatusBadge status={order.status as OrderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card>
          <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">Müşteri Bilgileri</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500">Ad Soyad</dt>
              <dd className="font-bold">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500">E-posta</dt>
              <dd className="font-bold">{order.customer_email}</dd>
            </div>
            {order.customer_phone && (
              <div>
                <dt className="text-xs font-bold uppercase text-gray-500">Telefon</dt>
                <dd className="font-bold">{order.customer_phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500">Sipariş Tarihi</dt>
              <dd className="font-bold">{formatDate(order.created_at)}</dd>
            </div>
          </dl>
        </Card>

        {/* Package Info */}
        <Card>
          <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">Paket Bilgileri</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500">Paket</dt>
              <dd className="font-bold">
                {order.package?.country?.flag_emoji} {order.package?.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500">Veri / Süre</dt>
              <dd className="font-bold">{order.package?.data_amount} / {order.package?.duration_days} gün</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500">Fiyat</dt>
              <dd className="font-black text-lg">{formatPrice(order.package?.price_tr || 0)}</dd>
            </div>
          </dl>
        </Card>

        {/* Actions */}
        <Card>
          <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">İşlemler</h2>
          <OrderActions orderId={order.id} currentStatus={order.status as OrderStatus} />
        </Card>

        {/* Email Logs */}
        <Card>
          <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">E-posta Geçmişi</h2>
          {emailLogs && emailLogs.length > 0 ? (
            <div className="space-y-2">
              {emailLogs.map((log: EmailLog) => (
                <div key={log.id} className="border-2 border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase">
                      {log.status === 'sent' ? '✓ Gönderildi' : log.status === 'failed' ? '✗ Başarısız' : log.status}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(log.created_at)}</span>
                  </div>
                  <p className="text-sm mt-1">{log.to_email}</p>
                  {log.error_message && (
                    <p className="text-xs text-red-600 mt-1">{log.error_message}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Henüz e-posta gönderilmemiş</p>
          )}
        </Card>
      </div>
    </div>
  )
}
