'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NouvelleMontantePage() {
  const router = useRouter()
  const [bookmakers, setBookmakers] = useState([])
  const [formData, setFormData] = useState({
    bookmakerId: '',
    miseInitiale: '',
    objectif: 'X2',
    premierPalier: {
      cote: '',
      description: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookmakers()
  }, [])

  const fetchBookmakers = async () => {
    try {
      const response = await fetch('/api/bookmakers')
      if (response.ok) {
        const data = await response.json()
        setBookmakers(data.bookmakers || [])
      }
    } catch (error) {
      console.error('Erreur chargement bookmakers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/montantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bookmakerId: parseInt(formData.bookmakerId),
          miseInitiale: parseFloat(formData.miseInitiale),
          premierPalier: {
            cote: parseFloat(formData.premierPalier.cote),
            description: formData.premierPalier.description
          }
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la création')
      }

      // Redirection vers la liste des montantes
      router.push('/admin/montantes')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Nouvelle Montante</h1>
            <a 
              href="/admin/montantes"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Retour aux montantes
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bookmaker */}
              <div>
                <label htmlFor="bookmakerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Bookmaker
                </label>
                <select
                  id="bookmakerId"
                  name="bookmakerId"
                  required
                  value={formData.bookmakerId}
                  onChange={(e) => setFormData({ ...formData, bookmakerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Sélectionner un bookmaker</option>
                  {bookmakers.map((bookmaker) => (
                    <option key={bookmaker.id} value={bookmaker.id}>
                      {bookmaker.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mise initiale */}
              <div>
                <label htmlFor="miseInitiale" className="block text-sm font-medium text-gray-700 mb-2">
                  Mise initiale (€)
                </label>
                <input
                  type="number"
                  id="miseInitiale"
                  name="miseInitiale"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.miseInitiale}
                  onChange={(e) => setFormData({ ...formData, miseInitiale: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10.00"
                  disabled={loading}
                />
              </div>

              {/* Objectif */}
              <div>
                <label htmlFor="objectif" className="block text-sm font-medium text-gray-700 mb-2">
                  Objectif de gain
                </label>
                <select
                  id="objectif"
                  name="objectif"
                  required
                  value={formData.objectif}
                  onChange={(e) => setFormData({ ...formData, objectif: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="X2">X2 - Doubler la mise</option>
                  <option value="X3">X3 - Tripler la mise</option>
                  <option value="X5">X5 - Quintupler la mise</option>
                  <option value="X10">X10 - Décupler la mise</option>
                </select>
              </div>

              {/* Premier palier */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Premier palier</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cote" className="block text-sm font-medium text-gray-700 mb-2">
                      Cote du premier pari
                    </label>
                    <input
                      type="number"
                      id="cote"
                      name="cote"
                      step="0.01"
                      min="1.01"
                      required
                      value={formData.premierPalier.cote}
                      onChange={(e) => setFormData({
                        ...formData,
                        premierPalier: { ...formData.premierPalier, cote: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1.50"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description du pari
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={formData.premierPalier.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        premierPalier: { ...formData.premierPalier, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: PSG vs Lyon - Plus de 2.5 buts"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Résumé */}
              {formData.miseInitiale && formData.premierPalier.cote && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Résumé</h3>
                  <p className="text-sm text-blue-700">
                    Mise initiale : {parseFloat(formData.miseInitiale).toFixed(2)} €
                  </p>
                  <p className="text-sm text-blue-700">
                    Premier gain potentiel : {(parseFloat(formData.miseInitiale) * parseFloat(formData.premierPalier.cote)).toFixed(2)} €
                  </p>
                  <p className="text-sm text-blue-700">
                    Objectif final : {formData.objectif} = {
                      (parseFloat(formData.miseInitiale) * parseInt(formData.objectif.slice(1))).toFixed(2)
                    } €
                  </p>
                </div>
              )}

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Boutons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création...' : 'Créer la montante'}
                </button>
                <a
                  href="/admin/montantes"
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-center"
                >
                  Annuler
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}