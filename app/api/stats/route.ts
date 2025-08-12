import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StatsGlobales } from '@/types'

export async function GET() {
  try {
    // Récupérer toutes les montantes
    const montantes = await prisma.montante.findMany({
      include: {
        paliers: {
          orderBy: { numeroPalier: 'desc' },
          take: 1
        }
      }
    })
    
    // Récupérer les settings pour la bankroll
    const settings = await prisma.settings.findFirst()
    
    // Calculer les stats
    const stats: StatsGlobales = {
      nombreTotal: montantes.length,
      enCours: 0,
      reussies: 0,
      perdues: 0,
      arretees: 0,
      tauxReussite: 0,
      roi: 0,
      gainsTotaux: 0,
      pertesTotales: 0,
      bilanTotal: 0,
      misesEngagees: 0
    }
    
    // Compter par état et calculer gains/pertes
    montantes.forEach(montante => {
      switch (montante.etat) {
        case 'EN_COURS':
          stats.enCours++
          stats.misesEngagees += montante.miseEngagee
          break
        case 'REUSSI':
          stats.reussies++
          if (montante.gainFinal) {
            const gain = montante.gainFinal - montante.miseInitiale
            stats.gainsTotaux += gain
          }
          break
        case 'PERDU':
          stats.perdues++
          stats.pertesTotales += montante.miseInitiale
          break
        case 'ARRETEE':
          stats.arretees++
          if (montante.gainFinal && montante.gainFinal > montante.miseInitiale) {
            const gain = montante.gainFinal - montante.miseInitiale
            stats.gainsTotaux += gain
          } else if (montante.gainFinal && montante.gainFinal < montante.miseInitiale) {
            const perte = montante.miseInitiale - montante.gainFinal
            stats.pertesTotales += perte
          }
          break
      }
    })
    
    // Calculer le bilan
    stats.bilanTotal = stats.gainsTotaux - stats.pertesTotales
    
    // Calculer le taux de réussite
    if (stats.nombreTotal > 0) {
      const montantesTerminees = stats.reussies + stats.perdues + stats.arretees
      if (montantesTerminees > 0) {
        stats.tauxReussite = ((stats.reussies + stats.arretees) / montantesTerminees) * 100
      }
    }
    
    // Calculer le ROI
    const miseTotale = montantes.reduce((acc, m) => {
      // Ne compter que les montantes terminées
      if (m.etat !== 'EN_COURS') {
        return acc + m.miseInitiale
      }
      return acc
    }, 0)
    
    if (miseTotale > 0) {
      stats.roi = (stats.bilanTotal / miseTotale) * 100
    }
    
    // Ajouter les infos de bankroll si disponibles
    if (settings) {
      return NextResponse.json({
        ...stats,
        bankrollInitiale: settings.bankrollInitiale,
        bankrollActuelle: settings.bankrollActuelle,
        bankrollDisponible: settings.bankrollDisponible
      })
    }
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Erreur API stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors du calcul des statistiques' },
      { status: 500 }
    )
  }
}

// GET avec paramètres pour des stats spécifiques
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { periode, type } = body
    
    // Stats par période (30j, 90j, tout)
    let dateDebut: Date | undefined
    if (periode === '30j') {
      dateDebut = new Date()
      dateDebut.setDate(dateDebut.getDate() - 30)
    } else if (periode === '90j') {
      dateDebut = new Date()
      dateDebut.setDate(dateDebut.getDate() - 90)
    }
    
    const whereClause = dateDebut ? {
      dateDebut: { gte: dateDebut }
    } : {}
    
    // Stats détaillées par type
    if (type === 'progression') {
      // Evolution de la bankroll
      const historique = await prisma.historiqueBankroll.findMany({
        where: dateDebut ? {
          createdAt: { gte: dateDebut }
        } : {},
        orderBy: { createdAt: 'asc' },
        select: {
          montantApres: true,
          createdAt: true,
          typeOperation: true
        }
      })
      
      return NextResponse.json({ historique })
      
    } else if (type === 'montantes') {
      // Stats par montante
      const montantes = await prisma.montante.findMany({
        where: whereClause,
        include: {
          paliers: true
        }
      })
      
      const statsMontantes = montantes.map(m => ({
        id: m.id,
        nom: m.nom,
        etat: m.etat,
        roi: m.roi,
        nombrePaliers: m.paliers.length,
        duree: m.dureeJours
      }))
      
      return NextResponse.json({ montantes: statsMontantes })
    }
    
    // Par défaut, retourner les stats globales
    return GET()
    
  } catch (error) {
    console.error('Erreur API stats POST:', error)
    return NextResponse.json(
      { error: 'Erreur lors du calcul des statistiques' },
      { status: 500 }
    )
  }
}