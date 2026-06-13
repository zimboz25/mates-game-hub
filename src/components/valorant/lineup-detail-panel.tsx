"use client";

import { useState } from "react";
import type { LineupSide, ValorantLineup, ValorantMap } from "@/lib/types/valorant";
import { getUtilityColor } from "@/lib/valorant/lineups";
import { getMapMinimap } from "@/lib/valorant/strats-api";
import { LineupTypeIcon } from "@/components/valorant/lineup-type-icon";
import {
  ClickablePreview,
  ImageLightbox,
  LineupStandPreview,
  StandLightbox,
} from "@/components/valorant/lineup-media";

interface LineupDetailPanelProps {
  lineup: ValorantLineup | null;
  map: ValorantMap;
  side: LineupSide;
  onClose: () => void;
}

type DetailTab = "lineup" | "video";
type LightboxView = "stand" | "aim" | null;

export function LineupDetailPanel({
  lineup,
  map,
  side,
  onClose,
}: LineupDetailPanelProps) {
  const [tab, setTab] = useState<DetailTab>("lineup");
  const [lightbox, setLightbox] = useState<LightboxView>(null);

  if (!lineup) return null;

  const hasVideo = Boolean(lineup.details.videoUrl);
  const hasAimImage = Boolean(lineup.details.aimImage);
  const minimapUrl = getMapMinimap(map, side);
  const agentColor = getUtilityColor(lineup.agentId);

  return (
    <>
      <aside className="flex h-full w-full flex-col border-l border-[#1e2d3d] bg-[#0a1219] lg:w-[340px] lg:shrink-0">
        <div className="flex items-start gap-3 border-b border-[#1e2d3d] p-4">
          <LineupTypeIcon
            iconUrl={lineup.utilityIconUrl}
            label={lineup.ability}
            agentId={lineup.agentId}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff4655]">
              {lineup.agent} · {lineup.ability}
            </p>
            <h2 className="text-base font-semibold leading-snug text-[#ece8e1]">
              {lineup.name}
            </h2>
            <p className="mt-0.5 text-xs text-[#6b7a82]">
              {lineup.side} · {lineup.site} site
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[#6b7a82] hover:bg-white/5 hover:text-white"
            aria-label="Close lineup details"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-[#1e2d3d]">
          {hasVideo && (
            <TabButton
              active={tab === "video"}
              onClick={() => setTab("video")}
              label="Video"
            />
          )}
          <TabButton
            active={tab === "lineup"}
            onClick={() => setTab("lineup")}
            label="Lineup"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "video" && lineup.details.videoUrl ? (
            <div className="aspect-video overflow-hidden rounded-lg border border-[#1e2d3d] bg-black">
              <iframe
                src={lineup.details.videoUrl}
                title={`${lineup.name} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-[#c8d0d4]">
                {lineup.details.description}
              </p>

              <div className="mt-4 space-y-4">
                <figure>
                  <figcaption className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#ff4655]">
                    Where to stand
                  </figcaption>
                  <ClickablePreview
                    label="where to stand"
                    onClick={() => setLightbox("stand")}
                  >
                    <LineupStandPreview
                      minimapUrl={minimapUrl}
                      stand={lineup.stand}
                      agentColor={agentColor}
                      mapName={map.name}
                    />
                  </ClickablePreview>
                </figure>

                {hasAimImage && (
                  <figure>
                    <figcaption className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#ff4655]">
                      Where to aim
                    </figcaption>
                    <ClickablePreview
                      label="where to aim"
                      onClick={() => setLightbox("aim")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lineup.details.aimImage}
                        alt={`Aim reference for ${lineup.name}`}
                        className="w-full rounded-lg border border-[#1e2d3d] bg-[#0f1923]"
                      />
                    </ClickablePreview>
                  </figure>
                )}
              </div>

              {!hasAimImage && !hasVideo && (
                <p className="mt-4 text-sm text-[#6b7a82]">
                  No aim reference image for this lineup.
                </p>
              )}
            </>
          )}
        </div>
      </aside>

      {lightbox === "stand" && (
        <StandLightbox
          minimapUrl={minimapUrl}
          stand={lineup.stand}
          agentColor={agentColor}
          mapName={map.name}
          onClose={() => setLightbox(null)}
        />
      )}

      {lightbox === "aim" && hasAimImage && (
        <ImageLightbox
          src={lineup.details.aimImage}
          alt={`Aim reference for ${lineup.name}`}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition ${
        active
          ? "border-b-2 border-[#ff4655] text-[#ece8e1]"
          : "text-[#6b7a82] hover:text-[#ece8e1]"
      }`}
    >
      {label}
    </button>
  );
}
