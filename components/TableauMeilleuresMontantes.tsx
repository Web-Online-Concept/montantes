import Link from 'next/link'
import { formatEuro, formatPourcentage } from '@/types'

interface MontanteTop {
  id: string
  nom: string
  etat: string
  roi: number
  nombrePaliers: number
  duree: number | null
}

interface TableauMeilleuresMontantesProps {
  montantes: MontanteTop[]
}

export default function TableauMeilleuresMontantes({ montantes }: TableauMeilleuresMontantesProps) {
  // Fonction pour obtenir la médaille selon le rang
  const getMedaille = (index: number) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}.`
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Rang</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Montante</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">ROI</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Paliers</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Durée</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {montantes.map((montante, index) => (
            <tr 
              key={montante.id} 
              className={`border-b hover:bg-gray-50 transition-colors ${
                index < 3 ? 'bg-yellow-50' : ''
              }`}
            >
              {/* Rang */}
              <td className="py-4 px-4">
                <span className="text-2xl">
                  {getMedaille(index)}
                </span>
              </td>
              
              {/* Nom de la montante */}
              <td className="py-4 px-4">
                <div>
                  <p className="font-semibold text-gray-900">{montante.nom}</p>
                </div>
              </td>
              
              {/* ROI */}
              <td className="py-4 px-4 text-center">
                <span className={`text-lg font-bold ${
                  montante.roi > 100 ? 'text-green-600' : 
                  montante.roi > 50 ? 'text-blue-600' : 
                  'text-gray-600'
                }`}>
                  {formatPourcentage(montante.roi)}
                </span>
                {montante.roi > 200 && (
                  <span className="ml-1 text-lg">🔥</span>
                )}
              </td>
              
              {/* Nombre de paliers */}
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {montante.nombrePaliers}
                </span>
              </td>
              
              {/* Durée */}
              <td className="py-4 px-4 text-center">
                <span className="text-sm text-gray-600">
                  {montante.duree ? `${montante.duree}j` : '< 1j'}
                </span>
              </td>
              
              {/* Action */}
              <td className="py-4 px-4 text-center">
                <Link
                  href={`/montante/${montante.id}`}
                  className="inline-flex items-center text-[#1e40af] hover:text-[#fbbf24] font-medium transition-colors"
                >
                  <span className="mr-1">Voir</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {montantes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune montante réussie pour cette période</p>
        </div>
      )}
      
      {/* Légende */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <span>ROI supérieur à 200%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-4 bg-yellow-50 rounded"></div>
          <span>Top 3</span>
        </div>
      </div>
    </div>
  )
}