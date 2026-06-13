export type GameThemeId = "hub" | "nba-2k26" | "valorant";

export const GAME_THEMES: Record<
  GameThemeId,
  {
    label: string;
    accent: string;
    accentMuted: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    navBg: string;
    navBorder: string;
    navBrand: string;
    cardBg: string;
    cardBorder: string;
    buttonPrimary: string;
    buttonSecondary: string;
  }
> = {
  hub: {
    label: "BurgBuild",
    accent: "#fafafa",
    accentMuted: "#d4d4d4",
    surface: "#0a0a0a",
    border: "#262626",
    text: "#fafafa",
    textMuted: "#a3a3a3",
    navBg: "#000000",
    navBorder: "#262626",
    navBrand: "#ffffff",
    cardBg: "#141414",
    cardBorder: "#262626",
    buttonPrimary: "bg-white text-black hover:bg-neutral-200",
    buttonSecondary:
      "border border-neutral-600 text-neutral-200 hover:bg-neutral-900",
  },
  "nba-2k26": {
    label: "NBA 2K26",
    accent: "#6ee7d7",
    accentMuted: "#5eead4",
    surface: "#0a0606",
    border: "#5c1a1a",
    text: "#f5f5f5",
    textMuted: "#a8a29e",
    navBg: "#0d0808",
    navBorder: "rgba(127, 29, 29, 0.4)",
    navBrand: "#f87171",
    cardBg: "rgba(10, 6, 6, 0.85)",
    cardBorder: "rgba(127, 29, 29, 0.45)",
    buttonPrimary: "bg-[#6ee7d7] text-[#0a0606] hover:bg-[#5eead4]",
    buttonSecondary:
      "border border-red-900/50 text-red-100 hover:bg-red-950/40",
  },
  valorant: {
    label: "Valorant",
    accent: "#ff4655",
    accentMuted: "#ff6b77",
    surface: "#0f1923",
    border: "#ff4655",
    text: "#ece8e1",
    textMuted: "#8b978f",
    navBg: "#0f1923",
    navBorder: "rgba(255, 70, 85, 0.35)",
    navBrand: "#ff4655",
    cardBg: "rgba(15, 25, 35, 0.9)",
    cardBorder: "rgba(255, 70, 85, 0.4)",
    buttonPrimary: "bg-[#ff4655] text-white hover:bg-[#ff6b77]",
    buttonSecondary:
      "border border-[#ff4655]/50 text-[#ece8e1] hover:bg-[#ff4655]/10",
  },
};

export function getGameThemeForPath(pathname: string): GameThemeId {
  if (
    pathname.startsWith("/build") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/calibrate")
  ) {
    return "nba-2k26";
  }

  if (pathname.startsWith("/valorant")) {
    return "valorant";
  }

  return "hub";
}
