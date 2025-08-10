import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    const paliers = await prisma.palier.findMany({
      where: {
        montanteId: parseInt(id)
      },
      orderBy: {
        numero: 'asc'
      }
    });
    
    return NextResponse.json({ paliers });
  } catch (error) {
    console.error('Erreur lors de la récupération des paliers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paliers' },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Récupérer la montante
    const montante = await prisma.montante.findUnique({
      where: { id: parseInt(id) },
      include: { paliers: true }
    });
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      );
    }
    
    if (montante.statut !== 'en_cours') {
      return NextResponse.json(
        { error: 'La montante doit être en cours pour ajouter des paliers' },
        { status: 400 }
      );
    }
    
    // Créer le nouveau palier
    const nouveauPalier = await prisma.palier.create({
      data: {
        montanteId: parseInt(id),
        numero: montante.paliers.length + 1,
        mise: parseFloat(body.mise),
        cote: parseFloat(body.cote),
        description: body.description || '',
        statut: 'en_attente',
        gainPotentiel: parseFloat(body.mise) * parseFloat(body.cote)
      }
    });
    
    // Mettre à jour le palier actuel de la montante
    await prisma.montante.update({
      where: { id: parseInt(id) },
      data: { palierActuel: nouveauPalier.numero }
    });
    
    return NextResponse.json({ palier: nouveauPalier });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du palier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du palier' },
      { status: 500 }
    );
  }
}