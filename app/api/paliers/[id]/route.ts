import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculerProgression } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Récupérer le palier avec sa montante et tous les paliers
    const palier = await prisma.palier.findUnique({
      where: { id },
      include: {
        montante: {
          include: {
            paliers: {
              orderBy: { numeroPalier: 'asc' }
            }
          }
        }
      }
    })

    if (!palier) {
      return NextResponse.json(
        { error: 'Palier introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que c'est le dernier palier
    const isLastPalier = palier.numeroPalier === palier.montante.paliers.length
    if (!isLastPalier) {
      return NextResponse.json(
        { error: 'Seul le dernier palier peut être supprimé' },
        { status: 400 }
      )
    }

    // Vérifier que la montante est en cours
    if (palier.montante.etat !== 'EN_COURS') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un palier d\'une montante terminée' },
        { status: 400 }
      )
    }

    // Vérifier qu'on ne supprime pas un palier qui a déjà affecté la bankroll
    if (palier.statut !== 'EN_ATTENTE') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un palier déjà joué. Utilisez plutôt la modification du statut.' },
        { status: 400 }
      )
    }

    // Supprimer le palier
    await prisma.palier.delete({
      where: { id }
    })

    // Mettre à jour la montante
    const palierPrecedent = palier.montante.paliers[palier.montante.paliers.length - 2]
    let updateData: any = {
      nombrePaliersMax: palier.montante.paliers.length - 1
    }

    if (palierPrecedent) {
      // S'il reste des paliers, mettre à jour avec les données du palier précédent
      updateData.miseEngagee = palierPrecedent.gain || palierPrecedent.mise
      
      if (palierPrecedent.gain) {
        updateData.gainFinal = palierPrecedent.gain
        updateData.progression = calculerProgression(palier.montante.miseInitiale, palierPrecedent.gain)
      }
    } else {
      // Si c'était le seul palier, réinitialiser aux valeurs initiales
      updateData.miseEngagee = palier.montante.miseInitiale
      updateData.gainFinal = null
      updateData.progression = 0
    }

    await prisma.montante.update({
      where: { id: palier.montante.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Palier supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du palier' },
      { status: 500 }
    )
  }
}

// GET pour récupérer un palier spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const palier = await prisma.palier.findUnique({
      where: { id },
      include: {
        montante: true
      }
    })

    if (!palier) {
      return NextResponse.json(
        { error: 'Palier introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(palier)

  } catch (error) {
    console.error('Erreur récupération palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du palier' },
      { status: 500 }
    )
  }
}

// PUT pour mettre à jour complètement un palier
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { cote, typePari, detailsMatchs, dateMatch } = body

    // Validation
    if (!cote || !typePari || !detailsMatchs || !dateMatch) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Récupérer le palier
    const palier = await prisma.palier.findUnique({
      where: { id },
      include: { montante: true }
    })

    if (!palier) {
      return NextResponse.json(
        { error: 'Palier introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que la montante est en cours
    if (palier.montante.etat !== 'EN_COURS') {
      return NextResponse.json(
        { error: 'Impossible de modifier un palier d\'une montante terminée' },
        { status: 400 }
      )
    }

    // Vérifier que le palier est en attente
    if (palier.statut !== 'EN_ATTENTE') {
      return NextResponse.json(
        { error: 'Impossible de modifier les détails d\'un palier déjà joué' },
        { status: 400 }
      )
    }

    // Mettre à jour le palier
    const updatedPalier = await prisma.palier.update({
      where: { id },
      data: {
        cote,
        typePari,
        detailsMatchs: detailsMatchs as any,
        dateMatch: new Date(dateMatch)
      }
    })

    return NextResponse.json({
      success: true,
      palier: updatedPalier
    })

  } catch (error) {
    console.error('Erreur mise à jour palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du palier' },
      { status: 500 }
    )
  }
}