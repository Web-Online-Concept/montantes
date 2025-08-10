import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Utilisation de global pour partager les données
global.montantes = global.montantes || []

// Mettre à jour le statut d'un palier
export async function PUT(request, { params }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id: montanteId, palierId } = params
    const data = await request.json()
    
    // Trouver la montante
    const montanteIndex = global.montantes.findIndex(m => m.id === montanteId)
    if (montanteIndex === -1) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    const montante = global.montantes[montanteIndex]
    
    // Trouver le palier
    const palierIndex = montante.paliers?.findIndex(p => p.id === palierId)
    if (palierIndex === -1 || palierIndex === undefined) {
      return NextResponse.json(
        { error: 'Palier non trouvé' },
        { status: 404 }
      )
    }
    
    // Mettre à jour le statut du palier
    montante.paliers[palierIndex].status = data.status
    montante.paliers[palierIndex].dateResultat = new Date().toISOString()
    
    // Si le palier est perdu, la montante est perdue
    if (data.status === 'PERDU') {
      montante.status = 'PERDUE'
      montante.dateFin = new Date().toISOString()
      montante.gainFinal = -montante.miseInitiale // Perte = mise initiale négative
      
      // Ajouter à la bankroll
      const entry = {
        id: (global.bankrollIdCounter || 1).toString(),
        montant: -montante.miseInitiale,
        description: `Montante n°${montante.id} perdue`,
        type: 'MONTANTE_LOSS',
        montanteId: montante.id,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      global.bankrollHistory = global.bankrollHistory || []
      global.bankrollHistory.push(entry)
      global.bankrollIdCounter = (global.bankrollIdCounter || 1) + 1
    }
    
    // Si le palier est gagné, vérifier si l'objectif est atteint
    if (data.status === 'GAGNE') {
      const dernierGainPotentiel = montante.paliers[palierIndex].gainPotentiel
      const multiplicateur = parseInt(montante.objectif.slice(1)) // X2 -> 2, X3 -> 3, etc.
      const objectifAtteint = dernierGainPotentiel >= (montante.miseInitiale * multiplicateur)
      
      if (objectifAtteint) {
        montante.status = 'GAGNEE'
        montante.dateFin = new Date().toISOString()
        montante.gainFinal = dernierGainPotentiel - montante.miseInitiale // Gain net
        
        // Ajouter à la bankroll
        const entry = {
          id: (global.bankrollIdCounter || 1).toString(),
          montant: montante.gainFinal,
          description: `Montante n°${montante.id} gagnée (objectif ${montante.objectif} atteint)`,
          type: 'MONTANTE_WIN',
          montanteId: montante.id,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        global.bankrollHistory = global.bankrollHistory || []
        global.bankrollHistory.push(entry)
        global.bankrollIdCounter = (global.bankrollIdCounter || 1) + 1
      }
    }
    
    return NextResponse.json(montante.paliers[palierIndex])
  } catch (error) {
    console.error('Erreur PUT palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du palier' },
      { status: 500 }
    )
  }
}

// Supprimer un palier
export async function DELETE(request, { params }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id: montanteId, palierId } = params
    
    // Trouver la montante
    const montanteIndex = global.montantes.findIndex(m => m.id === montanteId)
    if (montanteIndex === -1) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    const montante = global.montantes[montanteIndex]
    
    // Trouver et supprimer le palier
    const palierIndex = montante.paliers?.findIndex(p => p.id === palierId)
    if (palierIndex === -1 || palierIndex === undefined) {
      return NextResponse.json(
        { error: 'Palier non trouvé' },
        { status: 404 }
      )
    }
    
    // Supprimer le palier
    montante.paliers.splice(palierIndex, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du palier' },
      { status: 500 }
    )
  }
}