import type { Viewport } from "next";

import { editorialFonts } from "@/lib/editorial-fonts";

import "@/components/Work/work.css";

export const viewport: Viewport = {
  themeColor: "#090a0b",
  colorScheme: "dark",
};

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${editorialFonts} night-work-fonts`}>
      <a className="night-skip-link" href="#main-content">
        Skip to content
      </a>
      {children}
    </div>
  );
}
