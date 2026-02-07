'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'

interface ReportData {
  dailyOrders: { date: string; count: number }[]
  countryRevenue: { country: string; revenue: number; orders: number }[]
}

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchReport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?report=true&start=${startDate}&end=${endDate}`)
      const json = await res.json()
      setData(json)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function exportCsv() {
    if (!data) return
    const rows = [
      ['Tarih', 'Sipariş Sayısı'],
      ...data.dailyOrders.map((d) => [d.date, String(d.count)]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapor-${startDate}-${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-black text-3xl uppercase tracking-tight">Raporlar</h1>

      <div className="flex flex-wrap items-end gap-4">
        <Input
          id="start_date"
          type="date"
          label="Başlangıç"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-48"
        />
        <Input
          id="end_date"
          type="date"
          label="Bitiş"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-48"
        />
        <Button onClick={fetchReport} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Rapor Getir'}
        </Button>
        <Button onClick={exportCsv} variant="secondary" disabled={!data}>
          <Download size={16} className="mr-2" /> CSV İndir
        </Button>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily orders chart (simple bar representation) */}
          <Card>
            <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">
              Günlük Siparişler
            </h2>
            <div className="space-y-2">
              {data.dailyOrders.length === 0 && (
                <p className="text-sm text-gray-500">Bu tarih aralığında sipariş yok</p>
              )}
              {data.dailyOrders.map((d) => {
                const max = Math.max(...data.dailyOrders.map((x) => x.count), 1)
                const width = (d.count / max) * 100
                return (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-20 shrink-0">{d.date}</span>
                    <div className="flex-1 bg-gray-100 border-2 border-black h-6">
                      <div
                        className="h-full bg-[#FFE500] flex items-center justify-end pr-1"
                        style={{ width: `${Math.max(width, 5)}%` }}
                      >
                        <span className="text-xs font-black">{d.count}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Country revenue */}
          <Card>
            <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">
              Ülke Bazlı Gelir
            </h2>
            <div className="space-y-2">
              {data.countryRevenue.length === 0 && (
                <p className="text-sm text-gray-500">Bu tarih aralığında veri yok</p>
              )}
              {data.countryRevenue.map((c) => (
                <div key={c.country} className="flex items-center justify-between border-b-2 border-gray-200 py-2">
                  <span className="font-bold text-sm">{c.country}</span>
                  <div className="text-right">
                    <p className="font-black">{c.revenue.toLocaleString('tr-TR')} ₺</p>
                    <p className="text-xs text-gray-500">{c.orders} sipariş</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
