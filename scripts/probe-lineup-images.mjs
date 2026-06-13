const headers = { Accept: "application/json" };
const grouped = await fetch(
  "https://api.strats.gg/internal/api/v1/games/valorant/map_sources/ascent-attacker/characters/sova/lineups/grouped?level=easy,medium,pro&utility_id=recon-dart,shock-dart",
  { headers },
).then((r) => r.json());

const keys = new Set();
for (const group of grouped.slice(0, 10)) {
  for (const lineup of group.lineups) {
    Object.keys(lineup).forEach((k) => keys.add(k));
    const detail = await fetch(
      `https://api.strats.gg/internal/api/v1/lineups/${lineup.id}`,
      { headers },
    ).then((r) => r.json());
    Object.keys(detail).forEach((k) => keys.add(`detail:${k}`));
    if (detail.images || detail.stand || detail.aim) {
      console.log(lineup.id, detail);
    }
  }
}
console.log([...keys].sort().join("\n"));
