import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { enrichPlayer } from '@/lib/player'
import { Player } from '@/lib/player/types'
import { WithId, Document } from 'mongodb'

// type PlayerDocument = WithId<Document> & Player

function isValidPlayer(body: any) {
  if (!body) return false
  if (typeof body.name !== 'string') return false
  if (typeof body.position !== 'string') return false

  const stats = body.stats
  if (!stats) return false

  const requiredStats = ['pace', 'passing', 'shooting', 'defending', 'stamina']
  for (const stat of requiredStats) {
    if (typeof stats[stat] !== 'number') return false
  }

  return true
}

export async function GET() {
  console.log('GET /api/players')

  try {
    const client = await getMongoClient()
    const db = client.db()

    const players = await db
      .collection<Player>('players')
      .find()
      .toArray()

    const enriched = players.map(enrichPlayer)

    return NextResponse.json({
      data: enriched,
    })
  } catch (error) {
    console.error('Error fetching players:', error)

    return NextResponse.json(
      { success: false, message: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  console.log('POST /api/players')
  
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    if (!isValidPlayer(body)) {
      return NextResponse.json(
        { success: false, message: 'Invalid player payload' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db('football-db')

    const result = await db.collection('players').insertOne({
      name: body.name,
      position: body.position,
      stats: body.stats,
      createdAt: new Date(),
    })

    console.log('Player created:', result.insertedId)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error('Error creating player:', error)

    return NextResponse.json(
      { success: false, message: 'Failed to create player' },
      { status: 500 }
    )
  }
}
