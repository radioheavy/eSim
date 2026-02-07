export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-3 border-black border-t-[#FFE500] animate-spin" />
        <p className="mt-4 font-bold text-sm uppercase tracking-wider">Yükleniyor...</p>
      </div>
    </div>
  )
}
