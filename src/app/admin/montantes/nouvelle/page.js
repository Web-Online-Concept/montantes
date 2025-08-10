'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NouvelleMontantePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    miseInitiale: '',
    objectif: 'X2'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/montantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          miseInitiale: parseFloat(formData.miseInitiale),
          objectif: formData.objectif,
          bookmakerId: 1, // Premier bookmaker par défaut
          premierPalier: {
            cote: 1.01,
            description: 'À définir'
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

              {/* Résumé */}
              {formData.miseInitiale && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Résumé</h3>
                  <p className="text-sm text-blue-700">
                    Mise initiale : {parseFloat(formData.miseInitiale).toFixed(2)} €
                  </p>
                  <p className="text-sm text-blue-700">
                    Objectif : {formData.objectif} = {
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

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Comment ça marche ?</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• La mise initiale sera déduite de votre bankroll</li>
              <li>• À chaque palier gagné, vous réinvestissez la totalité des gains</li>
              <li>• La montante est validée quand l'objectif est atteint</li>
              <li>• Si vous perdez un palier, la montante est perdue</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}