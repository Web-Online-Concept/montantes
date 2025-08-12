import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // 1. Récupérer les settings actuels
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings non trouvés' },
        { status: 404 }
      )
    }

    const bankrollInitiale = settings.bankrollInitiale

    // 2. Supprimer tous les paliers
    await prisma.palier.deleteMany()
    
    // 3. Supprimer toutes les montantes
    await prisma.montante.deleteMany()
    
    // 4. Supprimer tout l'historique
    await prisma.historiqueBankroll.deleteMany()
    
    // 5. Réinitialiser les settings
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        bankrollInitiale: 0,
        bankrollActuelle: 0,
        bankrollDisponible: 0
      }
    })
    
    // Pas d'entrée d'historique quand on remet à 0
    
    return NextResponse.json({
      success: true,
      message: 'Base de données réinitialisée avec succès',
      bankrollInitiale: 0
    })
    
  } catch (error) {
    console.error('Erreur réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    )
  }
}