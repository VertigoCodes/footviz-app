'use client'

import { useEffect, useState } from 'react'
import PageContainer from '@/components/PageContainer'

type Player = {
  _id: string
  name: string
  position: string
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

    <ul className="space-y-2">
      {players.map(player => (
        <li
          key={player._id}
          className="border p-3 rounded"
        >
          <div className="font-medium">{player.name}</div>
          <div className="text-sm text-gray-600">
            {player.position}
          </div>
        </li>
      ))}
    </ul>
  </PageContainer>
)

}
