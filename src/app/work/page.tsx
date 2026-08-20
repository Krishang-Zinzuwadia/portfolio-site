import type { Metadata } from "next";

import WorkFooter from "@/components/Work/WorkFooter";
import WorkHeader from "@/components/Work/WorkHeader";
import WorkIndexCard from "@/components/Work/WorkIndexCard";
import WorkJsonLd from "@/components/Work/WorkJsonLd";
import {
  labProjects,
  openSourceContributions,
  projects,
} from "@/data/portfolio";
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
    <div className="work-page work-index-page">
      <WorkJsonLd kind="index" />
      <WorkHeader />

      <main id="main-content">
        <section className="work-index-hero work-container">
          <div>
            <p className="work-kicker">Selected case studies · 2025–2026</p>
            <h1>
              Work, <em>examined.</em>
            </h1>
          </div>
          <div className="work-index-intro">
            <p>
              I&apos;m Krishang Zinzuwadia. These case studies document the
              systems I built, the decisions I owned, and the outcomes recorded
              for each project.
            </p>
            <a href="#case-studies">
              Browse the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          className="work-index-list work-container"
          id="case-studies"
          aria-labelledby="case-studies-title"
        >
          <header className="work-index-list-heading">
            <p className="work-kicker">Seven systems, in detail</p>
            <h2 id="case-studies-title">Case studies</h2>
            <p>
              Each page separates verified project facts from the evidence that
              is currently public.
            </p>
          </header>

          <div className="work-index-grid">
            {projects.map((project, index) => (
              <WorkIndexCard
                index={index}
                key={project.slug}
                project={project}
              />
            ))}
          </div>
        </section>

        <section
          className="work-lab work-container"
          id="lab"
          aria-labelledby="work-lab-title"
        >
          <header className="work-collection-heading">
            <p className="work-kicker">Five focused experiments</p>
            <h2 id="work-lab-title">
              The <em>lab.</em>
            </h2>
            <p>
              Smaller utilities with a narrow job: organize stickers, dictate on
              Linux, clean folders, automate Windows, or sharpen a terminal.
            </p>
          </header>

          <div className="work-lab-grid">
            {labProjects.map((project, index) => (
              <article key={project.title}>
                <header>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.note}</span>
                </header>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul aria-label={`${project.title} technologies`}>
                  {project.stack.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <a href={project.href} target="_blank" rel="noreferrer">
                  Repository <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="work-open-source" id="open-source">
          <div className="work-container">
            <header className="work-collection-heading work-collection-heading-dark">
              <p className="work-kicker">Merged upstream</p>
              <h2>
                Open <em>source.</em>
              </h2>
              <p>
                Contributions are linked to their public record, so the work is
                visible without blurring contribution into ownership.
              </p>
            </header>

            <ol className="work-contribution-list">
              {openSourceContributions.map((contribution, index) => (
                <li key={`${contribution.organization}-${contribution.title}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{contribution.organization}</p>
                    <h3>{contribution.title}</h3>
                  </div>
                  <p>{contribution.contribution}</p>
                  <a href={contribution.href} target="_blank" rel="noreferrer">
                    {contribution.proof} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="work-index-principle work-container">
          <p className="work-kicker">A note on the record</p>
          <p>
            The pages describe what can be supported by the project repository
            or the résumé on this site. When public evidence is not linked, the
            case study says so plainly.
          </p>
        </section>
      </main>

      <WorkFooter />
    </div>
  );
}
