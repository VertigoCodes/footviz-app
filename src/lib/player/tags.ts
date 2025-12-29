import { PlayerAttributes, PlayerTag } from './types'

export function getPlayerTags(attr: PlayerAttributes): PlayerTag[] {
  const tags: PlayerTag[] = []

  if (attr.defense >= 75 && attr.strength >= 70) {
    tags.push('Wall')
  }

  if (attr.pace >= 80 && attr.agility >= 75) {
    tags.push('Cheetah')
  }

  if (attr.passing >= 75 && attr.gameIQ >= 80) {
    tags.push('Maestro')
  }

  if (attr.stamina >= 80 && attr.gameIQ >= 65) {
    tags.push('Engine')
  }

  if (attr.shooting >= 80 && attr.gameIQ >= 60) {
    tags.push('Finisher')
  }

  if (
    attr.defense >= 70 &&
    attr.stamina >= 70 &&
    attr.pace < 65
  ) {
    tags.push('Anchor')
  }

  return tags
}
