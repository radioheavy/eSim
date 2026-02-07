import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()

  const formData = await request.formData()
  const file = formData.get('file') as File
  const packageId = formData.get('package_id') as string

  if (!file || !packageId) {
    return NextResponse.json({ error: 'Dosya ve paket ID gerekli' }, { status: 400 })
  }

  // Validate file
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Sadece resim dosyaları kabul edilir' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Dosya 5MB\'dan büyük olamaz' }, { status: 400 })
  }

  // Check package exists
  const { data: pkg } = await supabase
    .from('packages')
    .select('id')
    .eq('id', packageId)
    .single()

  if (!pkg) {
    return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 })
  }

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop() || 'png'
  const fileName = `${packageId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('qr-codes')
    .upload(fileName, file, { contentType: file.type })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 })
  }

  // Create QR code record
  const { error: insertError } = await supabase
    .from('qr_codes')
    .insert({
      package_id: packageId,
      image_path: fileName,
      status: 'available',
    })

  if (insertError) {
    // Clean up uploaded file
    await supabase.storage.from('qr-codes').remove([fileName])
    console.error('Insert error:', insertError)
    return NextResponse.json({ error: 'Kayıt oluşturma hatası' }, { status: 500 })
  }

  return NextResponse.json({ success: true, path: fileName })
}
