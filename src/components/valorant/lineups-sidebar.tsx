"use client";

import { useEffect, useRef, useState } from "react";
import type {
  LineupImportance,
  LineupSide,
  ValorantAgent,
  ValorantMap,
} from "@/lib/types/valorant";
import {
  DEFAULT_AGENT_ID,
  DEFAULT_MAP_ID,
  IMPORTANCE_OPTIONS,
  VALORANT_AGENTS,
  VALORANT_MAPS,
  getAgentUtilities,
} from "@/lib/valorant/lineups";
import { LineupTypeIcon } from "@/components/valorant/lineup-type-icon";

interface LineupsSidebarProps {
  mapId: string;
  side: LineupSide;
  agentId: string;
  hiddenUtilities: Set<string>;
  importance: Set<LineupImportance>;
  lineupCount: number;
  onMapChange: (mapId: string) => void;
  onSideChange: (side: LineupSide) => void;
  onAgentChange: (agentId: string) => void;
  onToggleUtility: (utilityId: string) => void;
  onToggleImportance: (value: LineupImportance) => void;
}

export function LineupsSidebar({
  mapId,
  side,
  agentId,
  hiddenUtilities,
  importance,
  lineupCount,
  onMapChange,
  onSideChange,
  onAgentChange,
  onToggleUtility,
  onToggleImportance,
}: LineupsSidebarProps) {
  const [mapOpen, setMapOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const selectedMap = VALORANT_MAPS.find((map) => map.id === mapId) ?? VALORANT_MAPS[0];
  const utilities = getAgentUtilities(agentId);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setMapOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#1e2d3d] bg-[#0a1219] lg:w-[280px] lg:shrink-0">
      <div className="border-b border-[#1e2d3d] p-4">
        <h1 className="text-lg font-bold tracking-tight text-[#ece8e1]">
          Lineups
        </h1>
        <p className="mt-0.5 text-xs text-[#6b7a82]">
          {lineupCount > 0
            ? `${lineupCount} lineups · strats.gg data`
            : "Filter by map, side, and agent"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div ref={mapRef}>
          <MapDropdown
            selectedMap={selectedMap}
            open={mapOpen}
            onToggle={() => setMapOpen((value) => !value)}
            onSelect={(id) => {
              onMapChange(id);
              setMapOpen(false);
            }}
          />
        </div>

        <SideToggle side={side} onChange={onSideChange} />

        <section className="mt-5">
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7a82]">
            Agents
          </h2>
          <AgentGrid
            agents={VALORANT_AGENTS}
            selectedId={agentId}
            onSelect={onAgentChange}
          />
        </section>

        {utilities.length > 0 && (
          <section className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#6b7a82]">
                Abilities
              </h2>
              <span className="text-[10px] text-[#4a5860]">Hide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {utilities.map((utility) => {
                const hidden = hiddenUtilities.has(utility.id);
                return (
                  <button
                    key={utility.id}
                    type="button"
                    title={hidden ? "Show ability" : "Hide ability"}
                    onClick={() => onToggleUtility(utility.id)}
                    className={`rounded-lg p-1 transition ${
                      hidden
                        ? "opacity-30 grayscale"
                        : "opacity-100 hover:bg-white/5"
                    }`}
                  >
                    <LineupTypeIcon
                      iconUrl={utility.icon}
                      label={utility.name}
                      agentId={agentId}
                      size="sm"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-5">
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7a82]">
            Filter
          </h2>
          <div className="flex flex-wrap gap-2">
            {IMPORTANCE_OPTIONS.map((option) => {
              const active = importance.has(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onToggleImportance(option.value)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                    active
                      ? "border-transparent text-[#0f1923]"
                      : "border-[#334155] text-[#6b7a82] hover:border-[#4a5860]"
                  }`}
                  style={active ? { backgroundColor: option.color } : undefined}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}

function MapDropdown({
  selectedMap,
  open,
  onToggle,
  onSelect,
}: {
  selectedMap: ValorantMap;
  open: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-lg border border-[#1e2d3d] bg-[#0f1923] px-3 py-2 text-left transition hover:border-[#ff4655]/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedMap.thumbnail}
          alt=""
          className="h-10 w-10 rounded object-cover"
        />
        <span className="flex-1 font-semibold text-[#ece8e1]">
          {selectedMap.name}
        </span>
        <span className="text-[#6b7a82]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-lg border border-[#1e2d3d] bg-[#0f1923] p-2 shadow-xl">
          <div className="grid grid-cols-3 gap-2">
            {VALORANT_MAPS.map((map) => (
              <button
                key={map.id}
                type="button"
                onClick={() => onSelect(map.id)}
                className={`overflow-hidden rounded-lg border transition hover:border-[#ff4655]/60 ${
                  map.id === selectedMap.id
                    ? "border-[#ff4655] ring-1 ring-[#ff4655]/50"
                    : "border-[#1e2d3d]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={map.thumbnail}
                  alt={map.name}
                  className="aspect-square w-full object-cover"
                />
                <span className="block truncate px-1 py-1 text-[10px] font-medium text-[#ece8e1]">
                  {map.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SideToggle({
  side,
  onChange,
}: {
  side: LineupSide;
  onChange: (side: LineupSide) => void;
}) {
  return (
    <div className="mt-4 flex rounded-lg border border-[#1e2d3d] bg-[#0f1923] p-1">
      {(["attack", "defense"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`flex-1 rounded-md py-2 text-xs font-semibold uppercase tracking-wide transition ${
            side === value
              ? "bg-[#ff4655] text-white"
              : "text-[#6b7a82] hover:text-[#ece8e1]"
          }`}
        >
          {value === "attack" ? "Attacking" : "Defending"}
        </button>
      ))}
    </div>
  );
}

function AgentGrid({
  agents,
  selectedId,
  onSelect,
}: {
  agents: ValorantAgent[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {agents.map((agent) => {
        const selected = agent.id === selectedId;
        return (
          <button
            key={agent.id}
            type="button"
            title={agent.name}
            onClick={() => onSelect(agent.id)}
            className={`relative aspect-square overflow-hidden rounded-lg border transition hover:border-[#ff4655]/50 ${
              selected
                ? "border-[#ff4655] ring-2 ring-[#ff4655]/40"
                : "border-[#1e2d3d]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={agent.icon}
              alt={agent.name}
              className="h-full w-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

export { DEFAULT_AGENT_ID, DEFAULT_MAP_ID };
