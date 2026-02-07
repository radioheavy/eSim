import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://esim.com'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/tr`, lastModified: new Date(), changeFrequency: 'daily' },
    { url: `${SITE_URL}/tr/packages`, lastModified: new Date(), changeFrequency: 'daily' },
  ]

  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()

    const { data: packages } = await supabase
      .from('packages')
      .select('slug, updated_at')
      .eq('is_active', true)

    const packageUrls = (packages || []).map((pkg) => ({
      url: `${SITE_URL}/tr/packages/${pkg.slug}`,
      lastModified: new Date(pkg.updated_at),
      changeFrequency: 'weekly' as const,
    }))

    return [...staticPages, ...packageUrls]
  } catch {
    return staticPages
  }
}
