const t = await fetch("https://strats.gg/chunk-ZP7A67L3.js").then((r) =>
  r.text(),
);
let idx = 0;
while ((idx = t.indexOf("image_url", idx + 1)) !== -1) {
  console.log(t.slice(Math.max(0, idx - 150), idx + 200));
  console.log("---");
}
