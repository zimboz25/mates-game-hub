"use client";

import { useMemo } from "react";
import type { LineupSide, ValorantLineup, ValorantLineupGroup, ValorantMap } from "@/lib/types/valorant";
import { getUtilityColor } from "@/lib/valorant/lineups";
import { getMapMinimap } from "@/lib/valorant/strats-api";
import { LineupTypeIcon } from "@/components/valorant/lineup-type-icon";

interface LineupsMapCanvasProps {
  map: ValorantMap;
  side: LineupSide;
  groups: ValorantLineupGroup[];
  selectedGroupId: string | null;
  selectedLineupId: string | null;
  loading?: boolean;
  onSelectGroup: (groupId: string | null) => void;
  onSelectLineup: (lineup: ValorantLineup | null) => void;
}

export function LineupsMapCanvas({
  map,
  side,
  groups,
  selectedGroupId,
  selectedLineupId,
  loading = false,
  onSelectGroup,
  onSelectLineup,
}: LineupsMapCanvasProps) {
  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? null,
    [groups, selectedGroupId],
  );
  const minimap = getMapMinimap(map, side);

  return (
    <div className="relative flex h-full min-h-[420px] flex-1 items-center justify-center bg-[#0f1923] p-4 lg:min-h-0">
      <div className="relative aspect-square w-full max-w-[min(100%,720px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={minimap}
          alt={`${map.name} top-down minimap`}
          className="h-full w-full rounded-lg object-contain"
        />

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {selectedGroup &&
            selectedGroup.lineups.map((lineup) => {
              const points = lineup.trajectory ?? [lineup.stand, lineup.landing];
              const path = points
                .map(
                  (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
                )
                .join(" ");
              const color = getUtilityColor(lineup.agentId);
              const active = lineup.id === selectedLineupId;

              return (
                <g key={lineup.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={active ? 0.6 : 0.35}
                    strokeDasharray={active ? undefined : "1.5 1"}
                    opacity={active ? 1 : 0.55}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
        </svg>

        {!selectedGroup &&
          groups.map((group) => (
            <LandingGroupMarker
              key={group.id}
              group={group}
              onClick={() => onSelectGroup(group.id)}
            />
          ))}

        {selectedGroup && (
          <>
            <LandingGroupMarker
              group={selectedGroup}
              expanded
              onClose={() => {
                onSelectGroup(null);
                onSelectLineup(null);
              }}
            />
            {selectedGroup.lineups.map((lineup) => (
              <StandPointMarker
                key={lineup.id}
                lineup={lineup}
                selected={lineup.id === selectedLineupId}
                onClick={() => onSelectLineup(lineup)}
              />
            ))}
          </>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
            <p className="rounded-lg bg-[#0a1219]/90 px-4 py-3 text-sm text-[#8b978f]">
              Loading lineups…
            </p>
          </div>
        )}

        {!loading && groups.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
            <p className="rounded-lg bg-[#0a1219]/90 px-4 py-3 text-sm text-[#8b978f]">
              No lineups for this filter. Try another agent or map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingGroupMarker({
  group,
  expanded = false,
  onClick,
  onClose,
}: {
  group: ValorantLineupGroup;
  expanded?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}) {
  const count = group.lineups.length;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${group.landing.x}%`, top: `${group.landing.y}%` }}
    >
      {expanded && onClose && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="absolute -right-3 -top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#0f1923] text-xs text-[#ece8e1] ring-1 ring-[#334155] hover:bg-[#ff4655]"
          aria-label="Close group"
        >
          ✕
        </button>
      )}
      <div
        className={`relative flex items-center justify-center ${
          expanded ? "scale-110" : ""
        }`}
        title={`${group.ability} — ${count} lineup${count === 1 ? "" : "s"}`}
      >
        {!expanded && onClick ? (
          <button
            type="button"
            onClick={onClick}
            className="transition-transform hover:scale-110"
          >
            <LineupTypeIcon
              iconUrl={group.utilityIconUrl}
              label={group.ability}
              agentId={group.agentId}
              size="lg"
            />
          </button>
        ) : (
          <LineupTypeIcon
            iconUrl={group.utilityIconUrl}
            label={group.ability}
            agentId={group.agentId}
            size="lg"
          />
        )}
        {count > 1 && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#0f1923] px-0.5 text-[8px] font-bold text-white ring-1 ring-white/80">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

function StandPointMarker({
  lineup,
  selected,
  onClick,
}: {
  lineup: ValorantLineup;
  selected: boolean;
  onClick: () => void;
}) {
  const color = getUtilityColor(lineup.agentId);

  return (
    <button
      type="button"
      onClick={onClick}
      title={lineup.name}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4655] ${
        selected ? "z-20 scale-125" : "z-10"
      }`}
      style={{ left: `${lineup.stand.x}%`, top: `${lineup.stand.y}%` }}
    >
      <span
        className={`block rounded-full border border-white shadow-md ${
          selected ? "h-2.5 w-2.5" : "h-2 w-2"
        }`}
        style={{ backgroundColor: color }}
      />
    </button>
  );
}
