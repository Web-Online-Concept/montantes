import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Montantes.pro - Suivi de montantes professionnelles',
  description: 'Suivez nos montantes en temps réel. Système professionnel de paris sportifs avec transparence totale.',
  keywords: 'montantes, paris sportifs, pronostics, bankroll',
  metadataBase: new URL('https://montantes.pro'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Montantes.pro - Suivi de montantes professionnelles',
    description: 'Suivez nos montantes en temps réel',
    url: 'https://montantes.pro',
    siteName: 'Montantes.pro',
    images: [
      {
        url: '/og-image.jpg', // Changez en .png si votre image est en PNG
        width: 1200,
        height: 630,
        alt: 'Montantes.pro - Système professionnel de paris sportifs',
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Montantes.pro - Suivi de montantes professionnelles',
    description: 'Suivez nos montantes en temps réel',
    images: ['/og-image.jpg'], // Changez en .png si votre image est en PNG
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear()
  
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Montantes.pro",
              "description": "Système professionnel de suivi de montantes avec transparence totale",
              "url": "https://montantes.pro",
              "publisher": {
                "@type": "Organization",
                "name": "Web Online Concept",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://montantes.pro/logo.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://montantes.pro/?s={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                <img src="/logo.png" alt="Logo Montantes.pro - Système professionnel de paris sportifs" className="w-[50px] h-[50px]" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Montantes.pro</h1>
                  <p className="text-sm text-gray-600">Suivez nos montantes</p>
                </div>
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="/fonctionnement"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fonctionnement
                </a>
                <a
                  href="https://t.me/votre_canal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  Telegram
                </a>
                <a
                  href="https://rounders.pro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Jouer sur Stake
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Colonne 1 - À propos */}
              <div>
                <h3 className="font-bold text-lg mb-4">Montantes.pro</h3>
                <p className="text-sm text-gray-400">
                  Système professionnel de suivi de montantes avec transparence totale.
                </p>
              </div>
              
              {/* Colonne 2 - Liens rapides */}
              <div>
                <h4 className="font-semibold mb-4">Liens rapides</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/" className="text-gray-400 hover:text-white transition">
                      Accueil
                    </a>
                  </li>
                  <li>
                    <a href="/fonctionnement" className="text-gray-400 hover:text-white transition">
                      Comment ça marche
                    </a>
                  </li>
                  <li>
                    <a href="/historique" className="text-gray-400 hover:text-white transition">
                      Historique complet
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Colonne 3 - Pages légales */}
              <div>
                <h4 className="font-semibold mb-4">Pages légales</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/mentions-legales" className="text-gray-400 hover:text-white transition">
                      Mentions légales
                    </a>
                  </li>
                  <li>
                    <a href="/cgu" className="text-gray-400 hover:text-white transition">
                      CGU
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Colonne 4 - Nous suivre */}
              <div>
                <h4 className="font-semibold mb-4">Nous suivre</h4>
                <a
                  href="https://t.me/votre_canal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                >
                  <div className="relative inline-flex items-center">
                    <div className="w-6 h-6 bg-[#229ED9] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                      </svg>
                    </div>
                  </div>
                  <span>Canal Telegram</span>
                </a>
                <div className="mt-6">
                  <a href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition">
                    Admin
                  </a>
                </div>
              </div>
            </div>
            
            {/* Avertissement */}
            <div className="border-t border-gray-800 mt-8 pt-6 mb-4">
              <p className="text-xs text-gray-400 text-center">
                Les paris sportifs comportent des risques. Ne pariez que ce que vous pouvez vous permettre de perdre. 
                18+ | Jouez responsable
              </p>
            </div>
            
            {/* Copyright */}
            <div className="text-center text-sm text-gray-400">
              <p>© {currentYear} Montantes.pro - Tous droits réservés</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}