'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ComparisonRow from '@/components/ComparisonRow'
import RadarComparison from '@/components/RadarComparison'
import { derivedToRadarMetrics } from '@/lib/radar/adapters'

type Player = {
  playerId: string
  name: string
  derived: {
    physical: number
    attack: number
    defense: number
    playmaking: number
    mobility: number
    overall: number
  }
}

export default function ComparePageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [players, setPlayers] = useState<Player[]>([])
  const [leftId, setLeftId] = useState<string | null>(null)
  const [rightId, setRightId] = useState<string | null>(null)

  const left = players.find(p => p.playerId === leftId)
  const right = players.find(p => p.playerId === rightId)

  /* Load players */
  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(json => setPlayers(json.data ?? []))
  }, [])

  /* Init from URL */
  useEffect(() => {
    const l = searchParams.get('left')
    const r = searchParams.get('right')

    if (l) setLeftId(l)
    if (r) setRightId(r)
  }, [searchParams])

  /* Sync URL */
  useEffect(() => {
    const params = new URLSearchParams()
    if (leftId) params.set('left', leftId)
    if (rightId) params.set('right', rightId)

    router.replace(`/compare?${params.toString()}`, { scroll: false })
  }, [leftId, rightId, router])

  if (!left || !right) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">
          Player Comparison
        </h1>

        <select
          className="border p-2 w-full mb-3"
          value={leftId ?? ''}
          onChange={e => setLeftId(e.target.value || null)}
        >
          <option value="">Select Player A</option>
          {players.map(p => (
            <option key={p.playerId} value={p.playerId}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full"
          value={rightId ?? ''}
          onChange={e => setRightId(e.target.value || null)}
        >
          <option value="">Select Player B</option>
          {players.map(p => (
            <option key={p.playerId} value={p.playerId}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const radarStats = [
    { label: 'Physical', leftValue: left.derived.physical, rightValue: right.derived.physical },
    { label: 'Attack', leftValue: left.derived.attack, rightValue: right.derived.attack },
    { label: 'Defense', leftValue: left.derived.defense, rightValue: right.derived.defense },
    { label: 'Playmaking', leftValue: left.derived.playmaking, rightValue: right.derived.playmaking },
    { label: 'Mobility', leftValue: left.derived.mobility, rightValue: right.derived.mobility },
  ]

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">
        Player Comparison
      </h1>

      <RadarComparison
      left={{
        name: left.name,
        color: '#2563eb',
        metrics: derivedToRadarMetrics(left.derived),
      }}
      right={{
        name: right.name,
        color: '#dc2626',
        metrics: derivedToRadarMetrics(right.derived),
      }}
      />


      <div className="border rounded mt-6">
        <ComparisonRow 
          label="Overall" 
          leftValue={left.derived.overall} 
          rightValue={right.derived.overall} 
          leftColor='#2563eb'
          rightColor='#dc2626'
        />
        {radarStats.map(stat => (
          <ComparisonRow
            key={stat.label}
            label={stat.label}
            leftValue={stat.leftValue}
            rightValue={stat.rightValue}
            leftColor='#2563eb'
            rightColor='#dc2626'
          />
        ))}
      </div>
    </div>
  )
}
