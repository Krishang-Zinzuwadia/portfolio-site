import type { Metadata } from "next";

import ProjectContentsEntry from "@/components/Work/ProjectContentsEntry";
import WorkFooter from "@/components/Work/WorkFooter";
import WorkHeader from "@/components/Work/WorkHeader";
import WorkJsonLd from "@/components/Work/WorkJsonLd";
import styles from "@/components/Work/WorkPages.module.css";
import { projects } from "@/data/portfolio";
import { SITE_NAME, WORK_DESCRIPTION } from "@/lib/site";

const title = `Projects | ${SITE_NAME}`;
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
        alt: "Portfolio cover for Krishang Zinzuwadia.",
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
        alt: "Portfolio cover for Krishang Zinzuwadia.",
      },
    ],
  },
};

export default function WorkPage() {
  return (
    <div className={styles.page}>
      <WorkJsonLd kind="index" />
      <WorkHeader />

      <main id="main-content" className={styles.main}>
        <section className={styles.workHero} aria-labelledby="work-title">
          <aside className={styles.heroMargin} aria-label="About these pages">
            <p>Seven projects</p>
            <p>Built with TypeScript, Python, and Rust.</p>
          </aside>

          <div className={styles.heroCopy}>
            <h1 id="work-title">The parts that don’t fit in a résumé.</h1>
            <p>
              Each page covers what I worked on, how the pieces connect, the
              trade-offs I made, what exists now, and any source code I can
              share.
            </p>
            <a className={styles.textLink} href="#projects">
              Choose a project
            </a>
          </div>
        </section>

        <section
          className={styles.projectContents}
          id="projects"
          aria-labelledby="projects-title"
        >
          <header className={styles.contentsIntro}>
            <p className={styles.sectionLabel}>Projects</p>
            <h2 id="projects-title">All seven</h2>
            <p>
              I’d start with Quark, Scatterfield, or Aisle. The other four cover
              local agents, application review, and peer-to-peer messaging.
            </p>
          </header>

          <div className={styles.contentsList}>
            {projects.map((project) => (
              <ProjectContentsEntry key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <aside
          className={styles.readingNote}
          aria-labelledby="reading-note-title"
        >
          <p className={styles.sectionLabel}>About the links</p>
          <h2 id="reading-note-title">Public code is linked on each page.</h2>
          <p>
            Each project page ends with the repository, merged pull requests, or
            event records I have. If the repository is private, the page says
            so.
          </p>
        </aside>
      </main>

      <WorkFooter />
    </div>
  );
}
