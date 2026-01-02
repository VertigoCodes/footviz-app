'use client'

import { useEffect, useState } from 'react'
import RadarComparison from '@/components/RadarComparison'
import { derivedToRadarMetrics } from '@/lib/radar/adapters'

type Player = {
  playerId: string
  name: string
  derived: {
    overall: number
  }
}

type TeamStats = {
  physical: number
  attack: number
  defense: number
  playmaking: number
  mobility: number
  overall: number
}

type TeamResult = {
  teamA: Player[]
  teamB: Player[]
  scoreA: number
  scoreB: number
  delta: number
  statsA: TeamStats
  statsB: TeamStats
}


export default function TeamsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [result, setResult] = useState<TeamResult | null>(null)
  const [loading, setLoading] = useState(false)

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

  async function generateTeams() {
    setLoading(true)
    const res = await fetch('/api/teams/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerIds: selectedIds }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const isValid =
    selectedIds.length >= 2 &&
    selectedIds.length % 2 === 0

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Team Generator
      </h1>

      {/* Player selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {players.map(p => (
          <label
            key={p.playerId}
            className="flex items-center gap-2 border p-2 rounded"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(p.playerId)}
              onChange={() => togglePlayer(p.playerId)}
            />
            <span className="flex-1">{p.name}</span>
            <span className="text-sm text-gray-500">
              {p.derived.overall}
            </span>
          </label>
        ))}
      </div>

      <button
        className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        disabled={!isValid || loading}
        onClick={generateTeams}
      >
        {loading ? 'Generating…' : 'Generate Teams'}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamStatsCard
              title="Team A"
              stats={result.statsA}
            />
            <TeamStatsCard
              title="Team B"
              stats={result.statsB}
            />
          </div>

            {/* Radar */}
            <div className="border rounded p-4">
            <h2 className="font-medium mb-4 text-center">
                Team Comparison
            </h2>

            <RadarComparison
            left={{
            name: 'Team A',
            color: '#2563eb',
            metrics: derivedToRadarMetrics(result.statsA),
            }}
            right={{
            name: 'Team B',
            color: '#dc2626',
            metrics: derivedToRadarMetrics(result.statsB),
            }}
            />


            </div>


          {/* Teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamList
              title={`Team A (Avg ${result.scoreA})`}
              players={result.teamA}
            />
            <TeamList
              title={`Team B (Avg ${result.scoreB})`}
              players={result.teamB}
            />
          </div>

          <div className="text-center font-medium">
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

function TeamStatsCard({
  title,
  stats,
}: {
  title: string
  stats: TeamStats
}) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-medium mb-2">{title}</h2>
      {Object.entries(stats).map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between text-sm"
        >
          <span className="capitalize">{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  )
}

function TeamList({
  title,
  players,
}: {
  title: string
  players: Player[]
}) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-medium mb-2">{title}</h2>
      <ul className="space-y-1">
        {players.map(p => (
          <li key={p.playerId}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
