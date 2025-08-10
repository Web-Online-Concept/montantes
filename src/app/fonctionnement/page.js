'use client'

import { useEffect } from 'react'

export default function FonctionnementPage() {
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = 'Comment fonctionnent les montantes - Montantes.pro'
    
    // Mise à jour de la description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez notre système professionnel de montantes : stratégie, gestion des risques, types de paris et méthode pour maximiser vos chances de succès.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment fonctionnent les montantes",
            "description": "Guide complet sur le fonctionnement des montantes dans les paris sportifs",
            "author": {
              "@type": "Organization",
              "name": "Montantes.pro"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "logo": {
                "@type": "ImageObject",
                "url": "https://montantes.pro/logo.png"
              }
            },
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://montantes.pro/fonctionnement"
            }
          })
        }}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Qu'est-ce qu'une montante ?</h2>
          <p className="text-gray-700 mb-4">
            Une montante est une méthode qui consiste à utiliser l'intégralité des gains réalisés sur un pari (mise initiale incluse) comme mise pour le pari suivant. 
            On répète ce processus à chaque palier jusqu'à atteindre l'objectif de gain fixé. C'est une technique qui permet de multiplier rapidement sa mise initiale, 
            mais qui nécessite de remporter tous les paris consécutifs.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm">
              <strong>Exemple concret :</strong> Avec 10€ de mise initiale sur une cote à 2.00, vous gagnez 20€. 
              Ces 20€ deviennent la mise du palier suivant. Si vous gagnez à nouveau sur une cote de 1.50, vous obtenez 30€, et ainsi de suite.
            </p>
          </div>
        </div>

        {/* Fonctionnement */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Comment fonctionne notre système ?</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                Définition de l'objectif
              </h3>
              <p className="text-gray-700 ml-10">
                Chaque montante commence avec une mise initiale et un objectif multiplicateur (x2, x3, x5 ou x10). 
                Par exemple, avec 10€ de mise initiale et un objectif x3, nous visons 30€ de gain total.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                Réinvestissement intégral
              </h3>
              <p className="text-gray-700 ml-10">
                À chaque palier gagné, l'intégralité des gains (mise + bénéfice) est réinvestie sur le pari suivant. 
                Il n'y a pas de retrait partiel : tout est remis en jeu jusqu'à l'objectif final ou la perte d'un palier.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                Sélection rigoureuse des paris
              </h3>
              <p className="text-gray-700 ml-10">
                Nous sélectionnons des paris avec des cotes comprises entre 1.30 et 2.00, privilégiant la fiabilité. 
                Les paris peuvent être simples ou combinés (maximum 2 matchs) pour maintenir un bon équilibre risque/gain.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
                Fin de la montante
              </h3>
              <p className="text-gray-700 ml-10">
                La montante se termine dans 3 cas : l'objectif est atteint (succès), un palier est perdu (échec), 
                ou nous décidons de sécuriser les gains avant l'objectif (clôture manuelle).
              </p>
            </div>
          </div>
        </div>

        {/* Exemple pratique */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Exemple pratique d'une montante</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Palier</th>
                  <th className="p-2 text-left">Mise</th>
                  <th className="p-2 text-left">Cote</th>
                  <th className="p-2 text-left">Gain</th>
                  <th className="p-2 text-left">Progression</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">1</td>
                  <td className="p-2">10€</td>
                  <td className="p-2">×1.50</td>
                  <td className="p-2">15€</td>
                  <td className="p-2 text-green-600">+50%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">2</td>
                  <td className="p-2">15€</td>
                  <td className="p-2">×1.40</td>
                  <td className="p-2">21€</td>
                  <td className="p-2 text-green-600">+110%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">3</td>
                  <td className="p-2">21€</td>
                  <td className="p-2">×1.45</td>
                  <td className="p-2">30.45€</td>
                  <td className="p-2 text-green-600">+204% ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Dans cet exemple, l'objectif x3 est atteint en 3 paliers. La mise initiale de 10€ devient 30.45€.
          </p>
        </div>

        {/* Points importants */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Points importants à retenir</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <h3 className="font-semibold">Tout ou rien</h3>
                <p className="text-sm text-gray-600">
                  Si un seul palier est perdu, l'intégralité de la montante est perdue. Il n'y a pas de récupération possible.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">€</span>
              </div>
              <div>
                <h3 className="font-semibold">Capital dédié</h3>
                <p className="text-sm text-gray-600">
                  Ne jamais utiliser plus de 1-5% de votre bankroll totale pour une montante. C'est une technique à haut risque.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Discipline absolue</h3>
                <p className="text-sm text-gray-600">
                  Respectez toujours votre plan initial : objectif fixé, types de paris définis, et limite de paliers établie.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">%</span>
              </div>
              <div>
                <h3 className="font-semibold">Probabilités décroissantes</h3>
                <p className="text-sm text-gray-600">
                  Plus vous enchaînez de paliers, plus la probabilité de tout gagner diminue. Même avec des cotes faibles, le risque augmente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notre approche */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Notre approche professionnelle</h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Chez Montantes.pro, nous appliquons une méthodologie stricte pour maximiser les chances de succès :
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <strong>Analyse approfondie :</strong> Chaque pari est analysé pendant plusieurs heures avant d'être sélectionné.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <strong>Diversification :</strong> Nous ne concentrons jamais plusieurs montantes sur les mêmes marchés.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <strong>Transparence totale :</strong> Tous nos paliers sont publiés en temps réel, succès comme échecs.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <strong>Gestion du capital :</strong> Jamais plus de 5% de notre bankroll sur une seule montante.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Comment nous suivre */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Comment nous suivre ?</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Rejoignez notre canal Telegram</h3>
              <p className="text-sm text-gray-600 mb-3">
                Recevez les notifications instantanées de chaque nouveau palier avec toutes les informations nécessaires pour suivre ou répliquer.
              </p>
              <a
                href="https://t.me/votre_canal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Rejoindre le canal
              </a>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Consultez le site régulièrement</h3>
              <p className="text-sm text-gray-600">
                Retrouvez l'historique complet, les statistiques détaillées et le suivi en temps réel de toutes les montantes actives.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Gérez votre propre bankroll</h3>
              <p className="text-sm text-gray-600">
                Si vous décidez de suivre nos montantes, utilisez toujours une bankroll dédiée et ne misez que ce que vous pouvez vous permettre de perdre.
              </p>
            </div>
          </div>
        </div>

        {/* Avertissement */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-800 mb-2">⚠️ Avertissement important</h2>
          <p className="text-red-700 text-sm mb-3">
            Les montantes sont une technique à très haut risque. Un seul pari perdu entraîne la perte totale de la montante. 
            Les performances passées ne garantissent pas les résultats futurs.
          </p>
          <p className="text-red-700 text-sm">
            Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. Les paris sportifs peuvent créer une dépendance. 
            Jouez de manière responsable et fixez-vous des limites strictes.
          </p>
        </div>
      </main>
    </div>
  )
}