export type Position = 'GK' | 'DEF' | 'MID' | 'ATT'
export type PreferredFoot = 'Left' | 'Right' | 'Both'

export interface PlayerAttributes {
  pace: number
  agility: number
  stamina: number
  strength: number
  defense: number
  passing: number
  shooting: number
  gameIQ: number
}

export interface Player {
  playerId: string
  name: string
  primaryPosition: Position
  secondaryPositions?: Position[]
  preferredFoot: PreferredFoot
  age?: number
  attributes: PlayerAttributes
}

export interface PlayerDerivedMetrics {
  physical: number
  defense: number
  attack: number
  playmaking: number
  mobility: number
  overall: number
}

export type PlayerTag =
  | 'Wall'
  | 'Cheetah'
  | 'Maestro'
  | 'Engine'
  | 'Finisher'
  | 'Anchor'

export interface EnrichedPlayer extends Player {
  derived: PlayerDerivedMetrics
  tags: PlayerTag[]
}
