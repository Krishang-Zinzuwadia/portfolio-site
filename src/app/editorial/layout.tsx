import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  Intel_One_Mono,
} from "next/font/google";

import "./editorial.css";

const shareImageAlt =
  "Krishang Zinzuwadia — AI systems, full-stack engineering, and security presented through a Macintosh Classic portfolio.";
const shareImageUrl = new URL(
  "https://portfolio.krishang.dev/opengraph-image.jpg?v=20260718"
);
const twitterImageUrl = new URL(
  "https://portfolio.krishang.dev/twitter-image.jpg?v=20260718"
);

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
  description:
    "Selected AI systems, full-stack engineering, and cybersecurity work by Krishang Zinzuwadia.",
  alternates: { canonical: "/editorial" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/editorial",
    title: "Krishang Zinzuwadia — Editorial Portfolio",
    description:
      "Selected AI systems, full-stack engineering, and cybersecurity work by Krishang Zinzuwadia.",
    siteName: "Krishang Zinzuwadia",
    images: [
      {
        url: shareImageUrl,
        secureUrl: shareImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: shareImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishang Zinzuwadia — Editorial Portfolio",
    description:
      "Selected AI systems, full-stack engineering, and cybersecurity work by Krishang Zinzuwadia.",
    images: [
      {
        url: twitterImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: shareImageAlt,
      },
    ],
  },
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
