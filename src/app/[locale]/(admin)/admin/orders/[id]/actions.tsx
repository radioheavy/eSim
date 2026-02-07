'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import type { OrderStatus } from '@/lib/types'

interface OrderActionsProps {
  orderId: string
  currentStatus: OrderStatus
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [status, setStatus] = useState(currentStatus)
  const [updating, setUpdating] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleStatusChange() {
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      addToast('Durum güncellendi', 'success')
      router.refresh()
    } catch {
      addToast('Güncelleme hatası', 'error')
    } finally {
      setUpdating(false)
    }
  }

  async function handleResendEmail() {
    setResending(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/resend-email`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error()
      addToast('E-posta tekrar gönderildi', 'success')
      router.refresh()
    } catch {
      addToast('E-posta gönderilemedi', 'error')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          id="status_select"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          options={[
            { value: 'waiting', label: 'Bekliyor' },
            { value: 'sent', label: 'Gönderildi' },
            { value: 'problematic', label: 'Sorunlu' },
          ]}
          className="flex-1"
        />
        <Button onClick={handleStatusChange} disabled={updating || status === currentStatus}>
          {updating ? '...' : 'Güncelle'}
        </Button>
      </div>

      <Button
        onClick={handleResendEmail}
        disabled={resending}
        variant="secondary"
        className="w-full"
      >
        {resending ? 'Gönderiliyor...' : 'E-posta Tekrar Gönder'}
      </Button>
    </div>
  )
}
