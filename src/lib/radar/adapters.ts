type DerivedStats = {
  physical: number
  attack: number
  defense: number
  playmaking: number
  mobility: number
}

export function derivedToRadarMetrics(
  derived: DerivedStats
) {
  return [
    { label: 'Physical', value: derived.physical },
    { label: 'Attack', value: derived.attack },
    { label: 'Defense', value: derived.defense },
    { label: 'Playmaking', value: derived.playmaking },
    { label: 'Mobility', value: derived.mobility },
  ]
}
