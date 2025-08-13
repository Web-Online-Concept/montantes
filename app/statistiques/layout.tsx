import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Statistiques - Montantes.pro | Performances et analyses',
  description: 'Consultez les statistiques détaillées de nos montantes : taux de réussite, ROI global, évolution de la bankroll et analyses de performance.',
  keywords: 'statistiques montantes, performance paris sportifs, ROI paris, taux réussite montantes, analyse bankroll',
  alternates: {
    canonical: '/statistiques',
  },
  openGraph: {
    title: 'Statistiques des montantes - Montantes.pro',
    description: 'Analyses détaillées et performances de nos montantes sportives. Transparence totale sur les résultats.',
    type: 'website',
    url: 'https://montantes.pro/statistiques',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Statistiques Montantes.pro',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Statistiques - Montantes.pro',
    description: 'Performances et analyses détaillées de nos montantes sportives',
    images: ['/og-image.png'],
  },
}

export default function StatistiquesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Données structurées pour la page de statistiques (sans export)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name: 'Statistiques Montantes.pro',
    description: 'Statistiques et analyses de performance des montantes sportives',
    url: 'https://montantes.pro/statistiques',
    provider: {
      '@type': 'Organization',
      name: 'Montantes.pro',
      url: 'https://montantes.pro',
    },
    dataset: [
      {
        '@type': 'Dataset',
        name: 'Taux de réussite',
        description: 'Pourcentage de montantes gagnées',
      },
      {
        '@type': 'Dataset',
        name: 'ROI Global',
        description: 'Return on Investment global',
      },
      {
        '@type': 'Dataset',
        name: 'Évolution bankroll',
        description: 'Progression de la bankroll dans le temps',
      },
    ],
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