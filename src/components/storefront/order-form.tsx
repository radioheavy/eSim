'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Package } from '@/lib/types'

interface OrderFormProps {
  pkg: Package
}

export function OrderForm({ pkg }: OrderFormProps) {
  const t = useTranslations('order')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setServerError('')

    const form = new FormData(e.currentTarget)
    const data = {
      customer_name: form.get('customer_name') as string,
      customer_email: form.get('customer_email') as string,
      customer_email_confirm: form.get('customer_email_confirm') as string,
      customer_phone: form.get('customer_phone') as string,
      package_id: pkg.id,
    }

    // Validate
    const newErrors: Record<string, string> = {}
    if (!data.customer_name.trim()) newErrors.customer_name = t('required')
    if (!data.customer_email.trim()) newErrors.customer_email = t('required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email))
      newErrors.customer_email = t('invalidEmail')
    if (data.customer_email !== data.customer_email_confirm)
      newErrors.customer_email_confirm = t('emailMismatch')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        if (result.code === 'out_of_stock') {
          setServerError(t('outOfStock'))
        } else {
          setServerError(result.error || 'Bir hata oluştu')
        }
        return
      }

      router.push(`/order-success?order=${result.order_number}`)
    } catch {
      setServerError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-black text-2xl uppercase tracking-tight border-b-3 border-black pb-3">
        {t('title')}
      </h2>

      {serverError && (
        <div className="bg-red-500 text-white font-bold p-4 border-3 border-red-700">
          {serverError}
        </div>
      )}

      <Input
        id="customer_name"
        name="customer_name"
        label={t('customerName')}
        error={errors.customer_name}
        required
      />

      <Input
        id="customer_email"
        name="customer_email"
        type="email"
        label={t('customerEmail')}
        error={errors.customer_email}
        required
      />

      <Input
        id="customer_email_confirm"
        name="customer_email_confirm"
        type="email"
        label={t('customerEmailConfirm')}
        error={errors.customer_email_confirm}
        required
      />

      <Input
        id="customer_phone"
        name="customer_phone"
        type="tel"
        label={t('customerPhone')}
      />

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}
