'use client'

import { useState, useEffect } from 'react'

export default function HistoriquePage() {
  const [montantes, setMontantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('TOUS') // TOUS, GAGNEE, PERDUE

  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = 'Historique complet des montantes - Montantes.pro'
    
    // Mise à jour de la description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Consultez l\'historique complet de toutes nos montantes : résultats détaillés, statistiques, gains et pertes. Transparence totale sur nos performances.')
    }
    
    fetchMontantes()
  }, [])

  const fetchMontantes = async () => {
    try {
      const response = await fetch('/api/montantes')
      if (response.ok) {
        const data = await response.json()
        // FIX: L'API retourne { montantes: [...] }
        setMontantes(data.montantes || [])
      }
    } catch (error) {
      console.error('Erreur chargement montantes:', error)
      setMontantes([])
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les montantes
  const montantesFiltrees = montantes
    .filter(m => m.statut !== 'en_cours')
    .filter(m => {
      if (filter === 'TOUS') return true
      return m.statut === filter
    })

  // Calculer les stats
  const stats = {
    total: montantes.filter(m => m.statut !== 'en_cours').length,
    gagnees: montantes.filter(m => m.statut === 'GAGNEE').length,
    perdues: montantes.filter(m => m.statut === 'PERDUE').length,
    gains: montantes
      .filter(m => m.statut !== 'en_cours' && m.gainFinal > 0)
      .reduce((sum, m) => sum + m.gainFinal, 0),
    pertes: montantes
      .filter(m => m.statut !== 'en_cours' && m.gainFinal < 0)
      .reduce((sum, m) => sum + m.gainFinal, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Historique des montantes",
            "description": "Historique complet de toutes les montantes terminées avec statistiques détaillées",
            "url": "https://montantes.pro/historique",
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://montantes.pro"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://montantes.pro"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Historique",
                  "item": "https://montantes.pro/historique"
                }
              ]
            }
          })
        }}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Titre de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historique Complet</h1>
          <p className="text-gray-600 mt-2">Toutes les montantes terminées</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-600">Total montantes</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.gagnees}</p>
            <p className="text-sm text-gray-600">Gagnées</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.perdues}</p>
            <p className="text-sm text-gray-600">Perdues</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">+{stats.gains.toFixed(2)}€</p>
            <p className="text-sm text-gray-600">Total gains</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.pertes.toFixed(2)}€</p>
            <p className="text-sm text-gray-600">Total pertes</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filtrer :</span>
            <button
              onClick={() => setFilter('TOUS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'TOUS' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setFilter('GAGNEE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'GAGNEE' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Gagnées ({stats.gagnees})
            </button>
            <button
              onClick={() => setFilter('PERDUE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'PERDUE' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Perdues ({stats.perdues})
            </button>
          </div>
        </div>

        {/* Liste des montantes */}
        <div className="space-y-4">
          {montantesFiltrees.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Aucune montante trouvée
            </div>
          ) : (
            montantesFiltrees.map(montante => (
              <div key={montante.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <button
                  onClick={() => {
                    const element = document.getElementById(`montante-detail-${montante.id}`)
                    if (element) {
                      element.classList.toggle('hidden')
                    }
                  }}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold flex items-center gap-2">
                        {montante.statut === 'GAGNEE' ? (
                          <span className="text-yellow-500">🏆</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                        Montante n°{montante.id} - Objectif {montante.objectif.toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(montante.createdAt).toLocaleDateString('fr-FR')} - {montante.dateFin ? new Date(montante.dateFin).toLocaleDateString('fr-FR') : 'En cours'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Mise: {montante.miseInitiale.toFixed(2)} € | 
                        Résultat: {montante.gainFinal >= 0 ? '+' : ''}{montante.gainFinal.toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        montante.statut === 'GAGNEE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {montante.statut === 'GAGNEE' ? 'Gagnée' : 'Perdue'}
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Détails cachés */}
                <div id={`montante-detail-${montante.id}`} className="hidden border-t">
                  <div className="p-4 space-y-3">
                    <div className="text-sm text-gray-600">
                      <p><strong>Nombre de paliers:</strong> {montante.paliers?.length || 0}</p>
                      <p><strong>Objectif visé:</strong> {(montante.miseInitiale * parseInt(montante.objectif.slice(1))).toFixed(2)} €</p>
                      <p><strong>Gain net final:</strong> {montante.gainFinal >= 0 ? '+' : ''}{montante.gainFinal.toFixed(2)} €</p>
                    </div>
                    
                    {/* Liste détaillée des paliers */}
                    {montante.paliers && montante.paliers.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-sm mb-2">Détail complet des paliers:</p>
                        <div className="space-y-3">
                          {montante.paliers.map((palier, idx) => (
                            <div key={palier.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold flex items-center gap-2">
                                  {palier.statut === 'GAGNE' ? (
                                    <span className="text-green-500">✓</span>
                                  ) : palier.statut === 'PERDU' ? (
                                    <span className="text-red-500">✗</span>
                                  ) : (
                                    <span className="text-gray-400">◯</span>
                                  )}
                                  Palier {palier.numero}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  palier.statut === 'GAGNE' ? 'bg-green-100 text-green-800' :
                                  palier.statut === 'PERDU' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {palier.statut === 'GAGNE' ? 'Gagné' :
                                   palier.statut === 'PERDU' ? 'Perdu' : 'En attente'}
                                </span>
                              </div>
                              
                              <div className="text-sm space-y-1">
                                <p className="text-gray-600">{palier.description}</p>
                                <p className="font-semibold mt-2">
                                  Cote: {palier.cote} • Mise: {palier.mise.toFixed(2)} € → Gain: {palier.gainPotentiel.toFixed(2)} €
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}