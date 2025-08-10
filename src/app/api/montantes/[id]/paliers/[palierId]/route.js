import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Mettre à jour le statut d'un palier
export async function PUT(request, { params }) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { id: montanteId, palierId } = params;
    const data = await request.json();
    
    // Récupérer le palier avec sa montante
    const palier = await prisma.palier.findUnique({
      where: { id: parseInt(palierId) },
      include: {
        montante: {
          include: {
            paliers: {
              orderBy: { numero: 'asc' }
            }
          }
        }
      }
    });
    
    if (!palier || palier.montanteId !== parseInt(montanteId)) {
      return NextResponse.json(
        { error: 'Palier non trouvé' },
        { status: 404 }
      );
    }
    
    // Mettre à jour le statut du palier
    const palierMisAJour = await prisma.palier.update({
      where: { id: parseInt(palierId) },
      data: {
        statut: data.status,
        dateResultat: new Date()
      }
    });
    
    // Si le palier est perdu, la montante est perdue
    if (data.status === 'PERDU') {
      await prisma.montante.update({
        where: { id: parseInt(montanteId) },
        data: {
          statut: 'PERDUE',
          dateFin: new Date(),
          gainFinal: -palier.montante.miseInitiale
        }
      });
      
      // Ajouter à l'historique des transactions
      await prisma.transaction.create({
        data: {
          montant: -palier.montante.miseInitiale,
          description: `Montante n°${montanteId} perdue`,
          type: 'MONTANTE_LOSS',
          montanteId: parseInt(montanteId)
        }
      });
    }
    
    // Si le palier est gagné, vérifier si l'objectif est atteint
    if (data.status === 'GAGNE') {
      const dernierGainPotentiel = palier.gainPotentiel;
      const multiplicateur = parseInt(palier.montante.objectif.slice(1)); // X2 -> 2, X3 -> 3, etc.
      const objectifAtteint = dernierGainPotentiel >= (palier.montante.miseInitiale * multiplicateur);
      
      if (objectifAtteint) {
        await prisma.montante.update({
          where: { id: parseInt(montanteId) },
          data: {
            statut: 'GAGNEE',
            dateFin: new Date(),
            gainFinal: dernierGainPotentiel - palier.montante.miseInitiale
          }
        });
        
        // Ajouter à l'historique des transactions
        await prisma.transaction.create({
          data: {
            montant: dernierGainPotentiel - palier.montante.miseInitiale,
            description: `Montante n°${montanteId} gagnée (objectif ${palier.montante.objectif} atteint)`,
            type: 'MONTANTE_WIN',
            montanteId: parseInt(montanteId)
          }
        });
      }
    }
    
    return NextResponse.json(palierMisAJour);
  } catch (error) {
    console.error('Erreur PUT palier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du palier' },
      { status: 500 }
    );
  }
}

// Supprimer un palier
export async function DELETE(request, { params }) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { id: montanteId, palierId } = params;
    
    // Vérifier que le palier appartient bien à la montante
    const palier = await prisma.palier.findUnique({
      where: { id: parseInt(palierId) }
    });
    
    if (!palier || palier.montanteId !== parseInt(montanteId)) {
      return NextResponse.json(
        { error: 'Palier non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le palier
    await prisma.palier.delete({
      where: { id: parseInt(palierId) }
    });
    
    // Réorganiser les numéros des paliers restants
    const paliersRestants = await prisma.palier.findMany({
      where: { montanteId: parseInt(montanteId) },
      orderBy: { numero: 'asc' }
    });
    
    // Mettre à jour les numéros
    for (let i = 0; i < paliersRestants.length; i++) {
      await prisma.palier.update({
        where: { id: paliersRestants[i].id },
        data: { numero: i + 1 }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE palier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du palier' },
      { status: 500 }
    );
  }
}