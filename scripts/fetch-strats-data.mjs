import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const headers = {
  Accept: "application/json",
  Origin: "https://strats.gg",
  Referer: "https://strats.gg/valorant/lineups",
};

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

const [maps, characters, valorantAgents] = await Promise.all([
  fetchJson(
    "https://api.strats.gg/internal/api/v1/games/valorant/maps?order[]=name:asc",
  ),
  fetchJson("https://api.strats.gg/internal/api/v1/games/valorant/characters"),
  fetchJson("https://valorant-api.com/v1/agents?isPlayableCharacter=true"),
]);

const valorantIconById = Object.fromEntries(
  valorantAgents.data.map((agent) => [
    agent.displayName.toLowerCase().replace(/\//g, "-"),
    agent.displayIcon,
  ]),
);

function agentIcon(char) {
  return (
    char.thumb_image_url ??
    char.full_image_url ??
    valorantIconById[char.id] ??
    null
  );
}

const mapsOut = maps.map((map) => ({
  id: map.id,
  name: map.name,
  thumbnail: map.thumb_image_url,
  image: map.full_image_url,
  minimap: map.sources.attacker.source_url,
  sources: {
    attack: {
      id: map.sources.attacker.id,
      minimap: map.sources.attacker.source_url,
    },
    defense: {
      id: map.sources.defender.id,
      minimap: map.sources.defender.source_url,
    },
  },
}));

let existingAgents = [];
try {
  existingAgents = JSON.parse(
    await import("node:fs").then((fs) =>
      fs.readFileSync(join(root, "src/data/valorant/agents.json"), "utf8"),
    ),
  );
} catch {
  /* fresh run */
}

const roleById = Object.fromEntries(
  existingAgents.map((agent) => [agent.id, agent.role]),
);

const agentsOut = characters.map((char) => ({
  id: char.id,
  name: char.name,
  icon: agentIcon(char),
  role: roleById[char.id] ?? "Unknown",
  primaryColor: char.primary_color,
  lineColor: char.line_color,
  utilities: char.utilities.map((util) => ({
    id: util.id,
    name: util.name,
    icon: util.icon_url,
  })),
}));

writeFileSync(
  join(root, "src/data/valorant/maps.json"),
  JSON.stringify(mapsOut, null, 2) + "\n",
);
writeFileSync(
  join(root, "src/data/valorant/agents.json"),
  JSON.stringify(agentsOut, null, 2) + "\n",
);

console.log(`Wrote ${mapsOut.length} maps and ${agentsOut.length} agents`);
