import type { Metadata } from "next";
import { Suspense } from "react";
import { LineupsWorkspace } from "@/components/valorant/lineups-workspace";

export const metadata: Metadata = {
  title: "Lineups",
};

function LineupsLoading() {
  return (
    <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center text-[#6b7a82]">
      Loading lineups…
    </div>
  );
}

export default function ValorantLineupsPage() {
  return (
    <Suspense fallback={<LineupsLoading />}>
      <LineupsWorkspace />
    </Suspense>
  );
}
