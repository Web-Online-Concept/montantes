import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma' // Commenté pour l'instant
import { isAuthenticated } from '@/lib/auth'

// Récupérer tous les bookmakers
export async function GET() {
  try {
    // Pour l'instant, on retourne des données en dur
    // On utilisera Prisma quand la DB sera configurée
    const bookmakers = [
      { id: '1', nom: 'Stake', code: 'STAKE', ordre: 1, actif: true },
      { id: '2', nom: 'PS3838', code: 'PS3838', ordre: 2, actif: true },
      { id: '3', nom: 'Winamax', code: 'WINA', ordre: 3, actif: true },
      { id: '4', nom: 'Betclic', code: 'BETC', ordre: 4, actif: true },
      { id: '5', nom: 'Paris Sportifs En Ligne', code: 'PSEL', ordre: 5, actif: true },
      { id: '6', nom: 'Unibet', code: 'UNI', ordre: 6, actif: true },
    ]
    return NextResponse.json(bookmakers)
  } catch (error) {
    console.error('Erreur GET bookmakers:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bookmakers' },
      { status: 500 }
    )
  }
}

// Créer un nouveau bookmaker (admin seulement)
export async function POST(request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Pour l'instant, on simule la création
    const newBookmaker = {
      id: Date.now().toString(),
      nom: data.nom,
      code: data.code,
      ordre: data.ordre || 0,
      actif: data.actif !== false
    }
    
    return NextResponse.json(newBookmaker)
  } catch (error) {
    console.error('Erreur POST bookmaker:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du bookmaker' },
      { status: 500 }
    )
  }
}

// Mettre à jour un bookmaker (admin seulement)
export async function PUT(request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Pour l'instant, on simule la mise à jour
    const updatedBookmaker = {
      id: data.id,
      nom: data.nom,
      code: data.code,
      ordre: data.ordre,
      actif: data.actif
    }
    
    return NextResponse.json(updatedBookmaker)
  } catch (error) {
    console.error('Erreur PUT bookmaker:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du bookmaker' },
      { status: 500 }
    )
  }
}