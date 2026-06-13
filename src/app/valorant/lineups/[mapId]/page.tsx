import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [
    { mapId: "ascent" },
    { mapId: "bind" },
    { mapId: "haven" },
    { mapId: "split" },
    { mapId: "fracture" },
    { mapId: "breeze" },
    { mapId: "lotus" },
    { mapId: "sunset" },
    { mapId: "pearl" },
    { mapId: "icebox" },
    { mapId: "abyss" },
    { mapId: "corrode" },
  ];
}

export default async function ValorantMapLineupsRedirect({
  params,
}: {
  params: Promise<{ mapId: string }>;
}) {
  const { mapId } = await params;
  redirect(`/valorant/lineups?map=${mapId}`);
}
