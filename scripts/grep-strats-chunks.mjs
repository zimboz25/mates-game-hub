const main = await fetch("https://strats.gg/main-GYEB2PNO.js").then((r) =>
  r.text(),
);
const chunkNames = [
  ...main.matchAll(/\.\/chunk-[A-Z0-9]+\.js/g),
].map((m) => m[0].replace("./", ""));
console.log("chunk count", chunkNames.length);

const apiHits = new Map();

for (const chunk of [...new Set(chunkNames)]) {
  const url = `https://strats.gg/${chunk}`;
  const text = await fetch(url).then((r) => r.text());
  const apis = [
    ...text.matchAll(/internal\/api\/v1\/[^"'` )]+/g),
  ].map((m) => m[0]);
  const lineupApis = [
    ...text.matchAll(/valorant\/[a-z-]+(?:\?[^"'` )]*)?/g),
  ].map((m) => m[0]);
  if (apis.length || lineupApis.some((p) => p.includes("lineup"))) {
    apiHits.set(chunk, {
      apis: [...new Set(apis)],
      lineup: [...new Set(lineupApis)].filter((p) => p.includes("lineup")),
      size: text.length,
    });
  }
}

for (const [chunk, data] of apiHits) {
  console.log("\n", chunk, data);
}
