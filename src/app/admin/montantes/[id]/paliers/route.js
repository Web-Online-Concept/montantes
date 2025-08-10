import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Utilisation de global pour partager les données
global.montantes = global.montantes || []
global.palierIdCounter = global.palierIdCounter || 1

// Créer un nouveau palier pour une montante
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
    
    const data = await request.json()
    
    // Créer le nouveau palier
    const nouveauPalier = {
      id: global.palierIdCounter.toString(),
      montanteId: params.id,
      typePari: data.typePari,
      sports: data.sports,
      matchs: data.matchs,
      cotes: data.cotes,
      coteTotale: data.coteTotale,
      bookmakerId: data.bookmakerId,
      bookmaker: { 
        id: data.bookmakerId,
        nom: 'Bookmaker ' + data.bookmakerId // Simulé pour l'instant
      },
      mise: data.mise,
      gainPotentiel: data.gainPotentiel,
      status: 'EN_ATTENTE',
      resultat: null,
      dateCreation: new Date().toISOString(),
      dateResultat: null
    }
    
    // Ajouter le palier à la montante
    if (!montante.paliers) {
      montante.paliers = []
    }
    montante.paliers.push(nouveauPalier)
    
    global.palierIdCounter++
    
    return NextResponse.json(nouveauPalier)
  } catch (error) {
    console.error('Erreur POST palier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du palier' },
      { status: 500 }
    )
  }
}