'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MontanteAvecNumero, formatEuro, formatPourcentage, ETATS_CONFIG } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminMontantesPage() {
  const [montantes, setMontantes] = useState<MontanteAvecNumero[]>([])
  const [filtreEtat, setFiltreEtat] = useState<'toutes' | 'EN_COURS' | 'REUSSI' | 'PERDU' | 'ARRETEE'>('toutes')
  const [recherche, setRecherche] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMontantes()
  }, [])

  const fetchMontantes = async () => {
    try {
      const response = await fetch('/api/montantes')
      if (response.ok) {
        const data = await response.json()
        setMontantes(data)
      }
    } catch (error) {
      console.error('Erreur chargement montantes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la montante "${nom}" ?\n\nCette action est irréversible et les montantes seront renumérotées automatiquement.`)) {
      return
    }

    try {
      const response = await fetch(`/api/montantes?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Recharger la liste pour voir la nouvelle numérotation
        await fetchMontantes()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Filtrer les montantes
  const montantesFiltrees = montantes.filter(montante => {
    // Filtre par état
    if (filtreEtat !== 'toutes' && montante.etat !== filtreEtat) {
      return false
    }
    
    // Filtre par recherche
    if (recherche) {
      const searchLower = recherche.toLowerCase()
      return (
        montante.nom.toLowerCase().includes(searchLower) ||
        `n°${montante.numeroAffichage}`.includes(searchLower)
      )
    }
    
    return true
  })

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fbbf24]"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des montantes</h1>
          <Link
            href="/admin/montantes/nouvelle"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle montante
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher par nom ou numéro..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filtres par état */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltreEtat('toutes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreEtat === 'toutes'
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({montantes.length})
              </button>
              <button
                onClick={() => setFiltreEtat('EN_COURS')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreEtat === 'EN_COURS'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En cours ({montantes.filter(m => m.etat === 'EN_COURS').length})
              </button>
              <button
                onClick={() => setFiltreEtat('REUSSI')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreEtat === 'REUSSI'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Gagnées ({montantes.filter(m => m.etat === 'REUSSI').length})
              </button>
              <button
                onClick={() => setFiltreEtat('PERDU')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreEtat === 'PERDU'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Perdues ({montantes.filter(m => m.etat === 'PERDU').length})
              </button>
              {montantes.some(m => m.etat === 'ARRETEE') && (
                <button
                  onClick={() => setFiltreEtat('ARRETEE')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtreEtat === 'ARRETEE'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Arrêtées ({montantes.filter(m => m.etat === 'ARRETEE').length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tableau des montantes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mise initiale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progression
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objectif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paliers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {montantesFiltrees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Aucune montante trouvée
                    </td>
                  </tr>
                ) : (
                  montantesFiltrees.map((montante) => {
                    // Gestion du cas où l'état ARRETEE existe encore
                    let etatConfig = ETATS_CONFIG[montante.etat as keyof typeof ETATS_CONFIG]
                    if (!etatConfig) {
                      if (montante.etat === 'ARRETEE') {
                        etatConfig = ETATS_CONFIG.REUSSI
                      } else {
                        etatConfig = {
                          label: montante.etat,
                          couleur: '#6b7280',
                          emoji: '❓'
                        }
                      }
                    }
                    
                    return (
                      <tr key={montante.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Montante n°{montante.numeroAffichage}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${etatConfig.couleur}20`,
                              color: etatConfig.couleur
                            }}
                          >
                            {etatConfig.emoji} {etatConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatEuro(montante.miseInitiale)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              montante.progression > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPourcentage(montante.progression)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {montante.objectif.toLowerCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {montante.paliers?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(montante.dateDebut).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/montantes/${montante.id}/editer`}
                              className="text-[#1e40af] hover:text-[#fbbf24] transition-colors"
                              title="Éditer"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/montante/${montante.id}`}
                              target="_blank"
                              className="text-gray-600 hover:text-[#1e40af] transition-colors"
                              title="Voir sur le site"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(montante.id, montante.nom)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}