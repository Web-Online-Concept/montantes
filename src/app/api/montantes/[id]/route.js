import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer une montante spécifique
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    const montante = await prisma.montante.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookmaker: true,
        paliers: {
          orderBy: {
            numero: 'asc'
          }
        }
      }
    });
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ montante });
  } catch (error) {
    console.error('Erreur lors de la récupération de la montante:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la montante' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une montante
export async function DELETE(req, { params }) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { id } = params;
    
    // Récupérer la montante pour vérifier son état
    const montante = await prisma.montante.findUnique({
      where: { id: parseInt(id) },
      include: {
        paliers: true
      }
    });
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      );
    }
    
    // Si la montante a des paliers joués (gagnés ou perdus), on ne peut pas la supprimer sans impact
    const hasPlayedPaliers = montante.paliers.some(p => p.statut !== 'en_attente');
    
    if (hasPlayedPaliers) {
      // Si des paliers ont été joués, on doit gérer l'impact sur la bankroll
      // On clôture la montante au lieu de la supprimer
      return NextResponse.json(
        { error: 'Cette montante a des paliers joués. Utilisez la fonction de clôture.' },
        { status: 400 }
      );
    }
    
    // Si aucun palier n'a été joué, on peut supprimer sans impact sur la bankroll
    // Supprimer d'abord les paliers associés
    await prisma.palier.deleteMany({
      where: { montanteId: parseInt(id) }
    });
    
    // Supprimer les transactions éventuelles (il ne devrait pas y en avoir)
    await prisma.transaction.deleteMany({
      where: { montanteId: parseInt(id) }
    });
    
    // Puis supprimer la montante
    await prisma.montante.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Montante supprimée sans impact sur la bankroll'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la montante:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la montante' },
      { status: 500 }
    );
  }
}