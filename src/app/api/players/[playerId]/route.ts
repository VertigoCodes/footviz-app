import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'
import { enrichPlayer } from '@/lib/player'
import { Player } from '@/lib/player/types'

export async function GET(
  _req: Request,
  context: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await context.params

  const client = await getMongoClient()
  const db = client.db()

  const player = await db
    .collection<Player>('players')
    .findOne({ playerId })

  if (!player) {
    return NextResponse.json(
      { error: 'Player not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    data: enrichPlayer(player),
  })
}
