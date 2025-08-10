import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// Récupérer tous les bookmakers
export async function GET() {
  try {
    const bookmakers = await prisma.bookmaker.findMany({
      orderBy: { ordre: 'asc' },
      where: { actif: true }
    })
    
    // Si aucun bookmaker, on initialise avec les données par défaut
    if (bookmakers.length === 0) {
      const defaultBookmakers = [
        { nom: 'Stake', code: 'STAKE', ordre: 1, actif: true },
        { nom: 'PS3838', code: 'PS3838', ordre: 2, actif: true },
        { nom: 'Winamax', code: 'WINA', ordre: 3, actif: true },
        { nom: 'Betclic', code: 'BETC', ordre: 4, actif: true },
        { nom: 'Paris Sportifs En Ligne', code: 'PSEL', ordre: 5, actif: true },
        { nom: 'Unibet', code: 'UNI', ordre: 6, actif: true },
      ]
      
      await prisma.bookmaker.createMany({ data: defaultBookmakers })
      
      return NextResponse.json(
        await prisma.bookmaker.findMany({ orderBy: { ordre: 'asc' } })
      )
    }
    
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
    
    const newBookmaker = await prisma.bookmaker.create({
      data: {
        nom: data.nom,
        code: data.code,
        ordre: data.ordre || 0,
        actif: data.actif !== false
      }
    })
    
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
    
    const updatedBookmaker = await prisma.bookmaker.update({
      where: { id: data.id },
      data: {
        nom: data.nom,
        code: data.code,
        ordre: data.ordre,
        actif: data.actif
      }
    })
    
    return NextResponse.json(updatedBookmaker)
  } catch (error) {
    console.error('Erreur PUT bookmaker:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du bookmaker' },
      { status: 500 }
    )
  }
}