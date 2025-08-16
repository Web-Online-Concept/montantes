import Link from 'next/link'
import { MontanteAvecNumero, ETATS_CONFIG, OBJECTIFS_CONFIG, formatEuro, formatPourcentage } from '@/types'

interface CarteMontanteProps {
  montante: MontanteAvecNumero & { 
    paliers?: Array<{
      numeroPalier: number
      statut: string
      gain: number | null
    }>
  }
}

export default function CarteMontante({ montante }: CarteMontanteProps) {
  // Gestion du cas où l'état ARRETEE existe encore dans la base
  let etatConfig = ETATS_CONFIG[montante.etat as keyof typeof ETATS_CONFIG]
  
  // Si l'état n'existe pas (ex: ARRETEE), on le traite comme REUSSI
  if (!etatConfig) {
    if (montante.etat === 'ARRETEE') {
      etatConfig = ETATS_CONFIG.REUSSI
    } else {
      // Fallback par défaut
      etatConfig = {
        label: 'Arrêtée' as const,
        couleur: '#6b7280',
        emoji: '⏹️' as const
      }
    }
  }
  
  const objectifConfig = OBJECTIFS_CONFIG[montante.objectif as keyof typeof OBJECTIFS_CONFIG]
  
  // Calculer le gain RÉEL (comme dans la page de détail)
  const isTerminee = montante.etat === 'REUSSI' || montante.etat === 'PERDU' || montante.etat === 'ARRETEE'
  
  let gainAffiche = 0
  
  if (isTerminee && montante.gainFinal) {
    // Montante terminée, utiliser le gain final
    gainAffiche = montante.gainFinal
  } else if (montante.paliers && montante.paliers.length > 0) {
    // Montante en cours, chercher le dernier palier gagné
    const paliersGagnes = montante.paliers
      .filter(p => p.statut === 'GAGNE' && p.gain)
      .sort((a, b) => b.numeroPalier - a.numeroPalier)
    
    if (paliersGagnes.length > 0) {
      gainAffiche = paliersGagnes[0].gain!
    }
  }
  // Si aucun palier gagné, gainAffiche reste à 0
  
  // Calculer la progression réelle (ROI)
  const progressionReelle = gainAffiche > 0 
    ? ((gainAffiche - montante.miseInitiale) / montante.miseInitiale) * 100
    : 0
  
  // Déterminer le statut du palier actuel
  let statutPalier = ''
  if (montante.etat === 'EN_COURS') {
    if (!montante.paliers || montante.paliers.length === 0) {
      // Pas encore de paliers = Palier 1 en attente
      statutPalier = 'Palier 1 en attente'
    } else {
      // Trier les paliers par numéro
      const paliersOrdonnes = [...montante.paliers].sort((a, b) => a.numeroPalier - b.numeroPalier)
      const dernierPalier = paliersOrdonnes[paliersOrdonnes.length - 1]
      
      if (dernierPalier.statut === 'EN_ATTENTE') {
        statutPalier = `Palier ${dernierPalier.numeroPalier} en cours`
      } else if (dernierPalier.statut === 'GAGNE') {
        // Si le dernier est gagné, le prochain est en attente
        statutPalier = `Palier ${dernierPalier.numeroPalier + 1} en attente`
      }
    }
  } else if (isTerminee) {
    statutPalier = 'Terminée'
  }
  
  // Calculer le pourcentage de progression vers l'objectif (basé sur le profit)
  const objectifMontant = montante.miseInitiale * objectifConfig.multiplicateur
  const profitActuel = gainAffiche > 0 ? gainAffiche - montante.miseInitiale : 0
  const profitObjectif = objectifMontant - montante.miseInitiale
  const progressionObjectif = profitObjectif > 0 
    ? Math.min((profitActuel / profitObjectif) * 100, 100)
    : 0
  
  return (
    <Link href={`/montante/${montante.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
        {/* En-tête coloré selon l'état */}
        <div 
          className="p-4 text-white"
          style={{ backgroundColor: etatConfig.couleur }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">{etatConfig.emoji}</span>
                Montante n°{montante.numeroAffichage}
              </h3>
              <p className="text-sm opacity-90">
                Créée le {new Date(montante.dateDebut).toLocaleDateString('fr-FR')}
                {statutPalier && ` - ${statutPalier}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">Objectif</p>
              <p className="font-bold text-xl">{objectifConfig.label}</p>
            </div>
          </div>
        </div>
        
        {/* Corps de la carte */}
        <div className="p-4 space-y-4">
          {/* Progression */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progression</span>
              <span className={`font-semibold ${progressionReelle > 0 ? 'text-green-600' : progressionReelle < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {formatPourcentage(progressionReelle)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">{formatEuro(montante.miseInitiale)}</span>
              <span className="text-xs text-gray-500">{formatEuro(objectifMontant)}</span>
            </div>
          </div>
          
          {/* Infos principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Mise initiale</p>
              <p className="font-semibold">{formatEuro(montante.miseInitiale)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {isTerminee ? 'Gain final' : 'Gain actuel'}
              </p>
              <p className={`font-semibold ${gainAffiche > montante.miseInitiale ? 'text-green-600' : gainAffiche === 0 ? 'text-gray-600' : 'text-red-600'}`}>
                {formatEuro(gainAffiche)}
              </p>
            </div>
          </div>
          
          {/* Infos secondaires */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {montante.paliers?.length || 0} paliers
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(montante.dateDebut).toLocaleDateString('fr-FR', { 
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            
            {/* Badge état */}
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${etatConfig.couleur}15`,
                color: etatConfig.couleur
              }}
            >
              {etatConfig.label}
            </span>
          </div>
        </div>
        
        {/* Indicateur visuel au survol */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </Link>
  )
}