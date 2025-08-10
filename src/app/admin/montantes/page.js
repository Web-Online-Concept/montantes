'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MontantesPage() {
  const router = useRouter()
  const [montantes, setMontantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Charger les montantes
  const fetchMontantes = async () => {
    try {
      const response = await fetch('/api/montantes')
      if (!response.ok) throw new Error('Erreur de chargement')
      const data = await response.json()
      setMontantes(data)
    } catch (error) {
      setError('Erreur lors du chargement des montantes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMontantes()
  }, [])

  // Supprimer une montante
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette montante ?')) return

    try {
      const response = await fetch(`/api/montantes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erreur de suppression')
      
      // Recharger la liste
      fetchMontantes()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  // Calculer le statut d'affichage
  const getStatusBadge = (status) => {
    switch (status) {
      case 'EN_COURS':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">En cours</span>
      case 'GAGNEE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Gagnée</span>
      case 'PERDUE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Perdue</span>
      default:
        return null
    }
  }

  // Calculer le gain potentiel actuel
  const getGainPotentiel = (montante) => {
    const multiplicateur = parseInt(montante.objectif.slice(1))
    return montante.miseInitiale * multiplicateur
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gestion des Montantes</h1>
            <div className="flex space-x-4">
              <a 
                href="/admin"
                className="text-gray-600 hover:text-gray-800"
              >
                ← Retour au tableau de bord
              </a>
              <a
                href="/admin/montantes/nouvelle"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                + Nouvelle montante
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Liste des montantes */}
        {montantes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Aucune montante créée</p>
            <a
              href="/admin/montantes/nouvelle"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Créer la première montante
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mise initiale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objectif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gain potentiel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {montantes.map((montante) => (
                  <tr key={montante.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{montante.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {montante.miseInitiale.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {montante.objectif}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getGainPotentiel(montante).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(montante.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(montante.dateDebut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`/admin/montantes/${montante.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Gérer
                        </a>
                        <button
                          onClick={() => handleDelete(montante.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Statistiques rapides */}
        {montantes.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">En cours</h3>
              <p className="text-3xl font-bold text-blue-600">
                {montantes.filter(m => m.status === 'EN_COURS').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Gagnées</h3>
              <p className="text-3xl font-bold text-green-600">
                {montantes.filter(m => m.status === 'GAGNEE').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Perdues</h3>
              <p className="text-3xl font-bold text-red-600">
                {montantes.filter(m => m.status === 'PERDUE').length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}