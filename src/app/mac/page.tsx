import type { Metadata } from "next";
import Link from "next/link";

import MacExperience from "@/components/Macintosh/MacExperience";
import PortfolioViewSwitcher from "@/components/Portfolio/PortfolioViewSwitcher";
import { SITE_NAME } from "@/lib/site";

const title = `${SITE_NAME} — Macintosh Portfolio`;
const description =
  "Explore Krishang Zinzuwadia’s projects inside an interactive System 7-style Macintosh desktop.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/mac" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/mac",
    title,
    description,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function MacPage() {
  return (
    <>
      <noscript>
        <section
          aria-label="JavaScript required"
          style={{
            position: "fixed",
            zIndex: 2147483647,
            inset: 0,
            display: "grid",
            padding: "2rem",
            background: "#f1eee4",
            color: "#151713",
            fontFamily: "system-ui, sans-serif",
            placeItems: "center",
          }}
        >
          <div style={{ maxWidth: "34rem", textAlign: "center" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              The Macintosh version needs JavaScript.
            </p>
            <p style={{ marginTop: "1rem" }}>
              You can still read every project, result, and contact detail in
              the regular portfolio.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                marginTop: "1.5rem",
                padding: "0.75rem 1rem",
                borderRadius: "999px",
                background: "#151713",
                color: "#fffdf7",
                fontWeight: 700,
              }}
            >
              Open the regular portfolio
            </Link>
          </div>
        </section>
      </noscript>
      <PortfolioViewSwitcher currentView="immersive" waitForEntry />
      <MacExperience />
    </>
  );
}
