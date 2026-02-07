import { Resend } from 'resend'
import { render } from '@react-email/components'
import { OrderConfirmationEmail } from '@/components/email/order-confirmation'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendOrderEmailParams {
  orderId: string
  customerName: string
  customerEmail: string
  orderNumber: string
  packageName: string
  dataAmount: string
  durationDays: number
  countryName: string
  qrImagePath: string
}

export async function sendOrderEmail(params: SendOrderEmailParams) {
  const supabase = createAdminClient()

  // Download QR image from Supabase Storage
  const { data: qrData, error: downloadError } = await supabase.storage
    .from('qr-codes')
    .download(params.qrImagePath)

  if (downloadError || !qrData) {
    await logEmail(supabase, params.orderId, params.customerEmail, 'failed', null, `QR download failed: ${downloadError?.message}`)
    throw new Error(`Failed to download QR: ${downloadError?.message}`)
  }

  const qrBuffer = Buffer.from(await qrData.arrayBuffer())

  const emailHtml = await render(
    OrderConfirmationEmail({
      customerName: params.customerName,
      orderNumber: params.orderNumber,
      packageName: params.packageName,
      dataAmount: params.dataAmount,
      durationDays: params.durationDays,
      countryName: params.countryName,
    })
  )

  const subject = `eSIM Siparişiniz Hazır - ${params.orderNumber}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@esim.com',
      to: params.customerEmail,
      subject,
      html: emailHtml,
      attachments: [
        {
          filename: `esim-qr-${params.orderNumber}.png`,
          content: qrBuffer,
        },
      ],
    })

    if (error) {
      await logEmail(supabase, params.orderId, params.customerEmail, 'failed', null, error.message)
      throw error
    }

    await logEmail(supabase, params.orderId, params.customerEmail, 'sent', data?.id || null, null)

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'sent', email_sent: true, email_sent_at: new Date().toISOString() })
      .eq('id', params.orderId)

    return data
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await logEmail(supabase, params.orderId, params.customerEmail, 'failed', null, message)
    throw err
  }
}

async function logEmail(
  supabase: ReturnType<typeof createAdminClient>,
  orderId: string,
  toEmail: string,
  status: string,
  resendId: string | null,
  errorMessage: string | null
) {
  await supabase.from('email_logs').insert({
    order_id: orderId,
    to_email: toEmail,
    subject: `eSIM Siparişiniz Hazır`,
    resend_id: resendId,
    status,
    error_message: errorMessage,
  })
}
