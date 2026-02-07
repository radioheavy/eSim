import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eSIM Türkiye',
  description: 'Seyahat eSIM paketleri ile her yerde bağlı kal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
