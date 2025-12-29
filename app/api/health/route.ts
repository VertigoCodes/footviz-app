import 'server-only'

import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'

export async function GET() {
  try {
    const client = await getMongoClient()
    await client.db('football-db').listCollections().toArray()

    return NextResponse.json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      mongoVersion: info.version,
      hasMongoUri: Boolean(ENV.MONGODB_URI),
      hasAuthSecret: Boolean(ENV.NEXTAUTH_SECRET),
      hasAuthUrl: Boolean(ENV.NEXTAUTH_URL),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    log.error('Health check failed', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
      },
      { status: 500 }
    )
  }
}
