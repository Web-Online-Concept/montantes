'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { MontanteAvecNumero, PalierAvecInfos, ETATS_CONFIG, OBJECTIFS_CONFIG, formatEuro, formatPourcentage, formatCote } from '@/types'
import CartePalier from '@/components/CartePalier'

export default function MontanteDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [montante, setMontante] = useState<MontanteAvecNumero | null>(null)
  const [paliers, setPaliers] = useState<PalierAvecInfos[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMontante()
  }, [id])

  const fetchMontante = async () => {
    try {
      const response = await fetch(`/api/montantes/${id}`)
      if (!response.ok) {
        notFound()
      }
      
      const data = await response.json()
      setMontante(data.montante)
      setPaliers(data.paliers)
    } catch (error) {
      console.error('Erreur chargement montante:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    )
  }

  if (!montante) {
    notFound()
  }

  // Gestion du cas où l'état ARRETEE existe encore dans la base
  let etatConfig = ETATS_CONFIG[montante.etat as keyof typeof ETATS_CONFIG]
  
  // Si l'état n'existe pas (ex: ARRETEE), on le traite comme REUSSI
  if (!etatConfig) {
    if (montante.etat === 'ARRETEE') {
      etatConfig = ETATS_CONFIG.REUSSI
    } else {
      // Fallback par défaut
      etatConfig = {
        label: montante.etat,
        couleur: '#6b7280',
        emoji: '❓'
      }
    }
  }

  const objectifConfig = OBJECTIFS_CONFIG[montante.objectif]
  
  // Calculer le gain actuel RÉEL (seulement les paliers gagnés)
  let gainActuelReel = montante.miseInitiale
  if (paliers && paliers.length > 0) {
    // Trouver le dernier palier gagné
    const paliersGagnes = paliers
      .filter(p => p.statut === 'GAGNE' && p.gain)
      .sort((a, b) => b.numeroPalier - a.numeroPalier)
    
    if (paliersGagnes.length > 0) {
      gainActuelReel = paliersGagnes[0].gain!
    } else {
      // Aucun palier gagné = pas de gain
      gainActuelReel = 0
    }
  } else if (montante.etat === 'REUSSI' || montante.etat === 'ARRETEE') {
    // Montante terminée, utiliser le gain final
    gainActuelReel = montante.gainFinal || montante.miseInitiale
  } else {
    // Pas de paliers = pas de gain
    gainActuelReel = 0
  }
  
  // Calculer la progression réelle
  const progressionReelle = gainActuelReel > 0 
    ? ((gainActuelReel - montante.miseInitiale) / montante.miseInitiale) * 100
    : 0
    
  // Déterminer le statut du palier actuel
  let statutPalier = ''
  if (montante.etat === 'EN_COURS' && paliers && paliers.length > 0) {
    // Trier les paliers par numéro
    const paliersOrdonnes = [...paliers].sort((a, b) => a.numeroPalier - b.numeroPalier)
    const dernierPalier = paliersOrdonnes[paliersOrdonnes.length - 1]
    
    if (dernierPalier.statut === 'EN_ATTENTE') {
      statutPalier = `Palier ${dernierPalier.numeroPalier} en cours`
    } else if (dernierPalier.statut === 'GAGNE') {
      // Si le dernier est gagné, le prochain est en attente
      statutPalier = `Palier ${dernierPalier.numeroPalier + 1} en attente`
    }
  }
  
  const objectifMontant = montante.miseInitiale * objectifConfig.multiplicateur
  const progressionObjectif = gainActuelReel > 0
    ? Math.min((gainActuelReel / objectifMontant) * 100, 100)
    : 0

  // Déterminer si la montante est terminée
  const isTerminee = montante.etat === 'REUSSI' || montante.etat === 'PERDU' || montante.etat === 'ARRETEE'

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:text-[#1e40af]">
                Accueil
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">
              Montante n°{montante.numeroAffichage}
            </li>
          </ol>
        </nav>

        {/* En-tête */}
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          style={{ borderTop: `4px solid ${etatConfig.couleur}` }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">{etatConfig.emoji}</span>
                  Montante n°{montante.numeroAffichage}
                </h1>
                <p className="text-gray-600 mt-1">
                  {statutPalier || `Créée le ${new Date(montante.dateDebut).toLocaleDateString('fr-FR')}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Objectif</p>
                <p className="text-2xl font-bold" style={{ color: objectifConfig.couleur }}>
                  {objectifConfig.label}
                </p>
                <p className="text-sm text-gray-600">{formatEuro(objectifMontant)}</p>
              </div>
            </div>

            {/* Cartes de stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Mise initiale</p>
                <p className="text-xl font-bold text-gray-900">{formatEuro(montante.miseInitiale)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {isTerminee ? 'Gain final' : 'Gain actuel'}
                </p>
                <p className="text-xl font-bold text-green-600">{formatEuro(gainActuelReel)}</p>
              </div>
              <div className={`rounded-lg p-4 ${progressionReelle > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600">Progression</p>
                <p className={`text-xl font-bold ${progressionReelle > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPourcentage(progressionReelle)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">État</p>
                <p className="text-xl font-bold" style={{ color: etatConfig.couleur }}>
                  {etatConfig.label}
                </p>
              </div>
            </div>

            {/* Barre de progression */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progression vers l&apos;objectif</span>
                <span className="text-sm font-medium">
                  {formatEuro(gainActuelReel)} / {formatEuro(objectifMontant)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 relative"
                  style={{ 
                    width: `${progressionObjectif}%`,
                    backgroundColor: progressionObjectif >= 100 ? '#10b981' : progressionObjectif > 0 ? objectifConfig.couleur : '#e5e7eb'
                  }}
                >
                  {progressionObjectif > 0 && (
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {progressionObjectif.toFixed(1)}% de l&apos;objectif
              </p>
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations détaillées</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-600">Date de début</dt>
              <dd className="font-medium">{new Date(montante.dateDebut).toLocaleDateString('fr-FR', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</dd>
            </div>
            {montante.dateFin && (
              <div>
                <dt className="text-sm text-gray-600">Date de fin</dt>
                <dd className="font-medium">{new Date(montante.dateFin).toLocaleDateString('fr-FR', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-gray-600">Nombre de paliers</dt>
              <dd className="font-medium">{paliers.length} palier{paliers.length > 1 ? &apos;s&apos; : &apos;&apos;}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">ROI (Return on Investment)</dt>
              <dd className={`font-medium ${progressionReelle > 0 ? &apos;text-green-600&apos; : progressionReelle < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatPourcentage(progressionReelle)}
              </dd>
            </div>
            {montante.dureeJours > 0 && (
              <div>
                <dt className="text-sm text-gray-600">Durée</dt>
                <dd className="font-medium">{montante.dureeJours} jour{montante.dureeJours > 1 ? &apos;s&apos; : &apos;&apos;}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Liste des paliers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Détail des paliers ({paliers.length})
          </h2>
          
          {paliers.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              Aucun palier n&apos;a encore été ajouté à cette montante
            </p>
          ) : (
            <div className="space-y-4">
              {paliers.map((palier) => (
                <CartePalier 
                  key={palier.id} 
                  palier={palier}
                  montante={montante}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}