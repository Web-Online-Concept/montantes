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
    
    // Supprimer d'abord les paliers associés
    await prisma.palier.deleteMany({
      where: { montanteId: parseInt(id) }
    });
    
    // Puis supprimer la montante
    await prisma.montante.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la montante:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la montante' },
      { status: 500 }
    );
  }
}