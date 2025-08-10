import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer tous les bookmakers
export async function GET() {
  try {
    const bookmakers = await prisma.bookmaker.findMany({
      orderBy: {
        nom: 'asc'
      }
    });
    
    return NextResponse.json({ bookmakers });
  } catch (error) {
    console.error('Erreur lors de la récupération des bookmakers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bookmakers' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau bookmaker
export async function POST(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const nouveauBookmaker = await prisma.bookmaker.create({
      data: {
        nom: data.nom,
        couleur: data.couleur || '#3B82F6'
      }
    });
    
    return NextResponse.json({ bookmaker: nouveauBookmaker });
  } catch (error) {
    console.error('Erreur lors de la création du bookmaker:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du bookmaker' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un bookmaker
export async function PUT(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const bookmakerMisAJour = await prisma.bookmaker.update({
      where: { id: data.id },
      data: {
        nom: data.nom,
        couleur: data.couleur
      }
    });
    
    return NextResponse.json({ bookmaker: bookmakerMisAJour });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bookmaker:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du bookmaker' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un bookmaker
export async function DELETE(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    await prisma.bookmaker.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du bookmaker:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du bookmaker' },
      { status: 500 }
    );
  }
}