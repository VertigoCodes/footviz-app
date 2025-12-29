import 'server-only'

import { MongoClient } from 'mongodb'
import { ENV } from '@/lib/env'

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

/**
 * Returns a shared MongoDB client.
 * - Lazy initialized (runtime only)
 * - Safe for Vercel serverless
 * - No build-time side effects
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (client) {
    return client
  }

  if (!clientPromise) {
    clientPromise = MongoClient.connect(ENV.MONGODB_URI)
  }

  client = await clientPromise
  return client
}
