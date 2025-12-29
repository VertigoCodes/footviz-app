export type ComparablePlayer = {
  playerId: string
  name: string
  primaryPosition: string

  attributes: {
    pace: number
    agility: number
    stamina: number
    strength: number
    defense: number
    passing: number
    shooting: number
    gameIQ: number
  }

  derived: {
    physical: number
    defense: number
    attack: number
    playmaking: number
    mobility: number
    overall: number
  }

  tags: string[]
}
