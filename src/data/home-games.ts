import type { GameSection } from "@/components/home/game-card";

export const homeGames: GameSection[] = [
  {
    id: "nba-2k26",
    title: "NBA 2K26",
    theme: "nba-2k26",
    tools: [
      {
        name: "build-planner",
        title: "NBA 2K26 Build Planner",
        description:
          "Input your MyPLAYER build and get auto-computed max potentials, badge eligibility, VC upgrade suggestions, and cap breaker optimization.",
        href: "/build",
        cta: "Start Building",
        secondaryCta: { label: "View Results", href: "/results" },
        features: [
          "Auto max potentials from height, weight, wingspan, and position",
          "43 badges with Bronze through Legend tier requirements",
          "VC optimizer ranked by badge impact per VC spent",
          "Cap breaker allocation plans with specialization constraints",
        ],
      },
    ],
  },
  {
    id: "valorant",
    title: "Valorant",
    theme: "valorant",
    tools: [
      {
        name: "lineups",
        title: "Lineup Library",
        description:
          "Pick a map, browse top-down lineup markers, and open stand position, aim reference, and utility details for each spot.",
        href: "/valorant/lineups",
        cta: "Browse Lineups",
        features: [
          "Map picker with top-down lineup markers",
          "Agent-specific icons for darts, mollies, and nades",
          "Stand and aim reference images with power levels",
          "Filter by site and attack/defense side",
        ],
      },
    ],
  },
];
