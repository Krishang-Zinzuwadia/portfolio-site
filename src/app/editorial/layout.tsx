import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  Intel_One_Mono,
} from "next/font/google";

import "./editorial.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

const intelOneMono = Intel_One_Mono({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-intel-one-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Krishang Zinzuwadia — Editorial Portfolio",
  alternates: { canonical: "/editorial" },
};

export default function EditorialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${intelOneMono.variable}`}
    >
      {children}
    </div>
  );
}
