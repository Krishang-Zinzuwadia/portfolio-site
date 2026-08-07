import Link from "next/link";

import type { Project } from "@/data/portfolio";

import WorkFooter from "./WorkFooter";
import WorkHeader from "./WorkHeader";
import WorkJsonLd from "./WorkJsonLd";

type ProjectCaseStudyProps = {
  project: Project;
  nextProject: Project;
  previousProject: Project;
};

const chapters = [
  ["01", "Context", "context"],
  ["02", "System", "system"],
  ["03", "Decisions", "decisions"],
  ["04", "Results", "results"],
  ["05", "Evidence", "evidence"],
] as const;

export default function ProjectCaseStudy({
  project,
  nextProject,
  previousProject,
}: ProjectCaseStudyProps) {
  const { caseStudy } = project;

  return (
    <div className="night-work night-case-study">
      <WorkJsonLd kind="project" project={project} />
      <WorkHeader />

      <main id="main-content">
        <section className="night-case-hero" aria-labelledby="project-title">
          <nav className="night-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Portfolio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/work">Case studies</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>

          <div className="night-case-heading">
            <p className="night-work-kicker">Build record / {project.slug}</p>
            <h1 id="project-title">{project.title}</h1>
            {project.fullTitle !== project.title ? (
              <p className="night-case-full-title">{project.fullTitle}</p>
            ) : null}
            <p className="night-case-standfirst">{project.summary}</p>
          </div>

          <dl className="night-case-facts" aria-label="Project record">
            <div>
              <dt>Record</dt>
              <dd>{project.recognition}</dd>
            </div>
            <div>
              <dt>System</dt>
              <dd>{project.subtitle}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{project.date ?? "Not listed"}</dd>
            </div>
          </dl>

          <dl className="night-case-metrics" aria-label="Recorded metrics">
            {project.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="night-case-body">
          <nav className="night-chapter-rail" aria-label="Case study chapters">
            <p>Contents</p>
            <ol>
              {chapters.map(([index, title, href]) => (
                <li key={href}>
                  <a href={`#${href}`}>
                    <span>{index}</span>
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="night-case-content">
            <section
              className="night-case-context night-case-chapter"
              id="context"
              aria-labelledby="context-title"
            >
              <div className="night-chapter-heading">
                <p className="night-work-kicker">01 / Problem &amp; scope</p>
                <h2 id="context-title">{caseStudy.challengeHeading}</h2>
              </div>

              <div className="night-context-grid">
                <div className="night-case-reading">
                  <p>{caseStudy.challenge}</p>
                </div>

                <aside className="night-owned" aria-labelledby="owned-title">
                  <p className="night-work-kicker">What I owned</p>
                  <h3 id="owned-title">Responsibility boundary</h3>
                  <ul>
                    {caseStudy.role.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </aside>
              </div>
            </section>

            <section
              className="night-architecture night-case-chapter"
              id="system"
              aria-labelledby="system-title"
            >
              <div className="night-chapter-heading">
                <p className="night-work-kicker">02 / How it works</p>
                <h2 id="system-title">From input to outcome.</h2>
              </div>

              <ol className="night-architecture-band">
                {caseStudy.architecture.map((stage, index) => (
                  <li key={stage.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section
              className="night-decisions night-case-chapter"
              id="decisions"
              aria-labelledby="decisions-title"
            >
              <div className="night-chapter-heading">
                <p className="night-work-kicker">03 / Important decisions</p>
                <h2 id="decisions-title">What shaped the build.</h2>
              </div>

              <div className="night-decision-list">
                {caseStudy.decisions.map((decision, index) => (
                  <article key={decision.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p>Why</p>
                      <h3>{decision.title}</h3>
                    </div>
                    <p>{decision.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="night-results night-case-chapter"
              id="results"
              aria-labelledby="results-title"
            >
              <div className="night-results-inner">
                <div className="night-chapter-heading">
                  <p className="night-work-kicker">04 / Recorded result</p>
                  <h2 id="results-title">What the project delivered.</h2>
                </div>

                <ol className="night-outcomes">
                  {caseStudy.outcomes.map((outcome, index) => (
                    <li key={outcome}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{outcome}</p>
                    </li>
                  ))}
                </ol>

                <p className="night-results-stack">
                  <span>Stack</span>
                  {project.stack.join(" — ")}
                </p>
              </div>
            </section>

            <section
              className="night-evidence night-case-chapter"
              id="evidence"
              aria-labelledby="evidence-title"
            >
              <div className="night-chapter-heading">
                <p className="night-work-kicker">05 / Evidence &amp; limits</p>
                <h2 id="evidence-title">What this account is based on.</h2>
              </div>

              <p className="night-evidence-note">{caseStudy.evidenceNote}</p>

              {caseStudy.evidence.length > 0 ? (
                <ul className="night-evidence-list">
                  {caseStudy.evidence.map((item, index) => (
                    <li key={item.href}>
                      <a href={item.href} target="_blank" rel="noreferrer">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{item.label}</strong>
                        <p>{item.description}</p>
                        <i aria-hidden="true">↗</i>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="night-no-public-proof">
                  No public evidence link is listed.
                </p>
              )}
            </section>
          </div>
        </div>

        <nav className="night-case-pagination" aria-label="Other case studies">
          <Link href={`/work/${previousProject.slug}`}>
            <span>Previous record</span>
            <strong>← {previousProject.title}</strong>
          </Link>
          <Link href={`/work/${nextProject.slug}`}>
            <span>Next record</span>
            <strong>{nextProject.title} →</strong>
          </Link>
        </nav>
      </main>

      <WorkFooter />
    </div>
  );
}
