import {
  Instrument_Sans,
  Instrument_Serif,
  Intel_One_Mono,
} from "next/font/google";

import "@/components/Work/work.css";

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

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${intelOneMono.variable} work-fonts`}
    >
      <a className="work-skip-link" href="#main-content">
        Skip to content
      </a>
      {children}
    </div>
  );
}
