'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatsGlobales, formatEuro, formatPourcentage, ETATS_CONFIG } from '@/types'
import StatsCard from '@/components/StatsCard'
import AdminLayout from '@/components/admin/AdminLayout'

interface DashboardData {
  stats: StatsGlobales
  montantesRecentes: any[]
  derniersMovements: any[]
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Stats globales
      const statsRes = await fetch('/api/stats')
      if (!statsRes.ok) throw new Error('Erreur stats')
      const stats = await statsRes.json()

      // Montantes récentes
      const montantesRes = await fetch('/api/montantes')
      if (!montantesRes.ok) throw new Error('Erreur montantes')
      const montantes = await montantesRes.json()
      const montantesRecentes = montantes.slice(0, 5)

      // Derniers mouvements bankroll
      const histoRes = await fetch('/api/historique?periode=7j')
      if (!histoRes.ok) throw new Error('Erreur historique')
      const historique = await histoRes.json()
      const derniersMovements = historique.historique.slice(0, 5)

      setData({
        stats,
        montantesRecentes,
        derniersMovements
      })
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour obtenir la configuration d'état
  const getEtatConfig = (etat: string) => {
    const config = ETATS_CONFIG[etat as keyof typeof ETATS_CONFIG]
    
    if (config) {
      return config
    }
    
    // Retourner un objet par défaut compatible avec le type
    return {
      label: 'Inconnu' as const,
      couleur: '#6b7280' as const,
      emoji: '⏹️' as const
    }
  }

  // Fonction pour obtenir les classes CSS selon l'état
  const getEtatClasses = (etat: string) => {
    if (etat === 'EN_COURS') return 'bg-blue-100 text-blue-800'
    if (etat === 'REUSSI' || etat === 'ARRETEE') return 'bg-green-100 text-green-800'
    if (etat === 'PERDU') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
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

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-500">Erreur de chargement</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Titre */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administration</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble et actions rapides</p>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Bankroll actuelle"
            value={formatEuro(data.stats.bankrollActuelle)}
            subtitle={`Disponible: ${formatEuro(data.stats.bankrollDisponible)}`}
            variation={data.stats.bankrollInitiale > 0 
              ? ((data.stats.bankrollActuelle - data.stats.bankrollInitiale) / data.stats.bankrollInitiale) * 100
              : data.stats.bankrollActuelle > 0 ? 100 : 0}
            icon="💰"
            color="primary"
          />
          
          <StatsCard
            title="Montantes en cours"
            value={data.stats.enCours.toString()}
            subtitle={`Capital engagé: ${formatEuro(data.stats.misesEngagees)}`}
            icon="⏳"
            color="accent"
          />
          
          <StatsCard
            title="Taux de réussite"
            value={formatPourcentage(data.stats.tauxReussite)}
            subtitle={`${data.stats.reussies} réussies sur ${data.stats.nombreTotal}`}
            icon="🎯"
            color={data.stats.tauxReussite >= 60 ? 'success' : 'warning'}
          />
          
          <StatsCard
            title="ROI Global"
            value={formatPourcentage(data.stats.roi)}
            subtitle={`Bilan: ${formatEuro(data.stats.bilanTotal)}`}
            icon="📊"
            color={data.stats.roi > 0 ? 'success' : 'danger'}
          />
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/montantes/nouvelle"
              className="flex items-center justify-center space-x-2 bg-[#1e40af] text-white px-4 py-3 rounded-lg hover:bg-[#1e3a8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nouvelle montante</span>
            </Link>
            
            <Link
              href="/admin/bankroll"
              className="flex items-center justify-center space-x-2 bg-[#fbbf24] text-[#1e40af] px-4 py-3 rounded-lg hover:bg-[#f59e0b] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Gérer bankroll</span>
            </Link>
            
            <Link
              href="/admin/montantes"
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Toutes les montantes</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Montantes récentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Montantes récentes</h2>
            </div>
            <div className="p-6">
              {data.montantesRecentes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune montante</p>
              ) : (
                <div className="space-y-4">
                  {data.montantesRecentes.map((montante) => {
                    const etatConfig = getEtatConfig(montante.etat)
                    return (
                      <Link
                        key={montante.id}
                        href={`/admin/montantes/${montante.id}/editer`}
                        className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Montante n°{montante.numeroAffichage}
                            </p>
                            <p className="text-sm text-gray-500">{montante.nom}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEtatClasses(montante.etat)}`}>
                              {etatConfig.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatPourcentage(montante.progression)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Derniers mouvements */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Derniers mouvements</h2>
            </div>
            <div className="p-6">
              {data.derniersMovements.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun mouvement récent</p>
              ) : (
                <div className="space-y-4">
                  {data.derniersMovements.map((mouvement) => (
                    <div key={mouvement.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          mouvement.typeOperation === 'DEPOT' ? 'bg-green-100 text-green-600' :
                          mouvement.typeOperation === 'RETRAIT' ? 'bg-red-100 text-red-600' :
                          mouvement.typeOperation === 'GAIN_MONTANTE' ? 'bg-blue-100 text-blue-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {mouvement.typeOperation === 'DEPOT' ? '+' :
                           mouvement.typeOperation === 'RETRAIT' ? '-' :
                           mouvement.typeOperation === 'GAIN_MONTANTE' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {mouvement.typeOperation.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(mouvement.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <p className={`font-semibold ${
                        mouvement.montant > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mouvement.montant > 0 ? '+' : ''}{formatEuro(Math.abs(mouvement.montant))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}