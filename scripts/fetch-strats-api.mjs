const MAP_ASSETS = {
  Abyss: {
    minimap: "https://resources.strats.gg/images/a1cfbd37-78bb-4db3-b21a-8cff2b97bcc1.svg",
    thumbnail: "https://resources.strats.gg/images/0ea32383-0747-430f-a071-e35bd73c061e.webp",
  },
  Ascent: {
    minimap: "https://resources.strats.gg/images/3f3c6eb7-160c-4183-b41d-84e1dc7ce61b.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/198fec02-ca01-4c7b-9eb8-ada09ad9d8df.webp",
  },
  Bind: {
    minimap:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/5bae4d50-d938-44c4-982d-be4e96bd46dc.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/0e3341ff-3754-43df-ab4a-ee8c95f96981.webp",
  },
  Breeze: {
    minimap: "https://resources.strats.gg/images/8ed37e0d-1347-4be6-8b95-bca8d26a7529.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/72d2f79f-543c-462b-a665-ce02d67e9a7b.webp",
  },
  Corrode: {
    minimap: "https://resources.strats.gg/images/cfc62a9d-a99f-4dff-8660-8f98623b7c36.svg",
    thumbnail:
      "https://resources.strats.gg/images/a7377588-e8ff-418f-8083-08b3974c70f1.webp",
  },
  Fracture: {
    minimap:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/02cbd304-39ea-4a69-981a-ef637792f940.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/8f289cff-00b0-4ec9-9193-8eafc9f50a18.webp",
  },
  Haven: {
    minimap: "https://resources.strats.gg/images/faa88fff-e48c-4ed9-8717-ec74efcf41df.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/d917bf80-b9f5-4033-818d-bf8848b06828.webp",
  },
  Icebox: {
    minimap: "https://resources.strats.gg/images/64950889-db94-464d-bda5-55a5b5303642.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/5aee2319-7100-4f0f-9eba-34b4100bf7a2.webp",
  },
  Lotus: {
    minimap: "https://resources.strats.gg/images/1611d847-964a-476a-b215-f73130103e13.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/bacc7745-9db5-4255-99c8-3fefc6cefbc2.webp",
  },
  Pearl: {
    minimap: "https://resources.strats.gg/images/22c22ed2-6af8-4787-8c12-f780959be1c8.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/de982c5a-3b10-46e1-9323-222391669355.webp",
  },
  Split: {
    minimap:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/0d76f194-54ad-41ce-930b-dfc46982792f.svg",
    thumbnail:
      "https://s3-us-east-2.amazonaws.com/strats-gg/images/cc385137-445a-46da-b87b-8a593b763f26.webp",
  },
  Sunset: {
    minimap: "https://resources.strats.gg/images/9d92143f-4f74-4e66-b4a1-b64b5806d837.svg",
    thumbnail:
      "https://resources.strats.gg/images/751d25e2-74e6-45e3-88a2-f69f99d14f31.webp",
  },
};

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.log(url, res.status, text.slice(0, 200));
    return null;
  }
}

const mapsApi = await fetchJson(
  "https://api.strats.gg/internal/api/v1/games/valorant/maps?order[]=name:asc",
);
console.log("maps api sample:", JSON.stringify(mapsApi?.data?.slice?.(0, 2) ?? mapsApi, null, 2).slice(0, 2000));

const charsApi = await fetchJson(
  "https://api.strats.gg/internal/api/v1/games/valorant/characters",
);
const sova = charsApi?.data?.find?.((c) => c.name === "Sova" || c.slug === "sova");
console.log("sova id:", sova?.id ?? sova?.slug ?? sova);

if (sova?.id) {
  for (const mapName of ["Ascent", "Bind", "Haven"]) {
    const map = mapsApi?.data?.find((m) => m.name === mapName);
    if (!map) continue;
    const url = `https://api.strats.gg/internal/api/v1/games/valorant/lineups?mapId=${map.id}&characterId=${sova.id}&side=attack`;
    const lineups = await fetchJson(url);
    console.log(`\n${mapName} lineups:`, lineups?.data?.length ?? lineups?.length ?? "none");
    if (lineups?.data?.[0]) console.log(JSON.stringify(lineups.data[0], null, 2).slice(0, 1500));
  }
}

export { MAP_ASSETS };
