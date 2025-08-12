// Re-export des types Prisma pour simplifier les imports
export type {
  Montante,
  Palier,
  HistoriqueBankroll,
  Settings,
  Admin,
  Objectif,
  EtatMontante,
  TypeOperation,
  TypePari,
  StatutPalier
} from '@prisma/client'

// Types étendus avec infos calculées
export interface MontanteAvecNumero {
  id: string
  numero: number
  numeroAffichage: number // Numéro recalculé pour l'affichage
  nom: string
  miseInitiale: number
  miseEngagee: number
  gainActuel: number | null
  gainFinal: number | null
  objectif: Objectif
  progression: number
  roi: number
  etat: EtatMontante
  dureeJours: number
  dateDebut: Date
  dateFin: Date | null
  createdAt: Date
  updatedAt: Date
  paliers?: PalierAvecInfos[]
}

export interface PalierAvecInfos {
  id: string
  montanteId: string
  numeroPalier: number
  mise: number
  cote: number
  typePari: TypePari
  detailsMatchs: DetailsMatchs
  gain: number | null
  progressionTotale: number
  statut: StatutPalier
  dateMatch: Date
  createdAt: Date
  updatedAt: Date
}

// Structure pour les détails des matchs
export interface DetailsMatchs {
  matchs: DetailMatch[]
}

export interface DetailMatch {
  sport: string
  equipe1: string
  equipe2: string
  competition: string
  pronostic: string
  cote: number
  dateMatch?: string
  statut?: 'EN_ATTENTE' | 'GAGNE' | 'PERDU' | 'ANNULE'
}

// Configuration des sports disponibles
export const SPORTS_ICONS: Record<string, string> = {
  football: '⚽',
  tennis: '🎾',
  basketball: '🏀',
  volleyball: '🏐',
  rugby: '🏉',
  hockey: '🏒',
  handball: '🤾',
  baseball: '⚾',
  boxe: '🥊',
  mma: '🥋',
  cyclisme: '🚴',
  golf: '⛳',
  athletisme: '🏃',
  natation: '🏊',
  ski: '⛷️',
  formule1: '🏎️',
  esports: '🎮',
  cricket: '🏏',
  snooker: '🎱',
  flechettes: '🎯',
  autres: '🎲'
}

// Configuration des objectifs
export const OBJECTIFS_CONFIG = {
  X2: { label: 'x2', multiplicateur: 2, couleur: '#10b981' },
  X3: { label: 'x3', multiplicateur: 3, couleur: '#3b82f6' },
  X5: { label: 'x5', multiplicateur: 5, couleur: '#8b5cf6' },
  X10: { label: 'x10', multiplicateur: 10, couleur: '#ef4444' }
} as const

// Configuration des états (sans ARRETEE)
export const ETATS_CONFIG = {
  EN_COURS: { label: 'En cours', couleur: '#3b82f6', emoji: '⏳' },
  REUSSI: { label: 'Gagnée', couleur: '#10b981', emoji: '✅' },
  PERDU: { label: 'Perdue', couleur: '#ef4444', emoji: '❌' }
} as const

// Configuration des statuts de palier
export const STATUTS_PALIER_CONFIG = {
  EN_ATTENTE: { label: 'En attente', couleur: '#fbbf24', emoji: '⏳' },
  GAGNE: { label: 'Gagné', couleur: '#10b981', emoji: '✓' },
  PERDU: { label: 'Perdu', couleur: '#ef4444', emoji: '✗' },
  ANNULE: { label: 'Annulé', couleur: '#6b7280', emoji: '↺' }
} as const

// Configuration des statuts de match (pour les combinés)
export const STATUTS_MATCH_CONFIG = {
  EN_ATTENTE: { label: 'En attente', couleur: '#fbbf24', emoji: '⏳' },
  GAGNE: { label: 'Gagné', couleur: '#10b981', emoji: '✓' },
  PERDU: { label: 'Perdu', couleur: '#ef4444', emoji: '✗' },
  ANNULE: { label: 'Annulé', couleur: '#6b7280', emoji: '↺' }
} as const

// Types pour les stats globales
export interface StatsGlobales {
  nombreTotal: number
  enCours: number
  reussies: number
  perdues: number
  tauxReussite: number
  roi: number
  gainsTotaux: number
  pertesTotales: number
  bilanTotal: number
  misesEngagees: number
  bankrollInitiale?: number
  bankrollActuelle?: number
  bankrollDisponible?: number
}

// Types pour les formulaires
export interface FormMontante {
  nom: string
  miseInitiale: number
  objectif: Objectif
}

export interface FormPalier {
  typePari: TypePari
  matchs: DetailMatch[]
  cote: number
  dateMatch: string
  statut?: StatutPalier
}

// Types pour les filtres
export type FiltreMontante = 'toutes' | EtatMontante
export type TriMontante = 'recent' | 'ancien' | 'progression' | 'mise'
export type PeriodeFiltre = '7j' | '30j' | '90j' | 'tout'

// Constantes de validation
export const VALIDATION = {
  MISE_MIN: 1,
  MISE_MAX: 100000,
  COTE_MIN: 1.01,
  COTE_MAX: 15.00,
  NOM_MIN_LENGTH: 3,
  NOM_MAX_LENGTH: 50,
  NOM_MONTANTE_MAX_LENGTH: 50,
  BANKROLL_POURCENTAGE_MAX: 10,
  PASSWORD_MIN_LENGTH: 8
} as const

// Fonctions de formatage
export const formatEuro = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(montant)
}

export const formatPourcentage = (valeur: number): string => {
  return `${valeur >= 0 ? '+' : ''}${valeur.toFixed(2)}%`
}

export const formatCote = (cote: number): string => {
  return cote.toFixed(2)
}

// Fonction pour calculer la cote finale d'un combiné selon les statuts des matchs
export const calculerCoteFinale = (matchs: DetailMatch[]): number => {
  return matchs.reduce((coteFinale, match) => {
    // Si le match est annulé, on ne compte pas sa cote (comme si cote = 1)
    if (match.statut === 'ANNULE') return coteFinale
    // Si le match est perdu, le combiné est perdu (cote = 0)
    if (match.statut === 'PERDU') return 0
    // Si le match est gagné ou en attente, on multiplie par sa cote
    return coteFinale * match.cote
  }, 1)
}