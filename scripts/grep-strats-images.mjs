const main = await fetch("https://strats.gg/main-GYEB2PNO.js").then((r) =>
  r.text(),
);
const chunks = [...main.matchAll(/\.\/(chunk-[A-Z0-9]+\.js)/g)].map((m) => m[1]);

for (const chunk of [...new Set(chunks)]) {
  const t = await fetch(`https://strats.gg/${chunk}`).then((r) => r.text());
  if (!t.includes("image_url")) continue;
  const fields = [
    ...t.matchAll(
      /[a-z_]*image[a-z_]*(?:url|Url|URL)?[^a-zA-Z0-9_][^"'` )]{0,30}/g,
    ),
  ].map((m) => m[0]);
  const unique = [...new Set(fields)].filter((f) =>
    /stand|aim|image/.test(f),
  );
  if (unique.length) console.log(chunk, unique.slice(0, 20));
}
