import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Historique Bankroll - Montantes.pro | Évolution du capital',
  description: 'Suivez l\'évolution détaillée de votre bankroll : dépôts, retraits, gains et pertes. Timeline complète et graphiques de progression.',
  keywords: 'historique bankroll, évolution capital, suivi gains pertes, timeline paris sportifs, gestion bankroll',
  alternates: {
    canonical: '/historique',
  },
  openGraph: {
    title: 'Historique de la bankroll - Montantes.pro',
    description: 'Timeline détaillée et évolution du capital. Transparence totale sur tous les mouvements.',
    type: 'website',
    url: 'https://montantes.pro/historique',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Historique Montantes.pro',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Historique Bankroll - Montantes.pro',
    description: 'Évolution détaillée du capital et timeline complète',
    images: ['/og-image.png'],
  },
}

export default function HistoriqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Données structurées intégrées directement (sans export)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'Historique Bankroll Montantes.pro',
    description: 'Suivi détaillé de l\'évolution du capital dans les paris sportifs',
    url: 'https://montantes.pro/historique',
    provider: {
      '@type': 'Organization',
      name: 'Montantes.pro',
      url: 'https://montantes.pro',
    },
    featureList: [
      'Timeline détaillée des transactions',
      'Graphiques d\'évolution',
      'Export CSV des données',
      'Filtres par période et type',
      'Calcul de performance automatique',
    ],
    additionalType: 'http://www.productontology.org/id/Financial_accounting',
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