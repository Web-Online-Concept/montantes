import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions Légales - Montantes.pro | Informations légales',
  description: 'Mentions légales du site Montantes.pro. Informations sur l\'éditeur, l\'hébergement et la protection des données.',
  keywords: 'mentions légales, informations légales, éditeur, hébergeur, RGPD, Montantes.pro',
  alternates: {
    canonical: '/mentions-legales',
  },
  openGraph: {
    title: 'Mentions Légales - Montantes.pro',
    description: 'Informations légales et réglementaires du site Montantes.pro',
    type: 'website',
    url: 'https://montantes.pro/mentions-legales',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Montantes.pro - Mentions Légales',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mentions Légales - Montantes.pro',
    description: 'Informations légales et réglementaires du site Montantes.pro',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Données structurées pour les mentions légales (sans export)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Mentions Légales - Montantes.pro',
    description: 'Mentions légales du site Montantes.pro',
    url: 'https://montantes.pro/mentions-legales',
    publisher: {
      '@type': 'Organization',
      name: 'Web Online Concept',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue Paul Estival',
        addressLocality: 'Toulouse',
        postalCode: '31200',
        addressCountry: 'FR',
      },
      email: 'web.online.concept@gmail.com',
      taxID: '510 583 800 00048',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}