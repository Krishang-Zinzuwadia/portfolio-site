import type { Metadata, Viewport } from "next";

import NightIndexPortfolio from "@/components/Editorial/NightIndexPortfolio";
import PortfolioJsonLd from "@/components/Portfolio/PortfolioJsonLd";
import { editorialFonts } from "@/lib/editorial-fonts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import "./editorial/editorial.css";

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

export const viewport: Viewport = {
  themeColor: "#090a0b",
  colorScheme: "dark",
};

export default function Home() {
  return (
    <div className={editorialFonts}>
      <PortfolioJsonLd />
      <NightIndexPortfolio />
    </div>
  );
}
