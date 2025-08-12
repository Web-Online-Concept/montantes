import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Montantes.pro | Protection des données',
  description: 'Politique de confidentialité de Montantes.pro. Découvrez comment nous protégeons vos données personnelles conformément au RGPD.',
  keywords: 'politique confidentialité, RGPD, protection données, vie privée, Montantes.pro',
  alternates: {
    canonical: '/politique-confidentialite',
  },
  openGraph: {
    title: 'Politique de Confidentialité - Montantes.pro',
    description: 'Protection de vos données personnelles conformément au RGPD',
    type: 'website',
    url: 'https://montantes.pro/politique-confidentialite',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Montantes.pro - Politique de Confidentialité',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politique de Confidentialité - Montantes.pro',
    description: 'Protection de vos données personnelles conformément au RGPD',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PolitiqueConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}