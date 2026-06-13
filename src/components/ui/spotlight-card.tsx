"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

export type GlowColor = "blue" | "purple" | "green" | "red" | "orange";

export interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  /** When true, ignores size prop and uses width/height or className */
  customSize?: boolean;
}

const glowHueMap: Record<GlowColor, number> = {
  blue: 220,
  purple: 280,
  green: 145,
  red: 0,
  orange: 28,
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
} as const;

const SPOTLIGHT_SIZE = 280;

export function GlowCard({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const hue = glowHueMap[glowColor];
  const spotlightCore = `hsl(${hue} 82% 62% / 0.55)`;
  const spotlightMid = `hsl(${hue} 82% 62% / 0.2)`;
  const borderTint = `hsl(${hue} 78% 58% / 0.28)`;

  const moveGlow = (clientX: number, clientY: number, visible: boolean) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    if (!visible) {
      glow.style.opacity = "0";
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    glow.style.opacity = "1";
    glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { clientX, clientY } = event;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      moveGlow(clientX, clientY, true);
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    moveGlow(0, 0, false);
  };

  const inlineStyles: CSSProperties = {
    borderColor: borderTint,
    width:
      width !== undefined
        ? typeof width === "number"
          ? `${width}px`
          : width
        : undefined,
    height:
      height !== undefined
        ? typeof height === "number"
          ? `${height}px`
          : height
        : undefined,
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={inlineStyles}
      className={`relative overflow-hidden rounded-2xl border bg-white/[0.04] shadow-[0_1rem_2rem_-1rem_black] ${customSize ? "" : sizeMap[size]} ${!customSize ? "aspect-[3/4]" : ""} ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[2] opacity-0 mix-blend-screen will-change-transform"
        style={{
          width: SPOTLIGHT_SIZE,
          height: SPOTLIGHT_SIZE,
          background: `radial-gradient(circle, ${spotlightCore} 0%, ${spotlightMid} 42%, transparent 68%)`,
          transition: "opacity 120ms ease",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
