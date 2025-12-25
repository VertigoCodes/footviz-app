import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      password.length < 6
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('football-db')
    const users = db.collection('users')

    const userCount = await users.countDocuments()

    if (userCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Setup already completed' },
        { status: 403 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await users.insertOne({
      username,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error('Setup error:', error)

    return NextResponse.json(
      { success: false, message: 'Setup failed' },
      { status: 500 }
    )
  }
}
