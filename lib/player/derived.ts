import { PlayerAttributes, PlayerDerivedMetrics } from './types'

export function computeDerivedMetrics(
  attr: PlayerAttributes
): PlayerDerivedMetrics {
  const physical =
    attr.pace * 0.4 +
    attr.stamina * 0.3 +
    attr.strength * 0.3

  const defense =
    attr.defense * 0.6 +
    attr.strength * 0.25 +
    attr.gameIQ * 0.15

  const attack =
    attr.shooting * 0.5 +
    attr.pace * 0.25 +
    attr.agility * 0.25

  const playmaking =
    attr.passing * 0.5 +
    attr.gameIQ * 0.3 +
    attr.stamina * 0.2

  const mobility =
    attr.pace * 0.6 +
    attr.agility * 0.4

  const overall =
    physical * 0.2 +
    defense * 0.25 +
    attack * 0.25 +
    playmaking * 0.2 +
    attr.gameIQ * 0.1

  return {
    physical: Math.round(physical),
    defense: Math.round(defense),
    attack: Math.round(attack),
    playmaking: Math.round(playmaking),
    mobility: Math.round(mobility),
    overall: Math.round(overall),
  }
}
