import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// Récupérer toutes les montantes (public en lecture)
export async function GET() {
  try {
    const montantes = await prisma.montante.findMany({
      include: {
        paliers: {
          include: {
            bookmaker: true
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(montantes)
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
    const nouvelleMontante = await prisma.montante.create({
      data: {
        miseInitiale: parseFloat(data.miseInitiale),
        objectif: data.objectif,
        status: 'EN_COURS',
        miseActuelle: parseFloat(data.miseInitiale),
        gainFinal: 0,
        dateDebut: new Date(),
        dateFin: null
      },
      include: {
        paliers: true
      }
    })
    
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
    
    // Vérifier que la montante existe
    const montanteExistante = await prisma.montante.findUnique({
      where: { id: data.id }
    })
    
    if (!montanteExistante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    // Mise à jour de la montante
    const montanteMiseAJour = await prisma.montante.update({
      where: { id: data.id },
      data: {
        status: data.status || montanteExistante.status,
        gainFinal: data.gainFinal !== undefined ? data.gainFinal : montanteExistante.gainFinal,
        miseActuelle: data.miseActuelle || montanteExistante.miseActuelle,
        dateFin: data.status && data.status !== 'EN_COURS' ? new Date() : null
      },
      include: {
        paliers: {
          include: {
            bookmaker: true
          }
        }
      }
    })
    
    return NextResponse.json(montanteMiseAJour)
  } catch (error) {
    console.error('Erreur PUT montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la montante' },
      { status: 500 }
    )
  }
}