import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  Intel_One_Mono,
} from "next/font/google";

import EditorialPortfolio from "@/components/Portfolio/EditorialPortfolio";
import PortfolioJsonLd from "@/components/Portfolio/PortfolioJsonLd";
import PortfolioViewSwitcher from "@/components/Portfolio/PortfolioViewSwitcher";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import "./editorial/editorial.css";

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
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function Home() {
  return (
    <div
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${intelOneMono.variable}`}
    >
      <PortfolioJsonLd />
      <PortfolioViewSwitcher currentView="editorial" />
      <EditorialPortfolio />
    </div>
  );
}
