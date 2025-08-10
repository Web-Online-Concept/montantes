import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Données en mémoire pour la bankroll
global.bankrollHistory = global.bankrollHistory || []
global.bankrollIdCounter = global.bankrollIdCounter || 1

// Calculer la bankroll actuelle
function calculateCurrentBankroll() {
  return global.bankrollHistory.reduce((total, entry) => total + entry.montant, 0)
}

// Récupérer l'historique de la bankroll (public en lecture)
export async function GET() {
  try {
    const currentBankroll = calculateCurrentBankroll()
    
    return NextResponse.json({
      current: currentBankroll,
      history: global.bankrollHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  } catch (error) {
    console.error('Erreur GET bankroll:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la bankroll' },
      { status: 500 }
    )
  }
}

// Ajouter une entrée à la bankroll (admin seulement)
export async function POST(request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Validation
    if (typeof data.montant !== 'number' || !data.description) {
      return NextResponse.json(
        { error: 'Montant et description requis' },
        { status: 400 }
      )
    }
    
    // Créer l'entrée
    const nouvelleEntree = {
      id: global.bankrollIdCounter.toString(),
      montant: data.montant,
      description: data.description,
      type: data.type || 'MANUAL', // MANUAL, MONTANTE_WIN, MONTANTE_LOSS
      montanteId: data.montanteId || null,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    global.bankrollHistory.push(nouvelleEntree)
    global.bankrollIdCounter++
    
    return NextResponse.json({
      entry: nouvelleEntree,
      newBankroll: calculateCurrentBankroll()
    })
  } catch (error) {
    console.error('Erreur POST bankroll:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout à la bankroll' },
      { status: 500 }
    )
  }
}

// Fonction helper pour ajouter automatiquement les gains/pertes des montantes
export async function addMontanteResult(montanteId, montant, description) {
  const entry = {
    id: global.bankrollIdCounter.toString(),
    montant: montant,
    description: description,
    type: montant >= 0 ? 'MONTANTE_WIN' : 'MONTANTE_LOSS',
    montanteId: montanteId,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
  
  global.bankrollHistory.push(entry)
  global.bankrollIdCounter++
  
  return entry
}