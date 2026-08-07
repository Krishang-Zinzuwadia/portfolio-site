import type { Metadata } from "next";

import WorkFooter from "@/components/Work/WorkFooter";
import WorkHeader from "@/components/Work/WorkHeader";
import WorkIndexCard from "@/components/Work/WorkIndexCard";
import WorkJsonLd from "@/components/Work/WorkJsonLd";
import { projects } from "@/data/portfolio";
import { SITE_NAME, WORK_DESCRIPTION } from "@/lib/site";

const title = `Selected Work | ${SITE_NAME}`;
const description = WORK_DESCRIPTION;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/work",
    title,
    description,
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Selected engineering work by Krishang Zinzuwadia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/twitter-image.jpg",
        width: 1200,
        height: 630,
        alt: "Selected engineering work by Krishang Zinzuwadia",
      },
    ],
  },
};

export default function WorkPage() {
  return (
    <div className="night-work night-work-index">
      <WorkJsonLd kind="index" />
      <WorkHeader />

      <main id="main-content">
        <section className="night-work-hero" aria-labelledby="work-title">
          <p className="night-work-kicker">Seven systems / 2025—2026</p>
          <h1 id="work-title">The case-study index.</h1>
          <p>
            A record of what I built, what I owned, and the evidence available
            for every claim.
          </p>
          <a href="#case-studies">Open index ↓</a>
        </section>

        <section
          className="night-directory"
          id="case-studies"
          aria-labelledby="case-studies-title"
        >
          <header className="night-directory-intro">
            <p className="night-work-kicker">01—07 / Directory</p>
            <h2 id="case-studies-title">Case studies</h2>
            <p>System / scope / recorded status or result / date</p>
          </header>

          <div className="night-directory-columns" aria-hidden="true">
            <span>No.</span>
            <span>System</span>
            <span>Scope</span>
            <span>Record</span>
            <span>Date</span>
            <span>Open</span>
          </div>

          <div className="night-directory-list">
            {projects.map((project, index) => (
              <WorkIndexCard
                index={index}
                key={project.slug}
                project={project}
              />
            ))}
          </div>
        </section>

        <section className="night-directory-note">
          <p className="night-work-kicker">Evidence boundary</p>
          <p>
            These pages separate project facts from public evidence. When a
            repository, release, or live proof is unavailable, the case study
            says so plainly.
          </p>
        </section>
      </main>

      <WorkFooter />
    </div>
  );
}
