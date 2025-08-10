'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [montantes, setMontantes] = useState([])
  const [bankroll, setBankroll] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchMontantes()
    fetchBankroll()
  }, [])

  const fetchMontantes = async () => {
    try {
      const response = await fetch('/api/montantes')
      if (response.ok) {
        const data = await response.json()
        console.log('API montantes response:', data) // Debug
        // FIX: L'API retourne { montantes: [...] }, pas directement le tableau
        const montantesArray = Array.isArray(data) ? data : (data.montantes || [])
        setMontantes(montantesArray)
      } else {
        console.error('Erreur API montantes:', response.status)
        setMontantes([])
      }
    } catch (error) {
      console.error('Erreur chargement montantes:', error)
      setMontantes([])
    }
  }

  const fetchBankroll = async () => {
    try {
      const response = await fetch('/api/bankroll')
      if (response.ok) {
        const data = await response.json()
        setBankroll(data.current || 0)
      }
    } catch (error) {
      console.error('Erreur chargement bankroll:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        setError('Mot de passe incorrect')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Calculer les stats
  const montantesArray = Array.isArray(montantes) ? montantes : []
  const montantesEnCours = montantesArray.filter(m => m.status === 'EN_COURS').length
  const montantesGagnees = montantesArray.filter(m => m.status === 'GAGNEE').length
  const montantesPerdues = montantesArray.filter(m => m.status === 'PERDUE').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats générales */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Bouton Admin */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{bankroll.toFixed(2)} €</p>
              <p className="text-sm opacity-90">Bankroll</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{montantesEnCours}</p>
              <p className="text-sm opacity-90">En cours</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{montantesGagnees}</p>
              <p className="text-sm opacity-90">Gagnées</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{montantesPerdues}</p>
              <p className="text-sm opacity-90">Perdues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Montantes en cours */}
        <h2 className="text-2xl font-bold mb-6">Montantes en cours</h2>
        
        {montantesEnCours === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Aucune montante en cours actuellement
          </div>
        ) : (
          <div className="space-y-6">
            {montantesArray
              .filter(m => m.status === 'EN_COURS')
              .map(montante => (
                <MontanteCard key={montante.id} montante={montante} />
              ))}
          </div>
        )}

        {/* Historique des Montantes */}
        <div className="flex items-center justify-between mb-6 mt-12">
          <h2 className="text-2xl font-bold">Historique des Montantes</h2>
          {montantesArray.filter(m => m.status !== 'EN_COURS').length > 5 && (
            <a 
              href="/historique" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir tout l'historique →
            </a>
          )}
        </div>
        <div className="space-y-4">
          {montantesArray
            .filter(m => m.status !== 'EN_COURS')
            .slice(0, 5) // Limite à 5 montantes
            .map(montante => (
              <div key={montante.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <button
                  onClick={() => {
                    const element = document.getElementById(`montante-history-${montante.id}`)
                    if (element) {
                      element.classList.toggle('hidden')
                    }
                  }}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold flex items-center gap-2">
                        {montante.status === 'GAGNEE' ? (
                          <span className="text-yellow-500">🏆</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                        Montante n°{montante.id} - Objectif {montante.objectif.toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(montante.dateDebut).toLocaleDateString('fr-FR')} - {montante.dateFin ? new Date(montante.dateFin).toLocaleDateString('fr-FR') : 'En cours'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Mise: {montante.miseInitiale.toFixed(2)} € | 
                        Résultat: {montante.gainFinal >= 0 ? '+' : ''}{montante.gainFinal.toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        montante.status === 'GAGNEE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {montante.status === 'GAGNEE' ? 'Gagnée' : 'Perdue'}
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Détails cachés */}
                <div id={`montante-history-${montante.id}`} className="hidden border-t">
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
                                  {palier.status === 'GAGNE' ? (
                                    <span className="text-green-500">✓</span>
                                  ) : palier.status === 'PERDU' ? (
                                    <span className="text-red-500">✗</span>
                                  ) : (
                                    <span className="text-gray-400">◯</span>
                                  )}
                                  Palier {idx + 1}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  palier.status === 'GAGNE' ? 'bg-green-100 text-green-800' :
                                  palier.status === 'PERDU' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {palier.status === 'GAGNE' ? 'Gagné' :
                                   palier.status === 'PERDU' ? 'Perdu' : 'En attente'}
                                </span>
                              </div>
                              
                              <div className="text-sm space-y-1">
                                <p><strong>Type:</strong> {palier.typePari} • <strong>Bookmaker:</strong> {palier.bookmaker?.nom || 'N/A'}</p>
                                
                                {/* Détails de chaque match */}
                                {palier.sports?.map((sport, matchIdx) => (
                                  <div key={matchIdx} className="mt-2 p-2 bg-white rounded border border-gray-200">
                                    <p className="text-xs font-medium text-gray-500 uppercase">{sport}</p>
                                    <p className="font-medium">{palier.matchs?.[matchIdx] || 'N/A'}</p>
                                    <p className="text-gray-600">
                                      {palier.typeParis?.[matchIdx] || 'N/A'} : <strong>{palier.pronostics?.[matchIdx] || 'N/A'}</strong> 
                                      <span className="ml-2 text-blue-600 font-medium">×{palier.cotes?.[matchIdx] || 'N/A'}</span>
                                    </p>
                                    {palier.dateParis?.[matchIdx] && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {new Date(palier.dateParis[matchIdx]).toLocaleString('fr-FR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    )}
                                  </div>
                                ))}
                                
                                <p className="font-semibold mt-2">
                                  Cote totale: {palier.coteTotale} • Mise: {palier.mise.toFixed(2)} € → Gain: {palier.gainPotentiel.toFixed(2)} €
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
            ))}
        </div>
      </main>

      {/* Modal de login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowLogin(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h2 className="text-lg font-semibold mb-4">Accès Administration</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={loading}
                />
              </div>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant pour afficher une montante
function MontanteCard({ montante }) {
  const [expanded, setExpanded] = useState(false)
  
  // Calculer la progression
  const progression = montante.paliers?.map((p, index) => ({
    numero: index + 1,
    mise: index === 0 ? montante.miseInitiale : montante.paliers[index - 1]?.gainPotentiel || montante.miseInitiale,
    gain: p.gainPotentiel,
    status: p.status,
    cote: p.coteTotale
  })) || []

  // Dernier palier actif
  const dernierPalier = montante.paliers?.[montante.paliers.length - 1]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header simplifié */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Montante n°{montante.id}</h3>
            <p className="text-sm opacity-90">
              Objectif {montante.objectif.toLowerCase()} ({(montante.miseInitiale * parseInt(montante.objectif.slice(1))).toFixed(2)} €)
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Mise initiale</p>
            <p className="text-2xl font-bold">{montante.miseInitiale.toFixed(2)} €</p>
          </div>
        </div>
        
        {/* Progression simplifiée */}
        {progression.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-90">Progression</p>
              <p className="font-medium">
                Palier {progression.length} - {progression[progression.length - 1].gain.toFixed(2)} €
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dernier palier actif */}
      {dernierPalier && dernierPalier.status === 'EN_ATTENTE' && (
        <PalierCard palier={dernierPalier} montante={montante} />
      )}

      {/* Bouton pour voir l'historique */}
      <div className="p-4 bg-gray-50 text-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {expanded ? 'Masquer' : 'Historique complet Montante n°' + montante.id}
        </button>
      </div>

      {/* Historique complet */}
      {expanded && (
        <div className="border-t">
          {montante.paliers?.map((palier, idx) => (
            <div key={palier.id} className="p-4 border-b last:border-0">
              <div className="flex items-center justify-between">
                <p className="font-medium flex items-center gap-2">
                  {palier.status === 'GAGNE' ? (
                    <span className="text-green-500">✓</span>
                  ) : palier.status === 'PERDU' ? (
                    <span className="text-red-500">✗</span>
                  ) : (
                    <span className="text-gray-400">◯</span>
                  )}
                  Palier {idx + 1}
                </p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  palier.status === 'GAGNE' ? 'bg-green-100 text-green-800' :
                  palier.status === 'PERDU' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {palier.status === 'GAGNE' ? 'Gagné' :
                   palier.status === 'PERDU' ? 'Perdu' : 'En attente'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Mise: {palier.mise.toFixed(2)} € → {palier.gainPotentiel.toFixed(2)} € (×{palier.coteTotale})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Composant pour afficher un palier (optimisé pour capture)
function PalierCard({ palier, montante }) {
  // Trouver le numéro du palier
  const palierNumber = montante.paliers?.findIndex(p => p.id === palier.id) + 1 || 1
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header du palier */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              Palier n°{palierNumber} en cours - Montante n°{montante.id}
            </h4>
            <p className="text-sm text-gray-600">
              {palier.typePari} • {palier.bookmaker?.nom}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Cote totale</p>
            <p className="text-2xl font-bold text-purple-600">×{palier.coteTotale}</p>
          </div>
        </div>

        {/* Matchs */}
        <div className="space-y-3 mb-4">
          {palier.sports?.map((sport, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase">{sport}</p>
                  <p className="font-medium text-gray-900 mt-1">{palier.matchs?.[idx] || 'N/A'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      {palier.typeParis?.[idx] || 'N/A'} : <strong>{palier.pronostics?.[idx] || 'N/A'}</strong>
                    </span>
                    {palier.dateParis?.[idx] && (
                      <span className="text-xs text-gray-500">
                        {new Date(palier.dateParis[idx]).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-lg font-bold text-blue-600">×{palier.cotes?.[idx] || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer avec mise et gain */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mise</p>
              <p className="text-xl font-bold">{palier.mise.toFixed(2)} €</p>
            </div>
            <div className="text-center">
              <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Gain potentiel</p>
              <p className="text-xl font-bold text-green-600">{palier.gainPotentiel.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}