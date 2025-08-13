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
    
    // Récupérer la bankroll initiale des settings
    const settings = await prisma.settings.findFirst()
    // La variable bankrollInitiale n'est pas utilisée car on ne réinitialise pas les settings
    
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