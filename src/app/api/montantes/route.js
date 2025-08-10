import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer toutes les montantes
export async function GET() {
  try {
    const montantes = await prisma.montante.findMany({
      include: {
        bookmaker: true,
        paliers: {
          orderBy: {
            numero: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ montantes });
  } catch (error) {
    console.error('Erreur lors de la récupération des montantes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des montantes' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle montante
export async function POST(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Créer la montante SANS palier
    const nouvelleMontante = await prisma.montante.create({
      data: {
        bookmakerId: data.bookmakerId || 1, // Bookmaker par défaut si non spécifié
        miseInitiale: parseFloat(data.miseInitiale),
        objectif: data.objectif,
        statut: 'en_cours',
        palierActuel: 0 // Pas de palier au début
      },
      include: {
        bookmaker: true,
        paliers: true
      }
    });
    
    return NextResponse.json({ montante: nouvelleMontante });
  } catch (error) {
    console.error('Erreur lors de la création de la montante:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la montante' },
      { status: 500 }
    );
  }
}