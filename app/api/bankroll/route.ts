import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Récupérer les settings
    let settings = await prisma.settings.findFirst()
    
    // Si pas de settings, créer les valeurs par défaut
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          bankrollInitiale: 0,
          bankrollActuelle: 0,
          bankrollDisponible: 0
        }
      })
    }
    
    // Calculer la bankroll disponible (actuelle - mises engagées)
    const montantesEnCours = await prisma.montante.findMany({
      where: { etat: 'EN_COURS' },
      select: { miseEngagee: true }
    })
    
    const misesEngagees = montantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
    const bankrollDisponible = settings.bankrollActuelle - misesEngagees
    
    // Mettre à jour si différent
    if (bankrollDisponible !== settings.bankrollDisponible) {
      await prisma.settings.update({
        where: { id: settings.id },
        data: { bankrollDisponible }
      })
    }
    
    return NextResponse.json({
      bankrollInitiale: settings.bankrollInitiale,
      bankrollActuelle: settings.bankrollActuelle,
      bankrollDisponible: bankrollDisponible
    })
    
  } catch (error) {
    console.error('Erreur API bankroll:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la bankroll' },
      { status: 500 }
    )
  }
}

// POST pour mettre à jour la bankroll (admin only)
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
    
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings non configurés' },
        { status: 500 }
      )
    }
    
    const montantAvant = settings.bankrollActuelle
    let montantApres = montantAvant
    
    // Calculer le nouveau montant
    if (typeOperation === 'DEPOT') {
      montantApres = montantAvant + montant
    } else if (typeOperation === 'RETRAIT') {
      if (montant > settings.bankrollDisponible) {
        return NextResponse.json(
          { error: 'Montant supérieur à la bankroll disponible' },
          { status: 400 }
        )
      }
      montantApres = montantAvant - montant
    }
    
    // Créer l'historique
    await prisma.historiqueBankroll.create({
      data: {
        typeOperation,
        montant: typeOperation === 'DEPOT' ? montant : -montant,
        montantAvant,
        montantApres,
        description: description || `${typeOperation} - ${montant}€`
      }
    })
    
    // Mettre à jour les settings
    const montantesEnCours = await prisma.montante.findMany({
      where: { etat: 'EN_COURS' },
      select: { miseEngagee: true }
    })
    
    const misesEngagees = montantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
    
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        bankrollActuelle: montantApres,
        bankrollDisponible: montantApres - misesEngagees
      }
    })
    
    return NextResponse.json({
      success: true,
      bankrollActuelle: montantApres,
      bankrollDisponible: montantApres - misesEngagees
    })
    
  } catch (error) {
    console.error('Erreur mise à jour bankroll:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la bankroll' },
      { status: 500 }
    )
  }
}