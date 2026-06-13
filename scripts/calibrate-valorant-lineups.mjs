/**
 * Regenerates map bounds and lineup coordinates from Valorant API callouts.
 * Run: node scripts/calibrate-valorant-lineups.mjs
 */
import fs from "node:fs";

const mapsPath = "src/data/valorant/maps.json";
const lineupsPath = "src/data/valorant/lineups.json";

const LINEUP_CALLOUTS = {
  "ascent-a-main-recon": { stand: ["A", "Lobby"], landing: ["A", "Site"] },
  "ascent-a-site-shock": { stand: ["A", "Main"], landing: ["A", "Site"] },
  "ascent-b-market-molly": { stand: ["Mid", "Market"], landing: ["B", "Site"] },
  "bind-a-short-recon": { stand: ["A", "Lobby"], landing: ["A", "Site"] },
  "bind-b-long-molly": { stand: ["B", "Long"], landing: ["B", "Site"] },
  "haven-c-long-recon": { stand: ["C", "Long"], landing: ["C", "Site"] },
};

function rawPercent(callout, map) {
  return {
    x: (callout.location.x * map.xMultiplier + map.xScalarToAdd) * 100,
    y: (callout.location.y * map.yMultiplier + map.yScalarToAdd) * 100,
  };
}

function boundsFromCallouts(callouts, map) {
  const points = callouts.map((c) => rawPercent(c, map));
  return {
    minX: Math.min(...points.map((p) => p.x)),
    maxX: Math.max(...points.map((p) => p.x)),
    minY: Math.min(...points.map((p) => p.y)),
    maxY: Math.max(...points.map((p) => p.y)),
  };
}

function toNorm(point, bounds) {
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  return {
    x: +(((point.x - bounds.minX) / width) * 100).toFixed(1),
    y: +(((point.y - bounds.minY) / height) * 100).toFixed(1),
  };
}

function midpoint(a, b) {
  return {
    x: +((a.x + b.x) / 2).toFixed(1),
    y: +((a.y + b.y) / 2).toFixed(1),
  };
}

function findCallout(callouts, [region, name]) {
  return callouts.find(
    (c) => c.superRegionName === region && c.regionName === name,
  );
}

async function main() {
  const api = await fetch("https://valorant-api.com/v1/maps").then((r) =>
    r.json(),
  );
  const maps = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
  const lineups = JSON.parse(fs.readFileSync(lineupsPath, "utf8"));

  const boundsByMapId = {};

  for (const map of maps) {
    const apiMap = api.data.find((m) => m.displayName === map.name);
    if (!apiMap) continue;

    const bounds = boundsFromCallouts(apiMap.callouts, apiMap);
    boundsByMapId[map.id] = bounds;
    map.bounds = {
      minX: +bounds.minX.toFixed(1),
      maxX: +bounds.maxX.toFixed(1),
      minY: +bounds.minY.toFixed(1),
      maxY: +bounds.maxY.toFixed(1),
    };
  }

  for (const lineup of lineups) {
    const refs = LINEUP_CALLOUTS[lineup.id];
    if (!refs) continue;

    const apiMap = api.data.find((m) => m.uuid === maps.find((x) => x.id === lineup.mapId)?.uuid);
    const bounds = boundsByMapId[lineup.mapId];
    const standCallout = findCallout(apiMap.callouts, refs.stand);
    const landingCallout = findCallout(apiMap.callouts, refs.landing);

    if (!standCallout || !landingCallout) {
      console.warn(`Missing callouts for ${lineup.id}`);
      continue;
    }

    const stand = toNorm(rawPercent(standCallout, apiMap), bounds);
    const landing = toNorm(rawPercent(landingCallout, apiMap), bounds);

    lineup.stand = stand;
    lineup.landing = landing;
    lineup.trajectory = [stand, midpoint(stand, landing), landing];
    console.log(`${lineup.id}: stand ${JSON.stringify(stand)} landing ${JSON.stringify(landing)}`);
  }

  fs.writeFileSync(mapsPath, JSON.stringify(maps, null, 2));
  fs.writeFileSync(lineupsPath, JSON.stringify(lineups, null, 2));
  console.log("Calibrated maps and lineups.");
}

main();
