import type { Metadata } from "next";
import "./valorant.css";

export const metadata: Metadata = {
  title: "Valorant",
};

export default function ValorantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-valorant-panel flex min-h-full flex-1 flex-col">
      {children}
    </div>
  );
}
