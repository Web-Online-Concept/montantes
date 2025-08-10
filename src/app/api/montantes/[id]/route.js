import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// Récupérer une montante spécifique
export async function GET(request, { params }) {
  try {
    const montante = await prisma.montante.findUnique({
      where: { id: params.id },
      include: {
        paliers: {
          include: {
            bookmaker: true
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(montante)
  } catch (error) {
    console.error('Erreur GET montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la montante' },
      { status: 500 }
    )
  }
}

// Supprimer une montante
export async function DELETE(request, { params }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Vérifier que la montante existe
    const montante = await prisma.montante.findUnique({
      where: { id: params.id }
    })
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    // Supprimer la montante (les paliers seront supprimés automatiquement grâce à onDelete: Cascade)
    await prisma.montante.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la montante' },
      { status: 500 }
    )
  }
}