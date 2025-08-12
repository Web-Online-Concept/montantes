import { PrismaClient } from '@prisma/client'

// Évite de créer plusieurs instances de Prisma en développement
// (à cause du hot reload de Next.js)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Fonctions utilitaires pour les calculs récurrents

/**
 * Calcule la progression d'une montante
 */
export function calculerProgression(miseInitiale: number, gainActuel: number): number {
  if (miseInitiale === 0) return 0
  return ((gainActuel - miseInitiale) / miseInitiale) * 100
}

/**
 * Vérifie si l'objectif est atteint
 */
export function verifierObjectifAtteint(
  miseInitiale: number, 
  gainActuel: number, 
  objectif: 'X2' | 'X3' | 'X5' | 'X10'
): boolean {
  const multiplicateurs = {
    X2: 2,
    X3: 3,
    X5: 5,
    X10: 10
  }
  
  return gainActuel >= miseInitiale * multiplicateurs[objectif]
}

/**
 * Calcule le ROI (Return on Investment)
 */
export function calculerROI(miseInitiale: number, gainFinal: number | null): number {
  if (!gainFinal || miseInitiale === 0) return 0
  return ((gainFinal - miseInitiale) / miseInitiale) * 100
}

/**
 * Calcule la durée en jours entre deux dates
 */
export function calculerDureeJours(dateDebut: Date, dateFin: Date | null): number | null {
  if (!dateFin) return null
  const diff = dateFin.getTime() - dateDebut.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Calcule les statistiques globales
 */
export async function calculerStatsGlobales() {
  const montantes = await prisma.montante.findMany()
  const settings = await prisma.settings.findFirst()
  
  const stats = {
    nombreTotal: montantes.length,
    enCours: montantes.filter(m => m.etat === 'EN_COURS').length,
    reussies: montantes.filter(m => m.etat === 'REUSSI').length,
    perdues: montantes.filter(m => m.etat === 'PERDU').length,
    arretees: montantes.filter(m => m.etat === 'ARRETEE').length,
    gainsTotaux: 0,
    pertesTotales: 0,
    misesEngagees: 0
  }
  
  montantes.forEach(montante => {
    if (montante.etat === 'EN_COURS') {
      stats.misesEngagees += montante.miseEngagee
    } else if (montante.etat === 'REUSSI' || montante.etat === 'ARRETEE') {
      if (montante.gainFinal) {
        stats.gainsTotaux += (montante.gainFinal - montante.miseInitiale)
      }
    } else if (montante.etat === 'PERDU') {
      stats.pertesTotales += montante.miseInitiale
    }
  })
  
  const bilanTotal = stats.gainsTotaux - stats.pertesTotales
  const tauxReussite = stats.nombreTotal > 0 
    ? ((stats.reussies + stats.arretees) / stats.nombreTotal) * 100 
    : 0
    
  const miseTotale = montantes.reduce((acc, m) => acc + m.miseInitiale, 0)
  const roi = miseTotale > 0 ? (bilanTotal / miseTotale) * 100 : 0
  
  return {
    ...stats,
    bilanTotal,
    tauxReussite,
    roi,
    bankrollActuelle: settings?.bankrollActuelle || 0,
    bankrollDisponible: settings?.bankrollDisponible || 0
  }
}

/**
 * Met à jour la bankroll après une opération
 */
export async function mettreAJourBankroll(params: {
  typeOperation: 'DEPOT' | 'RETRAIT' | 'GAIN_MONTANTE' | 'PERTE_MONTANTE'
  montant: number
  montanteId?: string
  description?: string
}) {
  const { typeOperation, montant, montanteId, description } = params
  
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    throw new Error('Settings non configurés')
  }
  
  const montantAvant = settings.bankrollActuelle
  let montantApres = montantAvant
  let variation = 0
  
  switch (typeOperation) {
    case 'DEPOT':
      montantApres = montantAvant + montant
      variation = montant
      break
    case 'RETRAIT':
      montantApres = montantAvant - montant
      variation = -montant
      break
    case 'GAIN_MONTANTE':
      montantApres = montantAvant + montant
      variation = montant
      break
    case 'PERTE_MONTANTE':
      montantApres = montantAvant - montant
      variation = -montant
      break
  }
  
  // Créer l'historique avec le champ montant
  await prisma.historiqueBankroll.create({
    data: {
      montant: Math.abs(montant), // Montant toujours positif
      montantAvant,
      montantApres,
      typeOperation,
      montanteId,
      description: description || `${typeOperation} - ${new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(Math.abs(montant))}`
    }
  })
  
  // Mettre à jour les settings
  await prisma.settings.update({
    where: { id: settings.id },
    data: {
      bankrollActuelle: montantApres,
      bankrollDisponible: await calculerBankrollDisponible()
    }
  })
  
  return montantApres
}

/**
 * Calcule la bankroll disponible (actuelle - mises engagées)
 */
async function calculerBankrollDisponible(): Promise<number> {
  const settings = await prisma.settings.findFirst()
  if (!settings) return 0
  
  const montantesEnCours = await prisma.montante.findMany({
    where: { etat: 'EN_COURS' }
  })
  
  const misesEngagees = montantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
  
  return Math.max(0, settings.bankrollActuelle - misesEngagees)
}