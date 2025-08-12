import { formatEuro, formatPourcentage } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comment fonctionnent les montantes - Montantes.pro | Guide complet',
  description: 'Découvrez le fonctionnement des montantes : méthode de paris progressifs, règles strictes, exemples pratiques et avertissements importants.',
  keywords: 'fonctionnement montantes, méthode paris progressifs, stratégie montante, règles montantes, guide montantes',
  alternates: {
    canonical: '/fonctionnement',
  },
  openGraph: {
    title: 'Guide des montantes - Montantes.pro',
    description: 'Comprendre le fonctionnement des montantes sportives : méthode, exemples et règles de gestion.',
    type: 'article',
    url: 'https://montantes.pro/fonctionnement',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Guide Montantes.pro',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comment fonctionnent les montantes - Montantes.pro',
    description: 'Guide complet sur la méthode des montantes dans les paris sportifs',
    images: ['/og-image.png'],
  },
}

// Données structurées pour le guide
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment fonctionnent les montantes sportives',
  description: 'Guide complet pour comprendre et utiliser la méthode des montantes dans les paris sportifs',
  url: 'https://montantes.pro/fonctionnement',
  image: 'https://montantes.pro/og-image.png',
  author: {
    '@type': 'Organization',
    name: 'Montantes.pro',
    url: 'https://montantes.pro',
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Définition de l\'objectif',
      text: 'Chaque montante commence avec une mise initiale et un objectif multiplicateur (x2, x3, x5 ou x10).',
    },
    {
      '@type': 'HowToStep',
      name: 'Réinvestissement intégral',
      text: 'À chaque palier gagné, l\'intégralité des gains est réinvestie sur le pari suivant.',
    },
    {
      '@type': 'HowToStep',
      name: 'Sélection rigoureuse des paris',
      text: 'Sélection de paris avec des cotes comprises entre 1.30 et 2.00.',
    },
    {
      '@type': 'HowToStep',
      name: 'Fin de la montante',
      text: 'La montante se termine quand l\'objectif est atteint, un palier est perdu, ou clôture manuelle.',
    },
  ],
  totalTime: 'PT30M',
  supply: {
    '@type': 'HowToSupply',
    name: 'Capital de départ',
  },
  tool: {
    '@type': 'HowToTool',
    name: 'Compte de paris sportifs',
  },
  yield: 'Multiplication du capital initial selon l\'objectif fixé',
}

export default function FonctionnementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e40af] mb-4">
            Comment fonctionnent les montantes ?
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez notre méthode de paris progressifs et nos règles strictes
          </p>
        </section>

        {/* Qu'est-ce qu'une montante */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Qu'est-ce qu'une montante ?</h2>
          <div className="prose prose-lg text-gray-700">
            <p>
              Une montante est une méthode qui consiste à utiliser <strong>l'intégralité des gains réalisés</strong> sur un pari 
              (mise initiale incluse) comme mise pour le pari suivant. On répète ce processus à chaque palier jusqu'à 
              atteindre l'objectif de gain fixé. C'est une technique qui permet de multiplier rapidement sa mise initiale, 
              mais qui nécessite de remporter tous les paris consécutifs.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-[#1e40af] p-4 my-6">
              <p className="font-semibold text-[#1e40af] mb-2">Exemple concret :</p>
              <p className="text-gray-700">
                Avec 10€ de mise initiale sur une cote à 2.00, vous gagnez 20€. Ces 20€ deviennent la mise du palier 
                suivant. Si vous gagnez à nouveau sur une cote de 1.50, vous obtenez 30€, et ainsi de suite.
              </p>
            </div>
          </div>
        </section>

        {/* Comment fonctionne notre système */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Comment fonctionne notre système ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Étape 1 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-[#1e40af] font-bold text-xl">
                  1
                </div>
                <h3 className="ml-3 font-semibold text-lg">Définition de l'objectif</h3>
              </div>
              <p className="text-gray-700">
                Chaque montante commence avec une mise initiale et un objectif multiplicateur (x2, x3, x5 ou x10). 
                Par exemple, avec 10€ de mise initiale et un objectif x3, nous visons 30€ de gain total.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-[#1e40af] font-bold text-xl">
                  2
                </div>
                <h3 className="ml-3 font-semibold text-lg">Réinvestissement intégral</h3>
              </div>
              <p className="text-gray-700">
                À chaque palier gagné, l'intégralité des gains (mise + bénéfice) est réinvestie sur le pari suivant. 
                Il n'y a pas de retrait partiel : tout est remis en jeu jusqu'à l'objectif final ou la perte d'un palier.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-[#1e40af] font-bold text-xl">
                  3
                </div>
                <h3 className="ml-3 font-semibold text-lg">Sélection rigoureuse des paris</h3>
              </div>
              <p className="text-gray-700">
                Nous sélectionnons des paris avec des cotes comprises entre <strong>1.30 et 2.00</strong>, privilégiant la fiabilité. 
                Les paris peuvent être simples ou combinés (maximum 2 matchs) pour maintenir un bon équilibre risque/gain.
              </p>
            </div>

            {/* Étape 4 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-[#1e40af] font-bold text-xl">
                  4
                </div>
                <h3 className="ml-3 font-semibold text-lg">Fin de la montante</h3>
              </div>
              <p className="text-gray-700">
                La montante se termine dans 3 cas : l'objectif est atteint (succès), un palier est perdu (échec), 
                ou nous décidons de sécuriser les gains avant l'objectif (clôture manuelle).
              </p>
            </div>
          </div>
        </section>

        {/* Exemple pratique */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Exemple pratique d'une montante</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e40af] text-white">
                  <th className="px-4 py-3 text-left">Palier</th>
                  <th className="px-4 py-3 text-center">Mise</th>
                  <th className="px-4 py-3 text-center">Cote</th>
                  <th className="px-4 py-3 text-center">Gain</th>
                  <th className="px-4 py-3 text-right">Progression</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">1</td>
                  <td className="px-4 py-3 text-center">{formatEuro(10)}</td>
                  <td className="px-4 py-3 text-center">× 1.50</td>
                  <td className="px-4 py-3 text-center font-semibold">{formatEuro(15)}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold">{formatPourcentage(50)}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">2</td>
                  <td className="px-4 py-3 text-center">{formatEuro(15)}</td>
                  <td className="px-4 py-3 text-center">× 1.40</td>
                  <td className="px-4 py-3 text-center font-semibold">{formatEuro(21)}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold">{formatPourcentage(110)}</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-3 font-medium">3</td>
                  <td className="px-4 py-3 text-center">{formatEuro(21)}</td>
                  <td className="px-4 py-3 text-center">× 1.45</td>
                  <td className="px-4 py-3 text-center font-semibold">{formatEuro(30.45)}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold">{formatPourcentage(204)} ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mt-4 text-gray-700">
            Dans cet exemple, l'objectif x3 est atteint en 3 paliers. La mise initiale de 10€ devient 30.45€.
          </p>
        </section>

        {/* Points importants */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Points importants à retenir</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Tout ou rien</h3>
                <p className="text-gray-700">
                  Si un seul palier est perdu, l'intégralité de la montante est perdue. 
                  Il n'y a pas de récupération possible.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Capital dédié</h3>
                <p className="text-gray-700">
                  Ne jamais utiliser plus de 1-5% de votre bankroll totale pour une montante. 
                  C'est une technique à haut risque.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Discipline absolue</h3>
                <p className="text-gray-700">
                  Respectez toujours votre plan initial : objectif fixé, types de paris définis, 
                  et limite de paliers établie.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📉</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Probabilités décroissantes</h3>
                <p className="text-gray-700">
                  Plus vous enchaînez de paliers, plus la probabilité de tout gagner diminue. 
                  Même avec des cotes faibles, le risque augmente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Notre approche */}
        <section className="bg-[#1e40af] text-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Notre approche professionnelle</h2>
          
          <p className="text-lg mb-6 text-blue-100">
            Chez Montantes.pro, nous appliquons une méthodologie stricte pour maximiser les chances de succès :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-[#fbbf24] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Analyse approfondie</h3>
                <p className="text-blue-100">Chaque pari est analysé pendant plusieurs heures avant d'être sélectionné.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-[#fbbf24] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Diversification</h3>
                <p className="text-blue-100">Nous ne concentrons jamais plusieurs montantes sur les mêmes marchés.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-[#fbbf24] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Transparence totale</h3>
                <p className="text-blue-100">Tous nos paliers sont publiés en temps réel, succès comme échecs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-[#fbbf24] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Gestion du capital</h3>
                <p className="text-blue-100">Jamais plus de 5% de notre bankroll sur une seule montante.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment nous suivre */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Comment nous suivre ?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#0088cc] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">1. Rejoignez notre canal Telegram</h3>
                <p className="text-gray-700 mb-3">
                  Recevez les notifications instantanées de chaque nouveau palier avec toutes les informations 
                  nécessaires pour suivre ou répliquer.
                </p>
                <a
                  href="https://t.me/montantespro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#0088cc] text-white px-4 py-2 rounded-lg hover:bg-[#0077b3] transition-colors"
                >
                  <span>Rejoindre le canal</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#1e40af] rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">🌐</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Consultez le site régulièrement</h3>
                <p className="text-gray-700">
                  Retrouvez l'historique complet, les statistiques détaillées et le suivi en temps réel 
                  de toutes les montantes actives.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#fbbf24] rounded-lg flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Gérez votre propre bankroll</h3>
                <p className="text-gray-700">
                  Si vous décidez de suivre nos montantes, utilisez toujours une bankroll dédiée et ne misez 
                  que ce que vous pouvez vous permettre de perdre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Avertissement */}
        <section className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <svg className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-3">Avertissement important</h2>
              <p className="text-red-700 mb-3">
                Les montantes sont une technique à très haut risque. Un seul pari perdu entraîne la perte totale 
                de la montante. Les performances passées ne garantissent pas les résultats futurs.
              </p>
              <p className="text-red-700">
                Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. Les paris sportifs peuvent 
                créer une dépendance. Jouez de manière responsable et fixez-vous des limites strictes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}