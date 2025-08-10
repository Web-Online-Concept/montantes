import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Synchroniser la bankroll avec toutes les montantes terminées
export async function POST(request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Réinitialiser l'historique de la bankroll
    global.bankrollHistory = []
    global.bankrollIdCounter = 1
    
    // Récupérer toutes les montantes terminées
    const montantesTerminees = global.montantes.filter(m => m.status !== 'EN_COURS')
    
    // Ajouter chaque montante à la bankroll
    for (const montante of montantesTerminees) {
      if (montante.gainFinal !== null && montante.gainFinal !== undefined) {
        const entry = {
          id: global.bankrollIdCounter.toString(),
          montant: montante.gainFinal,
          description: montante.status === 'GAGNEE' 
            ? `Montante n°${montante.id} gagnée${montante.gainFinal > 0 ? ' (objectif ' + montante.objectif + ' atteint)' : ' (clôturée manuellement)'}`
            : `Montante n°${montante.id} perdue`,
          type: montante.gainFinal >= 0 ? 'MONTANTE_WIN' : 'MONTANTE_LOSS',
          montanteId: montante.id,
          date: montante.dateFin || montante.dateDebut,
          createdAt: new Date().toISOString()
        }
        
        global.bankrollHistory.push(entry)
        global.bankrollIdCounter++
      }
    }
    
    // Calculer le total
    const total = global.bankrollHistory.reduce((sum, entry) => sum + entry.montant, 0)
    
    return NextResponse.json({
      success: true,
      message: `Bankroll synchronisée avec ${montantesTerminees.length} montantes`,
      total: total,
      entries: global.bankrollHistory.length
    })
  } catch (error) {
    console.error('Erreur sync bankroll:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation' },
      { status: 500 }
    )
  }
}