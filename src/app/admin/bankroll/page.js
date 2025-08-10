'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function BankrollPage() {
  const [bankrollData, setBankrollData] = useState({ current: 0, history: [] })
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    montant: '',
    description: '',
    type: 'DEPOT'
  })

  useEffect(() => {
    fetchBankroll()
  }, [])

  const fetchBankroll = async () => {
    try {
      const response = await fetch('/api/bankroll')
      if (!response.ok) throw new Error('Erreur de chargement')
      const data = await response.json()
      setBankrollData(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const montant = formData.type === 'RETRAIT' 
        ? -Math.abs(parseFloat(formData.montant))
        : Math.abs(parseFloat(formData.montant))
      
      const response = await fetch('/api/bankroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          montant,
          description: `${formData.type}: ${formData.description}`,
          type: 'MANUAL'
        })
      })
      
      if (!response.ok) throw new Error('Erreur')
      
      // Recharger les données
      fetchBankroll()
      
      // Réinitialiser le formulaire
      setFormData({ montant: '', description: '', type: 'DEPOT' })
      setShowAddForm(false)
    } catch (error) {
      alert('Erreur lors de l\'ajout')
    }
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
            <h1 className="text-3xl font-bold">Gestion de la Bankroll</h1>
            <a 
              href="/admin"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Retour au tableau de bord
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Bankroll actuelle */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Bankroll actuelle</h2>
              <p className={`text-4xl font-bold ${
                bankrollData.current >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {bankrollData.current >= 0 ? '+' : ''}{bankrollData.current.toFixed(2)} €
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Ajouter une opération
            </button>
          </div>
          
          {/* Bouton de synchronisation */}
          {bankrollData.history.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                La bankroll semble vide. Si vous avez déjà des montantes terminées, cliquez sur synchroniser.
              </p>
              <button
                onClick={async () => {
                  if (confirm('Synchroniser la bankroll avec toutes les montantes terminées ?')) {
                    try {
                      const response = await fetch('/api/bankroll/sync', { method: 'POST' })
                      if (response.ok) {
                        const result = await response.json()
                        alert(result.message)
                        fetchBankroll()
                      }
                    } catch (error) {
                      alert('Erreur lors de la synchronisation')
                    }
                  }
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Synchroniser la bankroll
              </button>
            </div>
          )}
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Nouvelle opération</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="DEPOT">Dépôt</option>
                    <option value="RETRAIT">Retrait</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Montant (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    placeholder="Raison de l'opération"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Historique */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Historique des mouvements</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Solde après</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bankrollData.history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Aucun mouvement enregistré
                    </td>
                  </tr>
                ) : (
                  bankrollData.history.map((entry, index) => {
                    // Calculer le solde après cette opération
                    const soldeApres = bankrollData.history
                      .slice(0, index + 1)
                      .reduce((sum, e) => sum + e.montant, 0)
                    
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(entry.date).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.description}
                          {entry.montanteId && (
                            <span className="text-gray-500"> (Montante n°{entry.montanteId})</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            entry.type === 'MONTANTE_WIN' ? 'bg-green-100 text-green-800' :
                            entry.type === 'MONTANTE_LOSS' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.type === 'MONTANTE_WIN' ? 'Gain montante' :
                             entry.type === 'MONTANTE_LOSS' ? 'Perte montante' :
                             'Manuel'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm text-right font-medium ${
                          entry.montant >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.montant >= 0 ? '+' : ''}{entry.montant.toFixed(2)} €
                        </td>
                        <td className={`px-6 py-4 text-sm text-right font-medium ${
                          soldeApres >= 0 ? 'text-gray-900' : 'text-red-600'
                        }`}>
                          {soldeApres.toFixed(2)} €
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total gains</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              +{bankrollData.history
                .filter(e => e.montant > 0)
                .reduce((sum, e) => sum + e.montant, 0)
                .toFixed(2)} €
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total pertes</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {bankrollData.history
                .filter(e => e.montant < 0)
                .reduce((sum, e) => sum + e.montant, 0)
                .toFixed(2)} €
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Nombre d'opérations</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {bankrollData.history.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}