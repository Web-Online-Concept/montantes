'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MontanteAvecNumero, FiltreMontante, TriMontante, formatEuro, formatPourcentage, ETATS_CONFIG } from '@/types'
import CarteMontante from '@/components/CarteMontante'
import StatsCard from '@/components/StatsCard'
import type { HistoriqueBankroll, Montante } from '@/types'
import type { HistoriqueBankroll, Montante } from '@/types'

export default function HomePage() {
  const [montantes, setMontantes] = useState<MontanteAvecNumero[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState<FiltreMontante>('toutes')
  const [tri, setTri] = useState<TriMontante>('recent')

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      // Charger les stats
      const statsRes = await fetch('/api/stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      // Charger les montantes
      const montantesRes = await fetch('/api/montantes')
      const montantesData = await montantesRes.json()
      setMontantes(montantesData)
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les montantes
  const montantesFiltrees = montantes.filter(m => {
    if (filtre === 'toutes') return true
    // Traiter ARRETEE comme REUSSI pour le filtrage
    if (filtre === 'REUSSI' && m.etat === 'ARRETEE') return true
    return m.etat === filtre
  })

  // Trier les montantes
  const montantesTriees = [...montantesFiltrees].sort((a, b) => {
    switch (tri) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'ancien':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'progression':
        return b.progression - a.progression
      case 'mise':
        return b.miseInitiale - a.miseInitiale
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gestion de Montantes Paris Sportifs
          </h1>
          <p className="text-xl text-blue-100">
            Suivez nos montantes avec notre système transparent et nos statistiques détaillées
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Bankroll actuelle"
              value={formatEuro(stats.bankrollActuelle || 0)}
              variation={stats.bankrollInitiale > 0 ? 
                ((stats.bankrollActuelle - stats.bankrollInitiale) / stats.bankrollInitiale) * 100
                : stats.bankrollActuelle > 0 ? 100 : 0}
              icon="💰"
              color="primary"
            />
            <StatsCard
              title="Montantes actives"
              value={stats.enCours?.toString() || '0'}
              subtitle={`Sur ${stats.nombreTotal || 0} au total`}
              icon="📊"
              color="accent"
            />
            <StatsCard
              title="Performance globale"
              value={formatPourcentage(stats.tauxReussite || 0)}
              subtitle={`ROI: ${formatPourcentage(stats.roi || 0)}`}
              icon="📈"
              color={stats.roi > 0 ? "success" : "warning"}
            />
          </div>
        </div>
      )}

      {/* Filtres et tri */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltre('toutes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtre === 'toutes' 
                    ? 'bg-blue-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({montantes.length})
              </button>
              {(['EN_COURS', 'REUSSI', 'PERDU'] as const).map(etat => (
                <button
                  key={etat}
                  onClick={() => setFiltre(etat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtre === etat 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{ETATS_CONFIG[etat].emoji}</span>
                  {ETATS_CONFIG[etat].label} ({montantes.filter(m => {
                    // Compter ARRETEE comme REUSSI
                    if (etat === 'REUSSI') {
                      return m.etat === 'REUSSI' || m.etat === 'ARRETEE'
                    }
                    return m.etat === etat
                  }).length})
                </button>
              ))}
            </div>

            {/* Tri */}
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as TriMontante)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Plus récentes</option>
              <option value="ancien">Plus anciennes</option>
              <option value="progression">Progression ↓</option>
              <option value="mise">Mise ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des montantes */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {montantesTriees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune montante trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {montantesTriees.map((montante) => (
              <CarteMontante key={montante.id} montante={montante} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Telegram */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Suivez nos montantes en direct sur Telegram
          </h2>
          <p className="text-blue-100 mb-6">
            Recevez les notifications en temps réel et ne manquez aucun palier
          </p>
          <a
            href="https://t.me/montantespro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            Rejoindre le canal Telegram
          </a>
        </div>
      </div>
    </div>
  )
}