import { EnrichedPlayer } from '@/lib/player/types'

export function scoreTeam(players: EnrichedPlayer[]): number {
  if (players.length === 0) return 0

  const total = players.reduce(
    (sum, player) => sum + player.derived.overall,
    0
  )

  return Math.round(total / players.length)
}
