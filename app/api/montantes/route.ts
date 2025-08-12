import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MontanteAvecNumero } from '@/types'
import { calculerProgression, verifierObjectifAtteint, mettreAJourBankroll } from '@/lib/prisma'

export async function GET() {
  try {
    // Récupérer toutes les montantes avec leurs paliers
    const montantes = await prisma.montante.findMany({
      include: {
        paliers: {
          orderBy: { numeroPalier: 'desc' }
        }
      },
      orderBy: { createdAt: 'asc' } // Pour l'ordre d'affichage
    })
    
    // Transformer en MontanteAvecNumero avec calculs
    const montantesAvecNumero: MontanteAvecNumero[] = montantes.map((montante, index) => {
      // Récupérer le dernier palier
      const dernierPalier = montante.paliers[0] || null
      
      // Calculer le gain actuel
      let gainActuel = montante.miseInitiale
      if (montante.etat === 'REUSSI' || montante.etat === 'PERDU' || montante.etat === 'ARRETEE') {
        gainActuel = montante.gainFinal || montante.miseInitiale
      } else if (dernierPalier && dernierPalier.statut === 'GAGNE' && dernierPalier.gain) {
        gainActuel = dernierPalier.gain
      } else if (dernierPalier && dernierPalier.statut === 'EN_ATTENTE') {
        // Si le dernier palier est en attente, prendre le gain du palier précédent
        const palierPrecedent = montante.paliers[1]
        if (palierPrecedent && palierPrecedent.gain) {
          gainActuel = palierPrecedent.gain
        }
      }
      
      // Calculer la progression
      const progression = calculerProgression(montante.miseInitiale, gainActuel)
      
      return {
        ...montante,
        numeroAffichage: index + 1, // Numéro basé sur l'ordre de création
        gainActuel,
        dernierPalier,
        progression
      }
    })
    
    return NextResponse.json(montantesAvecNumero)
    
  } catch (error) {
    console.error('Erreur API montantes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des montantes' },
      { status: 500 }
    )
  }
}

// POST pour créer une nouvelle montante
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { miseInitiale, objectif } = body
    
    // Validation - On ne vérifie plus le nom car on le génère automatiquement
    if (!miseInitiale || !objectif) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    if (miseInitiale <= 0) {
      return NextResponse.json(
        { error: 'La mise initiale doit être positive' },
        { status: 400 }
      )
    }
    
    // Vérifier la bankroll disponible
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings non configurés' },
        { status: 500 }
      )
    }
    
    if (miseInitiale > settings.bankrollDisponible) {
      return NextResponse.json(
        { error: 'Mise supérieure à la bankroll disponible' },
        { status: 400 }
      )
    }
    
    // Compter le nombre de montantes existantes pour générer le nom
    const montantesCount = await prisma.montante.count()
    const numeroMontante = montantesCount + 1
    const nom = `Montante n°${numeroMontante}`
    
    // Créer la montante avec le nom généré automatiquement
    const montante = await prisma.montante.create({
      data: {
        nom,
        miseInitiale,
        miseEngagee: miseInitiale, // Au début, mise engagée = mise initiale
        objectif,
        etat: 'EN_COURS',
        progression: 0,
        roi: 0,
        dureeJours: 0
      }
    })
    
    // Mettre à jour la bankroll disponible
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
    
    return NextResponse.json({
      success: true,
      montante
    })
    
  } catch (error) {
    console.error('Erreur création montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la montante' },
      { status: 500 }
    )
  }
}

// PATCH pour mettre à jour une montante (arrêt, validation, etc.)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, action, gainFinal } = body
    
    if (!id || !action) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    const montante = await prisma.montante.findUnique({
      where: { id },
      include: { paliers: { orderBy: { numeroPalier: 'desc' } } }
    })
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante introuvable' },
        { status: 404 }
      )
    }
    
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings non configurés' },
        { status: 500 }
      )
    }
    
    let updateData: any = {}
    let typeOperation: 'GAIN_MONTANTE' | 'PERTE_MONTANTE' | null = null
    let montantVariation = 0
    
    switch (action) {
      case 'arreter':
        // Arrêter manuellement avec les gains actuels - C'EST TOUJOURS UNE MONTANTE GAGNÉE
        const dernierPalier = montante.paliers[0]
        const gain = gainFinal || (dernierPalier?.gain || montante.miseInitiale)
        
        updateData = {
          etat: 'REUSSI', // Une montante arrêtée manuellement est toujours réussie
          gainFinal: gain,
          dateFin: new Date(),
          roi: calculerProgression(montante.miseInitiale, gain),
          miseEngagee: 0 // Libérer la mise
        }
        
        // Une montante arrêtée manuellement a forcément des gains
        typeOperation = 'GAIN_MONTANTE'
        montantVariation = gain - montante.miseInitiale
        break
        
      case 'valider':
        // Cette action n'est plus nécessaire car arrêter = valider comme réussie
        // On garde pour compatibilité mais elle fait la même chose qu'arrêter
        const gainReussi = gainFinal || montante.paliers[0]?.gain || montante.miseInitiale
        
        updateData = {
          etat: 'REUSSI',
          gainFinal: gainReussi,
          dateFin: new Date(),
          roi: calculerProgression(montante.miseInitiale, gainReussi),
          miseEngagee: 0 // Libérer la mise
        }
        
        typeOperation = 'GAIN_MONTANTE'
        montantVariation = gainReussi - montante.miseInitiale
        break
        
      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        )
    }
    
    // Calculer la durée en jours
    const dateDebut = new Date(montante.dateDebut)
    const dateFin = new Date()
    const dureeJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24))
    updateData.dureeJours = dureeJours
    
    // Mettre à jour la montante
    const updatedMontante = await prisma.montante.update({
      where: { id },
      data: updateData
    })
    
    // IMPORTANT : Mettre à jour la bankroll et créer l'entrée dans l'historique
    if (typeOperation && montantVariation !== 0) {
      // La fonction mettreAJourBankroll doit créer une entrée dans l'historique
      await mettreAJourBankroll({
        typeOperation,
        montant: montantVariation, // Le montant est déjà positif pour un gain
        description: `${montante.nom} - Montante gagnée`,
        montanteId: id
      })
    }
    
    // Recalculer la bankroll disponible après l'arrêt
    const montantesEnCours = await prisma.montante.findMany({
      where: { etat: 'EN_COURS' },
      select: { miseEngagee: true }
    })
    
    const misesEngagees = montantesEnCours.reduce((acc, m) => acc + m.miseEngagee, 0)
    
    // Récupérer les settings actualisés après mettreAJourBankroll
    const updatedSettings = await prisma.settings.findFirst()
    if (updatedSettings) {
      await prisma.settings.update({
        where: { id: updatedSettings.id },
        data: {
          bankrollDisponible: updatedSettings.bankrollActuelle - misesEngagees
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      montante: updatedMontante
    })
    
  } catch (error) {
    console.error('Erreur mise à jour montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la montante' },
      { status: 500 }
    )
  }
}

// DELETE pour supprimer une montante et renuméroter les autres
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }
    
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
    
    // Supprimer la montante
    await prisma.montante.delete({
      where: { id }
    })
    
    // Récupérer toutes les montantes restantes triées par date de création
    const montantesRestantes = await prisma.montante.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    // Renuméroter toutes les montantes
    for (let i = 0; i < montantesRestantes.length; i++) {
      const nouveauNom = `Montante n°${i + 1}`
      
      // Ne mettre à jour que si le nom a changé
      if (montantesRestantes[i].nom !== nouveauNom) {
        await prisma.montante.update({
          where: { id: montantesRestantes[i].id },
          data: { nom: nouveauNom }
        })
      }
    }
    
    // Si la montante était en cours, recalculer la bankroll disponible
    if (montante.etat === 'EN_COURS') {
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
    }
    
    return NextResponse.json({
      success: true,
      message: 'Montante supprimée et numérotation mise à jour'
    })
    
  } catch (error) {
    console.error('Erreur suppression montante:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la montante' },
      { status: 500 }
    )
  }
}