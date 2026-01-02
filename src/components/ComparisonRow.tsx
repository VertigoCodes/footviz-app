type ComparisonRowProps = {
  label: string
  leftValue: number
  rightValue: number
  leftColor?: string
  rightColor?: string
}

export default function ComparisonRow({
  label,
  leftValue,
  rightValue,
  leftColor = '#2563eb',  // blue-600
  rightColor = '#d97706', // amber-600
}: ComparisonRowProps) {
  const max = Math.max(leftValue, rightValue) || 1
  const leftPct = (leftValue / max) * 100
  const rightPct = (rightValue / max) * 100

  const leftWins = leftValue > rightValue
  const rightWins = rightValue > leftValue

  return (
    <div className="py-2 border-b text-sm">
      <div className="grid grid-cols-3 mb-1 items-center">
        <div
          className="text-right font-medium"
          style={{ color: leftWins ? leftColor : undefined }}
        >
          {leftValue}
        </div>

        <div className="text-center text-gray-600">
          {label}
        </div>

        <div
          className="text-left font-medium"
          style={{ color: rightWins ? rightColor : undefined }}
        >
          {rightValue}
        </div>
      </div>

      <div className="flex gap-1 h-2">
        <div
          style={{
            width: `${leftPct}%`,
            backgroundColor: leftColor,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            width: `${rightPct}%`,
            backgroundColor: rightColor,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  )
}
