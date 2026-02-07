import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
} from '@react-email/components'

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  packageName: string
  dataAmount: string
  durationDays: number
  countryName: string
}

export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  packageName,
  dataAmount,
  durationDays,
  countryName,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ borderBottom: '3px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '24px', fontWeight: '900', margin: '0' }}>
              eSIM TR
            </Text>
          </Section>

          <Text style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
            Merhaba <strong>{customerName}</strong>,
          </Text>
          <Text style={{ fontSize: '16px', margin: '0 0 24px 0' }}>
            Siparişiniz başarıyla oluşturuldu!
          </Text>

          <Section style={{ backgroundColor: '#FFE500', padding: '16px', border: '3px solid #000', marginBottom: '24px' }}>
            <Text style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' as const, margin: '0 0 4px 0' }}>
              Sipariş Numarası
            </Text>
            <Text style={{ fontSize: '24px', fontWeight: '900', margin: '0' }}>
              {orderNumber}
            </Text>
          </Section>

          <Section style={{ border: '3px solid #000', padding: '16px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>
              <strong>Ülke:</strong> {countryName}
            </Text>
            <Text style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>
              <strong>Paket:</strong> {packageName}
            </Text>
            <Text style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>
              <strong>Veri:</strong> {dataAmount}
            </Text>
            <Text style={{ fontSize: '14px', fontWeight: '700', margin: '0' }}>
              <strong>Süre:</strong> {durationDays} gün
            </Text>
          </Section>

          <Text style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' }}>
            QR Kodunuz ektedir.
          </Text>

          <Text style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>
            Ek olarak gönderilen QR kod görselini kullanarak eSIM&apos;inizi kurabilirsiniz.
          </Text>

          <Hr style={{ border: '2px solid #000', margin: '24px 0' }} />

          <Text style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0' }}>
            Kurulum Adımları:
          </Text>
          <Text style={{ fontSize: '14px', margin: '0 0 6px 0' }}>
            1. Ayarlar → Mobil Veri → eSIM Ekle
          </Text>
          <Text style={{ fontSize: '14px', margin: '0 0 6px 0' }}>
            2. QR kodu telefonunuzla tarayın
          </Text>
          <Text style={{ fontSize: '14px', margin: '0 0 6px 0' }}>
            3. eSIM profilini yükleyin
          </Text>
          <Text style={{ fontSize: '14px', margin: '0 0 24px 0' }}>
            4. Veri dolaşımını açın
          </Text>

          <Hr style={{ border: '1px solid #eee', margin: '24px 0' }} />
          <Text style={{ fontSize: '12px', color: '#999', textAlign: 'center' as const }}>
            © {new Date().getFullYear()} eSIM TR. Tüm hakları saklıdır.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
