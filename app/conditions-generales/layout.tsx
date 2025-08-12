import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - Montantes.pro | CGU',
  description: 'Conditions générales d\'utilisation du site Montantes.pro. Règles d\'utilisation, responsabilités et avertissements sur les paris sportifs.',
  keywords: 'CGU, conditions générales, conditions utilisation, règlement, Montantes.pro',
  alternates: {
    canonical: '/conditions-generales',
  },
  openGraph: {
    title: 'CGU - Montantes.pro',
    description: 'Conditions générales d\'utilisation du site Montantes.pro',
    type: 'website',
    url: 'https://montantes.pro/conditions-generales',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Montantes.pro - Conditions Générales',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CGU - Montantes.pro',
    description: 'Conditions générales d\'utilisation du site Montantes.pro',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ConditionsGeneralesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}