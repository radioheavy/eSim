'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import { OrderStatusBadge } from './order-status-badge'
import { formatDate } from '@/lib/utils/format'
import type { Order, OrderStatus } from '@/lib/types'

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="border-3 border-black p-8 text-center">
        <p className="font-bold text-gray-500">Sipariş bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="border-3 border-black overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-3 border-black bg-black text-white">
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Sipariş No</th>
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Müşteri</th>
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Paket</th>
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Durum</th>
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Tarih</th>
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b-2 border-gray-200 hover:bg-[#FFFDE6] transition-colors">
              <td className="px-4 py-3 font-black text-sm">{order.order_number}</td>
              <td className="px-4 py-3">
                <p className="font-bold text-sm">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.customer_email}</p>
              </td>
              <td className="px-4 py-3 font-bold text-sm">{order.package?.name || '-'}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status as OrderStatus} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.created_at)}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-black font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors"
                >
                  <Eye size={14} /> Detay
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
