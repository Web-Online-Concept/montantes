import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma' // Commenté pour l'instant
import { isAuthenticated } from '@/lib/auth'

// Données en mémoire pour l'instant (utilisation de global pour partager entre les routes)
global.montantes = global.montantes || []
global.montanteIdCounter = global.montanteIdCounter || 1

// Récupérer toutes les montantes (public en lecture)
export async function GET() {
  try {
    // Pour l'instant, on retourne les données en mémoire avec les relations
    const montantesAvecRelations = global.montantes.map(montante => ({
      ...montante,
      paliers: montante.paliers || []
    }))
    return NextResponse.json(montantesAvecRelations)
  } catch (error) {
    console.error('Erreur GET montantes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des montantes' },
      { status: 500 }
    )
  }
}

// Créer une nouvelle montante (admin seulement)
export async function POST(request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Validation des données
    if (!data.miseInitiale || !data.objectif) {
      return NextResponse.json(
        { error: 'Mise initiale et objectif requis' },
        { status: 400 }
      )
    }
    
    // Création de la nouvelle montante
    const nouvelleMontante = {
      id: global.montanteIdCounter.toString(),
      miseInitiale: parseFloat(data.miseInitiale),
      objectif: data.objectif,
      status: 'EN_COURS',
      gainFinal: null,
      dateDebut: new Date().toISOString(),
      dateFin: null,
      paliers: []
    }
    
    global.montantes.push(nouvelleMontante)
    global.montanteIdCounter++
    
    // Simuler la mise à jour de la bankroll
    // TODO: Implémenter avec la vraie DB
    
    return NextResponse.json(nouvelleMontante)
  } catch (error) {
    console.error('Erreur POST montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la montante' },
      { status: 500 }
    )
  }
}

// Mettre à jour le statut d'une montante
export async function PUT(request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const montanteIndex = global.montantes.findIndex(m => m.id === data.id)
    
    if (montanteIndex === -1) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    // Mise à jour de la montante
    global.montantes[montanteIndex] = {
      ...global.montantes[montanteIndex],
      status: data.status,
      gainFinal: data.gainFinal || montantes[montanteIndex].gainFinal,
      dateFin: data.status !== 'EN_COURS' ? new Date().toISOString() : null
    }
    
    return NextResponse.json(global.montantes[montanteIndex])
  } catch (error) {
    console.error('Erreur PUT montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la montante' },
      { status: 500 }
    )
  }
}