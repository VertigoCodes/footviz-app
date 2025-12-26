export interface PlayerAttributes {
  pace: number;
  agility: number;
  stamina: number;
  strength: number;
  defense: number;
  passing: number;
  shooting: number;
  gameIQ: number;
}

export interface Player {
  playerId: string;
  name: string;
  primaryPosition: "GK" | "DEF" | "MID" | "ATT";
  secondaryPositions?: ("DEF" | "MID" | "ATT")[];
  preferredFoot: "Left" | "Right" | "Both";
  age?: number;
  attributes: PlayerAttributes;
}

export interface PlayerDerivedMetrics {
  physical: number;
  defense: number;
  attack: number;
  playmaking: number;
  mobility: number;
  overall: number;
}

export type PlayerTag =
  | "Wall"
  | "Cheetah"
  | "Maestro"
  | "Engine"
  | "Finisher"
  | "Anchor";

export interface PlayerTags {
  tags: PlayerTag[];
}

export interface EnrichedPlayer extends Player {
  derived: PlayerDerivedMetrics;
  tags: PlayerTag[];
}

