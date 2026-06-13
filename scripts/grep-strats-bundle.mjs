import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const text = await fetch("https://strats.gg/main-GYEB2PNO.js").then((r) =>
  r.text(),
);
const out = join(tmpdir(), "strats-main.js");
writeFileSync(out, text);
console.log("saved", out, "bytes", text.length);

const patterns = [
  /api\.strats\.gg[^"'` )]+/g,
  /internal\/api\/[^"'` )]+/g,
  /games\/valorant\/[^"'` )]+/g,
  /lineupsService[^;]{0,500}/g,
];

for (const pattern of patterns) {
  const matches = [...text.matchAll(pattern)].map((m) => m[0]);
  console.log("\n", pattern, [...new Set(matches)].slice(0, 25));
}

// Find lazy chunk references
const chunks = [...text.matchAll(/["'](chunk-[^"']+\.js)["']/g)].map((m) => m[1]);
console.log("\nchunks", [...new Set(chunks)].slice(0, 20));

for (const chunk of [...new Set(chunks)].slice(0, 15)) {
  const url = `https://strats.gg/${chunk}`;
  const chunkText = await fetch(url).then((r) => r.text());
  const apis = [
    ...chunkText.matchAll(/internal\/api\/v1\/[^"'` )]+/g),
  ].map((m) => m[0]);
  if (apis.length) {
    console.log(chunk, [...new Set(apis)]);
  }
}
