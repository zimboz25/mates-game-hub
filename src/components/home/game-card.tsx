import Link from "next/link";
import type { GameThemeId } from "@/lib/constants/game-themes";
import { GAME_THEMES } from "@/lib/constants/game-themes";

export interface GameTool {
  name: string;
  title: string;
  description: string;
  href?: string;
  cta: string;
  secondaryCta?: { label: string; href: string };
  features: string[];
  comingSoon?: boolean;
}

export interface GameSection {
  id: string;
  title: string;
  theme: GameThemeId;
  tools: GameTool[];
}

interface GameCardProps {
  game: GameSection;
  tool: GameTool;
}

export function GameCard({ game, tool }: GameCardProps) {
  const theme = GAME_THEMES[game.theme];

  return (
    <article
      className="rounded-xl border p-6 backdrop-blur-sm"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
      }}
    >
      <p
        className="mb-2 text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: theme.accent }}
      >
        {game.title}
      </p>
      <h3
        className="mb-2 text-2xl font-semibold"
        style={{ color: theme.text }}
      >
        {tool.title}
      </h3>
      <p className="mb-6" style={{ color: theme.textMuted }}>
        {tool.description}
      </p>
      <div className="mb-6 flex flex-wrap gap-4">
        {tool.comingSoon || !tool.href ? (
          <span
            className={`cursor-not-allowed rounded-lg px-6 py-3 font-medium opacity-60 ${theme.buttonPrimary}`}
          >
            {tool.cta}
          </span>
        ) : (
          <Link
            href={tool.href}
            className={`rounded-lg px-6 py-3 font-medium ${theme.buttonPrimary}`}
          >
            {tool.cta}
          </Link>
        )}
        {tool.secondaryCta && (
          <Link
            href={tool.secondaryCta.href}
            className={`rounded-lg px-6 py-3 ${theme.buttonSecondary}`}
          >
            {tool.secondaryCta.label}
          </Link>
        )}
      </div>
      <ul className="space-y-2 text-sm" style={{ color: theme.textMuted }}>
        {tool.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span style={{ color: theme.accent }}>•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
