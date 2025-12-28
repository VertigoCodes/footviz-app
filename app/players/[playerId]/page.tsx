'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import PageContainer from '@/components/PageContainer'
import PlayerRadar from '@/components/PlayerRadar'
import StatBar from '@/components/StatBar'

type Player = {
  playerId: string
  name: string
  primaryPosition: string
  derived: {
    physical: number
    defense: number
    attack: number
    playmaking: number
    mobility: number
    overall: number
  }
  tags: string[]
}

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>()

  const [player, setPlayer] = useState<Player | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [allPlayers, setAllPlayers] = useState<
    { playerId: string; name: string }[]
  >([])

  /* Fetch selected player */
  useEffect(() => {
    if (!playerId) return

    fetch(`/api/players/${playerId}`)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data?.data) setPlayer(data.data)
      })
  }, [playerId])

  /* Fetch all players (for prev / next navigation) */
  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => {
        const minimal = (data.data || []).map((p: any) => ({
          playerId: p.playerId,
          name: p.name,
        }))
        setAllPlayers(minimal)
      })
  }, [])

  /* 404 UI */
  if (notFound) {
    return (
      <PageContainer>
        <Link
          href="/players"
          className="inline-block mb-4 text-sm text-gray-600 hover:underline"
        >
          ← Back to Players
        </Link>

        <div className="text-red-600 font-medium">
          Player not found.
        </div>
      </PageContainer>
    )
  }

  /* Loading skeleton */
  if (!player) {
    return (
      <PageContainer>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-200 rounded" />

          <div className="h-64 bg-gray-200 rounded" />

          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </PageContainer>
    )
  }

  /* Prev / Next computation */
  const index = allPlayers.findIndex(p => p.playerId === player.playerId)
  const prev =
    index > 0 ? allPlayers[index - 1] : null
  const next =
    index >= 0 && index < allPlayers.length - 1
      ? allPlayers[index + 1]
      : null

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href="/players"
        className="inline-block mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Back to Players
      </Link>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">{player.name}</h1>
        <div className="text-sm text-gray-600">
          {player.primaryPosition}
        </div>
      </div>

      {/* Radar */}
      <div className="mb-6 border p-4 rounded">
        <PlayerRadar
          data={[
            { metric: 'Physical', value: player.derived.physical },
            { metric: 'Defense', value: player.derived.defense },
            { metric: 'Attack', value: player.derived.attack },
            { metric: 'Playmaking', value: player.derived.playmaking },
            { metric: 'Mobility', value: player.derived.mobility },
          ]}
        />
      </div>

      {/* Stat bars */}
      <div className="space-y-3 mb-4">
        <StatBar label="Overall" value={player.derived.overall} />
        <StatBar label="Physical" value={player.derived.physical} />
        <StatBar label="Attack" value={player.derived.attack} />
        <StatBar label="Defense" value={player.derived.defense} />
        <StatBar label="Playmaking" value={player.derived.playmaking} />
        <StatBar label="Mobility" value={player.derived.mobility} />
      </div>

      {/* Tags */}
      {player.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {player.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-200 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Prev / Next navigation */}
      <div className="flex justify-between text-sm">
        {prev ? (
          <Link
            href={`/players/${prev.playerId}`}
            className="text-gray-600 hover:underline"
          >
            ← {prev.name}
          </Link>
        ) : <span />}

        {next ? (
          <Link
            href={`/players/${next.playerId}`}
            className="text-gray-600 hover:underline"
          >
            {next.name} →
          </Link>
        ) : <span />}
      </div>
    </PageContainer>
  )
}
