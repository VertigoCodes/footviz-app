type RadarStat = {
  label: string
  leftValue: number
  rightValue: number
}

type ComparisonRadarProps = {
  stats: RadarStat[]
  size?: number
}

export default function ComparisonRadar({
  stats,
  size = 260,
}: ComparisonRadarProps) {
  const center = size / 2
  const radius = size / 2 - 30
  const angleStep = (2 * Math.PI) / stats.length

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
      {stats.map((_, i) => {
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

      {/* Player A */}
      <polygon
        points={polygon(stats.map(s => s.leftValue))}
        fill="rgba(59,130,246,0.35)"
        stroke="rgb(59,130,246)"
        strokeWidth={2}
      />

      {/* Player B */}
      <polygon
        points={polygon(stats.map(s => s.rightValue))}
        fill="rgba(245,158,11,0.35)"
        stroke="rgb(245,158,11)"
        strokeWidth={2}
      />

      {/* Labels */}
      {stats.map((stat, i) => {
        const { x, y } = point(i * angleStep, 115)
        const leftWins = stat.leftValue > stat.rightValue
        const rightWins = stat.rightValue > stat.leftValue

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
                ? 'rgb(59,130,246)'
                : rightWins
                ? 'rgb(245,158,11)'
                : '#374151'
            }
            fontWeight={leftWins || rightWins ? 600 : 400}
          >
            {stat.label}
          </text>
        )
      })}
    </svg>
  )
}
