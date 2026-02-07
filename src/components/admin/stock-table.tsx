import { clsx } from 'clsx'
import type { StockSummary } from '@/lib/types'
import { LOW_STOCK_THRESHOLD, MEDIUM_STOCK_THRESHOLD } from '@/lib/constants'

interface StockTableProps {
  stockData: StockSummary[]
}

export function StockTable({ stockData }: StockTableProps) {
  if (stockData.length === 0) {
    return (
      <div className="border-3 border-black p-8 text-center">
        <p className="font-bold text-gray-500">Stok verisi bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="border-3 border-black overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-3 border-black bg-black text-white">
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Paket</th>
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">Ülke</th>
            <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">Mevcut</th>
            <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">Atanmış</th>
            <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">Sorunlu</th>
            <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">Toplam</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((item) => (
            <tr key={item.package_id} className="border-b-2 border-gray-200 hover:bg-[#FFFDE6] transition-colors">
              <td className="px-4 py-3 font-black text-sm">{item.package_name}</td>
              <td className="px-4 py-3">
                <span className="mr-1">{item.flag_emoji}</span>
                <span className="font-bold text-sm">{item.country_name}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={clsx(
                    'inline-block px-3 py-1 font-black text-sm border-2 border-black',
                    item.available < LOW_STOCK_THRESHOLD && 'bg-red-500 text-white',
                    item.available >= LOW_STOCK_THRESHOLD && item.available <= MEDIUM_STOCK_THRESHOLD && 'bg-[#FFE500]',
                    item.available > MEDIUM_STOCK_THRESHOLD && 'bg-green-400'
                  )}
                >
                  {item.available}
                </span>
              </td>
              <td className="px-4 py-3 text-center font-bold text-sm">{item.assigned}</td>
              <td className="px-4 py-3 text-center font-bold text-sm text-red-600">{item.problematic}</td>
              <td className="px-4 py-3 text-center font-black text-sm">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
