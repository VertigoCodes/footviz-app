'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'

type Player = {
  playerId: string
  name: string
  primaryPosition: string
  derived: {
    overall: number
  }
  tags: string[]
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data.data || []))
  }, [])

  return (
  <PageContainer>
    <h1 className="text-xl font-semibold mb-4">Players</h1>

    <ul className="divide-y border rounded">
      {players.map(player => (
        <li key={player.playerId}>
          <Link
            href={`/players/${player.playerId}`}
            className="block p-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{player.name}</div>
                <div className="text-sm text-gray-600">
                  {player.primaryPosition}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Overall</div>
                <div className="font-semibold">
                  {player.derived.overall}
                </div>
              </div>
            </div>

            {player.tags.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
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
          </Link>
        </li>
      ))}
    </ul>
  </PageContainer>
)

}
