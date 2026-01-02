import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'
import { generateTeams } from '@/lib/team'
import { enrichPlayer } from '@/lib/player'
import { Player } from '@/lib/player/types'
import { calculateTeamStats } from '@/lib/team'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { playerIds } = body

    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      return NextResponse.json(
        { error: 'playerIds must be a non-empty array' },
        { status: 400 }
      )
    }

    if (playerIds.length % 2 !== 0) {
      return NextResponse.json(
        { error: 'Number of players must be even' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    const players = await db
      .collection<Player>('players')
      .find({ playerId: { $in: playerIds } })
      .toArray()

    if (players.length !== playerIds.length) {
      return NextResponse.json(
        { error: 'One or more players not found' },
        { status: 404 }
      )
    }

    // Enrich players (derived stats + tags)
    const enrichedPlayers = players.map(enrichPlayer)

    const result = generateTeams(enrichedPlayers)

    const teamStatsA = calculateTeamStats(result.teamA)
    const teamStatsB = calculateTeamStats(result.teamB)

    return NextResponse.json({
    ...result,
    statsA: teamStatsA,
    statsB: teamStatsB,
    })} catch (err) {
    console.error('Team generation error:', err)
    return NextResponse.json(
      { error: 'Failed to generate teams' },
      { status: 500 }
    )
  }
}
