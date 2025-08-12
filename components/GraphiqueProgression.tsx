'use client'

import { useEffect, useRef } from 'react'
import { formatEuro } from '@/types'

interface GraphiqueProgressionProps {
  data: Array<{
    montantApres: number
    createdAt: string
    typeOperation: string
  }>
}

export default function GraphiqueProgression({ data }: GraphiqueProgressionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration du canvas pour le retina
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Dimensions
    const padding = { top: 20, right: 20, bottom: 50, left: 80 }
    const width = rect.width - padding.left - padding.right
    const height = rect.height - padding.top - padding.bottom

    // Calculer min/max
    const values = data.map(d => d.montantApres)
    const minValue = Math.min(...values) * 0.95
    const maxValue = Math.max(...values) * 1.05
    const range = maxValue - minValue

    // Fonction pour convertir les valeurs en coordonnées
    const getX = (index: number) => padding.left + (index / (data.length - 1)) * width
    const getY = (value: number) => padding.top + height - ((value - minValue) / range) * height

    // Effacer le canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Dessiner la grille
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])

    // Lignes horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (height / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + width, y)
      ctx.stroke()

      // Labels des valeurs
      const value = maxValue - (range / 5) * i
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px Inter'
      ctx.textAlign = 'right'
      ctx.fillText(formatEuro(value), padding.left - 10, y + 4)
    }

    ctx.setLineDash([])

    // Dessiner la zone sous la courbe (gradient)
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + height)
    gradient.addColorStop(0, 'rgba(251, 191, 36, 0.3)')
    gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')

    ctx.beginPath()
    ctx.moveTo(getX(0), getY(data[0].montantApres))
    data.forEach((point, i) => {
      ctx.lineTo(getX(i), getY(point.montantApres))
    })
    ctx.lineTo(getX(data.length - 1), padding.top + height)
    ctx.lineTo(getX(0), padding.top + height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Dessiner la ligne principale
    ctx.beginPath()
    ctx.moveTo(getX(0), getY(data[0].montantApres))
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    data.forEach((point, i) => {
      ctx.lineTo(getX(i), getY(point.montantApres))
    })
    ctx.stroke()

    // Dessiner les points
    data.forEach((point, i) => {
      const x = getX(i)
      const y = getY(point.montantApres)

      // Couleur selon le type d'opération
      let color = '#3b82f6' // Défaut
      if (point.typeOperation === 'GAIN_MONTANTE') color = '#10b981'
      else if (point.typeOperation === 'PERTE_MONTANTE') color = '#ef4444'
      else if (point.typeOperation === 'DEPOT') color = '#fbbf24'

      // Point extérieur
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Labels des dates (1 sur 3 pour éviter la surcharge)
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px Inter'
    ctx.textAlign = 'center'
    data.forEach((point, i) => {
      if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
        const x = getX(i)
        const date = new Date(point.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        })
        ctx.fillText(date, x, rect.height - 10)
      }
    })

    // Légende
    const legend = [
      { color: '#10b981', label: 'Gain' },
      { color: '#ef4444', label: 'Perte' },
      { color: '#fbbf24', label: 'Dépôt' },
      { color: '#3b82f6', label: 'Retrait' }
    ]

    let legendX = padding.left
    legend.forEach(item => {
      // Point
      ctx.beginPath()
      ctx.arc(legendX, 10, 4, 0, Math.PI * 2)
      ctx.fillStyle = item.color
      ctx.fill()

      // Label
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px Inter'
      ctx.textAlign = 'left'
      ctx.fillText(item.label, legendX + 10, 14)

      legendX += 80
    })

  }, [data])

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        className="w-full h-64 md:h-80"
        style={{ maxWidth: '100%' }}
      />
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Aucune donnée disponible pour cette période</p>
        </div>
      )}
    </div>
  )
}