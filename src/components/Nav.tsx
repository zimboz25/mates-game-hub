"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nba2k26Links = [
  { href: "/build", label: "Build" },
  { href: "/results", label: "Results" },
  { href: "/calibrate", label: "Calibrate" },
];

function isNba2k26Route(pathname: string) {
  return nba2k26Links.some((link) => pathname.startsWith(link.href));
}

export function Nav() {
  const pathname = usePathname();
  const inNba2k26 = isNba2k26Route(pathname);

  return (
    <nav className="border-b border-red-900/40 bg-[#0d0808]">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-2">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-wider text-red-400"
        >
          BurgBuild
        </Link>

        {inNba2k26 && (
          <>
            <span className="text-xs uppercase tracking-wide text-white/30">
              /
            </span>
            <span className="text-xs uppercase tracking-wide text-white/60">
              NBA 2K26
            </span>
            {nba2k26Links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-wide ${
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "font-semibold text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
