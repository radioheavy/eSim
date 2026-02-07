'use client'

import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-black text-6xl mb-4">HATA</h1>
        <p className="text-lg font-medium text-gray-600 mb-6">
          Bir şeyler yanlış gitti.
        </p>
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  )
}
