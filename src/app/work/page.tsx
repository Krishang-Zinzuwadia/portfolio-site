import type { Metadata } from "next";

import ProjectContentsEntry from "@/components/Work/ProjectContentsEntry";
import WorkFooter from "@/components/Work/WorkFooter";
import WorkHeader from "@/components/Work/WorkHeader";
import WorkJsonLd from "@/components/Work/WorkJsonLd";
import styles from "@/components/Work/WorkPages.module.css";
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
        alt: "Krishang Zinzuwadia — agent systems, local-first products, and developer tools.",
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
        alt: "Krishang Zinzuwadia — agent systems, local-first products, and developer tools.",
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
            <p>Working papers</p>
            <p>Project notes, written in Vellore.</p>
          </aside>

          <div className={styles.heroCopy}>
            <h1 id="work-title">Seven projects, without the résumé version.</h1>
            <p>
              Each one gets a proper walkthrough: why it exists, what I built,
              the calls I made, where it landed, and what you can inspect.
            </p>
            <a className={styles.textLink} href="#projects">
              Start with the projects
            </a>
          </div>
        </section>

        <section
          className={styles.projectContents}
          id="projects"
          aria-labelledby="projects-title"
        >
          <header className={styles.contentsIntro}>
            <p className={styles.sectionLabel}>Things I’ve built</p>
            <h2 id="projects-title">The projects</h2>
            <p>
              These are the seven projects I’d want to talk through. Quark,
              Scatterfield, and Aisle are the best place to start.
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
          <p className={styles.sectionLabel}>A note before you read</p>
          <h2 id="reading-note-title">The public links come last.</h2>
          <p>
            I keep the story readable, then list source links and limitations at
            the end of each page. If a repository is private or a result still
            needs live proof, I say so there.
          </p>
        </aside>
      </main>

      <WorkFooter />
    </div>
  );
}
