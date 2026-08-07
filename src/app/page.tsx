import type { Metadata, Viewport } from "next";

import WorkingPapersPortfolio from "@/components/Editorial/WorkingPapersPortfolio";
import PortfolioJsonLd from "@/components/Portfolio/PortfolioJsonLd";
import { paperFontClassName } from "@/lib/paper-fonts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

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
  themeColor: "#f2ead6",
  colorScheme: "light",
};

export default function Home() {
  return (
    <div className={paperFontClassName}>
      <PortfolioJsonLd />
      <WorkingPapersPortfolio />
    </div>
  );
}
