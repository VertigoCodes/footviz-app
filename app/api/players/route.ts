import {NextResponse} from 'next/server'

export async function GET() {
  console.log('GET /api/players called')

  const players = [
    {
      id: '1',
      name: 'Aadi',
      position: 'CM',
      stats: {
        pace: 7,
        passing: 9,
        shooting: 6,
        defending: 7,
        stamina: 8,
      },
    },
    {
      id: '2',
      name: 'Kesav',
      position: 'RB',
      stats: {
        pace: 8,
        passing: 6,
        shooting: 5,
        defending: 9,
        stamina: 7,
      },
    },
  ]

  return NextResponse.json({
    success: true,
    count: players.length,
    data: players,
  })
}
