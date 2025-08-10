import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Calculer la bankroll actuelle
async function calculateCurrentBankroll() {
  const result = await prisma.transaction.aggregate({
    _sum: {
      montant: true
    }
  });
  return result._sum.montant || 0;
}

// Récupérer l'historique de la bankroll (public en lecture)
export async function GET() {
  try {
    const currentBankroll = await calculateCurrentBankroll();
    
    const history = await prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        montante: {
          select: {
            id: true,
            miseInitiale: true,
            objectif: true,
            statut: true
          }
        }
      }
    });
    
    return NextResponse.json({
      current: currentBankroll,
      history: history
    });
  } catch (error) {
    console.error('Erreur GET bankroll:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la bankroll' },
      { status: 500 }
    );
  }
}

// Ajouter une entrée à la bankroll (admin seulement)
export async function POST(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validation
    if (typeof data.montant !== 'number' || !data.description) {
      return NextResponse.json(
        { error: 'Montant et description requis' },
        { status: 400 }
      );
    }
    
    // Créer l'entrée
    const nouvelleEntree = await prisma.transaction.create({
      data: {
        montant: data.montant,
        description: data.description,
        type: data.type || 'MANUAL', // MANUAL, MONTANTE_WIN, MONTANTE_LOSS
        montanteId: data.montanteId || null
      }
    });
    
    const newBankroll = await calculateCurrentBankroll();
    
    return NextResponse.json({
      entry: nouvelleEntree,
      newBankroll: newBankroll
    });
  } catch (error) {
    console.error('Erreur POST bankroll:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout à la bankroll' },
      { status: 500 }
    );
  }
}