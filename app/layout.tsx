import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Montantes.pro - Gestion de montantes sportives',
  description: 'Plateforme professionnelle de suivi et gestion de montantes dans les paris sportifs. Transparence totale et méthodologie stricte.',
  keywords: 'montantes, paris sportifs, gestion bankroll, stratégie paris',
  authors: [{ name: 'Montantes.pro' }],
  publisher: 'Montantes.pro',
  metadataBase: new URL('https://montantes.pro'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.png',
      }
    ]
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Montantes.pro - Gestion de montantes sportives',
    description: 'Suivez nos montantes en temps réel avec transparence totale',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://montantes.pro',
    siteName: 'Montantes.pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Montantes.pro - Gestion professionnelle de montantes sportives',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Montantes.pro',
    description: 'Gestion professionnelle de montantes sportives',
    images: ['/og-image.png'],
    creator: '@montantespro',
    site: '@montantespro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-google-search-console',
    yandex: 'votre-code-yandex',
    other: {
      'msvalidate.01': 'votre-code-bing',
    }
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e40af',
}

// Données structurées Schema.org
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Montantes.pro',
  description: 'Plateforme professionnelle de suivi et gestion de montantes dans les paris sportifs',
  url: 'https://montantes.pro',
  publisher: {
    '@type': 'Organization',
    name: 'Montantes.pro',
    logo: {
      '@type': 'ImageObject',
      url: 'https://montantes.pro/logo.png',
      width: 100,
      height: 100,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://montantes.pro/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  mainEntity: {
    '@type': 'SportsActivityLocation',
    name: 'Montantes.pro',
    description: 'Service de gestion de montantes sportives',
    url: 'https://montantes.pro',
    priceRange: '€€',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Montantes.pro" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-slate-50`}>
        <Header />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}