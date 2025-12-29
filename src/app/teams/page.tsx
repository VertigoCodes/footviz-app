'use client'

import { useEffect, useState } from 'react'

type Player = {
  playerId: string
  name: string
  primaryPosition: string
  derived: {
    overall: number
  }
}

type TeamResult = {
  teamA: Player[]
  teamB: Player[]
  scoreA: number
  scoreB: number
  delta: number
}

export default function TeamsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [result, setResult] = useState<TeamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* Load players */
  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(json => setPlayers(json.data ?? []))
  }, [])

  function togglePlayer(id: string) {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const isValidSelection =
    selectedIds.length >= 2 && selectedIds.length % 2 === 0

  async function generateTeams() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/teams/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIds: selectedIds }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate teams')
      }

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Team Generator
      </h1>

      {/* Player selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {players.map(player => (
          <label
            key={player.playerId}
            className="flex items-center gap-2 border p-2 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(player.playerId)}
              onChange={() => togglePlayer(player.playerId)}
            />
            <span className="flex-1">
              {player.name}
            </span>
            <span className="text-sm text-gray-500">
              {player.derived.overall}
            </span>
          </label>
        ))}
      </div>

      {/* Action */}
      <button
        className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        disabled={!isValidSelection || loading}
        onClick={generateTeams}
      >
        {loading ? 'Generating…' : 'Generate Teams'}
      </button>

      {!isValidSelection && (
        <p className="text-sm text-gray-500 mt-2">
          Select an even number of players (minimum 2)
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded p-4">
            <h2 className="font-medium mb-2">
              Team A (Avg {result.scoreA})
            </h2>
            <ul className="space-y-1">
              {result.teamA.map(p => (
                <li key={p.playerId}>
                  {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-medium mb-2">
              Team B (Avg {result.scoreB})
            </h2>
            <ul className="space-y-1">
              {result.teamB.map(p => (
                <li key={p.playerId}>
                  {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 text-center font-medium">
            Balance delta:{' '}
            <span
              className={
                result.delta <= 2
                  ? 'text-green-600'
                  : 'text-amber-600'
              }
            >
              {result.delta}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
