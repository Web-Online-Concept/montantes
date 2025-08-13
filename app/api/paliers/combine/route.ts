import { NextResponse } from 'next/server'
import { prisma, calculerProgression, verifierObjectifAtteint, mettreAJourBankroll } from '@/lib/prisma'
import { StatutPalier } from '@prisma/client'
import { DetailsMatchs } from '@/types'

// PATCH - Mettre à jour les statuts individuels des matchs d'un combiné
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { palierId, matchsStatuts } = body
    
    if (!palierId || !matchsStatuts || !Array.isArray(matchsStatuts)) {
      return NextResponse.json(
        { error: 'Données manquantes ou invalides' },
        { status: 400 }
      )
    }
    
    // Récupérer le palier avec sa montante
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
    
    // Caster detailsMatchs pour avoir le bon type
    const detailsMatchs = palier.detailsMatchs as unknown as DetailsMatchs
    
    // Vérifier que c'est bien un combiné
    if (palier.typePari !== 'COMBINE' || !detailsMatchs?.matchs || detailsMatchs.matchs.length < 2) {
      return NextResponse.json(
        { error: 'Ce palier n\'est pas un combiné' },
        { status: 400 }
      )
    }
    
    // Copier les matchs et appliquer les nouveaux statuts
    const matchsMisAJour = [...detailsMatchs.matchs]
    
    for (const { matchIndex, statut } of matchsStatuts) {
      if (matchIndex >= 0 && matchIndex < matchsMisAJour.length) {
        matchsMisAJour[matchIndex] = {
          ...matchsMisAJour[matchIndex],
          statut
        }
      }
    }
    
    // Calculer le résultat global du combiné
    let coteFinale = 1
    let statutGlobal: 'EN_ATTENTE' | 'GAGNE' | 'PERDU' | 'ANNULE' = 'GAGNE'
    let tousAnnules = true
    let auMoinsUnEnAttente = false
    
    for (const match of matchsMisAJour) {
      const statutMatch = match.statut || 'EN_ATTENTE'
      
      if (statutMatch === 'EN_ATTENTE') {
        auMoinsUnEnAttente = true
      } else if (statutMatch === 'PERDU') {
        // Un match perdu = combiné perdu
        statutGlobal = 'PERDU'
        coteFinale = 0
        tousAnnules = false
        break
      } else if (statutMatch === 'GAGNE') {
        // Match gagné, on multiplie la cote
        coteFinale *= match.cote
        tousAnnules = false
      }
      // Si ANNULE, on ne compte pas la cote (équivalent à cote = 1)
    }
    
    // Déterminer le statut final
    if (statutGlobal !== 'PERDU') {
      if (auMoinsUnEnAttente) {
        // S'il reste des matchs en attente, on ne peut pas valider le combiné
        return NextResponse.json(
          { error: 'Tous les matchs doivent être validés avant de confirmer le combiné' },
          { status: 400 }
        )
      } else if (tousAnnules) {
        // Tous les matchs sont annulés
        statutGlobal = 'ANNULE'
        coteFinale = 1 // Remboursement de la mise
      }
    }
    
    // Calculer le gain selon le statut
    let gain = null
    let progressionTotale = 0
    
    if (statutGlobal === 'GAGNE') {
      gain = palier.mise * coteFinale
      progressionTotale = calculerProgression(palier.montante.miseInitiale, gain)
    } else if (statutGlobal === 'ANNULE') {
      // Remboursement de la mise
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
    } else if (statutGlobal === 'PERDU') {
      gain = 0
      progressionTotale = -100 // Perte totale
    }
    
    // Mettre à jour le palier avec les matchs mis à jour et la cote finale
    await prisma.palier.update({
      where: { id: palierId },
      data: {
        statut: statutGlobal as StatutPalier,
        cote: coteFinale, // On met à jour la cote avec la cote finale recalculée
        detailsMatchs: { matchs: matchsMisAJour },
        gain,
        progressionTotale
      }
    })
    
    // Mettre à jour la montante selon le résultat
    if (statutGlobal === 'GAGNE') {
      const objectifAtteint = verifierObjectifAtteint(
        palier.montante.miseInitiale, 
        gain!, 
        palier.montante.objectif
      )
      
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
          description: `${palier.montante.nom} - Objectif atteint au palier n°${palier.numeroPalier}`,
          montanteId: palier.montanteId
        })
      }
    } else if (statutGlobal === 'ANNULE') {
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
    } else if (statutGlobal === 'PERDU') {
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
        description: `${palier.montante.nom} - Perdue au palier n°${palier.numeroPalier} (combiné)`,
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
    
    // Créer le message de retour selon le résultat
    let message = ''
    let objectifAtteint = false
    
    if (statutGlobal === 'GAGNE') {
      // Vérifier si l'objectif a été atteint
      objectifAtteint = verifierObjectifAtteint(
        palier.montante.miseInitiale,
        gain!,
        palier.montante.objectif
      )
      
      if (objectifAtteint) {
        message = `Félicitations ! Combiné gagné et objectif atteint ! Cote finale: ${coteFinale.toFixed(2)}, Gain final: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(gain!)}`
      } else {
        message = `Combiné validé comme gagné ! Cote finale: ${coteFinale.toFixed(2)}, Gain: ${gain?.toFixed(2)}€`
      }
    } else if (statutGlobal === 'PERDU') {
      const matchsPerdus = matchsMisAJour.filter(m => m.statut === 'PERDU').length
      message = `Combiné perdu (${matchsPerdus} match${matchsPerdus > 1 ? 's' : ''} perdu${matchsPerdus > 1 ? 's' : ''})`
    } else if (statutGlobal === 'ANNULE') {
      message = 'Tous les matchs ont été annulés, mise remboursée'
    }
    
    return NextResponse.json({ 
      success: true,
      message,
      statutGlobal,
      coteFinale,
      gain,
      objectifAtteint
    })
    
  } catch (error) {
    console.error('Erreur validation combiné:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation du combiné' },
      { status: 500 }
    )
  }
}