import { PalierAvecInfos, MontanteAvecNumero, formatEuro, formatPourcentage, formatCote, STATUTS_PALIER_CONFIG, DetailsMatchs, SPORTS_ICONS } from '@/types'

interface CartePalierProps {
  palier: PalierAvecInfos
  montante: MontanteAvecNumero
}

export default function CartePalier({ palier, montante }: CartePalierProps) {
  const statutConfig = STATUTS_PALIER_CONFIG[palier.statut as keyof typeof STATUTS_PALIER_CONFIG]
  const detailsMatchs = palier.detailsMatchs as DetailsMatchs
  
  // Fonction pour obtenir l'icône du sport
  const getSportIcon = (sport: string) => {
    return SPORTS_ICONS[sport as keyof typeof SPORTS_ICONS] || SPORTS_ICONS.autres
  }
  
  // Fonction pour formater la date/heure d'un match
  const formatMatchDateTime = (dateString: string | undefined) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    })
  }
  
  return (
    <div className="capture-ready bg-white rounded-xl shadow-lg overflow-hidden border-4 border-gray-100">
      {/* En-tête avec numéro de palier et statut */}
      <div className="bg-[#1e40af] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              Montante n°{montante.numeroAffichage}
            </h3>
            <p className="text-lg mt-1">Palier n°{palier.numeroPalier}</p>
          </div>
          <div className="text-right">
            {/* Badge de statut plus visuel */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
              palier.statut === 'GAGNE' ? 'bg-green-500 text-white' :
              palier.statut === 'PERDU' ? 'bg-red-500 text-white' :
              palier.statut === 'ANNULE' ? 'bg-gray-500 text-white' :
              'bg-yellow-500 text-gray-900'
            }`}>
              <span className="text-xl">{statutConfig.emoji}</span>
              <span>{statutConfig.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Détails des matchs */}
      <div className="px-6 py-4 bg-gray-50">
        {detailsMatchs.matchs.map((match: any, index: number) => (
          <div key={index} className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-2xl mt-1">{getSportIcon(match.sport)}</span>
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900">
                    {match.equipe1} vs {match.equipe2}
                  </p>
                  <p className="text-sm text-gray-600">{match.competition}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-[#1e40af] font-bold">
                      ➤ {match.pronostic}
                    </p>
                    <p className="text-sm font-bold text-gray-700 bg-white px-2 py-0.5 rounded">
                      @ {match.cote ? formatCote(match.cote) : '—'}
                    </p>
                  </div>
                  {/* Statut du match si disponible */}
                  {match.statut && match.statut !== 'EN_ATTENTE' && (
                    <div className="mt-1">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        match.statut === 'GAGNE' ? 'bg-green-100 text-green-800' :
                        match.statut === 'PERDU' ? 'bg-red-100 text-red-800' :
                        match.statut === 'ANNULE' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {match.statut === 'GAGNE' ? '✓ Gagné' :
                         match.statut === 'PERDU' ? '✗ Perdu' :
                         match.statut === 'ANNULE' ? '↺ Annulé' :
                         '⏳ En attente'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Date et heure du match */}
              {match.dateMatch && (
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gray-700">
                    📅 {formatMatchDateTime(match.dateMatch)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Informations de mise */}
      <div className="px-6 py-5">
        {/* Type de pari et cote totale */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {palier.typePari === 'SIMPLE' ? 'Pari simple' : `Combiné ${detailsMatchs.matchs.length} matchs`}
          </span>
          <div className="text-right">
            <p className="text-xs text-gray-500">Cote totale</p>
            <span className="text-2xl font-bold text-[#1e40af]">
              @ {formatCote(palier.cote)}
            </span>
          </div>
        </div>

        {/* Mise et gain avec flèche */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <p className="text-sm text-gray-500">Mise</p>
            <p className="text-2xl font-bold text-gray-900">{formatEuro(palier.mise)}</p>
          </div>
          
          <svg className="w-8 h-8 text-[#1e40af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Gain</p>
            <p className="text-2xl font-bold" style={{ 
              color: palier.statut === 'GAGNE' ? '#10b981' : 
                     palier.statut === 'PERDU' ? '#ef4444' : 
                     '#6b7280' 
            }}>
              {palier.gain ? formatEuro(palier.gain) : '—'}
            </p>
          </div>
        </div>

        {/* Progression */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Progression totale</span>
            <span className="text-xl font-bold" style={{ 
              color: palier.progressionTotale > 0 ? '#10b981' : '#ef4444' 
            }}>
              {formatPourcentage(palier.progressionTotale)} 📈
            </span>
          </div>
        </div>

        {/* Date de création du palier */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            <span className="text-xs">Palier créé le </span>
            {new Date(palier.createdAt).toLocaleString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Paris'
            })}
          </p>
        </div>
      </div>

      {/* Footer avec logo */}
      <div className="bg-[#1e40af] px-6 py-3">
        <p className="text-center text-white text-sm font-medium">
          Montantes.pro
        </p>
      </div>
    </div>
  )
}