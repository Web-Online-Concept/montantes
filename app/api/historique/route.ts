import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'tout'
    const periode = searchParams.get('periode') || '30j'
    
    // Calculer la date de début selon la période
    let dateDebut: Date | undefined
    const maintenant = new Date()
    
    switch (periode) {
      case '7j':
        dateDebut = new Date(maintenant)
        dateDebut.setDate(dateDebut.getDate() - 7)
        break
      case '30j':
        dateDebut = new Date(maintenant)
        dateDebut.setDate(dateDebut.getDate() - 30)
        break
      case '90j':
        dateDebut = new Date(maintenant)
        dateDebut.setDate(dateDebut.getDate() - 90)
        break
      case 'tout':
      default:
        dateDebut = undefined
    }
    
    // Construire les conditions de filtre
    const whereClause: any = {}
    
    if (dateDebut) {
      whereClause.createdAt = { gte: dateDebut }
    }
    
    if (type === 'depot_retrait') {
      whereClause.typeOperation = { in: ['DEPOT', 'RETRAIT'] }
    } else if (type === 'montantes') {
      whereClause.typeOperation = { in: ['GAIN_MONTANTE', 'PERTE_MONTANTE'] }
    }
    
    // Récupérer l'historique
    const historique = await prisma.historiqueBankroll.findMany({
      where: whereClause,
      include: {
        montante: {
          select: {
            id: true,
            nom: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Récupérer les settings pour la bankroll initiale
    const settings = await prisma.settings.findFirst()
    
    // Calculer les statistiques
    const stats = {
      totalDepots: 0,
      totalRetraits: 0,
      totalGains: 0,
      totalPertes: 0,
      variationTotale: 0,
      bankrollInitiale: settings?.bankrollInitiale || 0,
      bankrollActuelle: settings?.bankrollActuelle || 0
    }
    
    historique.forEach(item => {
      switch (item.typeOperation) {
        case 'DEPOT':
          stats.totalDepots += Math.abs(item.montant)
          break
        case 'RETRAIT':
          stats.totalRetraits += Math.abs(item.montant)
          break
        case 'GAIN_MONTANTE':
          stats.totalGains += Math.abs(item.montant)
          break
        case 'PERTE_MONTANTE':
          stats.totalPertes += Math.abs(item.montant)
          break
      }
    })
    
    // Calculer la variation totale
    stats.variationTotale = stats.bankrollActuelle - stats.bankrollInitiale
    
    return NextResponse.json({
      historique,
      stats
    })
    
  } catch (error) {
    console.error('Erreur API historique:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    )
  }
}

// POST pour ajouter une entrée manuelle (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { typeOperation, montant, description } = body
    
    // Validation
    if (!typeOperation || !montant || montant <= 0) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }
    
    // Vérifier que c'est bien un dépôt ou retrait (pas une opération montante)
    if (!['DEPOT', 'RETRAIT'].includes(typeOperation)) {
      return NextResponse.json(
        { error: 'Type d\'opération invalide' },
        { status: 400 }
      )
    }
    
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings non configurés' },
        { status: 500 }
      )
    }
    
    const montantAvant = settings.bankrollActuelle
    let montantApres = montantAvant
    let bankrollInitialeApres = settings.bankrollInitiale
    
    if (typeOperation === 'DEPOT') {
      montantApres = montantAvant + montant
      
      // Si c'est le premier dépôt (bankroll initiale = 0), définir la bankroll initiale
      if (settings.bankrollInitiale === 0 && settings.bankrollActuelle === 0) {
        bankrollInitialeApres = montant
      }
    } else if (typeOperation === 'RETRAIT') {
      // Vérifier qu'on a assez de bankroll disponible
      if (montant > settings.bankrollDisponible) {
        return NextResponse.json(
          { error: 'Montant supérieur à la bankroll disponible' },
          { status: 400 }
        )
      }
      montantApres = montantAvant - montant
    }
    
    // Créer l'entrée d'historique
    const nouvelleEntree = await prisma.historiqueBankroll.create({
      data: {
        typeOperation,
        montant: typeOperation === 'DEPOT' ? montant : -montant,
        montantAvant,
        montantApres,
        description: description || `${typeOperation} manuel`
      }
    })
    
    // Mettre à jour la bankroll
    const montantesEnCours = await prisma.montante.findMany({
      where: { etat: 'EN_COURS' },
      select: { miseEngagee: true }
    })
    
    const misesEngagees = montantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
    
    // Préparer les données de mise à jour
    const updateData: any = {
      bankrollActuelle: montantApres,
      bankrollDisponible: montantApres - misesEngagees
    }
    
    // Si la bankroll initiale a changé, la mettre à jour aussi
    if (bankrollInitialeApres !== settings.bankrollInitiale) {
      updateData.bankrollInitiale = bankrollInitialeApres
    }
    
    await prisma.settings.update({
      where: { id: settings.id },
      data: updateData
    })
    
    return NextResponse.json({
      success: true,
      entree: nouvelleEntree,
      nouvelleBankroll: montantApres,
      bankrollInitiale: bankrollInitialeApres,
      premierDepot: bankrollInitialeApres !== settings.bankrollInitiale
    })
    
  } catch (error) {
    console.error('Erreur création historique:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'entrée' },
      { status: 500 }
    )
  }
}