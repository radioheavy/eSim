export type OrderStatus = 'waiting' | 'sent' | 'problematic'
export type QrCodeStatus = 'available' | 'assigned' | 'problematic'

export interface Country {
  id: string
  name_tr: string
  name_en: string
  slug: string
  iso_code: string
  is_region: boolean
  flag_emoji: string
  is_active: boolean
  created_at: string
}

export interface Package {
  id: string
  country_id: string
  name: string
  slug: string
  description_tr: string
  data_amount: string
  duration_days: number
  price_tr: number
  features: Record<string, string>
  operator_name: string
  is_active: boolean
  created_at: string
  updated_at: string
  country?: Country
}

export interface QrCode {
  id: string
  package_id: string
  image_path: string
  status: QrCodeStatus
  order_id: string | null
  assigned_at: string | null
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  package_id: string
  qr_code_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  status: OrderStatus
  email_sent: boolean
  email_sent_at: string | null
  created_at: string
  updated_at: string
  package?: Package
  qr_code?: QrCode
}

export interface EmailLog {
  id: string
  order_id: string
  to_email: string
  subject: string
  resend_id: string | null
  status: string
  error_message: string | null
  created_at: string
}

export interface AdminProfile {
  id: string
  full_name: string
  role: string
  created_at: string
}

export interface StockSummary {
  package_id: string
  package_name: string
  country_name: string
  flag_emoji: string
  available: number
  assigned: number
  problematic: number
  total: number
}

export interface DashboardStats {
  todayOrders: number
  waitingOrders: number
  sentOrders: number
  lowStockPackages: StockSummary[]
  recentOrders: Order[]
}

export interface OrderFormData {
  customer_name: string
  customer_email: string
  customer_email_confirm: string
  customer_phone?: string
  package_id: string
}
