'use client'

import { useState, useEffect } from 'react'
import { StatsGlobales, formatEuro, formatPourcentage } from '@/types'
import StatsCard from '@/components/StatsCard'
import GraphiqueProgression from '@/components/GraphiqueProgression'
import TableauMeilleuresMontantes from '@/components/TableauMeilleuresMontantes'
import type { HistoriqueBankroll, Montante } from '@/types'

export default function StatistiquesPage() {
  const [stats, setStats] = useState<StatsGlobales | null>(null)
  const [periode, setPeriode] = useState<'30j' | '90j' | 'tout'>('tout')
  const [historique, setHistorique] = useState<any[]>([])
  const [meilleuresMontantes, setMeilleuresMontantes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [periode])

  const fetchStats = async () => {
    try {
      // Stats globales
      const statsRes = await fetch('/api/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Historique progression
      const historiqueRes = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periode, type: 'progression' })
      })
      if (historiqueRes.ok) {
        const data = await historiqueRes.json()
        setHistorique(data.historique || [])
      }

      // Meilleures montantes
      const montantesRes = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periode, type: 'montantes' })
      })
      if (montantesRes.ok) {
        const data = await montantesRes.json()
        const sorted = (data.montantes || [])
          .filter((m: any) => m.etat === 'REUSSI' || m.etat === 'ARRETEE')
          .sort((a: any, b: any) => b.roi - a.roi)
          .slice(0, 10)
        setMeilleuresMontantes(sorted)
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fbbf24]"></div>
      </div>
    )
  }

  if (!stats) return null

  // Calculer des stats supplémentaires en gérant les divisions par zéro
  const montantesReussiesTotal = (stats.reussies || 0) + (stats.arretees || 0)
  const montantesTerminees = montantesReussiesTotal + (stats.perdues || 0)
  
  const gainMoyen = montantesReussiesTotal > 0 
    ? (stats.gainsTotaux || 0) / montantesReussiesTotal 
    : 0
    
  const perteMoyenne = (stats.perdues || 0) > 0 
    ? (stats.pertesTotales || 0) / stats.perdues 
    : 0
    
  const ratioGainsPertes = (stats.pertesTotales || 0) > 0 
    ? (stats.gainsTotaux || 0) / stats.pertesTotales 
    : (stats.gainsTotaux || 0) > 0 ? '+∞' : '0'
    
  const evolutionBankroll = stats.bankrollInitiale && stats.bankrollInitiale > 0
    ? ((stats.bilanTotal || 0) / stats.bankrollInitiale) * 100
    : 0

  return (
    <div className="py-8 space-y-8">
      {/* Titre */}
      <section>
        <h1 className="text-4xl font-black text-[#1e40af] mb-2">Statistiques</h1>
        <p className="text-gray-600">Vue d&apos;ensemble des performances et analyses détaillées</p>
      </section>

      {/* Sélecteur de période */}
      <section className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPeriode('30j')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              periode === '30j'
                ? 'bg-[#1e40af] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 derniers jours
          </button>
          <button
            onClick={() => setPeriode('90j')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              periode === '90j'
                ? 'bg-[#1e40af] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            90 derniers jours
          </button>
          <button
            onClick={() => setPeriode('tout')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              periode === 'tout'
                ? 'bg-[#1e40af] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tout l&apos;historique
          </button>
        </div>
      </section>

      {/* Stats principales - VERSION MOBILE (inchangée) */}
      <section className="grid grid-cols-1 md:hidden gap-6">
        <StatsCard
          title="Taux de réussite"
          value={formatPourcentage(stats.tauxReussite || 0)}
          subtitle={`${montantesReussiesTotal} sur ${montantesTerminees} montantes`}
          icon="🎯"
          color={stats.tauxReussite >= 70 ? 'success' : stats.tauxReussite >= 50 ? 'warning' : 'danger'}
        />
        
        <StatsCard
          title="ROI Global"
          value={formatPourcentage(stats.roi || 0)}
          subtitle="Return on Investment"
          variation={stats.roi || 0}
          icon="📊"
          color={(stats.roi || 0) > 0 ? 'success' : 'danger'}
        />
        
        <StatsCard
          title="Bilan total"
          value={formatEuro(stats.bilanTotal || 0)}
          subtitle={`Gains: ${formatEuro(stats.gainsTotaux || 0)}`}
          icon="💰"
          color={(stats.bilanTotal || 0) > 0 ? 'success' : 'danger'}
        />
        
        <StatsCard
          title="Montantes actives"
          value={(stats.enCours || 0).toString()}
          subtitle={`Capital engagé: ${formatEuro(stats.misesEngagees || 0)}`}
          icon="⏳"
          color="primary"
        />
      </section>

      {/* Stats principales - VERSION DESKTOP (modifiée et centrée) */}
      <section className="hidden md:grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Bilan total Montantes"
          value={formatEuro(stats.bilanTotal || 0)}
          icon="💰"
          color={(stats.bilanTotal || 0) > 0 ? 'success' : 'danger'}
          centered={true}
        />
        
        <StatsCard
          title="Bilan Montantes"
          value={`${montantesReussiesTotal}/${stats.nombreTotal || 0} réussies`}
          icon="📊"
          color="primary"
          centered={true}
        />
        
        <StatsCard
          title="Taux de Réussite"
          value={formatPourcentage(stats.tauxReussite || 0)}
          icon="🎯"
          color={stats.tauxReussite >= 70 ? 'success' : stats.tauxReussite >= 50 ? 'warning' : 'danger'}
          centered={true}
        />
        
        <StatsCard
          title="ROI Global"
          value={formatPourcentage(stats.roi || 0)}
          icon="💎"
          color={(stats.roi || 0) > 0 ? 'success' : 'danger'}
          centered={true}
        />
      </section>

      {/* Stats détaillées */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition par état */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Répartition des montantes</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Gagnées</span>
                <span className="text-sm font-bold text-green-600">{montantesReussiesTotal}</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-bar-fill bg-green-500"
                  style={{ width: stats.nombreTotal > 0 ? `${(montantesReussiesTotal / stats.nombreTotal) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Perdues</span>
                <span className="text-sm font-bold text-red-600">{stats.perdues || 0}</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-bar-fill bg-red-500"
                  style={{ width: stats.nombreTotal > 0 ? `${((stats.perdues || 0) / stats.nombreTotal) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">En cours</span>
                <span className="text-sm font-bold text-blue-600">{stats.enCours || 0}</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-bar-fill bg-blue-500"
                  style={{ width: stats.nombreTotal > 0 ? `${((stats.enCours || 0) / stats.nombreTotal) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-2xl font-black text-[#1e40af]">
              Total : {stats.nombreTotal} montantes
            </p>
          </div>
        </div>

        {/* Moyennes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Moyennes et ratios</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gain moyen par réussite</span>
              <span className="text-xl font-bold text-green-600">
                {formatEuro(gainMoyen)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Perte moyenne par échec</span>
              <span className="text-xl font-bold text-red-600">
                {formatEuro(perteMoyenne)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ratio gains/pertes</span>
              <span className="text-xl font-bold" style={{
                color: typeof ratioGainsPertes === 'string' || ratioGainsPertes > 1 ? '#10b981' : '#ef4444'
              }}>
                {typeof ratioGainsPertes === 'string' ? ratioGainsPertes : ratioGainsPertes.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bankroll évolution</span>
              <span className="text-xl font-bold" style={{
                color: evolutionBankroll > 0 ? '#10b981' : evolutionBankroll < 0 ? '#ef4444' : '#6b7280'
              }}>
                {evolutionBankroll > 0 ? '+' : ''}{evolutionBankroll.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Graphique de progression */}
      {historique.length > 0 && (
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Évolution de la bankroll</h2>
          <GraphiqueProgression data={historique} />
        </section>
      )}

      {/* Top 10 des meilleures montantes */}
      {meilleuresMontantes.length > 0 && (
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top 10 des meilleures montantes</h2>
          <TableauMeilleuresMontantes montantes={meilleuresMontantes} />
        </section>
      )}
    </div>
  )
}