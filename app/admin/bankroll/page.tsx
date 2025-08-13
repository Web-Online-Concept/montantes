'use client'

import { useState, useEffect } from 'react'
import { formatEuro, formatPourcentage } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import TimelineBankroll from '@/components/TimelineBankroll'
import type { HistoriqueBankroll, Montante } from '@/types'
import type { HistoriqueBankroll, Montante } from '@/types'

interface BankrollData {
  bankrollInitiale: number
  bankrollActuelle: number
  bankrollDisponible: number
}

interface FormData {
  type: 'DEPOT' | 'RETRAIT'
  montant: string
  description: string
}

export default function AdminBankrollPage() {
  const [bankroll, setBankroll] = useState<BankrollData | null>(null)
  const [historique, setHistorique] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    type: 'DEPOT',
    montant: '',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Récupérer la bankroll
      const bankrollRes = await fetch('/api/bankroll')
      if (bankrollRes.ok) {
        const data = await bankrollRes.json()
        setBankroll(data)
      }

      // Récupérer l'historique récent
      const historiqueRes = await fetch('/api/historique?periode=30j')
      if (historiqueRes.ok) {
        const data = await historiqueRes.json()
        setHistorique(data.historique)
      }
    } catch (error) {
      console.error('Erreur chargement bankroll:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    const montant = parseFloat(formData.montant)
    if (!formData.montant) {
      newErrors.montant = 'Le montant est requis'
    } else if (isNaN(montant) || montant <= 0) {
      newErrors.montant = 'Le montant doit être positif'
    } else if (formData.type === 'RETRAIT' && bankroll && montant > bankroll.bankrollDisponible) {
      newErrors.montant = `Montant supérieur à la bankroll disponible (${formatEuro(bankroll.bankrollDisponible)})`
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)

    try {
      const response = await fetch('/api/historique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          typeOperation: formData.type,
          montant: parseFloat(formData.montant),
          description: formData.description.trim()
        })
      })

      if (response.ok) {
        // Réinitialiser le formulaire
        setFormData({
          type: 'DEPOT',
          montant: '',
          description: ''
        })
        setShowForm(false)
        
        // Recharger les données
        fetchData()
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || 'Erreur lors de l\'opération' })
      }
    } catch (error) {
      console.error('Erreur opération bankroll:', error)
      setErrors({ submit: 'Erreur lors de l\'opération' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fbbf24]"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!bankroll) return null

  const variation = bankroll.bankrollActuelle - bankroll.bankrollInitiale
  // Gérer le cas où bankrollInitiale est 0
  const variationPourcent = bankroll.bankrollInitiale > 0 
    ? (variation / bankroll.bankrollInitiale) * 100
    : 0

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de la bankroll</h1>
          <p className="text-gray-600 mt-1">Gérez votre capital et suivez son évolution</p>
        </div>

        {/* Vue d'ensemble */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vue d&apos;ensemble</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bankroll initiale */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Bankroll initiale</p>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(bankroll.bankrollInitiale)}</p>
              <p className="text-xs text-gray-500 mt-1">Capital de départ</p>
            </div>

            {/* Bankroll actuelle */}
            <div className="bg-[#1e40af]/10 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Bankroll actuelle</p>
              <p className="text-2xl font-bold text-[#1e40af]">{formatEuro(bankroll.bankrollActuelle)}</p>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variation >= 0 ? '+' : ''}{formatEuro(variation)}
                </span>
                {bankroll.bankrollInitiale > 0 && (
                  <span className={`text-sm ml-2 ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({formatPourcentage(variationPourcent)})
                  </span>
                )}
              </div>
            </div>

            {/* Bankroll disponible */}
            <div className="bg-[#fbbf24]/10 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Bankroll disponible</p>
              <p className="text-2xl font-bold text-[#f59e0b]">{formatEuro(bankroll.bankrollDisponible)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Capital engagé : {formatEuro(bankroll.bankrollActuelle - bankroll.bankrollDisponible)}
              </p>
            </div>
          </div>

          {/* Barre de progression - Affichée seulement si bankroll initiale > 0 */}
          {bankroll.bankrollInitiale > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Évolution du capital</span>
                <span className="text-sm font-medium">
                  {formatPourcentage(variationPourcent)}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    variation >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.abs(variationPourcent), 100)}%`,
                    marginLeft: variation < 0 ? 'auto' : '0'
                  }}
                />
              </div>
            </div>
          )}

          {/* Message si pas de bankroll initiale */}
          {bankroll.bankrollInitiale === 0 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note :</strong> La bankroll initiale n'a pas été définie. 
                Le premier dépôt définira automatiquement la bankroll initiale.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Opérations manuelles</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle opération
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 rounded-lg p-6">
              {/* Type d'opération */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'opération
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'DEPOT' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'DEPOT'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="font-medium">Dépôt</p>
                    <p className="text-xs text-gray-600 mt-1">Ajouter des fonds</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'RETRAIT' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'RETRAIT'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <p className="font-medium">Retrait</p>
                    <p className="text-xs text-gray-600 mt-1">Retirer des fonds</p>
                  </button>
                </div>
              </div>

              {/* Montant */}
              <div>
                <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2">
                  Montant
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="montant"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                    min="0.01"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                      errors.montant ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="100.00"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                </div>
                {errors.montant && (
                  <p className="mt-1 text-sm text-red-600">{errors.montant}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Rechargement mensuel, Retrait pour dépenses..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Message d'erreur */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Boutons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ type: 'DEPOT', montant: '', description: '' })
                    setErrors({})
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer l\'opération'}
                </button>
              </div>
            </form>
          )}

          {!showForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Information</h3>
              <p className="text-sm text-blue-700">
                Les gains et pertes des montantes sont automatiquement enregistrés dans l'historique. 
                Utilisez les opérations manuelles uniquement pour les dépôts et retraits de fonds.
              </p>
            </div>
          )}
        </div>

        {/* Historique récent */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Historique récent (30 derniers jours)</h2>
            <a
              href="/admin/historique"
              className="text-[#1e40af] hover:text-[#fbbf24] transition-colors text-sm font-medium"
            >
              Voir tout l'historique →
            </a>
          </div>
          
          <TimelineBankroll historique={historique} />
        </div>
      </div>
    </AdminLayout>
  )
}