import { EnrichedPlayer } from '@/lib/player/types'
import { scoreTeam } from './scoreTeam'

type SwapImpactResult = {
  newScoreA: number
  newScoreB: number
  newDelta: number
  deltaChange: number
}

export function calculateSwapImpact(
  teamA: EnrichedPlayer[],
  teamB: EnrichedPlayer[],
  playerAId: string,
  playerBId: string
): SwapImpactResult {
  const playerA = teamA.find(p => p.playerId === playerAId)
  const playerB = teamB.find(p => p.playerId === playerBId)

  if (!playerA || !playerB) {
    throw new Error('Players must exist in their respective teams')
  }

  const newTeamA = teamA.map(p =>
    p.playerId === playerAId ? playerB : p
  )

  const newTeamB = teamB.map(p =>
    p.playerId === playerBId ? playerA : p
  )

  const newScoreA = scoreTeam(newTeamA)
  const newScoreB = scoreTeam(newTeamB)

  const oldDelta = Math.abs(
    scoreTeam(teamA) - scoreTeam(teamB)
  )
  const newDelta = Math.abs(newScoreA - newScoreB)

  return {
    newScoreA,
    newScoreB,
    newDelta,
    deltaChange: newDelta - oldDelta,
  }
}
