import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "valorant", "lineups");

const diagrams = [
  { path: "ascent/a-main-recon-stand.svg", title: "A Lobby — Stand", kind: "stand" },
  { path: "ascent/a-main-recon-aim.svg", title: "A Main Arch — Aim", kind: "aim" },
  { path: "ascent/a-post-shock-stand.svg", title: "A Main — Post Plant", kind: "stand" },
  { path: "ascent/a-post-shock-aim.svg", title: "A Site Default — Aim", kind: "aim" },
  { path: "ascent/b-market-molly-stand.svg", title: "Market Door — Stand", kind: "stand" },
  { path: "ascent/b-market-molly-aim.svg", title: "B Site Pipe — Aim", kind: "aim" },
  { path: "bind/a-short-recon-stand.svg", title: "Showers — Stand", kind: "stand" },
  { path: "bind/a-short-recon-aim.svg", title: "A Short Corner — Aim", kind: "aim" },
  { path: "bind/b-long-molly-stand.svg", title: "B Long Crate — Stand", kind: "stand" },
  { path: "bind/b-long-molly-aim.svg", title: "Teleporter Frame — Aim", kind: "aim" },
  { path: "haven/c-long-recon-stand.svg", title: "C Long Back — Stand", kind: "stand" },
  { path: "haven/c-long-recon-aim.svg", title: "Garage Roof — Aim", kind: "aim" },
];

function svg(title, kind) {
  const accent = kind === "stand" ? "#6ee7d7" : "#ff4655";
  const label = kind === "stand" ? "Stand here" : "Aim here";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${title}">
  <rect width="320" height="180" fill="#0f1923"/>
  <rect x="8" y="8" width="304" height="164" rx="6" fill="#1a2733" stroke="#334155"/>
  <text x="16" y="28" fill="#ece8e1" font-size="14" font-family="sans-serif" font-weight="600">${title}</text>
  <text x="16" y="48" fill="#8b978f" font-size="11" font-family="sans-serif">Placeholder — swap with in-game screenshot</text>
  <circle cx="160" cy="105" r="28" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="6 4"/>
  <circle cx="160" cy="105" r="4" fill="${accent}"/>
  <line x1="160" y1="85" x2="160" y2="125" stroke="${accent}" stroke-width="1.5"/>
  <line x1="140" y1="105" x2="180" y2="105" stroke="${accent}" stroke-width="1.5"/>
  <text x="160" y="150" text-anchor="middle" fill="${accent}" font-size="12" font-family="sans-serif">${label}</text>
</svg>`;
}

for (const diagram of diagrams) {
  const fullPath = join(root, diagram.path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, svg(diagram.title, diagram.kind));
}

console.log(`Generated ${diagrams.length} lineup diagram placeholders.`);
