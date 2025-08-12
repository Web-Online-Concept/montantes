import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MontanteAvecNumero, PalierAvecInfos, DetailsMatchs } from '@/types'
import { calculerProgression } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Récupérer la montante avec ses paliers
    const montante = await prisma.montante.findUnique({
      where: { id },
      include: {
        paliers: {
          orderBy: { numeroPalier: 'asc' }
        }
      }
    })

    if (!montante) {
      return NextResponse.json(
        { error: 'Montante introuvable' },
        { status: 404 }
      )
    }

    // Récupérer toutes les montantes pour calculer le numéro d'affichage
    const allMontantes = await prisma.montante.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    })

    const numeroAffichage = allMontantes.findIndex(m => m.id === id) + 1

    // Calculer le gain actuel
    let gainActuel = montante.miseInitiale
    if (montante.etat === 'REUSSI' || montante.etat === 'PERDU' || montante.etat === 'ARRETEE') {
      gainActuel = montante.gainFinal || montante.miseInitiale
    } else {
      // Pour une montante en cours, prendre le gain du dernier palier gagné
      const dernierPalierGagne = montante.paliers
        .filter(p => p.statut === 'GAGNE' && p.gain !== null)
        .sort((a, b) => b.numeroPalier - a.numeroPalier)[0]
      
      if (dernierPalierGagne && dernierPalierGagne.gain) {
        gainActuel = dernierPalierGagne.gain
      }
    }

    // Calculer la progression actuelle
    const progression = calculerProgression(montante.miseInitiale, gainActuel)

    // Transformer la montante
    const montanteAvecNumero: MontanteAvecNumero = {
      ...montante,
      numeroAffichage,
      gainActuel,
      progression
    }

    // Transformer les paliers avec infos calculées
    const paliersAvecInfos: PalierAvecInfos[] = montante.paliers.map((palier, index) => {
      // Calculer la progression à ce palier
      let progressionPalier = 0
      if (palier.gain) {
        progressionPalier = calculerProgression(montante.miseInitiale, palier.gain)
      } else if (index > 0 && montante.paliers[index - 1].gain) {
        // Si pas de gain, prendre la progression du palier précédent
        progressionPalier = calculerProgression(montante.miseInitiale, montante.paliers[index - 1].gain!)
      }

      return {
        ...palier,
        progressionTotale: progressionPalier
      }
    })

    return NextResponse.json({
      montante: montanteAvecNumero,
      paliers: paliersAvecInfos
    })

  } catch (error) {
    console.error('Erreur API montante détail:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la montante' },
      { status: 500 }
    )
  }
}

// DELETE pour supprimer une montante
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Vérifier que la montante existe
    const montante = await prisma.montante.findUnique({
      where: { id }
    })

    if (!montante) {
      return NextResponse.json(
        { error: 'Montante introuvable' },
        { status: 404 }
      )
    }

    // Si la montante est en cours, libérer la mise engagée
    if (montante.etat === 'EN_COURS') {
      const settings = await prisma.settings.findFirst()
      if (settings) {
        // Recalculer la bankroll disponible après suppression
        const autresMontantesEnCours = await prisma.montante.findMany({
          where: { 
            etat: 'EN_COURS',
            id: { not: id }
          },
          select: { miseEngagee: true }
        })
        
        const misesEngagees = autresMontantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
        
        await prisma.settings.update({
          where: { id: settings.id },
          data: {
            bankrollDisponible: settings.bankrollActuelle - misesEngagees
          }
        })
      }
    }

    // Supprimer la montante (les paliers seront supprimés en cascade)
    await prisma.montante.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Montante supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la montante' },
      { status: 500 }
    )
  }
}

// PUT pour modifier une montante
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { nom, objectif } = body

    // Vérifier que la montante existe
    const montante = await prisma.montante.findUnique({
      where: { id }
    })

    if (!montante) {
      return NextResponse.json(
        { error: 'Montante introuvable' },
        { status: 404 }
      )
    }

    // Seuls le nom et l'objectif peuvent être modifiés
    const updateData: any = {}
    if (nom) updateData.nom = nom
    if (objectif) updateData.objectif = objectif

    // Mettre à jour la montante
    const updatedMontante = await prisma.montante.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      montante: updatedMontante
    })

  } catch (error) {
    console.error('Erreur modification montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la montante' },
      { status: 500 }
    )
  }
}