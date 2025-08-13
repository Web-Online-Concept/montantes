'use client'

import { useState } from 'react'
import { formatEuro, formatCote, SPORTS_ICONS } from '@/types'

interface Match {
  sport: string
  equipe1: string
  equipe2: string
  competition: string
  pronostic: string
  cote: number
  dateMatch: string
  statut?: 'EN_ATTENTE' | 'GAGNE' | 'PERDU' | 'ANNULE'
}

interface ValidationMatchsCombineProps {
  palierId: string
  matchs: Match[]
  mise: number
  onValidation: (matchsStatuts: { matchIndex: number; statut: 'GAGNE' | 'PERDU' | 'ANNULE' }[]) => void
  loading?: boolean
}

export default function ValidationMatchsCombine({
  palierId,
  matchs,
  mise,
  onValidation,
  loading = false
}: ValidationMatchsCombineProps) {
  // État local pour suivre le statut de chaque match
  const [matchsStatuts, setMatchsStatuts] = useState<Record<number, 'EN_ATTENTE' | 'GAGNE' | 'PERDU' | 'ANNULE'>>(
    matchs.reduce((acc, match, index) => ({
      ...acc,
      [index]: match.statut || 'EN_ATTENTE'
    }), {})
  )

  // Calculer la cote finale et le statut global
  const calculerResultat = () => {
    let coteFinale = 1
    let statutGlobal: 'EN_ATTENTE' | 'GAGNE' | 'PERDU' | 'ANNULE' = 'GAGNE'
    let tousAnnules = true
    let auMoinsUnEnAttente = false

    for (let i = 0; i < matchs.length; i++) {
      const statut = matchsStatuts[i]
      
      if (statut === 'EN_ATTENTE') {
        auMoinsUnEnAttente = true
      } else if (statut === 'PERDU') {
        statutGlobal = 'PERDU'
        coteFinale = 0
        tousAnnules = false
        break
      } else if (statut === 'GAGNE') {
        coteFinale *= matchs[i].cote
        tousAnnules = false
      }
      // Si ANNULE, on ne multiplie pas la cote (équivalent à cote = 1)
    }

    if (statutGlobal !== 'PERDU') {
      if (auMoinsUnEnAttente) {
        statutGlobal = 'EN_ATTENTE'
      } else if (tousAnnules) {
        statutGlobal = 'ANNULE'
        coteFinale = 1 // Remboursement
      }
    }

    return { coteFinale, statutGlobal }
  }

  const handleStatutChange = (matchIndex: number, nouveauStatut: 'GAGNE' | 'PERDU' | 'ANNULE') => {
    setMatchsStatuts(prev => ({
      ...prev,
      [matchIndex]: nouveauStatut
    }))
  }

  const handleValider = () => {
    const modifications = Object.entries(matchsStatuts)
      .filter(([index, statut]) => statut !== 'EN_ATTENTE')
      .map(([index, statut]) => ({
        matchIndex: parseInt(index),
        statut: statut as 'GAGNE' | 'PERDU' | 'ANNULE'
      }))

    onValidation(modifications)
  }

  const { coteFinale, statutGlobal } = calculerResultat()
  const gainPotentiel = mise * coteFinale

  // Formater la date du match
  const formatMatchDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    }).replace(',', ' à')
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Validation individuelle des matchs</h4>
      
      {/* Liste des matchs */}
      <div className="space-y-3">
        {matchs.map((match, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{SPORTS_ICONS[match.sport] || &apos;⚽&apos;}</span>
                  <div>
                    <p className="font-medium">
                      {match.equipe1} - {match.equipe2}
                    </p>
                    <p className="text-sm text-gray-600">
                      {match.competition} • {formatMatchDateTime(match.dateMatch)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700">
                    Pronostic: <span className="font-medium">{match.pronostic}</span>
                  </span>
                  <span className="text-gray-700">
                    Cote: <span className="font-medium">@ {formatCote(match.cote)}</span>
                  </span>
                </div>
              </div>
              
              {/* Boutons de statut */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleStatutChange(index, 'GAGNE')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-all ${
                    matchsStatuts[index] === 'GAGNE'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
                  }`}
                  disabled={loading}
                >
                  ✓ Gagné
                </button>
                <button
                  onClick={() => handleStatutChange(index, 'ANNULE')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-all ${
                    matchsStatuts[index] === 'ANNULE'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
                  }`}
                  disabled={loading}
                >
                  ↺ Annulé
                </button>
                <button
                  onClick={() => handleStatutChange(index, 'PERDU')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-all ${
                    matchsStatuts[index] === 'PERDU'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-red-500'
                  }`}
                  disabled={loading}
                >
                  ✗ Perdu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé du calcul */}
      <div className="border-t pt-4 space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700">Calcul de la cote</p>
              <p className="text-xs text-blue-600 mt-1">
                {matchs.map((match, index) => {
                  const statut = matchsStatuts[index]
                  if (statut === 'EN_ATTENTE') return null
                  if (statut === 'PERDU') return `Match ${index + 1}: Perdu`
                  if (statut === 'ANNULE') return `Match ${index + 1}: Annulé (×1)`
                  return `Match ${index + 1}: ${formatCote(match.cote)}`
                }).filter(Boolean).join(' • ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">Cote finale</p>
              <p className="text-xl font-bold text-blue-900">
                @ {formatCote(coteFinale)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Mise</p>
            <p className="font-semibold">{formatEuro(mise)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gain potentiel</p>
            <p className="font-semibold">{formatEuro(gainPotentiel)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Statut global</p>
            <p className={`font-semibold ${
              statutGlobal === 'GAGNE' ? 'text-green-600' :
              statutGlobal === 'PERDU' ? 'text-red-600' :
              statutGlobal === 'ANNULE' ? 'text-gray-600' :
              'text-yellow-600'
            }`}>
              {statutGlobal === 'GAGNE' ? '✓ Gagné' :
               statutGlobal === 'PERDU' ? '✗ Perdu' :
               statutGlobal === 'ANNULE' ? '↺ Annulé' :
               '⏳ En attente'}
            </p>
          </div>
        </div>

        {/* Message d'information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            {statutGlobal === 'PERDU' 
              ? '⚠️ Un match perdu entraîne la perte du combiné entier'
              : statutGlobal === 'ANNULE'
              ? '↺ Tous les matchs sont annulés, la mise sera remboursée'
              : statutGlobal === 'EN_ATTENTE'
              ? '⏳ Validez tous les matchs pour confirmer le résultat'
              : '✓ Tous les matchs sont gagnés, le combiné est validé'
            }
          </p>
        </div>

        {/* Bouton de validation */}
        <div className="flex justify-end">
          <button
            onClick={handleValider}
            disabled={loading || statutGlobal === 'EN_ATTENTE'}
            className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Validation...' : 'Valider le combiné'}
          </button>
        </div>
      </div>
    </div>
  )
}