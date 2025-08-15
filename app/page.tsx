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
  const [menuOuvert, setMenuOuvert] = useState(false)

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
            {/* VERSION MOBILE - Menu déroulant */}
            <div className="md:hidden">
              {/* En-tête cliquable */}
              <button
                onClick={() => setMenuOuvert(!menuOuvert)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-lg font-bold text-gray-800">Montantes</span>
                  <span className="text-sm text-gray-500">({montantes.length})</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>Filtrer</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${menuOuvert ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Menu déroulant */}
              <div className={`overflow-hidden transition-all duration-300 ${menuOuvert ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pt-3 space-y-3">
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
              </div>
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


  </div>
  )
}