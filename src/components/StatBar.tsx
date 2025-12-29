export default function StatBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-black rounded"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
