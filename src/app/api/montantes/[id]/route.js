import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Import des données partagées avec l'API principale
// Pour l'instant on utilise une variable globale (à remplacer par la DB)
global.montantes = global.montantes || []

// Récupérer une montante spécifique
export async function GET(request, { params }) {
  try {
    const montante = global.montantes.find(m => m.id === params.id)
    
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
    const index = global.montantes.findIndex(m => m.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    // Supprimer la montante
    global.montantes.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la montante' },
      { status: 500 }
    )
  }
}