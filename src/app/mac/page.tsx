import type { Metadata } from "next";
import Link from "next/link";

import MacExperience from "@/components/Macintosh/MacExperience";
import PortfolioViewSwitcher from "@/components/Portfolio/PortfolioViewSwitcher";
import { SITE_NAME } from "@/lib/site";

const title = `${SITE_NAME} — Interactive Macintosh Portfolio`;
const description =
  "Launch Krishang Zinzuwadia's interactive System 7-inspired portfolio inside a 3D Macintosh Classic.";

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
              The interactive Macintosh needs JavaScript.
            </p>
            <p style={{ marginTop: "1rem" }}>
              The complete portfolio, projects, experience, and contact details
              are available in the standard view.
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
              View Krishang&apos;s portfolio
            </Link>
          </div>
        </section>
      </noscript>
      <PortfolioViewSwitcher currentView="immersive" waitForEntry />
      <MacExperience />
    </>
  );
}
