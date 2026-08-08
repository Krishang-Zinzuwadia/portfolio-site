import type { Metadata } from "next";

import { getProjectPresentation } from "@/components/Editorial/project-presentation";
import ProjectHelix from "@/components/Work/ProjectHelix";
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
    <>
      <WorkJsonLd kind="index" />
      <main id="main-content" className={styles.spiralOnlyPage}>
        <ProjectHelix projects={helixProjects} />
      </main>
    </>
  );
}
