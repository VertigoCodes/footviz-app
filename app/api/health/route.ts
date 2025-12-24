import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export async function GET() {
  try {
    const client = await clientPromise
    await client.db('football-db').listCollections().toArray()

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
    })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      { status: 'error' },
      { status: 500 }
    )
  }
}
