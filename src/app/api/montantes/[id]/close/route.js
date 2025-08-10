import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST - Clôturer une montante
export async function POST(req, { params }) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    
    // Récupérer la montante avec ses paliers
    const montante = await prisma.montante.findUnique({
      where: { id: parseInt(id) },
      include: {
        paliers: {
          orderBy: { numero: 'asc' }
        }
      }
    });
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      );
    }
    
    if (montante.statut !== 'en_cours') {
      return NextResponse.json(
        { error: 'La montante n\'est pas en cours' },
        { status: 400 }
      );
    }
    
    // Calculer le gain final basé sur le dernier palier gagné
    let gainFinal = 0;
    if (body.statut === 'GAGNEE') {
      const dernierPalierGagne = montante.paliers
        .filter(p => p.statut === 'GAGNE')
        .pop();
      
      if (dernierPalierGagne) {
        gainFinal = dernierPalierGagne.gainPotentiel - montante.miseInitiale;
      }
    } else if (body.statut === 'PERDUE') {
      gainFinal = -montante.miseInitiale;
    }
    
    // Mettre à jour la montante
    const montanteMiseAJour = await prisma.montante.update({
      where: { id: parseInt(id) },
      data: {
        statut: body.statut,
        dateFin: new Date(),
        gainFinal: gainFinal
      }
    });
    
    // Créer une transaction dans l'historique
    const description = body.statut === 'GAGNEE' 
      ? `Montante n°${id} gagnée (objectif ${montante.objectif} atteint)`
      : `Montante n°${id} perdue`;
    
    await prisma.transaction.create({
      data: {
        montant: gainFinal,
        description: description,
        type: body.statut === 'GAGNEE' ? 'MONTANTE_WIN' : 'MONTANTE_LOSS',
        montanteId: parseInt(id)
      }
    });
    
    return NextResponse.json({ montante: montanteMiseAJour });
  } catch (error) {
    console.error('Erreur lors de la clôture de la montante:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la clôture de la montante' },
      { status: 500 }
    );
  }
}