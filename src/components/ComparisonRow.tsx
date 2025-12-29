type ComparisonRowProps = {
  label: string
  leftValue: number
  rightValue: number
}

export default function ComparisonRow({
  label,
  leftValue,
  rightValue,
}: ComparisonRowProps) {
  const max = Math.max(leftValue, rightValue)
  const leftPct = (leftValue / max) * 100
  const rightPct = (rightValue / max) * 100

  const leftWins = leftValue > rightValue
  const rightWins = rightValue > leftValue

  return (
    <div className="py-2 border-b text-sm">
      <div className="grid grid-cols-3 mb-1">
        <div
          className={`text-right font-medium ${
            leftWins ? 'text-blue-600' : ''
          }`}
        >
          {leftValue}
        </div>
        <div className="text-center text-gray-600">
          {label}
        </div>
        <div
          className={`text-left font-medium ${
            rightWins ? 'text-amber-600' : ''
          }`}
        >
          {rightValue}
        </div>
      </div>

      <div className="flex gap-1 h-2">
        <div
          className="bg-blue-500"
          style={{ width: `${leftPct}%` }}
        />
        <div
          className="bg-amber-500"
          style={{ width: `${rightPct}%` }}
        />
      </div>
    </div>
  )
}
