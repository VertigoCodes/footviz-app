type RadarStat = {
  label: string
  value: number // 0–100
}

type PlayerRadarProps = {
  stats: RadarStat[]
  size?: number
}

export default function PlayerRadar({
  stats,
  size = 180,
}: PlayerRadarProps) {
  const center = size / 2
  const radius = size / 2 - 20
  const angleStep = (2 * Math.PI) / stats.length

  function polarToCartesian(angle: number, value: number) {
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle - Math.PI / 2),
      y: center + r * Math.sin(angle - Math.PI / 2),
    }
  }

  const points = stats
    .map((stat, i) => {
      const angle = i * angleStep
      const { x, y } = polarToCartesian(angle, stat.value)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {[20, 40, 60, 80, 100].map(level => {
        const r = (level / 100) * radius
        return (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        )
      })}

      {/* Axes */}
      {stats.map((_, i) => {
        const angle = i * angleStep
        const { x, y } = polarToCartesian(angle, 100)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={points}
        fill="rgba(34,197,94,0.3)"
        stroke="rgb(34,197,94)"
        strokeWidth={2}
      />

      {/* Labels */}
      {stats.map((stat, i) => {
        const angle = i * angleStep
        const { x, y } = polarToCartesian(angle, 115)
        return (
          <text
            key={stat.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#374151"
          >
            {stat.label}
          </text>
        )
      })}
    </svg>
  )
}
