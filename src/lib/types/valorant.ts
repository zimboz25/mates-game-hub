export type LineupSide = "attack" | "defense";

export type LineupImportance = "essential" | "useful" | "niche";

/** @deprecated Use utilityId + utilityIconUrl from strats.gg instead */
export type LineupAbilityIcon =
  | "sova_recon"
  | "sova_shock"
  | "post_plant_molly"
  | "post_plant_grenade"
  | "viper_molly"
  | "brim_molly"
  | "kayo_flash";

export interface MapPoint {
  x: number;
  y: number;
}

export interface ValorantMapSource {
  id: string;
  minimap: string;
}

export interface ValorantMap {
  id: string;
  name: string;
  thumbnail: string;
  image: string;
  /** Default attacker minimap (strats.gg SVG) */
  minimap: string;
  sources: {
    attack: ValorantMapSource;
    defense: ValorantMapSource;
  };
}

export interface ValorantAgentUtility {
  id: string;
  name: string;
  icon: string;
}

export interface ValorantAgent {
  id: string;
  name: string;
  icon: string;
  role: string;
  primaryColor?: string;
  lineColor?: string;
  utilities: ValorantAgentUtility[];
}

export interface ValorantLineupDetails {
  description: string;
  standImage: string;
  aimImage: string;
  videoUrl?: string;
  chargeLevel?: number;
  bounceCount?: number;
  notes: string[];
}

export interface ValorantLineup {
  id: string;
  groupId: string;
  mapId: string;
  name: string;
  agent: string;
  agentId: string;
  ability: string;
  utilityId: string;
  utilityIconUrl: string;
  side: LineupSide;
  site: string;
  importance: LineupImportance;
  stand: MapPoint;
  landing: MapPoint;
  trajectory?: MapPoint[];
  details: ValorantLineupDetails;
}

export interface ValorantLineupGroup {
  id: string;
  mapId: string;
  agentId: string;
  agent: string;
  ability: string;
  utilityId: string;
  utilityIconUrl: string;
  side: LineupSide;
  importance: LineupImportance;
  landing: MapPoint;
  lineups: ValorantLineup[];
}

export interface LineupsFilterState {
  mapId: string;
  side: LineupSide;
  agentId: string;
  hiddenUtilities: Set<string>;
  importance: Set<LineupImportance>;
}
