import Link from "next/link";

import ProjectSketch from "@/components/Editorial/ProjectSketch";
import { getProjectPresentation } from "@/components/Editorial/project-presentation";
import type { Project } from "@/data/portfolio";

import styles from "./WorkPages.module.css";
import WorkFooter from "./WorkFooter";
import WorkHeader from "./WorkHeader";
import WorkJsonLd from "./WorkJsonLd";

type ProjectCaseStudyProps = {
  project: Project;
  nextProject: Project;
  previousProject: Project;
};

export default function ProjectCaseStudy({
  project,
  nextProject,
  previousProject,
}: ProjectCaseStudyProps) {
  const { caseStudy } = project;
  const presentation = getProjectPresentation(project.slug);
  const metricSentence = project.metrics
    .map((metric) => `${metric.value} ${metric.label}`)
    .join(" · ");

  return (
    <div className={styles.page}>
      <WorkJsonLd kind="project" project={project} />
      <WorkHeader />

      <main id="main-content" className={styles.main}>
        <header className={styles.caseHero}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/work">Projects</Link>
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          <div className={styles.caseHeroLayout}>
            <div className={styles.caseTitleBlock}>
              <p className={styles.sectionLabel}>{project.subtitle}</p>
              <h1 id="project-title">{project.title}</h1>
              {project.fullTitle !== project.title ? (
                <p className={styles.fullTitle}>{project.fullTitle}</p>
              ) : null}
              <p className={styles.caseStandfirst}>{presentation.summary}</p>
              <p className={styles.caseByline}>
                {project.recognition}
                {project.date ? ` · ${project.date}` : ""}
              </p>
            </div>

            <div className={styles.caseSketch} aria-hidden="true">
              <ProjectSketch slug={project.slug} />
            </div>
          </div>
        </header>

        <div className={styles.readingLayout}>
          <aside className={styles.caseMargin} aria-label="Project summary">
            <p className={styles.marginHeading}>At a glance</p>
            <p>{metricSentence}</p>
            <p>{project.stack.join(", ")}</p>
          </aside>

          <article className={styles.essay} aria-labelledby="project-title">
            <section
              className={styles.essaySection}
              aria-labelledby="problem-title"
            >
              <p className={styles.sectionLabel}>The problem</p>
              <h2 id="problem-title">{presentation.problemHeading}</h2>
              <p className={styles.bodyCopy}>{caseStudy.challenge}</p>
            </section>

            <section
              className={styles.essaySection}
              aria-labelledby="part-title"
            >
              <p className={styles.sectionLabel}>My part</p>
              <h2 id="part-title">What I built</h2>
              <ul className={styles.proseList}>
                {caseStudy.role.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section
              className={styles.essaySection}
              aria-labelledby="works-title"
            >
              <p className={styles.sectionLabel}>How it works</p>
              <h2 id="works-title">How the pieces fit together</h2>
              <div className={styles.explanationList}>
                {caseStudy.architecture.map((stage) => (
                  <article key={stage.title}>
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className={styles.essaySection}
              aria-labelledby="calls-title"
            >
              <p className={styles.sectionLabel}>Decisions</p>
              <h2 id="calls-title">Why I built it this way</h2>
              <div className={styles.decisionList}>
                {caseStudy.decisions.map((decision) => (
                  <article key={decision.title}>
                    <h3>{decision.title}</h3>
                    <p>{decision.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className={styles.essaySection}
              aria-labelledby="landed-title"
            >
              <p className={styles.sectionLabel}>Current state</p>
              <h2 id="landed-title">What works, and what doesn’t yet</h2>
              <ul className={styles.outcomeList}>
                {caseStudy.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <p className={styles.stackLine}>
                <strong>Stack:</strong> {project.stack.join(", ")}.
              </p>
            </section>

            <section
              className={styles.essaySection}
              aria-labelledby="source-title"
            >
              <p className={styles.sectionLabel}>Sources and loose ends</p>
              <h2 id="source-title">What I can show you</h2>
              <p className={styles.bodyCopy}>{caseStudy.evidenceNote}</p>

              {caseStudy.evidence.length > 0 ? (
                <ul className={styles.sourceList}>
                  {caseStudy.evidence.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} target="_blank" rel="noreferrer">
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                        <small>Visit source</small>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noSource}>
                  There isn’t a public source link for this one.
                </p>
              )}
            </section>
          </article>
        </div>

        <nav className={styles.projectPagination} aria-label="Other projects">
          <Link href={`/work/${previousProject.slug}`}>
            <span>Previous</span>
            <strong>{previousProject.title}</strong>
          </Link>
          <Link href={`/work/${nextProject.slug}`}>
            <span>Next</span>
            <strong>{nextProject.title}</strong>
          </Link>
        </nav>
      </main>

      <WorkFooter />
    </div>
  );
}
