import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Utilisation de global pour partager les données
global.montantes = global.montantes || []

// Clôturer manuellement une montante
export async function POST(request, { params }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const montanteIndex = global.montantes.findIndex(m => m.id === params.id)
    
    if (montanteIndex === -1) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
    const montante = global.montantes[montanteIndex]
    
    // Vérifier que la montante est en cours
    if (montante.status !== 'EN_COURS') {
      return NextResponse.json(
        { error: 'Cette montante n\'est plus en cours' },
        { status: 400 }
      )
    }
    
    // Calculer le gain final basé sur le dernier palier gagné
    let gainFinal = -montante.miseInitiale // Par défaut, perte totale
    
    if (montante.paliers && montante.paliers.length > 0) {
      // Trouver le dernier palier gagné
      const dernierPalierGagne = [...montante.paliers]
        .reverse()
        .find(p => p.status === 'GAGNE')
      
      if (dernierPalierGagne) {
        // Le gain final est le gain potentiel du dernier palier gagné moins la mise initiale
        gainFinal = dernierPalierGagne.gainPotentiel - montante.miseInitiale
      }
    }
    
    // Mettre à jour la montante
    global.montantes[montanteIndex] = {
      ...montante,
      status: 'GAGNEE', // On considère comme gagnée même si l'objectif n'est pas atteint
      dateFin: new Date().toISOString(),
      gainFinal: gainFinal
    }
    
    // Ajouter à la bankroll
    const entry = {
      id: (global.bankrollIdCounter || 1).toString(),
      montant: gainFinal,
      description: `Montante n°${montante.id} clôturée manuellement`,
      type: gainFinal >= 0 ? 'MONTANTE_WIN' : 'MONTANTE_LOSS',
      montanteId: montante.id,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    global.bankrollHistory = global.bankrollHistory || []
    global.bankrollHistory.push(entry)
    global.bankrollIdCounter = (global.bankrollIdCounter || 1) + 1
    
    return NextResponse.json({
      success: true,
      montante: global.montantes[montanteIndex],
      message: `Montante clôturée avec un gain de ${gainFinal.toFixed(2)} €`
    })
  } catch (error) {
    console.error('Erreur lors de la clôture:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la clôture de la montante' },
      { status: 500 }
    )
  }
}