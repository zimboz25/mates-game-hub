const html = await fetch("https://strats.gg/valorant/lineups").then((r) =>
  r.text(),
);
const chunks = [
  ...html.matchAll(/src="([^"]*chunk[^"]+\.js)"/g),
].map((m) => new URL(m[1], "https://strats.gg/").href);

console.log(`Found ${chunks.length} chunks`);

const apiPaths = new Set();
for (const url of chunks) {
  const text = await fetch(url).then((r) => r.text());
  for (const match of text.matchAll(
    /internal\/api\/v1\/games\/valorant\/[a-zA-Z0-9_?&=\[\]%:-]+/g,
  )) {
    apiPaths.add(match[0]);
  }
  if (
    text.includes("resources.strats") ||
    text.includes("Ascent") ||
    text.includes("lineupMap") ||
    text.includes("lineup")
  ) {
    console.log("\n===", url.split("/").pop(), "===");
    const resources = [
      ...text.matchAll(
        /resources\.strats\.gg\/images\/[a-f0-9-]+\.(?:svg|webp|png)/g,
      ),
    ].map((m) => m[0]);
    console.log("resources:", [...new Set(resources)].slice(0, 20));
    const apiUrls = [
      ...text.matchAll(/https?:\/\/[^"'` ]+strats[^"'` ]+/g),
    ].map((m) => m[0]);
    console.log("urls:", [...new Set(apiUrls)].slice(0, 20));
    const mapNames = [
      ...text.matchAll(
        /"(Ascent|Bind|Haven|Split|Fracture|Breeze|Lotus|Sunset|Pearl|Icebox|Abyss|Corrode)"/g,
      ),
    ].map((m) => m[1]);
    console.log("maps:", [...new Set(mapNames)]);
  }
}
console.log("\nAll API paths:", [...apiPaths]);
