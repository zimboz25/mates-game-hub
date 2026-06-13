import type {
  LineupImportance,
  LineupSide,
  MapPoint,
  ValorantLineup,
  ValorantLineupGroup,
} from "@/lib/types/valorant";

const API_BASE = "https://api.strats.gg/internal/api/v1";

const IMPORTANCE_TO_LEVEL: Record<LineupImportance, string> = {
  essential: "easy",
  useful: "medium",
  niche: "pro",
};

export interface StratsGroupedLineup {
  point: { left: number; top: number };
  lineups: StratsLineupSummary[];
}

export interface StratsLineupSummary {
  id: string;
  title: string;
  left: number;
  top: number;
  level: "easy" | "medium" | "pro";
  utility: { id: string; name: string; icon_url: string };
  points?: { left: number; top: number }[];
  image_url?: string;
  video_url?: string;
  character: { id: string; name: string; primary_color?: string };
}

export interface FetchGroupedLineupsParams {
  mapSourceId: string;
  characterId: string;
  side: LineupSide;
  importance: Set<LineupImportance>;
  utilityIds: string[];
}

function toPoint(coords: { left: number; top: number }): MapPoint {
  return {
    x: +coords.left.toFixed(4),
    y: +coords.top.toFixed(4),
  };
}

function youtubeEmbedUrl(url: string): string | undefined {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (!match) return undefined;
  return `https://www.youtube.com/embed/${match[1]}`;
}

function levelToImportance(level: string): LineupImportance {
  if (level === "medium") return "useful";
  if (level === "pro") return "niche";
  return "essential";
}

function siteFromTitle(title: string): string {
  const match = title.match(/\b([ABC])\b/i);
  return match ? match[1].toUpperCase() : "—";
}

export async function fetchGroupedLineups({
  mapSourceId,
  characterId,
  importance,
  utilityIds,
}: FetchGroupedLineupsParams): Promise<StratsGroupedLineup[]> {
  if (utilityIds.length === 0 || importance.size === 0) return [];

  const levels = [...importance]
    .map((value) => IMPORTANCE_TO_LEVEL[value])
    .join(",");
  const utilities = utilityIds.join(",");
  const url = `${API_BASE}/games/valorant/map_sources/${mapSourceId}/characters/${characterId}/lineups/grouped?level=${encodeURIComponent(levels)}&utility_id=${encodeURIComponent(utilities)}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Strats lineups failed: ${res.status}`);
  return res.json();
}

export function transformGroupedLineups(
  groups: StratsGroupedLineup[],
  mapId: string,
  side: LineupSide,
): ValorantLineup[] {
  const lineups: ValorantLineup[] = [];

  for (const group of groups) {
    const landing = toPoint(group.point);

    for (const entry of group.lineups) {
      const stand = toPoint({ left: entry.left, top: entry.top });
      const trajectory = entry.points?.length
        ? [stand, ...entry.points.map(toPoint)]
        : [stand, landing];

      const groupId = `${mapId}-${entry.utility.id}-${landing.x}-${landing.y}`;

      lineups.push({
        id: entry.id,
        groupId,
        mapId,
        name: entry.title,
        agent: entry.character.name,
        agentId: entry.character.id,
        ability: entry.utility.name,
        utilityId: entry.utility.id,
        utilityIconUrl: entry.utility.icon_url,
        side,
        site: siteFromTitle(entry.title),
        importance: levelToImportance(entry.level),
        stand,
        landing,
        trajectory,
        details: {
          description: entry.title,
          standImage: "",
          aimImage: entry.image_url ?? "",
          videoUrl: entry.video_url
            ? youtubeEmbedUrl(entry.video_url)
            : undefined,
          notes: [],
        },
      });
    }
  }

  return lineups;
}

export function groupStratsLineups(
  lineups: ValorantLineup[],
): ValorantLineupGroup[] {
  const groups = new Map<string, ValorantLineupGroup>();

  for (const lineup of lineups) {
    const existing = groups.get(lineup.groupId);
    if (existing) {
      existing.lineups.push(lineup);
      continue;
    }

    groups.set(lineup.groupId, {
      id: lineup.groupId,
      mapId: lineup.mapId,
      agentId: lineup.agentId,
      agent: lineup.agent,
      ability: lineup.ability,
      utilityId: lineup.utilityId,
      utilityIconUrl: lineup.utilityIconUrl,
      side: lineup.side,
      importance: lineup.importance,
      landing: lineup.landing,
      lineups: [lineup],
    });
  }

  return [...groups.values()];
}

export function getMapSourceId(
  map: { sources: { attack: { id: string }; defense: { id: string } } },
  side: LineupSide,
): string {
  return side === "attack" ? map.sources.attack.id : map.sources.defense.id;
}

export function getMapMinimap(
  map: {
    minimap: string;
    sources: { attack: { minimap: string }; defense: { minimap: string } };
  },
  side: LineupSide,
): string {
  return side === "attack"
    ? map.sources.attack.minimap
    : map.sources.defense.minimap;
}
