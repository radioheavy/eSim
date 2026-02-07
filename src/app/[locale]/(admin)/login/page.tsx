'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Giriş başarısız. Bilgilerinizi kontrol edin.')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE500] p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-black text-2xl tracking-tighter">
            eSIM<span className="text-black bg-[#FFE500] px-1 ml-0.5">ADMIN</span>
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase mt-2">Yönetim Paneli Girişi</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white font-bold p-3 mb-4 text-sm border-3 border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'GİRİŞ YAP'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
