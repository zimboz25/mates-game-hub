const headers = {
  Accept: "application/json",
  Origin: "https://strats.gg",
  Referer: "https://strats.gg/valorant/lineups",
};

const base =
  "https://api.strats.gg/internal/api/v1/games/valorant/map_sources/ascent-attacker/characters/sova/lineups/grouped";

const combos = [
  ["easy", "recon-dart"],
  ["medium", "recon-dart"],
  ["pro", "recon-dart"],
  ["easy,medium,pro", "recon-dart"],
  ["easy,medium,pro", "recon-dart,shock-dart,double-shock-dart,owl-drone,hunter-s-fury"],
  ["easy", "recon-dart,shock-dart"],
];

for (const [level, util] of combos) {
  const url = `${base}?level=${encodeURIComponent(level)}&utility_id=${encodeURIComponent(util)}`;
  const data = await fetch(url, { headers }).then((r) => r.json());
  console.log(level, util, Array.isArray(data) ? data.length : data);
  if (Array.isArray(data) && data.length) {
    console.log(JSON.stringify(data[0], null, 2).slice(0, 2500));
    break;
  }
}
