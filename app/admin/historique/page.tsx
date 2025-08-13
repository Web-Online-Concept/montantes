'use client'

import { useState, useEffect } from 'react'
import { formatEuro } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import TimelineBankroll from '@/components/TimelineBankroll'
import GraphiqueProgression from '@/components/GraphiqueProgression'
import type { HistoriqueBankroll, Montante } from '@/types'

interface HistoriqueStats {
  totalDepots: number
  totalRetraits: number
  totalGains: number
  totalPertes: number
  variationTotale: number
  bankrollInitiale: number
  bankrollActuelle: number
  nombreOperations: {
    depots: number
    retraits: number
    gains: number
    pertes: number
  }
}

export default function AdminHistoriquePage() {
  const [historique, setHistorique] = useState<any[]>([])
  const [stats, setStats] = useState<HistoriqueStats | null>(null)
  const [filtreType, setFiltreType] = useState<'tout' | 'depot_retrait' | 'montantes'>('tout')
  const [periode, setPeriode] = useState<'7j' | '30j' | '90j' | 'tout'>('30j')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistorique()
  }, [filtreType, periode])

  const fetchHistorique = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/historique?' + new URLSearchParams({
        type: filtreType,
        periode: periode
      }))
      
      if (res.ok) {
        const data = await res.json()
        setHistorique(data.historique)
        
        // Calculer les stats détaillées
        const statsDetaillees: HistoriqueStats = {
          ...data.stats,
          nombreOperations: {
            depots: data.historique.filter((h: { bankrollInitiale: number; bankrollActuelle: number; variationTotale: number; totalDepots: number; totalRetraits: number; totalGains: number; totalPertes: number }) => h.typeOperation === 'DEPOT').length,
            retraits: data.historique.filter((h: { bankrollInitiale: number; bankrollActuelle: number; variationTotale: number; totalDepots: number; totalRetraits: number; totalGains: number; totalPertes: number }) => h.typeOperation === 'RETRAIT').length,
            gains: data.historique.filter((h: { bankrollInitiale: number; bankrollActuelle: number; variationTotale: number; totalDepots: number; totalRetraits: number; totalGains: number; totalPertes: number }) => h.typeOperation === 'GAIN_MONTANTE').length,
            pertes: data.historique.filter((h: { bankrollInitiale: number; bankrollActuelle: number; variationTotale: number; totalDepots: number; totalRetraits: number; totalGains: number; totalPertes: number }) => h.typeOperation === 'PERTE_MONTANTE').length
          }
        }
        setStats(statsDetaillees)
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!historique.length) return

    // En-têtes CSV
    const headers = ['Date', 'Type', 'Description', 'Montant', 'Solde après']
    
    // Données
    const rows = historique.map(h => [
      new Date(h.createdAt).toLocaleDateString('fr-FR'),
      h.typeOperation.replace('_', ' '),
      h.description,
      formatEuro(h.variation),
      formatEuro(h.montantApres)
    ])

    // Créer le CSV
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n')

    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `historique-bankroll-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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

  // Préparer les données pour le graphique
  const graphData = historique.map(item => ({
    montantApres: item.montantApres,
    createdAt: item.createdAt,
    typeOperation: item.typeOperation
  }))

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historique de la bankroll</h1>
            <p className="text-gray-600 mt-1">Analyse détaillée des mouvements de capital</p>
          </div>
          <button
            onClick={exportCSV}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter CSV
          </button>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistiques de la période</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total dépôts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total dépôts</p>
                  <span className="text-xs text-gray-500">{stats.nombreOperations.depots} op.</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatEuro(stats.totalDepots)}</p>
              </div>

              {/* Total retraits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total retraits</p>
                  <span className="text-xs text-gray-500">{stats.nombreOperations.retraits} op.</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{formatEuro(stats.totalRetraits)}</p>
              </div>

              {/* Gains montantes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Gains montantes</p>
                  <span className="text-xs text-gray-500">{stats.nombreOperations.gains} op.</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatEuro(stats.totalGains)}</p>
              </div>

              {/* Pertes montantes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Pertes montantes</p>
                  <span className="text-xs text-gray-500">{stats.nombreOperations.pertes} op.</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{formatEuro(stats.totalPertes)}</p>
              </div>
            </div>

            {/* Résumé */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Variation totale sur la période</p>
                  <p className={`text-3xl font-bold ${stats.variationTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.variationTotale >= 0 ? '+' : ''}{formatEuro(stats.variationTotale)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Bankroll actuelle</p>
                  <p className="text-3xl font-bold text-[#1e40af]">{formatEuro(stats.bankrollActuelle)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filtre par type */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltreType('tout')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreType === 'tout'
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setFiltreType('depot_retrait')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreType === 'depot_retrait'
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dépôts/Retraits
              </button>
              <button
                onClick={() => setFiltreType('montantes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtreType === 'montantes'
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Montantes
              </button>
            </div>

            {/* Période */}
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value as any)}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
            >
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
              <option value="90j">90 derniers jours</option>
              <option value="tout">Tout l&apos;historique</option>
            </select>
          </div>
        </div>

        {/* Graphique d'évolution */}
        {graphData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Évolution de la bankroll</h2>
            <GraphiqueProgression data={graphData} />
          </div>
        )}

        {/* Timeline détaillée */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Timeline détaillée ({historique.length} opération{historique.length > 1 ? 's' : ''})
          </h2>
          <TimelineBankroll historique={historique} />
        </div>

        {/* Tableau récapitulatif */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif par type</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type d&apos;opération</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Moyenne</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600">+</span>
                        </div>
                        <span>Dépôts</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{stats.nombreOperations.depots}</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-600">
                      +{formatEuro(stats.totalDepots)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {stats.nombreOperations.depots > 0 
                        ? formatEuro(stats.totalDepots / stats.nombreOperations.depots)
                        : '—'
                      }
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-red-600">-</span>
                        </div>
                        <span>Retraits</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{stats.nombreOperations.retraits}</td>
                    <td className="py-4 px-4 text-right font-semibold text-red-600">
                      -{formatEuro(stats.totalRetraits)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {stats.nombreOperations.retraits > 0 
                        ? formatEuro(stats.totalRetraits / stats.nombreOperations.retraits)
                        : '—'
                      }
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600">↑</span>
                        </div>
                        <span>Gains montantes</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{stats.nombreOperations.gains}</td>
                    <td className="py-4 px-4 text-right font-semibold text-blue-600">
                      +{formatEuro(stats.totalGains)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {stats.nombreOperations.gains > 0 
                        ? formatEuro(stats.totalGains / stats.nombreOperations.gains)
                        : '—'
                      }
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-orange-600">↓</span>
                        </div>
                        <span>Pertes montantes</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{stats.nombreOperations.pertes}</td>
                    <td className="py-4 px-4 text-right font-semibold text-orange-600">
                      -{formatEuro(stats.totalPertes)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {stats.nombreOperations.pertes > 0 
                        ? formatEuro(stats.totalPertes / stats.nombreOperations.pertes)
                        : '—'
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}