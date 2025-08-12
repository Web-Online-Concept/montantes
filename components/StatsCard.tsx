import { formatEuro, formatPourcentage } from '@/types'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  variation?: number
  icon?: string
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger'
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  variation, 
  icon,
  color = 'primary' 
}: StatsCardProps) {
  
  const colorClasses = {
    primary: {
      bg: 'bg-[#1e40af]',
      bgLight: 'bg-[#1e40af]/10',
      text: 'text-[#1e40af]',
      border: 'border-[#1e40af]/20'
    },
    accent: {
      bg: 'bg-[#fbbf24]',
      bgLight: 'bg-[#fbbf24]/10',
      text: 'text-[#f59e0b]',
      border: 'border-[#fbbf24]/20'
    },
    success: {
      bg: 'bg-[#10b981]',
      bgLight: 'bg-[#10b981]/10',
      text: 'text-[#10b981]',
      border: 'border-[#10b981]/20'
    },
    warning: {
      bg: 'bg-[#f59e0b]',
      bgLight: 'bg-[#f59e0b]/10',
      text: 'text-[#f59e0b]',
      border: 'border-[#f59e0b]/20'
    },
    danger: {
      bg: 'bg-[#ef4444]',
      bgLight: 'bg-[#ef4444]/10',
      text: 'text-[#ef4444]',
      border: 'border-[#ef4444]/20'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden card-shadow">
      {/* Icône de fond */}
      {icon && (
        <div className="absolute -right-4 -top-4 text-6xl opacity-10">
          {icon}
        </div>
      )}

      {/* Contenu */}
      <div className="relative">
        {/* Titre */}
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        
        {/* Valeur principale */}
        <div className="flex items-baseline justify-between mb-3">
          <p className={`text-3xl font-black ${colors.text}`}>
            {value}
          </p>
          
          {/* Variation */}
          {variation !== undefined && (
            <div className={`flex items-center space-x-1 ${variation >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {variation >= 0 ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-bold">
                {typeof variation === 'number' ? formatPourcentage(variation) : variation}
              </span>
            </div>
          )}
        </div>
        
        {/* Sous-titre */}
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>

      {/* Barre de décoration en bas */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} />
    </div>
  )
}