import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { montant } = await request.json()

    // Validation
    if (!montant || montant <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Récupérer les settings actuels
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings non configurés' },
        { status: 500 }
      )
    }

    // Calculer la différence pour ajuster la bankroll actuelle
    const difference = montant - settings.bankrollInitiale
    
    // Mettre à jour les settings
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        bankrollInitiale: montant,
        bankrollActuelle: settings.bankrollActuelle + difference,
        bankrollDisponible: settings.bankrollDisponible + difference
      }
    })

    // Créer une entrée dans l'historique
    await prisma.historiqueBankroll.create({
      data: {
        montantAvant: settings.bankrollActuelle,
        montantApres: settings.bankrollActuelle + difference,
        montant: difference,
        typeOperation: difference > 0 ? 'DEPOT' : 'RETRAIT',
        description: `Ajustement de la bankroll initiale (${settings.bankrollInitiale}€ → ${montant}€)`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Bankroll initiale modifiée avec succès',
      nouvelleBankrollInitiale: montant,
      nouvelleBankrollActuelle: settings.bankrollActuelle + difference
    })

  } catch (error) {
    console.error('Erreur modification bankroll initiale:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la bankroll initiale' },
      { status: 500 }
    )
  }
}