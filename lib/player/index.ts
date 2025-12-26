import { Player, EnrichedPlayer } from './types'
import { computeDerivedMetrics } from './derived'
import { getPlayerTags } from './tags'

export function enrichPlayer(player: Player): EnrichedPlayer {
  return {
    ...player,
    derived: computeDerivedMetrics(player.attributes),
    tags: getPlayerTags(player.attributes),
  }
}
