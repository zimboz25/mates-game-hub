import agentsData from "@/data/valorant/agents.json";
import mapsData from "@/data/valorant/maps.json";
import type {
  LineupImportance,
  LineupSide,
  ValorantAgent,
  ValorantMap,
} from "@/lib/types/valorant";

export const VALORANT_MAPS = mapsData as ValorantMap[];
export const VALORANT_AGENTS = agentsData as ValorantAgent[];

export const DEFAULT_MAP_ID = "ascent";
export const DEFAULT_AGENT_ID = "sova";

export const IMPORTANCE_OPTIONS: {
  value: LineupImportance;
  label: string;
  color: string;
}[] = [
  { value: "essential", label: "Essential", color: "#22c55e" },
  { value: "useful", label: "Useful", color: "#eab308" },
  { value: "niche", label: "Niche", color: "#ef4444" },
];

export function getValorantMap(mapId: string): ValorantMap | undefined {
  return VALORANT_MAPS.find((map) => map.id === mapId);
}

export function getValorantAgent(agentId: string): ValorantAgent | undefined {
  return VALORANT_AGENTS.find((agent) => agent.id === agentId);
}

export function getAgentUtilities(agentId: string) {
  return getValorantAgent(agentId)?.utilities ?? [];
}

export function getUtilityColor(agentId: string): string {
  return getValorantAgent(agentId)?.primaryColor ?? "#7fe5fb";
}
