'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MontanteAvecNumero, FiltreMontante, TriMontante, formatEuro, formatPourcentage, ETATS_CONFIG } from '@/types'
import CarteMontante from '@/components/CarteMontante'
import type { HistoriqueBankroll, Montante } from '@/types'

export default function HomePage() {
  const [montantes, setMontantes] = useState<MontanteAvecNumero[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState<FiltreMontante>('toutes')
  const [tri, setTri] = useState<TriMontante>('recent')

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
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

  // Compter les montantes par état
  const compteMontantes = {
    toutes: montantes.length,
    EN_COURS: montantes.filter(m => m.etat === 'EN_COURS').length,
    REUSSI: montantes.filter(m => m.etat === 'REUSSI' || m.etat === 'ARRETEE').length,
    PERDU: montantes.filter(m => m.etat === 'PERDU').length
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-6 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">
            <span className="block md:inline">Gestion de Montantes</span>
            <span className="block md:inline"> Paris Sportifs</span>
          </h1>
          <p className="text-sm md:text-xl text-blue-100 mb-5 md:mb-0">
            <span className="md:hidden">Suivez nos montantes & nos statistiques détaillées</span>
            <span className="hidden md:inline">Suivez nos montantes avec notre système transparent et nos statistiques détaillées</span>
          </p>
        </div>
      </div>

      {/* Filtres et tri - Design amélioré */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 md:-mt-10 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 relative overflow-hidden">
          {/* Effet de dégradé subtil */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none" />
          
          <div className="relative">
            {/* VERSION MOBILE - Menus déroulants */}
            <div className="md:hidden space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span>Montantes</span>
                </h2>
                <span className="text-sm text-gray-500">({montantes.length})</span>
              </div>
              
              {/* Select pour les filtres */}
              <select
                value={filtre}
                onChange={(e) => setFiltre(e.target.value as FiltreMontante)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                <option value="toutes">📋 Toutes les montantes ({compteMontantes.toutes})</option>
                <option value="EN_COURS">{ETATS_CONFIG.EN_COURS.emoji} En cours ({compteMontantes.EN_COURS})</option>
                <option value="REUSSI">{ETATS_CONFIG.REUSSI.emoji} Gagnées ({compteMontantes.REUSSI})</option>
                <option value="PERDU">{ETATS_CONFIG.PERDU.emoji} Perdues ({compteMontantes.PERDU})</option>
              </select>

              {/* Select pour le tri */}
              <select
                value={tri}
                onChange={(e) => setTri(e.target.value as TriMontante)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                <option value="recent">📅 Plus récentes</option>
                <option value="ancien">📅 Plus anciennes</option>
                <option value="progression">📊 Progression ↓</option>
                <option value="mise">💰 Mise ↓</option>
              </select>
            </div>

            {/* VERSION DESKTOP - Conservée telle quelle */}
            <div className="hidden md:block">
              {/* Header de la section filtres */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-0 md:gap-6">
                {/* Titre */}
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 md:mb-0">
                  <span className="text-2xl">🎯</span>
                  <span>Montantes</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">({montantes.length} au total)</span>
                </h2>
                
                {/* Filtres - centrés sur desktop */}
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:flex-1">
                  <button
                    onClick={() => setFiltre('toutes')}
                    className={`relative px-4 py-2 md:py-1.5 rounded-xl font-medium transition-all text-sm md:text-base ${
                      filtre === 'toutes' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span>Toutes</span>
                      <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                        {montantes.length}
                      </span>
                    </span>
                  </button>
                  
                  {(['EN_COURS', 'REUSSI', 'PERDU'] as const).map(etat => {
                    const count = montantes.filter(m => {
                      if (etat === 'REUSSI') {
                        return m.etat === 'REUSSI' || m.etat === 'ARRETEE'
                      }
                      return m.etat === etat
                    }).length;
                    
                    return (
                      <button
                        key={etat}
                        onClick={() => setFiltre(etat)}
                        className={`relative px-4 py-2 md:py-1.5 rounded-xl font-medium transition-all text-sm md:text-base ${
                          filtre === etat 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="text-lg">{ETATS_CONFIG[etat].emoji}</span>
                          <span className="hidden sm:inline">{ETATS_CONFIG[etat].label}</span>
                          <span className="sm:hidden">
                            {etat === 'EN_COURS' ? 'En cours' : 
                             etat === 'REUSSI' ? 'Gagnées' : 'Perdues'}
                          </span>
                          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                            {count}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Tri sur desktop */}
                <div className="hidden md:block">
                  <select
                    value={tri}
                    onChange={(e) => setTri(e.target.value as TriMontante)}
                    className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  >
                    <option value="recent">📅 Plus récentes</option>
                    <option value="ancien">📅 Plus anciennes</option>
                    <option value="progression">📊 Progression ↓</option>
                    <option value="mise">💰 Mise ↓</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des montantes */}
      <div className="max-w-7xl mx-auto px-4 pb-6 md:pb-16">
        {montantesTriees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">Aucune montante trouvée</p>
            <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {montantesTriees.map((montante) => (
              <CarteMontante key={montante.id} montante={montante} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Telegram */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white pt-6 pb-6 md:py-12 -mb-[4rem] md:mb-0">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
            Suivez nos montantes en direct sur Telegram
          </h2>
          <p className="text-sm md:text-base text-blue-100 mb-4 md:mb-6 opacity-90">
            Recevez les notifications en temps réel et ne manquez aucun palier
          </p>
          <a
            href="https://t.me/montantespro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 text-sm md:text-base shadow-lg"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            Rejoindre le canal Telegram
          </a>
        </div>
      </div>
    </div>
  )
}