import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Manrope,
} from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-night-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-night-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-night-mono",
  display: "swap",
});

export const editorialFonts = `${display.variable} ${body.variable} ${mono.variable}`;
