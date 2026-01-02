'use client'

import { useEffect, useState } from 'react'
import RadarComparison from '@/components/RadarComparison'
import ComparisonRow from '@/components/ComparisonRow'
import { derivedToRadarMetrics } from '@/lib/radar/adapters'

/* =======================
   Types
======================= */

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

/* =======================
   Helpers
======================= */

function selectedSwapIds(
  swapSelection: { a?: string; b?: string } | null
): string[] {
  if (!swapSelection) return []
  return [swapSelection.a, swapSelection.b].filter(
    (id): id is string => Boolean(id)
  )
}

/* =======================
   Page
======================= */

export default function TeamsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [result, setResult] = useState<TeamResult | null>(null)
  const [previewResult, setPreviewResult] =
    useState<TeamResult | null>(null)
  const [swapSelection, setSwapSelection] = useState<{
    a?: string
    b?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const displayResult = previewResult ?? result

  /* =======================
     Data Load
  ======================= */

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(json => setPlayers(json.data ?? []))
  }, [])

  /* =======================
     Player Selection
  ======================= */

  function togglePlayer(id: string) {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const isValid =
    selectedIds.length >= 2 &&
    selectedIds.length % 2 === 0

  /* =======================
     Generate Teams
  ======================= */

  async function generateTeams() {
    setLoading(true)
    const res = await fetch('/api/teams/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerIds: selectedIds }),
    })
    const data = await res.json()
    setResult(data)
    setPreviewResult(null)
    setSwapSelection(null)
    setLoading(false)
  }

  /* =======================
     Swap Logic
  ======================= */

  function handlePlayerClick(
    team: 'A' | 'B',
    playerId: string
  ) {
    setSwapSelection(prev => {
      const next = { ...(prev ?? {}) }

      if (team === 'A') next.a = playerId
      else next.b = playerId

      if (next.a && next.b) {
        previewSwap(next.a, next.b)
      }

      return next
    })
  }

  async function previewSwap(aId: string, bId: string) {
    if (!result) return

    const res = await fetch('/api/teams/preview-swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseResult: result,
        swap: {
          fromA: aId,
          fromB: bId,
        },
      }),
    })

    const data = await res.json()
    setPreviewResult(data)
  }

  /* =======================
     Render
  ======================= */

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Team Generator
      </h1>

      {/* Player Selection */}
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
      {displayResult && (
        <>
          {/* Teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <TeamList
              title={`Team A`}
              players={displayResult.teamA}
              team="A"
              selectedPlayerIds={selectedSwapIds(swapSelection)}
              onPlayerClick={handlePlayerClick}
            />
            <TeamList
              title={`Team B`}
              players={displayResult.teamB}
              team="B"
              selectedPlayerIds={selectedSwapIds(swapSelection)}
              onPlayerClick={handlePlayerClick}
            />
          </div>

          {/* Radar */}
          <div className="border rounded p-4 mt-6">
            <h2 className="font-medium mb-4 text-center">
              Team Comparison
            </h2>

            <RadarComparison
              left={{
                name: 'Team A',
                color: '#2563eb',
                metrics: derivedToRadarMetrics(
                  displayResult.statsA
                ),
              }}
              right={{
                name: 'Team B',
                color: '#dc2626',
                metrics: derivedToRadarMetrics(
                  displayResult.statsB
                ),
              }}
            />
          </div>

          {/* Confirm / Cancel */}
          {previewResult && (
            <div className="flex gap-4 justify-center mt-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => {
                  setResult(previewResult)
                  setPreviewResult(null)
                  setSwapSelection(null)
                }}
              >
                Confirm Swap
              </button>

              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setPreviewResult(null)
                  setSwapSelection(null)
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Stat Comparison */}
          <div className="border rounded mt-6">
            <ComparisonRow
              label="Overall"
              leftValue={displayResult.statsA.overall}
              rightValue={displayResult.statsB.overall}
              leftColor="#2563eb"
              rightColor="#dc2626"
            />

            {[
              ['Physical', 'physical'],
              ['Attack', 'attack'],
              ['Defense', 'defense'],
              ['Playmaking', 'playmaking'],
              ['Mobility', 'mobility'],
            ].map(([label, key]) => (
              <ComparisonRow
                key={label}
                label={label}
                leftValue={
                  displayResult.statsA[key as keyof TeamStats]
                }
                rightValue={
                  displayResult.statsB[key as keyof TeamStats]
                }
                leftColor="#2563eb"
                rightColor="#dc2626"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* =======================
   Team List
======================= */

function TeamList({
  title,
  players,
  team,
  selectedPlayerIds = [],
  onPlayerClick,
}: {
  title: string
  players: Player[]
  team: 'A' | 'B'
  selectedPlayerIds?: string[]
  onPlayerClick: (team: 'A' | 'B', playerId: string) => void
}) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-medium mb-2">{title}</h2>
      <ul className="space-y-1">
        {players.map(p => {
          const isSelected =
            selectedPlayerIds.includes(p.playerId)

          return (
            <li
              key={p.playerId}
              onClick={() =>
                onPlayerClick(team, p.playerId)
              }
              className={`cursor-pointer rounded px-2 py-1 border ${
                isSelected
                  ? 'border-yellow-500 bg-transparent font-medium'
                  : 'border-transparent hover:border-gray-100'
              }`}
            >
              {p.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
