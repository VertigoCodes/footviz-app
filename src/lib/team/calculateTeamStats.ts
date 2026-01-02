import { EnrichedPlayer } from '@/lib/player/types'

export type TeamStats = {
  physical: number
  attack: number
  defense: number
  playmaking: number
  mobility: number
  overall: number
}

export function calculateTeamStats(
  team: EnrichedPlayer[]
): TeamStats {
  if (team.length === 0) {
    return {
      physical: 0,
      attack: 0,
      defense: 0,
      playmaking: 0,
      mobility: 0,
      overall: 0,
    }
  }

  const sum = team.reduce(
    (acc, p) => {
      acc.physical += p.derived.physical
      acc.attack += p.derived.attack
      acc.defense += p.derived.defense
      acc.playmaking += p.derived.playmaking
      acc.mobility += p.derived.mobility
      acc.overall += p.derived.overall
      return acc
    },
    {
      physical: 0,
      attack: 0,
      defense: 0,
      playmaking: 0,
      mobility: 0,
      overall: 0,
    }
  )

  const size = team.length

  return {
    physical: Math.round(sum.physical / size),
    attack: Math.round(sum.attack / size),
    defense: Math.round(sum.defense / size),
    playmaking: Math.round(sum.playmaking / size),
    mobility: Math.round(sum.mobility / size),
    overall: Math.round(sum.overall / size),
  }
}
