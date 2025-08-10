import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// Clôturer manuellement une montante
export async function POST(request, { params }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Récupérer la montante avec ses paliers
    const montante = await prisma.montante.findUnique({
      where: { id: params.id },
      include: {
        paliers: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    if (!montante) {
      return NextResponse.json(
        { error: 'Montante non trouvée' },
        { status: 404 }
      )
    }
    
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
    
    // Mettre à jour la montante dans une transaction
    const [montanteMiseAJour, transaction] = await prisma.$transaction([
      // Mettre à jour la montante
      prisma.montante.update({
        where: { id: params.id },
        data: {
          status: 'GAGNEE', // On considère comme gagnée même si l'objectif n'est pas atteint
          dateFin: new Date(),
          gainFinal: gainFinal
        },
        include: {
          paliers: {
            include: {
              bookmaker: true
            }
          }
        }
      }),
      
      // Créer une transaction dans l'historique bankroll
      prisma.transaction.create({
        data: {
          type: gainFinal >= 0 ? 'GAIN_MONTANTE' : 'PERTE_MONTANTE',
          montant: gainFinal,
          description: `Montante n°${montante.id} clôturée manuellement`,
          reference: montante.id,
          solde: 0 // Sera mis à jour par un trigger ou une fonction séparée
        }
      })
    ])
    
    return NextResponse.json({
      success: true,
      montante: montanteMiseAJour,
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