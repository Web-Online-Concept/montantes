'use client'

import { useState, useEffect } from 'react'
import { TypePari, VALIDATION, formatEuro, formatCote, SPORTS_ICONS } from '@/types'

interface FormulairePalierProps {
  montanteId: string
  numeroPalier: number
  miseCalculee: number
  onSuccess: () => void
  onCancel: () => void
}

interface DetailMatch {
  sport: string
  equipe1: string
  equipe2: string
  competition: string
  pronostic: string
  cote: string
  dateMatch: string
  heureMatch: string
  statut?: 'EN_ATTENTE' | 'GAGNE' | 'PERDU' | 'ANNULE'
}

export default function FormulairePalier({
  montanteId,
  numeroPalier,
  miseCalculee,
  onSuccess,
  onCancel
}: FormulairePalierProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Obtenir la date et l'heure actuelles en format local
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split('T')[0]
  const defaultTime = '20:00' // Heure par défaut pour les matchs
  
  // État du formulaire
  const [formData, setFormData] = useState({
    typePari: 'SIMPLE' as TypePari,
    coteCalculee: '1.00',
    statut: 'EN_ATTENTE' as 'EN_ATTENTE' | 'GAGNE' | 'PERDU'
  })

  // Matchs pour le pari avec cote individuelle
  const [matchs, setMatchs] = useState<DetailMatch[]>([{
    sport: 'football',
    equipe1: '',
    equipe2: '',
    competition: '',
    pronostic: '',
    cote: '',
    dateMatch: defaultDate,
    heureMatch: defaultTime,
    statut: 'EN_ATTENTE'
  }])

  // Calculer automatiquement la cote combinée
  useEffect(() => {
    if (formData.typePari === 'COMBINE' && matchs.length === 2) {
      const coteCombo = matchs.reduce((acc, match) => {
        const cote = parseFloat(match.cote)
        return !isNaN(cote) && cote > 0 ? acc * cote : acc
      }, 1)
      setFormData(prev => ({ ...prev, coteCalculee: coteCombo.toFixed(2) }))
    } else if (formData.typePari === 'SIMPLE' && matchs.length === 1) {
      const cote = parseFloat(matchs[0].cote) || 0
      setFormData(prev => ({ ...prev, coteCalculee: cote.toFixed(2) }))
    }
  }, [matchs, formData.typePari])

  const handleAddMatch = () => {
    if (matchs.length < 2) { // Limite à 2 matchs max
      setMatchs([...matchs, {
        sport: 'football',
        equipe1: '',
        equipe2: '',
        competition: '',
        pronostic: '',
        cote: '',
        dateMatch: defaultDate,
        heureMatch: defaultTime,
        statut: 'EN_ATTENTE'
      }])
      setFormData({ ...formData, typePari: 'COMBINE' })
    }
  }

  const handleRemoveMatch = (index: number) => {
    const newMatchs = matchs.filter((_, i) => i !== index)
    setMatchs(newMatchs)
    if (newMatchs.length === 1) {
      setFormData({ ...formData, typePari: 'SIMPLE' })
    }
  }

  const handleMatchChange = (index: number, field: keyof DetailMatch, value: any) => {
    const newMatchs = [...matchs]
    newMatchs[index] = { ...newMatchs[index], [field]: value }
    setMatchs(newMatchs)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validation des matchs
    matchs.forEach((match, index) => {
      if (!match.equipe1.trim()) {
        newErrors[`match${index}_equipe1`] = 'Équipe 1 requise'
      }
      if (!match.equipe2.trim()) {
        newErrors[`match${index}_equipe2`] = 'Équipe 2 requise'
      }
      if (!match.pronostic.trim()) {
        newErrors[`match${index}_pronostic`] = 'Pronostic requis'
      }
      
      // Validation de la cote individuelle
      const cote = parseFloat(match.cote)
      if (!match.cote) {
        newErrors[`match${index}_cote`] = 'Cote requise'
      } else if (isNaN(cote) || cote < 1.01 || cote > 100) {
        newErrors[`match${index}_cote`] = 'Cote invalide (1.01 - 100)'
      }
    })

    // Vérification de la cote combinée si applicable
    if (formData.typePari === 'COMBINE') {
      const coteCombo = parseFloat(formData.coteCalculee)
      if (coteCombo > VALIDATION.COTE_MAX) {
        newErrors.coteCombo = `La cote combinée (${formatCote(coteCombo)}) ne doit pas dépasser ${VALIDATION.COTE_MAX}`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Préparer les matchs avec leur date/heure complète et cote
      const matchsAvecDates = matchs.map(match => {
        const dateTimeString = `${match.dateMatch}T${match.heureMatch}:00`
        const localDateTime = new Date(dateTimeString)
        
        return {
          sport: match.sport,
          equipe1: match.equipe1,
          equipe2: match.equipe2,
          competition: match.competition,
          pronostic: match.pronostic,
          cote: parseFloat(match.cote),
          dateMatch: localDateTime.toISOString(),
          statut: match.statut
        }
      })
      
      // Utiliser la date du premier match comme date du palier (pour compatibilité)
      const datePremierMatch = new Date(`${matchs[0].dateMatch}T${matchs[0].heureMatch}:00`)

      const response = await fetch('/api/paliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          montanteId,
          typePari: formData.typePari,
          matchs: matchsAvecDates,
          cote: parseFloat(formData.coteCalculee),
          dateMatch: datePremierMatch.toISOString(),
          statut: formData.statut
        })
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || 'Erreur lors de l\'ajout du palier' })
      }
    } catch (error) {
      console.error('Erreur ajout palier:', error)
      setErrors({ submit: 'Erreur lors de l\'ajout du palier' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Ajouter le palier n°{numeroPalier}
      </h3>

      {/* Mise (affichage seulement) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mise du palier
        </label>
        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
          <span className="font-semibold">{formatEuro(miseCalculee)}</span>
          <span className="text-sm text-gray-600 ml-2">
            (calculée automatiquement)
          </span>
        </div>
      </div>

      {/* Détails des matchs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Détails du pari
          </label>
          {matchs.length < 2 && (
            <button
              type="button"
              onClick={handleAddMatch}
              className="text-sm text-[#1e40af] hover:text-[#fbbf24] transition-colors"
            >
              + Ajouter un 2ème match (combiné)
            </button>
          )}
        </div>

        {matchs.map((match, index) => (
          <div key={index} className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Match {index + 1}</h4>
              {matchs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMatch(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sport */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sport</label>
                <select
                  value={match.sport}
                  onChange={(e) => handleMatchChange(index, 'sport', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                >
                  {Object.entries(SPORTS_ICONS).map(([key, icon]) => (
                    <option key={key} value={key}>
                      {icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Compétition */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Compétition</label>
                <input
                  type="text"
                  value={match.competition}
                  onChange={(e) => handleMatchChange(index, 'competition', e.target.value)}
                  placeholder="Ex: Ligue 1, Champions League"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>

              {/* Équipe 1 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Équipe 1</label>
                <input
                  type="text"
                  value={match.equipe1}
                  onChange={(e) => handleMatchChange(index, 'equipe1', e.target.value)}
                  placeholder="Ex: PSG"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                    errors[`match${index}_equipe1`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`match${index}_equipe1`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`match${index}_equipe1`]}</p>
                )}
              </div>

              {/* Équipe 2 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Équipe 2</label>
                <input
                  type="text"
                  value={match.equipe2}
                  onChange={(e) => handleMatchChange(index, 'equipe2', e.target.value)}
                  placeholder="Ex: Lyon"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                    errors[`match${index}_equipe2`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`match${index}_equipe2`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`match${index}_equipe2`]}</p>
                )}
              </div>

              {/* Pronostic */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pronostic</label>
                <input
                  type="text"
                  value={match.pronostic}
                  onChange={(e) => handleMatchChange(index, 'pronostic', e.target.value)}
                  placeholder="Ex: PSG gagne"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                    errors[`match${index}_pronostic`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`match${index}_pronostic`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`match${index}_pronostic`]}</p>
                )}
              </div>

              {/* Cote du match */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cote</label>
                <input
                  type="number"
                  value={match.cote}
                  onChange={(e) => handleMatchChange(index, 'cote', e.target.value)}
                  min="1.01"
                  max="100"
                  step="0.01"
                  placeholder="1.50"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                    errors[`match${index}_cote`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`match${index}_cote`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`match${index}_cote`]}</p>
                )}
              </div>

              {/* Date et heure du match */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date du match</label>
                <input
                  type="date"
                  value={match.dateMatch}
                  onChange={(e) => handleMatchChange(index, 'dateMatch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Heure du match</label>
                <input
                  type="time"
                  value={match.heureMatch}
                  onChange={(e) => handleMatchChange(index, 'heureMatch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cote calculée */}
      {formData.typePari === 'COMBINE' && matchs.length === 2 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Cote combinée calculée</p>
              <p className="text-xs text-blue-700 mt-1">
                {matchs.map((m, i) => {
                  const c = parseFloat(m.cote) || 0
                  return c > 0 ? (i > 0 ? ' × ' : '') + formatCote(c) : ''
                }).join('')}
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              @ {formatCote(parseFloat(formData.coteCalculee))}
            </p>
          </div>
          {errors.coteCombo && (
            <p className="mt-2 text-sm text-red-600">{errors.coteCombo}</p>
          )}
        </div>
      )}

      {/* Gain potentiel */}
      {parseFloat(formData.coteCalculee) > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Gain potentiel</p>
          <p className="text-xl font-bold text-gray-900">
            {formatEuro(miseCalculee * parseFloat(formData.coteCalculee))}
          </p>
        </div>
      )}

      {/* Statut */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statut initial du palier
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, statut: 'EN_ATTENTE' })}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.statut === 'EN_ATTENTE'
                ? 'border-gray-500 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">⏳</span>
            <p className="text-sm mt-1">En attente</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, statut: 'GAGNE' })}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.statut === 'GAGNE'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">✅</span>
            <p className="text-sm mt-1">Gagné</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, statut: 'PERDU' })}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.statut === 'PERDU'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">❌</span>
            <p className="text-sm mt-1">Perdu</p>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Pour les combinés, vous pourrez valider chaque match individuellement après création
        </p>
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
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Ajout...' : 'Ajouter le palier'}
        </button>
      </div>
    </form>
  )
}