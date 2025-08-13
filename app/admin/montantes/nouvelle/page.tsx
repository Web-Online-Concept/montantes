'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Objectif, OBJECTIFS_CONFIG, VALIDATION } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'

export default function NouvelleMontantePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    miseInitiale: '',
    objectif: 'X3' as Objectif
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Fonction pour arrondir correctement à 2 décimales
  const roundToTwo = (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const mise = parseFloat(formData.miseInitiale)
    if (!formData.miseInitiale) {
      newErrors.miseInitiale = 'La mise initiale est requise'
    } else if (isNaN(mise) || mise < VALIDATION.MISE_MIN) {
      newErrors.miseInitiale = `La mise doit être d'au moins ${VALIDATION.MISE_MIN}€`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      // Arrondir la mise initiale à 2 décimales
      const miseInitiale = roundToTwo(parseFloat(formData.miseInitiale))
      
      const response = await fetch('/api/montantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          miseInitiale: miseInitiale,
          objectif: formData.objectif
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Rediriger vers la page d'édition de la nouvelle montante
        router.push(`/admin/montantes/${data.montante.id}/editer`)
      } else {
        // Afficher l'erreur
        if (data.error) {
          setErrors({ submit: data.error })
        }
      }
    } catch (error) {
      console.error('Erreur création montante:', error)
      setErrors({ submit: 'Erreur lors de la création de la montante' })
    } finally {
      setLoading(false)
    }
  }

  // Calculer l'objectif avec arrondi correct
  const calculerObjectif = (mise: string, multiplicateur: number): string => {
    const miseNum = parseFloat(mise)
    if (isNaN(miseNum)) return '0.00'
    return roundToTwo(miseNum * multiplicateur).toFixed(2)
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/admin/montantes"
            className="inline-flex items-center text-gray-600 hover:text-[#1e40af] transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux montantes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle montante</h1>
          <p className="text-gray-600 mt-1">Créez une nouvelle montante pour commencer à suivre vos paris</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Mise initiale */}
          <div>
            <label htmlFor="miseInitiale" className="block text-sm font-medium text-gray-700 mb-2">
              Mise initiale
            </label>
            <div className="relative">
              <input
                type="number"
                id="miseInitiale"
                value={formData.miseInitiale}
                onChange={(e) => setFormData({ ...formData, miseInitiale: e.target.value })}
                min={VALIDATION.MISE_MIN}
                step="0.01"
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                  errors.miseInitiale ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10.00"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            </div>
            {errors.miseInitiale && (
              <p className="mt-1 text-sm text-red-600">{errors.miseInitiale}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Montant minimum : {VALIDATION.MISE_MIN}€
            </p>
          </div>

          {/* Objectif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objectif multiplicateur
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(OBJECTIFS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, objectif: key as Objectif })}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    formData.objectif === key
                      ? 'border-[#fbbf24] bg-[#fbbf24]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{config.label}</p>
                      <p className="text-sm text-gray-600">
                        {formData.miseInitiale 
                          ? `Objectif : ${calculerObjectif(formData.miseInitiale, config.multiplicateur)}€`
                          : `× ${config.multiplicateur}`
                        }
                      </p>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: config.couleur }}
                    />
                  </div>
                  {formData.objectif === key && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-5 h-5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message d'erreur global */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Informations importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• La montante sera automatiquement nommée selon son ordre de création</li>
              <li>• La montante sera créée avec l&apos;état &quot;En cours&quot;</li>
              <li>• Vous pourrez ajouter des paliers après la création</li>
              <li>• La mise initiale sera déduite de la bankroll disponible</li>
              <li>• Recommandation : ne pas dépasser {VALIDATION.BANKROLL_POURCENTAGE_MAX}% de votre bankroll</li>
            </ul>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              href="/admin/montantes"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </span>
              ) : (
                'Créer la montante'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}