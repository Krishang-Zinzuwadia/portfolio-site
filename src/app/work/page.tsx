import type { Metadata } from "next";

import { getProjectPresentation } from "@/components/Editorial/project-presentation";
import ProjectHelix from "@/components/Work/ProjectHelix";
import WorkFooter from "@/components/Work/WorkFooter";
import WorkHeader from "@/components/Work/WorkHeader";
import WorkJsonLd from "@/components/Work/WorkJsonLd";
import styles from "@/components/Work/WorkPages.module.css";
import { projects } from "@/data/portfolio";
import { SITE_NAME, WORK_DESCRIPTION } from "@/lib/site";

const title = `Projects | ${SITE_NAME}`;
const description = WORK_DESCRIPTION;

const helixProjects = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
  subtitle: project.subtitle,
  summary: getProjectPresentation(project.slug).summary,
  recognition: project.recognition,
  date: project.date,
}));

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
            <p>TypeScript, Python, Rust, and a lot of debugging.</p>
          </aside>

          <div className={styles.heroCopy}>
            <h1 id="work-title">The longer version of the project cards.</h1>
            <p>
              This is where I explain what I actually did, how the pieces fit,
              why I made a few awkward choices, and what is still unfinished.
            </p>
            <a className={styles.textLink} href="#projects">
              Pick a project
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
            <h2 id="projects-title">All seven, starting with Helios</h2>
            <p>
              Scroll through the stack. Each project comes forward in turn,
              starting with Helios and ending with Hermes.
            </p>
          </header>

          <ProjectHelix projects={helixProjects} />
        </section>

        <aside
          className={styles.readingNote}
          id="after-project-spiral"
          tabIndex={-1}
          aria-labelledby="reading-note-title"
        >
          <p className={styles.sectionLabel}>Sources</p>
          <h2 id="reading-note-title">I link whatever I can show.</h2>
          <p>
            Each page ends with the repositories, merged pull requests,
            previews, or event records I have. Private work and unfinished
            branches are labelled plainly.
          </p>
        </aside>
      </main>

      <WorkFooter />
    </div>
  );
}
