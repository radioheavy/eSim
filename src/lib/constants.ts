export const SITE_NAME = 'eSIM Türkiye'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const DEFAULT_LOCALE = 'tr'
export const LOCALES = ['tr', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const LOW_STOCK_THRESHOLD = 5
export const MEDIUM_STOCK_THRESHOLD = 10

export const ORDER_STATUSES = {
  waiting: { label_tr: 'Bekliyor', label_en: 'Waiting', color: 'yellow' },
  sent: { label_tr: 'Gönderildi', label_en: 'Sent', color: 'green' },
  problematic: { label_tr: 'Sorunlu', label_en: 'Problematic', color: 'red' },
} as const

export const QR_STATUSES = {
  available: { label_tr: 'Mevcut', label_en: 'Available' },
  assigned: { label_tr: 'Atanmış', label_en: 'Assigned' },
  problematic: { label_tr: 'Sorunlu', label_en: 'Problematic' },
} as const
