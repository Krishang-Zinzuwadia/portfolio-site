import Link from "next/link";

import TechIcon from "@/components/Portfolio/TechIcon";
import type { Project } from "@/data/portfolio";

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

  return (
    <div className={`work-page work-case-study work-tone-${project.tone}`}>
      <WorkJsonLd kind="project" project={project} />
      <WorkHeader />

      <main id="main-content">
        <section
          className="case-hero work-container"
          aria-labelledby="project-title"
        >
          <nav className="work-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Portfolio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/work">Work</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>

          <div className="case-hero-grid">
            <div className="case-hero-copy">
              <p className="work-kicker">{project.recognition}</p>
              <h1 id="project-title">{project.title}</h1>
              {project.fullTitle !== project.title ? (
                <p className="case-full-title">{project.fullTitle}</p>
              ) : null}
              <p className="case-standfirst">{project.summary}</p>
            </div>

            <aside className="case-facts" aria-label="Project summary">
              {project.date ? (
                <div>
                  <span>When</span>
                  <strong>{project.date}</strong>
                </div>
              ) : null}
              <div>
                <span>Focus</span>
                <strong>{project.subtitle}</strong>
              </div>
              <div>
                <span>Recognition</span>
                <strong>{project.recognition}</strong>
              </div>
            </aside>
          </div>

          <dl className="case-metrics">
            {project.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="case-narrative work-container"
          aria-labelledby="challenge-title"
        >
          <div className="case-section-label">
            <span>01</span>
            <p>Context</p>
          </div>
          <div className="case-narrative-copy">
            <p className="work-kicker">The challenge</p>
            <h2 id="challenge-title">{caseStudy.challengeHeading}</h2>
            <p>{caseStudy.challenge}</p>
          </div>
          <div className="case-role">
            <p className="work-kicker">Krishang&apos;s role</p>
            <ul>
              {caseStudy.role.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="case-architecture"
          aria-labelledby="architecture-title"
        >
          <div className="work-container">
            <div className="case-section-heading">
              <div className="case-section-label">
                <span>02</span>
                <p>System</p>
              </div>
              <div>
                <p className="work-kicker">Architecture</p>
                <h2 id="architecture-title">From input to outcome.</h2>
              </div>
            </div>

            <ol className="architecture-flow">
              {caseStudy.architecture.map((stage, index) => (
                <li key={stage.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="case-decisions work-container"
          aria-labelledby="decisions-title"
        >
          <div className="case-section-heading">
            <div className="case-section-label">
              <span>03</span>
              <p>Choices</p>
            </div>
            <div>
              <p className="work-kicker">Engineering decisions</p>
              <h2 id="decisions-title">What shaped the build.</h2>
            </div>
          </div>

          <div className="decision-list">
            {caseStudy.decisions.map((decision, index) => (
              <article key={decision.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{decision.title}</h3>
                <p>{decision.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="case-results" aria-labelledby="results-title">
          <div className="work-container case-results-grid">
            <div className="case-section-heading">
              <div className="case-section-label">
                <span>04</span>
                <p>Result</p>
              </div>
              <div>
                <p className="work-kicker">Recorded outcomes</p>
                <h2 id="results-title">What the project delivered.</h2>
              </div>
            </div>

            <ul className="outcome-list">
              {caseStudy.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>

            <div className="case-toolkit">
              <p className="work-kicker">Working stack</p>
              <ul aria-label={`${project.title} technology stack`}>
                {project.stack.map((technology) => (
                  <li key={technology}>
                    <TechIcon name={technology} />
                    <span>{technology}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="case-evidence work-container"
          aria-labelledby="evidence-title"
        >
          <div>
            <p className="work-kicker">Evidence boundary</p>
            <h2 id="evidence-title">What this account is based on.</h2>
          </div>
          <div>
            <p>{caseStudy.evidenceNote}</p>
            {caseStudy.evidence.length > 0 ? (
              <ul>
                {caseStudy.evidence.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      <strong>
                        {item.label} <span aria-hidden="true">↗</span>
                      </strong>
                      <span>{item.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <nav
          className="case-pagination work-container"
          aria-label="Other case studies"
        >
          <Link href={`/work/${previousProject.slug}`}>
            <span>Previous case study</span>
            <strong>← {previousProject.title}</strong>
          </Link>
          <Link href={`/work/${nextProject.slug}`}>
            <span>Next case study</span>
            <strong>{nextProject.title} →</strong>
          </Link>
        </nav>
      </main>

      <WorkFooter />
    </div>
  );
}
