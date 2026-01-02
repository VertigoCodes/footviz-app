'use client'

import { useState } from 'react'

export type RadarMetric = {
  label: string
  value: number
}

export type RadarDataset = {
  name: string
  color: string
  metrics: RadarMetric[]
}

type RadarComparisonProps = {
  left: RadarDataset
  right: RadarDataset
  size?: number
}

export default function RadarComparison({
  left,
  right,
  size = 280,
}: RadarComparisonProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const center = size / 2
  const radius = size / 2 - 32
  const angleStep = (2 * Math.PI) / left.metrics.length

  function point(angle: number, value: number) {
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle - Math.PI / 2),
      y: center + r * Math.sin(angle - Math.PI / 2),
    }
  }

  function polygon(values: number[]) {
    return values
      .map((v, i) => {
        const { x, y } = point(i * angleStep, v)
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Legend */}
      <div className="flex gap-4 text-sm font-medium">
        <LegendItem color={left.color} label={left.name} />
        <LegendItem color={right.color} label={right.name} />
      </div>

      <svg width={size} height={size} className="mx-auto">
        {/* Grid */}
        {[20, 40, 60, 80, 100].map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            fill="none"
            stroke="#e5e7eb"
          />
        ))}

        {/* Axes */}
        {left.metrics.map((_, i) => {
          const { x, y } = point(i * angleStep, 100)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
            />
          )
        })}

        {/* Left polygon */}
        <polygon
          points={polygon(left.metrics.map(m => m.value))}
          fill={hexToRgba(left.color, 0.35)}
          stroke={left.color}
          strokeWidth={2}
        />

        {/* Right polygon */}
        <polygon
          points={polygon(right.metrics.map(m => m.value))}
          fill={hexToRgba(right.color, 0.35)}
          stroke={right.color}
          strokeWidth={2}
        />

        {/* Hover dots */}
        {left.metrics.map((m, i) => {
          const lp = point(i * angleStep, m.value)
          const rp = point(i * angleStep, right.metrics[i].value)

          return (
            <g key={m.label}>
              <circle
                cx={lp.x}
                cy={lp.y}
                r={hoverIndex === i ? 4 : 2.5}
                fill={left.color}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              <circle
                cx={rp.x}
                cy={rp.y}
                r={hoverIndex === i ? 4 : 2.5}
                fill={right.color}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            </g>
          )
        })}

        {/* Labels */}
        {left.metrics.map((stat, i) => {
          const { x, y } = point(i * angleStep, 115)
          const leftVal = stat.value
          const rightVal = right.metrics[i].value

          const leftWins = leftVal > rightVal
          const rightWins = rightVal > leftVal

          return (
            <text
              key={stat.label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill={
                leftWins
                  ? left.color
                  : rightWins
                  ? right.color
                  : '#374151'
              }
              fontWeight={leftWins || rightWins ? 600 : 400}
            >
              {stat.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

/* ---------- helpers ---------- */

function LegendItem({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  )
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
