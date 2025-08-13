'use client'

import { useState, useEffect } from 'react'
import { formatEuro, formatPourcentage, PeriodeFiltre } from '@/types'
import TimelineBankroll from '@/components/TimelineBankroll'
import GraphiqueProgression from '@/components/GraphiqueProgression'
import type { HistoriqueBankroll, Montante } from '@/types'
import type { HistoriqueBankroll, Montante } from '@/types'

export default function HistoriquePage() {
  const [historique, setHistorique] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [periode, setPeriode] = useState<PeriodeFiltre>('30j')
  const [typeFiltre, setTypeFiltre] = useState<'tout' | 'depot_retrait' | 'montantes'>('tout')

  useEffect(() => {
    chargerHistorique()
  }, [periode, typeFiltre])

  const chargerHistorique = async () => {
    try {
      const params = new URLSearchParams({
        periode,
        type: typeFiltre
      })
      
      const response = await fetch(`/api/historique?${params}`)
      const data = await response.json()
      
      setHistorique(data.historique)
      setStats(data.stats)
    } catch (error) {
      console.error('Erreur chargement historique:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculer la performance en évitant la division par zéro
  const calculerPerformance = () => {
    if (!stats) return '0%'
    if (stats.bankrollInitiale === 0) {
      if (stats.bankrollActuelle > 0) return '+100%'
      return '0%'
    }
    const perf = ((stats.bankrollActuelle - stats.bankrollInitiale) / stats.bankrollInitiale) * 100
    return formatPourcentage(perf)
  }

  const handleExport = () => {
    const csv = [
      ['Date', 'Type', 'Description', 'Montant', 'Solde après'],
      ...historique.map(item => [
        new Date(item.createdAt).toLocaleString('fr-FR'),
        item.typeOperation,
        item.description,
        formatEuro(Math.abs(item.montant)),
        formatEuro(item.montantApres)
      ])
    ].map(row => row.join(';')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `historique_bankroll_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historique Bankroll</h1>
          <p className="text-gray-600 mt-2">Suivez l&apos;évolution détaillée de votre capital</p>
        </div>

        {/* Résumé */}
        {stats && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bankroll initiale</p>
                <p className="text-2xl font-bold text-gray-900">{formatEuro(stats.bankrollInitiale)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Bankroll actuelle</p>
                <p className="text-2xl font-bold text-gray-900">{formatEuro(stats.bankrollActuelle)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Variation totale</p>
                <p className={`text-2xl font-bold ${stats.variationTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.variationTotale >= 0 ? '+' : ''}{formatEuro(stats.variationTotale)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Performance</p>
                <p className={`text-2xl font-bold ${stats.variationTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculerPerformance()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filtre par type */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Type :</label>
              <select
                value={typeFiltre}
                onChange={(e) => setTypeFiltre(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              >
                <option value="tout">Tout</option>
                <option value="depot_retrait">Dépôts/Retraits</option>
                <option value="montantes">Montantes</option>
              </select>
            </div>

            {/* Filtre par période */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Période :</label>
              <div className="flex space-x-2">
                {(['7j', '30j', '90j', 'tout'] as PeriodeFiltre[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriode(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      periode === p
                        ? 'bg-[#1e40af] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'tout' ? 'Tout' : `${p.replace('j', ' jours')}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques détaillées */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-700">Total dépôts</h3>
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(stats.totalDepots)}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-700">Total retraits</h3>
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(stats.totalRetraits)}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-700">Gains montantes</h3>
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(stats.totalGains)}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-orange-700">Pertes montantes</h3>
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(stats.totalPertes)}</p>
            </div>
          </div>
        )}

        {/* Graphique d'évolution */}
        {historique.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Évolution de la bankroll</h2>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter CSV
              </button>
            </div>
            <GraphiqueProgression
              data={historique.map(item => ({
                date: new Date(item.createdAt).toLocaleDateString('fr-FR'),
                montant: item.montantApres,
                type: item.typeOperation
              }))}
            />
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Timeline détaillée</h2>
          <TimelineBankroll historique={historique} />
        </div>
      </div>
    </div>
  )
}