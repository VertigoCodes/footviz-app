import { getMongoClient } from '@/lib/db'

/**
 * NOTE:
 * - This script seeds RAW player data only
 * - No derived stats
 * - No tags
 * - Safe to delete and rerun
 */

const players = [
  {
    playerId: 'p1',
    name: 'Arjun',
    primaryPosition: 'DEF',
    preferredFoot: 'Right',
    attributes: {
      pace: 62,
      agility: 58,
      stamina: 78,
      strength: 82,
      defense: 85,
      passing: 60,
      shooting: 40,
      gameIQ: 75,
    },
  },
  {
    playerId: 'p2',
    name: 'Rohit',
    primaryPosition: 'MID',
    preferredFoot: 'Both',
    attributes: {
      pace: 70,
      agility: 72,
      stamina: 80,
      strength: 65,
      defense: 68,
      passing: 85,
      shooting: 65,
      gameIQ: 82,
    },
  },
  {
    playerId: 'p3',
    name: 'Karthik',
    primaryPosition: 'ATT',
    preferredFoot: 'Right',
    attributes: {
      pace: 86,
      agility: 82,
      stamina: 70,
      strength: 60,
      defense: 40,
      passing: 65,
      shooting: 84,
      gameIQ: 68,
    },
  },
  {
    playerId: 'p4',
    name: 'Sahil',
    primaryPosition: 'MID',
    preferredFoot: 'Left',
    attributes: {
      pace: 65,
      agility: 68,
      stamina: 88,
      strength: 70,
      defense: 72,
      passing: 70,
      shooting: 55,
      gameIQ: 76,
    },
  },
  {
    playerId: 'p5',
    name: 'Aditya',
    primaryPosition: 'ATT',
    preferredFoot: 'Right',
    attributes: {
      pace: 90,
      agility: 85,
      stamina: 75,
      strength: 62,
      defense: 35,
      passing: 60,
      shooting: 88,
      gameIQ: 70,
    },
  },
]

async function seedPlayers() {
  try {
    const client = await getMongoClient()
    const db = client.db()

    console.log('Seeding database:', db.databaseName)

    const collection = db.collection('players')

    // Optional but recommended: reset collection
    await collection.deleteMany({})

    const result = await collection.insertMany(players)

    console.log(`Inserted ${result.insertedCount} players`)
  } catch (error) {
    console.error('Error seeding players:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

seedPlayers()
