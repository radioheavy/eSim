import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Sipariş Başarılı | eSIM Türkiye',
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <section className="max-w-xl mx-auto px-4 py-24">
      <Card className="text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
        <h1 className="font-black text-3xl uppercase tracking-tight mb-2">
          SİPARİŞ BAŞARILI!
        </h1>
        <p className="text-gray-600 font-medium mb-4">
          QR kodunuz e-posta adresinize gönderildi.
        </p>
        {order && (
          <div className="border-3 border-black bg-[#FFE500] px-4 py-3 mb-6 inline-block">
            <p className="text-xs font-bold uppercase tracking-wider">Sipariş Numarası</p>
            <p className="font-black text-xl">{order}</p>
          </div>
        )}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-4">
            E-postanızı kontrol edin. QR kodu e-postanıza ekli olarak gönderilmiştir.
            Lütfen spam klasörünü de kontrol edin.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-black text-white font-black uppercase tracking-wider border-3 border-black hover:bg-[#FFE500] hover:text-black transition-all"
          >
            ANA SAYFAYA DÖN
          </Link>
        </div>
      </Card>
    </section>
  )
}
