"use client";

import { useEffect, type ReactNode } from "react";
import type { MapPoint } from "@/lib/types/valorant";

interface LineupStandPreviewProps {
  minimapUrl: string;
  stand: MapPoint;
  agentColor: string;
  mapName: string;
  className?: string;
}

export function LineupStandPreview({
  minimapUrl,
  stand,
  agentColor,
  mapName,
  className = "",
}: LineupStandPreviewProps) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg border border-[#1e2d3d] bg-[#0f1923] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={minimapUrl}
        alt={`${mapName} minimap`}
        className="h-full w-full object-contain"
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${stand.x}%`, top: `${stand.y}%` }}
      >
        <span
          className="block h-3 w-3 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: agentColor }}
        />
        <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
          Stand
        </span>
      </div>
    </div>
  );
}

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-[#0f1923]/90 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 hover:bg-[#ff4655]"
        aria-label="Close enlarged image"
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[min(100%,960px)] rounded-lg object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

interface ClickablePreviewProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

export function ClickablePreview({
  label,
  onClick,
  children,
}: ClickablePreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full cursor-zoom-in text-left"
      aria-label={`Enlarge ${label}`}
    >
      {children}
      <span className="mt-1.5 block text-[10px] text-[#6b7a82] transition group-hover:text-[#ece8e1]">
        Click to enlarge
      </span>
    </button>
  );
}

interface StandLightboxProps {
  minimapUrl: string;
  stand: MapPoint;
  agentColor: string;
  mapName: string;
  onClose: () => void;
}

export function StandLightbox({
  minimapUrl,
  stand,
  agentColor,
  mapName,
  onClose,
}: StandLightboxProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Where to stand"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-[#0f1923]/90 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 hover:bg-[#ff4655]"
        aria-label="Close enlarged image"
      >
        ✕
      </button>
      <div
        className="relative aspect-square w-full max-w-[min(100%,720px)]"
        onClick={(event) => event.stopPropagation()}
      >
        <LineupStandPreview
          minimapUrl={minimapUrl}
          stand={stand}
          agentColor={agentColor}
          mapName={mapName}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
