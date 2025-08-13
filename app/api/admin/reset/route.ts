import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Réinitialiser toutes les données
    await prisma.$transaction([
      prisma.historiqueBankroll.deleteMany(),
      prisma.palier.deleteMany(),
      prisma.montante.deleteMany(),
    ])
    
    // Réinitialiser les settings (bankroll)
    const settings = await prisma.settings.findFirst()
    if (settings) {
      await prisma.settings.update({
        where: { id: settings.id },
        data: {
          bankrollActuelle: 0,
          bankrollInitiale: 0,
          bankrollDisponible: 0
        }
      })
    }
    
    return NextResponse.json({ 
      message: 'Base de données réinitialisée avec succès',
      success: true 
    })
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    )
  }
}