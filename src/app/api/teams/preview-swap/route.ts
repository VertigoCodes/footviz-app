import { NextResponse } from 'next/server'
import { calculateTeamStats } from '@/lib/team'

export async function POST(req: Request) {
  try {
    const { baseResult, swap } = await req.json()

    const teamA = [...baseResult.teamA]
    const teamB = [...baseResult.teamB]

    const indexA = teamA.findIndex(
      (p: any) => p.playerId === swap.fromA
    )
    const indexB = teamB.findIndex(
      (p: any) => p.playerId === swap.fromB
    )

    if (indexA === -1 || indexB === -1) {
      return NextResponse.json(
        { error: 'Invalid swap players' },
        { status: 400 }
      )
    }

    // Swap players
    const temp = teamA[indexA]
    teamA[indexA] = teamB[indexB]
    teamB[indexB] = temp

    // Recompute stats
    const statsA = calculateTeamStats(teamA)
    const statsB = calculateTeamStats(teamB)

    const scoreA = statsA.overall
    const scoreB = statsB.overall
    const delta = Math.abs(scoreA - scoreB)

    return NextResponse.json({
      teamA,
      teamB,
      statsA,
      statsB,
      scoreA,
      scoreB,
      delta,
    })
  } catch (err) {
    console.error('Preview swap failed', err)
    return NextResponse.json(
      { error: 'Preview swap failed' },
      { status: 500 }
    )
  }
}
