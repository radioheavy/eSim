import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-black text-8xl mb-2">404</h1>
        <p className="text-xl font-bold uppercase mb-6">Sayfa Bulunamadı</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white font-black uppercase tracking-wider border-3 border-black hover:bg-[#FFE500] hover:text-black transition-all"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
