'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

export default function EmailTemplatesPage() {
  const { addToast } = useToast()
  const [testEmail, setTestEmail] = useState('')
  const [sending, setSending] = useState(false)

  async function handleTestSend() {
    if (!testEmail) return
    setSending(true)
    try {
      const res = await fetch('/api/orders/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      })
      if (!res.ok) throw new Error()
      addToast('Test e-postası gönderildi', 'success')
    } catch {
      addToast('Gönderilemedi', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-black text-3xl uppercase tracking-tight">E-posta Şablonları</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">
            Sipariş Onay E-postası
          </h2>
          <div className="border-3 border-black p-4 bg-gray-50">
            <div className="space-y-2 text-sm">
              <p className="font-black text-lg">eSIM TR</p>
              <hr className="border-black border-t-2" />
              <p>Merhaba <strong>[Müşteri Adı]</strong>,</p>
              <p>Siparişiniz başarıyla oluşturuldu!</p>
              <p><strong>Sipariş No:</strong> [ESM-XXXXXXXX-XXX]</p>
              <p><strong>Paket:</strong> [Paket Adı]</p>
              <p><strong>Veri:</strong> [Veri Miktarı] / [Süre] gün</p>
              <hr className="border-black border-t-2" />
              <p className="font-bold">QR Kodunuz ektedir.</p>
              <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-400">
                [QR Kod Görseli]
              </div>
              <p className="font-bold mt-4">Kurulum Adımları:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ayarlar → Mobil Veri → eSIM Ekle</li>
                <li>QR kodu telefonunuzla tarayın</li>
                <li>eSIM profilini yükleyin</li>
                <li>Veri dolaşımını açın</li>
              </ol>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-black text-lg uppercase mb-4 border-b-3 border-black pb-2">
            Test Gönderimi
          </h2>
          <div className="space-y-4">
            <Input
              id="test_email"
              type="email"
              label="Test E-posta Adresi"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
            <Button onClick={handleTestSend} disabled={sending || !testEmail} className="w-full">
              {sending ? 'Gönderiliyor...' : 'Test E-postası Gönder'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
