const html = await fetch("https://strats.gg/valorant/lineups").then((r) =>
  r.text(),
);
console.log("html length", html.length);
const scripts = [
  ...html.matchAll(/<script[^>]+src="([^"]+)"/g),
].map((m) => m[1]);
console.log("scripts", scripts.slice(0, 15));

for (const src of scripts) {
  const url = new URL(src, "https://strats.gg/").href;
  const text = await fetch(url).then((r) => r.text());
  const lineupPaths = [
    ...text.matchAll(/valorant\/[a-z-]+/g),
  ].map((m) => m[0]);
  const apiPaths = [
    ...text.matchAll(/internal\/api\/v1\/[^"'`]+/g),
  ].map((m) => m[0]);
  if (apiPaths.length || text.includes("lineup")) {
    console.log("\n", url.split("/").pop(), "size", text.length);
    console.log("api", [...new Set(apiPaths)].slice(0, 30));
    const lineupApi = [
      ...text.matchAll(/lineup[^"'`]{0,40}/gi),
    ].map((m) => m[0]);
    console.log("lineup refs", [...new Set(lineupApi)].slice(0, 20));
  }
}
