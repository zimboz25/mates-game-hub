import fs from "node:fs";

const mapsPath = "src/data/valorant/maps.json";
const maps = JSON.parse(fs.readFileSync(mapsPath, "utf8"));

const updated = maps.map((map) => {
  const minimap = `https://media.valorant-api.com/maps/${map.uuid}/displayicon.png`;
  return { ...map, minimap, image: minimap };
});

fs.writeFileSync(mapsPath, JSON.stringify(updated, null, 2));
console.log(`Updated ${updated.length} maps with top-down minimaps.`);
