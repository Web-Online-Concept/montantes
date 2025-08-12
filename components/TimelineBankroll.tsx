import Link from 'next/link'
import { formatEuro } from '@/types'

interface HistoriqueItem {
  id: string
  montant: number
  montantAvant: number
  montantApres: number
  typeOperation: 'DEPOT' | 'RETRAIT' | 'GAIN_MONTANTE' | 'PERTE_MONTANTE' | 'REMBOURSEMENT'
  description: string
  createdAt: string
  montante?: {
    id: string
    nom: string
  }
}

interface TimelineBankrollProps {
  historique: HistoriqueItem[]
}

export default function TimelineBankroll({ historique }: TimelineBankrollProps) {
  // Configuration des types d'opération
  const operationConfig = {
    DEPOT: {
      label: 'Dépôt',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      bgColor: 'bg-green-500',
      textColor: 'text-green-700',
      bgLight: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    RETRAIT: {
      label: 'Retrait',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
      bgColor: 'bg-red-500',
      textColor: 'text-red-700',
      bgLight: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    GAIN_MONTANTE: {
      label: 'Gain montante',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    PERTE_MONTANTE: {
      label: 'Perte montante',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgLight: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    REMBOURSEMENT: {
      label: 'Remboursement',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      bgColor: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgLight: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  }

  // Grouper par date
  const groupedByDate = historique.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {} as Record<string, HistoriqueItem[]>)

  if (historique.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun mouvement pour cette période</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex items-center mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <h3 className="px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {date}
            </h3>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Événements de la journée */}
          <div className="space-y-4">
            {items.map((item, index) => {
              const config = operationConfig[item.typeOperation]
              const isPositive = item.montant > 0

              return (
                <div key={item.id} className="relative flex items-start">
                  {/* Ligne verticale (sauf pour le dernier) */}
                  {index < items.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300"></div>
                  )}

                  {/* Icône */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${config.bgColor} text-white shadow-lg`}>
                    {config.icon}
                  </div>

                  {/* Contenu */}
                  <div className={`ml-4 flex-1 ${config.bgLight} ${config.borderColor} border rounded-lg p-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`font-semibold ${config.textColor}`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{item.description}</p>
                        
                        {/* Lien vers la montante si applicable */}
                        {item.montante && (
                          <Link 
                            href={`/montante/${item.montante.id}`}
                            className="inline-flex items-center text-[#1e40af] hover:text-[#fbbf24] text-sm font-medium transition-colors"
                          >
                            <span>Voir la montante "{item.montante.nom}"</span>
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        )}
                      </div>
                      
                      {/* Montant */}
                      <div className="text-right ml-4">
                        <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{formatEuro(Math.abs(item.montant))}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Solde: {formatEuro(item.montantApres)}
                        </p>
                      </div>
                    </div>

                    {/* Barre de progression du solde */}
                    <div className="mt-3 flex items-center space-x-2 text-xs text-gray-600">
                      <span>{formatEuro(item.montantAvant)}</span>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{
                            width: '100%',
                            transform: item.montantAvant > 0 
                              ? `scaleX(${Math.min(item.montantApres / item.montantAvant, 2)})` 
                              : 'scaleX(1)'
                          }}
                        />
                      </div>
                      <span className="font-medium">{formatEuro(item.montantApres)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}