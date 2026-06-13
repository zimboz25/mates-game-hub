import { getUtilityColor } from "@/lib/valorant/lineups";

interface LineupTypeIconProps {
  iconUrl: string;
  label: string;
  agentId?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showBorder?: boolean;
}

export function LineupTypeIcon({
  iconUrl,
  label,
  agentId,
  size = "md",
  className = "",
  showBorder = true,
}: LineupTypeIconProps) {
  const dimension =
    size === "xs"
      ? "h-2.5 w-2.5"
      : size === "sm"
        ? "h-3.5 w-3.5"
        : size === "lg"
          ? "h-5 w-5"
          : "h-4 w-4";
  const border = showBorder ? "border border-white/90 shadow-md" : "";
  const ringColor = agentId ? getUtilityColor(agentId) : "#7fe5fb";

  return (
    <span
      title={label}
      className={`inline-flex items-center justify-center rounded-full bg-[#0f1923] ${border} ${dimension} ${className}`}
      style={{ boxShadow: showBorder ? `0 0 0 1px ${ringColor}` : undefined }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt=""
        className={`rounded-full object-cover ${dimension}`}
      />
    </span>
  );
}
