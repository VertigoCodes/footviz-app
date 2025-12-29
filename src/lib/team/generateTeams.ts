import { EnrichedPlayer } from '@/lib/player/types'
import { scoreTeam } from './scoreTeam'

type TeamResult = {
  teamA: EnrichedPlayer[]
  teamB: EnrichedPlayer[]
  scoreA: number
  scoreB: number
  delta: number
}

export function generateTeams(players: EnrichedPlayer[]): TeamResult {
  if (players.length % 2 !== 0) {
    throw new Error('Number of players must be even')
  }

  const sorted = [...players].sort(
    (a, b) => b.derived.overall - a.derived.overall
  )

  const teamA: EnrichedPlayer[] = []
  const teamB: EnrichedPlayer[] = []

  sorted.forEach((player, index) => {
    if (index % 2 === 0) {
      teamA.push(player)
    } else {
      teamB.push(player)
    }
  })

  const scoreA = scoreTeam(teamA)
  const scoreB = scoreTeam(teamB)

  return {
    teamA,
    teamB,
    scoreA,
    scoreB,
    delta: Math.abs(scoreA - scoreB),
  }
}
