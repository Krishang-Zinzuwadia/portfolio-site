import Link from "next/link";

import {
  achievements,
  identity,
  labProjects,
  openSourceContributions,
  projects,
} from "@/data/portfolio";

import ProjectSketch from "./ProjectSketch";
import {
  getProjectPresentation,
  labDescriptions,
} from "./project-presentation";
import styles from "./WorkingPapersPortfolio.module.css";

const resumePath = "/Krishang-Zinzuwadia-Resume.pdf";
const leadProjects = projects.slice(0, 3);
const additionalProjects = projects.slice(3);

export default function WorkingPapersPortfolio() {
  return (
    <div className={styles.page} id="top">
      <a className={styles.skipLink} href="#main-content">
        Skip to the work
      </a>

      <header className={styles.masthead}>
        <a className={styles.nameplate} href="#top">
          <strong>Krishang Zinzuwadia</strong>
          <span>Working papers</span>
        </a>

        <nav className={styles.primaryNav} aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#small-tools">Small tools</a>
          <a href="#open-source">Open source</a>
          <a href="#about">About</a>
        </nav>

        <a className={styles.helloLink} href={`mailto:${identity.email}`}>
          Say hello
        </a>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <aside className={styles.marginIntroduction}>
            <span className={styles.ruleMark} aria-hidden="true" />
            <p>
              A working selection of products, infrastructure, and useful
              oddities.
            </p>
          </aside>

          <div className={styles.heroCopy}>
            <p className={styles.salutation}>Hi, I’m Krishang.</p>
            <h1 id="hero-title">
              I like software <em>that shows its work.</em>
            </h1>
            <p className={styles.heroDeck}>
              I build agent systems, local-first products, and tools I wish
              already existed.
            </p>
            <p className={styles.heroDetail}>
              Recent examples: a guarded phone-call path for a blocked coding
              agent, an infinite canvas that works offline, and a Rust messenger
              with durable delivery. I’m studying computer science at VIT in
              Vellore.
            </p>
            <div className={styles.heroActions}>
              <a href="#projects">See what I’ve built</a>
              <Link href="/mac">Take the Macintosh detour</Link>
            </div>
          </div>

          <aside className={styles.deskNote}>
            <p>On my desk lately</p>
            <ul>
              <li>Human handoffs with narrow permissions</li>
              <li>Products that remain useful offline</li>
              <li>Small models with very specific jobs</li>
            </ul>
            <span>
              There is a Macintosh version of this site. It is not a joke,
              though it did begin as one.
            </span>
          </aside>
        </section>

        <section
          className={styles.projectsSection}
          id="projects"
          aria-labelledby="projects-title"
        >
          <header className={styles.sectionHeading}>
            <p className={styles.marginLabel}>Selected work</p>
            <div>
              <h2 id="projects-title">Things I’ve built</h2>
              <p>
                These are the seven projects I’d want to talk through. The first
                three are the best place to start.
              </p>
            </div>
          </header>

          <div className={styles.leadProjects}>
            {leadProjects.map((project) => {
              const presentation = getProjectPresentation(project.slug);

              return (
                <article className={styles.leadProject} key={project.slug}>
                  <div className={styles.projectDrawing}>
                    <span className={styles.projectInitial}>
                      {presentation.initial}
                    </span>
                    <ProjectSketch slug={project.slug} />
                    <p>{presentation.hook}</p>
                  </div>

                  <div className={styles.leadProjectCopy}>
                    <p className={styles.projectKind}>{project.subtitle}</p>
                    <h3>
                      <Link href={`/work/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className={styles.projectSummary}>
                      {presentation.summary}
                    </p>

                    <dl className={styles.projectFacts}>
                      <div>
                        <dt>My part</dt>
                        <dd>{project.caseStudy.role[0]}</dd>
                      </div>
                      <div>
                        <dt>Result</dt>
                        <dd>{project.recognition}</dd>
                      </div>
                    </dl>

                    <Link
                      className={styles.readLink}
                      href={`/work/${project.slug}`}
                    >
                      Read about {project.title}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.moreProjects}>
            <header className={styles.moreProjectsHeading}>
              <p>Four more from the same desk</p>
              <span>
                Local agents, a large review workflow, and messaging that does
                not confuse “sent” with “stored.”
              </span>
            </header>

            <div className={styles.moreProjectsGrid}>
              {additionalProjects.map((project) => {
                const presentation = getProjectPresentation(project.slug);

                return (
                  <article className={styles.moreProject} key={project.slug}>
                    <div className={styles.smallDrawing}>
                      <span className={styles.projectInitial}>
                        {presentation.initial}
                      </span>
                      <ProjectSketch slug={project.slug} />
                    </div>
                    <p className={styles.projectKind}>{project.subtitle}</p>
                    <h3>
                      <Link href={`/work/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p>{presentation.summary}</p>
                    <dl className={styles.compactFacts}>
                      <div>
                        <dt>My part</dt>
                        <dd>{project.caseStudy.role[0]}</dd>
                      </div>
                      <div>
                        <dt>Result</dt>
                        <dd>{project.recognition}</dd>
                      </div>
                    </dl>
                    <Link
                      className={styles.readLink}
                      href={`/work/${project.slug}`}
                    >
                      Read about {project.title}
                    </Link>
                  </article>
                );
              })}
            </div>

            <Link className={styles.allWorkLink} href="/work">
              See all seven projects together
            </Link>
          </div>
        </section>

        <section
          className={styles.toolsSection}
          id="small-tools"
          aria-labelledby="tools-title"
        >
          <header className={styles.sectionHeading}>
            <p className={styles.marginLabel}>Small tools</p>
            <div>
              <h2 id="tools-title">Made because I wanted them</h2>
              <p>
                Small software with one job. One cleans a folder from Explorer.
                One turns push-to-talk into Linux text input. One rescues a
                WhatsApp sticker collection. None needed a startup pitch.
              </p>
            </div>
          </header>

          <div className={styles.toolShelf}>
            {labProjects.map((project) => (
              <article className={styles.tool} key={project.title}>
                <p>{project.note}</p>
                <h3>{project.title}</h3>
                <span>{labDescriptions[project.title] ?? project.summary}</span>
                <ul aria-label={`${project.title} technology`}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href={project.href} target="_blank" rel="noreferrer">
                  Repository
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.openSourceSection}
          id="open-source"
          aria-labelledby="open-source-title"
        >
          <header className={styles.sectionHeading}>
            <p className={styles.marginLabel}>Open source</p>
            <div>
              <h2 id="open-source-title">Work I sent upstream</h2>
              <p>
                These changes are merged. The projects still belong to the
                people and organizations named below.
              </p>
            </div>
          </header>

          <div className={styles.contributions}>
            {openSourceContributions.map((contribution) => (
              <article
                className={styles.contribution}
                key={`${contribution.organization}-${contribution.title}`}
              >
                <div>
                  <p>{contribution.organization}</p>
                  <h3>{contribution.title}</h3>
                </div>
                <p>{contribution.contribution}</p>
                <a href={contribution.href} target="_blank" rel="noreferrer">
                  {contribution.proof}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.aboutSection}
          id="about"
          aria-labelledby="about-title"
        >
          <p className={styles.marginLabel}>About</p>

          <div className={styles.aboutCopy}>
            <h2 id="about-title">A bit about me</h2>
            <p>
              I’m a computer science student at VIT and a core committee member
              in ACM’s tech domain. I’ve helped run a hackathon with 1,500+
              participants, built a cryptic hunt for 400+ players, and led a
              MERN workshop. Outside class, I build products, contribute
              upstream, and play CTFs. In April 2026, my team ranked first in
              India and seventh globally on CTFTime.
            </p>
            <div className={styles.aboutLinks}>
              <a href={identity.ctftime} target="_blank" rel="noreferrer">
                CTFTime
              </a>
              <a href={resumePath} target="_blank" rel="noreferrer">
                Résumé
              </a>
            </div>
          </div>

          <aside className={styles.results} aria-labelledby="results-title">
            <h3 id="results-title">A few scoreboards</h3>
            <ul>
              {achievements.map((achievement) => (
                <li key={`${achievement.title}-${achievement.date}`}>
                  <strong>{achievement.place}</strong>
                  <div>
                    <h4>{achievement.title}</h4>
                    <p>{achievement.context}</p>
                  </div>
                  <time>{achievement.date}</time>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section
          className={styles.contactSection}
          id="contact"
          aria-labelledby="contact-title"
        >
          <p className={styles.marginLabel}>Contact</p>
          <div className={styles.contactCopy}>
            <h2 id="contact-title">Want to compare notes?</h2>
            <p>
              I’m always happy to talk about agent runtimes, local-first
              products, developer tools, or a bug that turned out to be an
              architecture problem.
            </p>
            <a className={styles.emailLink} href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Krishang Zinzuwadia</p>
        <nav aria-label="External links">
          <a href={identity.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={identity.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link href="/mac">Macintosh</Link>
        </nav>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  );
}
