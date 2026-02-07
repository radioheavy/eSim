import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/lib/types'

const statusConfig: Record<OrderStatus, { label: string; variant: 'yellow' | 'green' | 'red' }> = {
  waiting: { label: 'Bekliyor', variant: 'yellow' },
  sent: { label: 'Gönderildi', variant: 'green' },
  problematic: { label: 'Sorunlu', variant: 'red' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
