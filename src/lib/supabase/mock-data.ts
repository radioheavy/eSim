const countries = [
  { id: 'c1', name_tr: 'Türkiye', name_en: 'Turkey', slug: 'turkiye', iso_code: 'TR', is_region: false, flag_emoji: '🇹🇷', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c2', name_tr: 'Avrupa', name_en: 'Europe', slug: 'avrupa', iso_code: 'EU', is_region: true, flag_emoji: '🇪🇺', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c3', name_tr: 'Amerika Birleşik Devletleri', name_en: 'United States', slug: 'abd', iso_code: 'US', is_region: false, flag_emoji: '🇺🇸', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c4', name_tr: 'İngiltere', name_en: 'United Kingdom', slug: 'ingiltere', iso_code: 'GB', is_region: false, flag_emoji: '🇬🇧', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c5', name_tr: 'Japonya', name_en: 'Japan', slug: 'japonya', iso_code: 'JP', is_region: false, flag_emoji: '🇯🇵', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c6', name_tr: 'Almanya', name_en: 'Germany', slug: 'almanya', iso_code: 'DE', is_region: false, flag_emoji: '🇩🇪', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c7', name_tr: 'Fransa', name_en: 'France', slug: 'fransa', iso_code: 'FR', is_region: false, flag_emoji: '🇫🇷', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'c8', name_tr: 'İtalya', name_en: 'Italy', slug: 'italya', iso_code: 'IT', is_region: false, flag_emoji: '🇮🇹', is_active: true, created_at: '2025-01-01T00:00:00Z' },
]

const packages = [
  { id: 'p1', country_id: 'c1', name: 'Türkiye 1GB', slug: 'turkiye-1gb', description_tr: 'Türkiye için 1GB veri paketi', data_amount: '1GB', duration_days: 7, price_tr: 149.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'Turkcell', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Türkiye', flag_emoji: '🇹🇷', slug: 'turkiye' } },
  { id: 'p2', country_id: 'c1', name: 'Türkiye 3GB', slug: 'turkiye-3gb', description_tr: 'Türkiye için 3GB veri paketi', data_amount: '3GB', duration_days: 15, price_tr: 299.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'Turkcell', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Türkiye', flag_emoji: '🇹🇷', slug: 'turkiye' } },
  { id: 'p3', country_id: 'c1', name: 'Türkiye 5GB', slug: 'turkiye-5gb', description_tr: 'Türkiye için 5GB veri paketi', data_amount: '5GB', duration_days: 30, price_tr: 449.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'Turkcell', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Türkiye', flag_emoji: '🇹🇷', slug: 'turkiye' } },
  { id: 'p4', country_id: 'c2', name: 'Avrupa 1GB', slug: 'avrupa-1gb', description_tr: '30+ Avrupa ülkesinde geçerli', data_amount: '1GB', duration_days: 7, price_tr: 199.99, features: { network: '4G/LTE', hotspot: 'Evet', countries: '30+' }, operator_name: '3HK', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Avrupa', flag_emoji: '🇪🇺', slug: 'avrupa' } },
  { id: 'p5', country_id: 'c2', name: 'Avrupa 3GB', slug: 'avrupa-3gb', description_tr: '30+ Avrupa ülkesinde geçerli', data_amount: '3GB', duration_days: 15, price_tr: 399.99, features: { network: '4G/LTE', hotspot: 'Evet', countries: '30+' }, operator_name: '3HK', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Avrupa', flag_emoji: '🇪🇺', slug: 'avrupa' } },
  { id: 'p6', country_id: 'c2', name: 'Avrupa 5GB', slug: 'avrupa-5gb', description_tr: '30+ Avrupa ülkesinde geçerli', data_amount: '5GB', duration_days: 30, price_tr: 599.99, features: { network: '4G/LTE', hotspot: 'Evet', countries: '30+' }, operator_name: '3HK', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Avrupa', flag_emoji: '🇪🇺', slug: 'avrupa' } },
  { id: 'p7', country_id: 'c3', name: 'ABD 3GB', slug: 'abd-3gb', description_tr: 'Amerika için 3GB veri paketi', data_amount: '3GB', duration_days: 15, price_tr: 349.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'T-Mobile', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Amerika Birleşik Devletleri', flag_emoji: '🇺🇸', slug: 'abd' } },
  { id: 'p8', country_id: 'c3', name: 'ABD 5GB', slug: 'abd-5gb', description_tr: 'Amerika için 5GB veri paketi', data_amount: '5GB', duration_days: 30, price_tr: 549.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'T-Mobile', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Amerika Birleşik Devletleri', flag_emoji: '🇺🇸', slug: 'abd' } },
  { id: 'p9', country_id: 'c5', name: 'Japonya 1GB', slug: 'japonya-1gb', description_tr: 'Japonya için 1GB veri paketi', data_amount: '1GB', duration_days: 7, price_tr: 249.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'SoftBank', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Japonya', flag_emoji: '🇯🇵', slug: 'japonya' } },
  { id: 'p10', country_id: 'c5', name: 'Japonya 3GB', slug: 'japonya-3gb', description_tr: 'Japonya için 3GB veri paketi', data_amount: '3GB', duration_days: 15, price_tr: 449.99, features: { network: '4G/LTE', hotspot: 'Evet' }, operator_name: 'SoftBank', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z', country: { name_tr: 'Japonya', flag_emoji: '🇯🇵', slug: 'japonya' } },
]

const orders = [
  { id: 'o1', order_number: 'ESM-20250207-001', package_id: 'p1', qr_code_id: null, customer_name: 'Ahmet Yılmaz', customer_email: 'ahmet@test.com', customer_phone: '05551234567', status: 'sent', email_sent: true, email_sent_at: '2025-02-07T10:00:00Z', created_at: '2025-02-07T09:30:00Z', updated_at: '2025-02-07T10:00:00Z', package: { name: 'Türkiye 1GB', data_amount: '1GB', duration_days: 7, price_tr: 149.99, country: { name_tr: 'Türkiye', flag_emoji: '🇹🇷' } } },
  { id: 'o2', order_number: 'ESM-20250207-002', package_id: 'p4', qr_code_id: null, customer_name: 'Elif Demir', customer_email: 'elif@test.com', customer_phone: null, status: 'waiting', email_sent: false, email_sent_at: null, created_at: '2025-02-07T11:00:00Z', updated_at: '2025-02-07T11:00:00Z', package: { name: 'Avrupa 1GB', data_amount: '1GB', duration_days: 7, price_tr: 199.99, country: { name_tr: 'Avrupa', flag_emoji: '🇪🇺' } } },
  { id: 'o3', order_number: 'ESM-20250207-003', package_id: 'p7', qr_code_id: null, customer_name: 'Mehmet Kaya', customer_email: 'mehmet@test.com', customer_phone: '05559876543', status: 'sent', email_sent: true, email_sent_at: '2025-02-07T12:30:00Z', created_at: '2025-02-07T12:00:00Z', updated_at: '2025-02-07T12:30:00Z', package: { name: 'ABD 3GB', data_amount: '3GB', duration_days: 15, price_tr: 349.99, country: { name_tr: 'ABD', flag_emoji: '🇺🇸' } } },
  { id: 'o4', order_number: 'ESM-20250206-001', package_id: 'p2', qr_code_id: null, customer_name: 'Zeynep Çelik', customer_email: 'zeynep@test.com', customer_phone: null, status: 'problematic', email_sent: false, email_sent_at: null, created_at: '2025-02-06T14:00:00Z', updated_at: '2025-02-06T14:00:00Z', package: { name: 'Türkiye 3GB', data_amount: '3GB', duration_days: 15, price_tr: 299.99, country: { name_tr: 'Türkiye', flag_emoji: '🇹🇷' } } },
  { id: 'o5', order_number: 'ESM-20250206-002', package_id: 'p5', qr_code_id: null, customer_name: 'Can Özkan', customer_email: 'can@test.com', customer_phone: '05553456789', status: 'sent', email_sent: true, email_sent_at: '2025-02-06T16:00:00Z', created_at: '2025-02-06T15:30:00Z', updated_at: '2025-02-06T16:00:00Z', package: { name: 'Avrupa 3GB', data_amount: '3GB', duration_days: 15, price_tr: 399.99, country: { name_tr: 'Avrupa', flag_emoji: '🇪🇺' } } },
]

const stockSummary = [
  { package_id: 'p1', package_name: 'Türkiye 1GB', country_name: 'Türkiye', flag_emoji: '🇹🇷', available: 12, assigned: 5, problematic: 0, total: 17 },
  { package_id: 'p2', package_name: 'Türkiye 3GB', country_name: 'Türkiye', flag_emoji: '🇹🇷', available: 8, assigned: 3, problematic: 1, total: 12 },
  { package_id: 'p3', package_name: 'Türkiye 5GB', country_name: 'Türkiye', flag_emoji: '🇹🇷', available: 3, assigned: 2, problematic: 0, total: 5 },
  { package_id: 'p4', package_name: 'Avrupa 1GB', country_name: 'Avrupa', flag_emoji: '🇪🇺', available: 15, assigned: 8, problematic: 0, total: 23 },
  { package_id: 'p5', package_name: 'Avrupa 3GB', country_name: 'Avrupa', flag_emoji: '🇪🇺', available: 6, assigned: 4, problematic: 0, total: 10 },
  { package_id: 'p6', package_name: 'Avrupa 5GB', country_name: 'Avrupa', flag_emoji: '🇪🇺', available: 2, assigned: 1, problematic: 0, total: 3 },
  { package_id: 'p7', package_name: 'ABD 3GB', country_name: 'ABD', flag_emoji: '🇺🇸', available: 4, assigned: 6, problematic: 1, total: 11 },
  { package_id: 'p8', package_name: 'ABD 5GB', country_name: 'ABD', flag_emoji: '🇺🇸', available: 0, assigned: 3, problematic: 0, total: 3 },
  { package_id: 'p9', package_name: 'Japonya 1GB', country_name: 'Japonya', flag_emoji: '🇯🇵', available: 10, assigned: 2, problematic: 0, total: 12 },
  { package_id: 'p10', package_name: 'Japonya 3GB', country_name: 'Japonya', flag_emoji: '🇯🇵', available: 1, assigned: 1, problematic: 0, total: 2 },
]

const emailLogs = [
  { id: 'el1', order_id: 'o1', to_email: 'ahmet@test.com', subject: 'eSIM Siparişiniz Hazır - ESM-20250207-001', resend_id: 'r_123', status: 'sent', error_message: null, created_at: '2025-02-07T10:00:00Z' },
  { id: 'el2', order_id: 'o3', to_email: 'mehmet@test.com', subject: 'eSIM Siparişiniz Hazır - ESM-20250207-003', resend_id: 'r_124', status: 'sent', error_message: null, created_at: '2025-02-07T12:30:00Z' },
  { id: 'el3', order_id: 'o4', to_email: 'zeynep@test.com', subject: 'eSIM Siparişiniz Hazır - ESM-20250206-001', resend_id: null, status: 'failed', error_message: 'QR download failed', created_at: '2025-02-06T14:05:00Z' },
  { id: 'el4', order_id: 'o5', to_email: 'can@test.com', subject: 'eSIM Siparişiniz Hazır - ESM-20250206-002', resend_id: 'r_125', status: 'sent', error_message: null, created_at: '2025-02-06T16:00:00Z' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

class MockQueryBuilder {
  private _table: string
  private _data: Row[]
  private _filters: ((row: Row) => boolean)[] = []
  private _orderBy: { col: string; asc: boolean } | null = null
  private _limitN: number | null = null
  private _selectCols: string = '*'
  private _single = false
  private _countOnly = false
  private _headOnly = false

  constructor(table: string) {
    this._table = table
    this._data = this.getTableData(table)
  }

  private getTableData(table: string): Row[] {
    const tables: Record<string, Row[]> = {
      countries,
      packages,
      orders,
      stock_summary: stockSummary,
      email_logs: emailLogs,
      admin_profiles: [],
      qr_codes: [],
      site_settings: [],
    }
    return JSON.parse(JSON.stringify(tables[table] || []))
  }

  select(cols: string, opts?: { count?: string; head?: boolean }) {
    this._selectCols = cols
    if (opts?.count) this._countOnly = true
    if (opts?.head) this._headOnly = true
    return this
  }

  eq(col: string, val: string | number | boolean) {
    this._filters.push((row) => row[col] === val)
    return this
  }

  neq(col: string, val: string | number | boolean) {
    this._filters.push((row) => row[col] !== val)
    return this
  }

  lt(col: string, val: number) {
    this._filters.push((row) => (row[col] ?? 0) < val)
    return this
  }

  gte(col: string, val: string | number) {
    this._filters.push((row) => row[col] >= val)
    return this
  }

  lte(col: string, val: string | number) {
    this._filters.push((row) => row[col] <= val)
    return this
  }

  ilike(col: string, pattern: string) {
    const p = pattern.replace(/%/g, '').toLowerCase()
    this._filters.push((row) => (row[col] || '').toLowerCase().includes(p))
    return this
  }

  or(conditions: string) {
    // Simple or parsing for search: col.ilike.%val%,col2.ilike.%val%
    const parts = conditions.split(',')
    this._filters.push((row) => {
      return parts.some((part) => {
        const match = part.match(/(\w+)\.ilike\.%(.+)%/)
        if (match) {
          return (row[match[1]] || '').toLowerCase().includes(match[2].toLowerCase())
        }
        return false
      })
    })
    return this
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this._orderBy = { col, asc: opts?.ascending ?? true }
    return this
  }

  limit(n: number) {
    this._limitN = n
    return this
  }

  single() {
    this._single = true
    return this
  }

  rpc() {
    return this
  }

  then(resolve: (value: { data: Row | Row[] | null; error: null; count?: number }) => void) {
    let result = this._data.filter((row) => this._filters.every((f) => f(row)))

    if (this._orderBy) {
      const { col, asc } = this._orderBy
      result.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1
        if (a[col] > b[col]) return asc ? 1 : -1
        return 0
      })
    }

    if (this._limitN) result = result.slice(0, this._limitN)

    if (this._countOnly && this._headOnly) {
      resolve({ data: null, error: null, count: result.length })
    } else if (this._single) {
      resolve({ data: result[0] || null, error: result[0] ? null : null })
    } else {
      resolve({ data: result, error: null })
    }
  }
}

class MockRpcBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then(resolve: (value: { data: any; error: null }) => void) {
    resolve({ data: null, error: null })
  }
}

export class MockSupabaseClient {
  from(table: string) {
    return new MockQueryBuilder(table)
  }

  rpc(_fn: string, _params?: Record<string, unknown>) {
    return new MockRpcBuilder()
  }

  get storage() {
    return {
      from: () => ({
        upload: async () => ({ error: null }),
        download: async () => ({ data: null, error: { message: 'Mock: no storage' } }),
        remove: async () => ({ error: null }),
      }),
    }
  }

  get auth() {
    return {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ error: { message: 'Mock mode' } }),
      signOut: async () => ({ error: null }),
    }
  }
}

export const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url'
