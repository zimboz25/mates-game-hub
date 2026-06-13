"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getGameThemeForPath } from "@/lib/constants/game-themes";

export function GameThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.gameTheme = getGameThemeForPath(pathname);
  }, [pathname]);

  return null;
}
