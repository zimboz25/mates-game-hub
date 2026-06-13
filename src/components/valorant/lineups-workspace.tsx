"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  LineupImportance,
  LineupSide,
  ValorantLineup,
  ValorantLineupGroup,
} from "@/lib/types/valorant";
import {
  DEFAULT_AGENT_ID,
  DEFAULT_MAP_ID,
  getAgentUtilities,
  getValorantAgent,
  getValorantMap,
} from "@/lib/valorant/lineups";
import {
  fetchGroupedLineups,
  getMapSourceId,
  groupStratsLineups,
  transformGroupedLineups,
} from "@/lib/valorant/strats-api";
import { LineupsSidebar } from "@/components/valorant/lineups-sidebar";
import { LineupsMapCanvas } from "@/components/valorant/lineups-map-canvas";
import { LineupDetailPanel } from "@/components/valorant/lineup-detail-panel";

const ALL_IMPORTANCE = new Set<LineupImportance>([
  "essential",
  "useful",
  "niche",
]);

export function LineupsWorkspace() {
  const searchParams = useSearchParams();
  const initialMap = searchParams.get("map") ?? DEFAULT_MAP_ID;

  const [mapId, setMapId] = useState(initialMap);
  const [side, setSide] = useState<LineupSide>("attack");
  const [agentId, setAgentId] = useState(DEFAULT_AGENT_ID);
  const [hiddenUtilities, setHiddenUtilities] = useState<Set<string>>(
    new Set(),
  );
  const [importance, setImportance] =
    useState<Set<LineupImportance>>(ALL_IMPORTANCE);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedLineup, setSelectedLineup] = useState<ValorantLineup | null>(
    null,
  );
  const [lineups, setLineups] = useState<ValorantLineup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const map = getValorantMap(mapId) ?? getValorantMap(DEFAULT_MAP_ID)!;
  const agent = getValorantAgent(agentId);
  const utilities = getAgentUtilities(agentId);

  const filteredLineups = useMemo(
    () =>
      lineups.filter(
        (lineup) =>
          lineup.importance && importance.has(lineup.importance) &&
          !hiddenUtilities.has(lineup.utilityId),
      ),
    [lineups, importance, hiddenUtilities],
  );

  const groups = useMemo(
    () => groupStratsLineups(filteredLineups),
    [filteredLineups],
  );

  useEffect(() => {
    if (!map || !agent) return;

    const characterId = agent.id;
    const utilityIds = utilities.map((util) => util.id);

    let cancelled = false;

    async function loadLineups() {
      setLoading(true);
      setError(null);

      try {
        const grouped = await fetchGroupedLineups({
          mapSourceId: getMapSourceId(map, side),
          characterId,
          side,
          importance,
          utilityIds,
        });

        if (cancelled) return;

        const nextLineups = transformGroupedLineups(grouped, map.id, side);
        setLineups(nextLineups);
      } catch (err) {
        if (!cancelled) {
          setLineups([]);
          setError(err instanceof Error ? err.message : "Failed to load lineups");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLineups();

    return () => {
      cancelled = true;
    };
  }, [map, agent, side, importance, utilities]);

  const resetSelection = useCallback(() => {
    setSelectedGroupId(null);
    setSelectedLineup(null);
  }, []);

  const handleMapChange = useCallback(
    (nextMapId: string) => {
      setMapId(nextMapId);
      resetSelection();
    },
    [resetSelection],
  );

  const handleSideChange = useCallback(
    (nextSide: LineupSide) => {
      setSide(nextSide);
      resetSelection();
    },
    [resetSelection],
  );

  const handleAgentChange = useCallback(
    (nextAgentId: string) => {
      setAgentId(nextAgentId);
      setHiddenUtilities(new Set());
      resetSelection();
    },
    [resetSelection],
  );

  const handleToggleUtility = useCallback(
    (utilityId: string) => {
      setHiddenUtilities((prev) => {
        const next = new Set(prev);
        if (next.has(utilityId)) next.delete(utilityId);
        else next.add(utilityId);
        return next;
      });
      resetSelection();
    },
    [resetSelection],
  );

  const handleToggleImportance = useCallback((value: LineupImportance) => {
    setImportance((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        if (next.size === 1) return prev;
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
    resetSelection();
  }, [resetSelection]);

  const handleSelectGroup = useCallback((groupId: string | null) => {
    setSelectedGroupId(groupId);
    setSelectedLineup(null);
  }, []);

  const handleSelectLineup = useCallback((lineup: ValorantLineup | null) => {
    setSelectedLineup(lineup);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:flex-row">
      <LineupsSidebar
        mapId={mapId}
        side={side}
        agentId={agentId}
        hiddenUtilities={hiddenUtilities}
        importance={importance}
        lineupCount={lineups.length}
        onMapChange={handleMapChange}
        onSideChange={handleSideChange}
        onAgentChange={handleAgentChange}
        onToggleUtility={handleToggleUtility}
        onToggleImportance={handleToggleImportance}
      />

      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <LineupsMapCanvas
          map={map}
          side={side}
          groups={groups}
          selectedGroupId={selectedGroupId}
          selectedLineupId={selectedLineup?.id ?? null}
          loading={loading}
          onSelectGroup={handleSelectGroup}
          onSelectLineup={handleSelectLineup}
        />

        {error && !loading && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-[#0a1219]/95 px-4 py-2 text-sm text-[#ef4444] ring-1 ring-[#ef4444]/30">
            {error}
          </div>
        )}

        {selectedLineup && (
          <LineupDetailPanel
            lineup={selectedLineup}
            map={map}
            side={side}
            onClose={() => setSelectedLineup(null)}
          />
        )}
      </div>
    </div>
  );
}
