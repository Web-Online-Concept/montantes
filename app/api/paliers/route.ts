import { NextResponse } from 'next/server'
import { prisma, calculerProgression, verifierObjectifAtteint, mettreAJourBankroll } from '@/lib/prisma'
import { StatutPalier } from '@prisma/client'

// POST - Créer un nouveau palier
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { montanteId, typePari, matchs, cote, dateMatch, statut = 'EN_ATTENTE' } = body
    
    // Validation
    if (!montanteId || !matchs || !cote || !dateMatch) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    // Vérifier que la montante existe et est en cours
    const montante = await prisma.montante.findUnique({
      where: { id: montanteId },
      include: {
        paliers: {
          orderBy: { numeroPalier: 'desc' }
        }
      }
    })
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante introuvable' },
        { status: 404 }
      )
    }
    
    if (montante.etat !== 'EN_COURS') {
      return NextResponse.json(
        { error: 'La montante n\'est plus en cours' },
        { status: 400 }
      )
    }
    
    // Calculer le numéro du palier et la mise
    const numeroPalier = montante.paliers.length + 1
    const dernierPalier = montante.paliers.length > 0 ? montante.paliers[0] : null
    const mise = dernierPalier && dernierPalier.gain
      ? dernierPalier.gain
      : montante.miseInitiale
    
    // Créer le palier
    const palier = await prisma.palier.create({
      data: {
        montanteId,
        numeroPalier,
        mise,
        cote,
        typePari,
        detailsMatchs: { matchs },
        dateMatch: new Date(dateMatch),
        statut: statut as StatutPalier,
        gain: statut === 'GAGNE' ? mise * cote : statut === 'ANNULE' ? mise : null,
        progressionTotale: statut === 'GAGNE' ? calculerProgression(montante.miseInitiale, mise * cote) : 0
      }
    })
    
    // Mettre à jour la montante selon le statut
    if (statut === 'GAGNE') {
      const gain = mise * cote
      const progression = calculerProgression(montante.miseInitiale, gain)
      const objectifAtteint = verifierObjectifAtteint(montante.miseInitiale, gain, montante.objectif)
      
      await prisma.montante.update({
        where: { id: montanteId },
        data: {
          gainActuel: gain,
          progression,
          etat: objectifAtteint ? 'REUSSI' : 'EN_COURS',
          gainFinal: objectifAtteint ? gain : null,
          dateFin: objectifAtteint ? new Date() : null,
          miseEngagee: objectifAtteint ? 0 : montante.miseEngagee
        }
      })
      
      // Si objectif atteint, gérer la bankroll
      if (objectifAtteint) {
        await mettreAJourBankroll({
          typeOperation: 'GAIN_MONTANTE',
          montant: gain - montante.miseInitiale,
          description: `${montante.nom} - Montante réussie`,
          montanteId
        })
      }
    } else if (statut === 'PERDU') {
      await prisma.montante.update({
        where: { id: montanteId },
        data: {
          etat: 'PERDU',
          gainFinal: 0,
          dateFin: new Date(),
          miseEngagee: 0
        }
      })
      
      await mettreAJourBankroll({
        typeOperation: 'PERTE_MONTANTE',
        montant: montante.miseInitiale,
        description: `${montante.nom} - Montante perdue`,
        montanteId
      })
    }
    
    return NextResponse.json({ 
      success: true,
      palier 
    })
    
  } catch (error) {
    console.error('Erreur création palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du palier' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le statut d'un palier
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { palierId, statut } = body
    
    if (!palierId || !statut) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    // Vérifier que le palier existe
    const palier = await prisma.palier.findUnique({
      where: { id: palierId },
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
    
    // Vérifier que la montante est en cours
    if (palier.montante.etat !== 'EN_COURS') {
      return NextResponse.json(
        { error: 'La montante n\'est plus en cours' },
        { status: 400 }
      )
    }
    
    // Vérifier que le palier est en attente
    if (palier.statut !== 'EN_ATTENTE') {
      return NextResponse.json(
        { error: 'Ce palier a déjà été joué' },
        { status: 400 }
      )
    }
    
    // Calculer le gain selon le nouveau statut
    let gain = null
    let progressionTotale = 0
    let objectifAtteint = false
    
    if (statut === 'GAGNE') {
      gain = palier.mise * palier.cote
      progressionTotale = calculerProgression(palier.montante.miseInitiale, gain)
      objectifAtteint = verifierObjectifAtteint(
        palier.montante.miseInitiale, 
        gain, 
        palier.montante.objectif
      )
    } else if (statut === 'ANNULE') {
      // Match annulé : on rembourse la mise (comme si cote = 1)
      gain = palier.mise
      // La progression reste la même qu'avant ce palier
      const palierPrecedent = palier.montante.paliers
        .filter(p => p.numeroPalier < palier.numeroPalier)
        .sort((a, b) => b.numeroPalier - a.numeroPalier)[0]
      
      if (palierPrecedent && palierPrecedent.gain) {
        progressionTotale = calculerProgression(palier.montante.miseInitiale, palierPrecedent.gain)
      } else {
        progressionTotale = 0
      }
    } else if (statut === 'PERDU') {
      gain = 0
      progressionTotale = -100 // Perte totale
    }
    
    // Mettre à jour le palier
    await prisma.palier.update({
      where: { id: palierId },
      data: {
        statut: statut as StatutPalier,
        gain,
        progressionTotale
      }
    })
    
    // Mettre à jour la montante
    if (statut === 'GAGNE') {
      await prisma.montante.update({
        where: { id: palier.montanteId },
        data: {
          gainActuel: gain,
          progression: progressionTotale,
          roi: ((gain! - palier.montante.miseInitiale) / palier.montante.miseInitiale) * 100,
          etat: objectifAtteint ? 'REUSSI' : 'EN_COURS',
          gainFinal: objectifAtteint ? gain : null,
          dateFin: objectifAtteint ? new Date() : null,
          miseEngagee: objectifAtteint ? 0 : palier.montante.miseEngagee
        }
      })
      
      if (objectifAtteint) {
        await mettreAJourBankroll({
          typeOperation: 'GAIN_MONTANTE',
          montant: gain! - palier.montante.miseInitiale,
          description: `${palier.montante.nom} - Montante réussie (objectif atteint)`,
          montanteId: palier.montanteId
        })
        
        return NextResponse.json({ 
          success: true,
          message: `Félicitations ! Palier gagné et objectif atteint ! Gain final : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(gain!)}`,
          objectifAtteint: true,
          gainFinal: gain
        })
      }
    } else if (statut === 'ANNULE') {
      // Pour une annulation, on garde le gain du palier précédent
      const palierPrecedent = palier.montante.paliers
        .filter(p => p.numeroPalier < palier.numeroPalier && p.statut === 'GAGNE')
        .sort((a, b) => b.numeroPalier - a.numeroPalier)[0]
      
      const gainActuel = palierPrecedent?.gain || palier.montante.miseInitiale
      
      await prisma.montante.update({
        where: { id: palier.montanteId },
        data: {
          gainActuel,
          progression: progressionTotale,
          roi: ((gainActuel - palier.montante.miseInitiale) / palier.montante.miseInitiale) * 100
        }
      })
    } else if (statut === 'PERDU') {
      await prisma.montante.update({
        where: { id: palier.montanteId },
        data: {
          etat: 'PERDU',
          gainFinal: 0,
          progression: -100,
          roi: -100,
          dateFin: new Date(),
          miseEngagee: 0
        }
      })
      
      await mettreAJourBankroll({
        typeOperation: 'PERTE_MONTANTE',
        montant: palier.montante.miseInitiale,
        description: `${palier.montante.nom} - Montante perdue au palier n°${palier.numeroPalier}`,
        montanteId: palier.montanteId
      })
    }
    
    // Recalculer la bankroll disponible après toute modification
    const settings = await prisma.settings.findFirst()
    if (settings) {
      const montantesEnCours = await prisma.montante.findMany({
        where: { etat: 'EN_COURS' },
        select: { miseEngagee: true }
      })
      
      const misesEngagees = montantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
      
      await prisma.settings.update({
        where: { id: settings.id },
        data: {
          bankrollDisponible: settings.bankrollActuelle - misesEngagees
        }
      })
    }
    
    return NextResponse.json({ 
      success: true,
      message: statut === 'ANNULE' 
        ? 'Palier marqué comme annulé, mise remboursée' 
        : statut === 'PERDU'
        ? 'Palier perdu, la montante est terminée'
        : 'Palier gagné avec succès',
      objectifAtteint: false
    })
    
  } catch (error) {
    console.error('Erreur mise à jour palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du palier' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un palier
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const palierId = searchParams.get('id')
    
    if (!palierId) {
      return NextResponse.json(
        { error: 'ID du palier manquant' },
        { status: 400 }
      )
    }
    
    // Vérifier que le palier existe
    const palier = await prisma.palier.findUnique({
      where: { id: palierId },
      include: {
        montante: {
          include: {
            paliers: {
              orderBy: { numeroPalier: 'desc' }
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
    
    // Vérifier que c'est bien le dernier palier
    if (palier.numeroPalier !== palier.montante.paliers[0].numeroPalier) {
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
    
    // Supprimer le palier
    await prisma.palier.delete({
      where: { id: palierId }
    })
    
    // Recalculer le gain actuel de la montante
    const paliersRestants = await prisma.palier.findMany({
      where: { montanteId: palier.montanteId },
      orderBy: { numeroPalier: 'desc' }
    })
    
    let gainActuel = palier.montante.miseInitiale
    let progression = 0
    
    if (paliersRestants.length > 0) {
      const dernierPalierGagne = paliersRestants.find(p => p.statut === 'GAGNE' && p.gain)
      if (dernierPalierGagne) {
        gainActuel = dernierPalierGagne.gain!
        progression = calculerProgression(palier.montante.miseInitiale, gainActuel)
      }
    }
    
    // Mettre à jour la montante
    await prisma.montante.update({
      where: { id: palier.montanteId },
      data: {
        gainActuel,
        progression,
        roi: progression
      }
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