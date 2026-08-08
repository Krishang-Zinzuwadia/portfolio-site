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
        Skip to main content
      </a>

      <header className={styles.masthead}>
        <a className={styles.nameplate} href="#top">
          <strong>Krishang Zinzuwadia</strong>
          <span>Computer science student at VIT</span>
        </a>

        <nav className={styles.primaryNav} aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#small-tools">Small tools</a>
          <a href="#open-source">Open source</a>
          <a href="#about">About</a>
        </nav>

        <a className={styles.helloLink} href={`mailto:${identity.email}`}>
          Email me
        </a>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroFrame}>
            <h1 className={styles.heroStatements} id="hero-title">
              <span>
                <strong>Quark</strong> calls me when a coding agent gets stuck.
              </span>
              <span>
                <strong>Scatterfield</strong> keeps my notes available when the
                Wi-Fi drops.
              </span>
              <span>
                <strong>Hermes</strong> waits until the other device stores a
                message before calling it sent.
              </span>
            </h1>

            <div className={styles.heroBottom}>
              <p className={styles.heroRemainder}>
                The other four projects, five small tools, and the upstream
                patches I can point to are below.
              </p>

              <nav className={styles.heroActions} aria-label="Portfolio views">
                <a href="#projects">See the projects</a>
                <Link href="/mac">Open the Macintosh version</Link>
              </nav>
            </div>
          </div>
        </section>

        <section
          className={styles.projectsSection}
          id="projects"
          aria-labelledby="projects-title"
        >
          <header className={styles.sectionHeading}>
            <p className={styles.marginLabel}>Projects</p>
            <div>
              <h2 id="projects-title">Larger projects</h2>
              <p>
                Quark, Scatterfield, and Aisle are the three I’d open first.
                They cover agent permissions, offline-first product work, and
                package provenance. The other four are just below them.
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
                        <dt>My work</dt>
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
                      Open {project.title}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.moreProjects}>
            <header className={styles.moreProjectsHeading}>
              <p>Four more projects</p>
              <span>
                Helios and Atlas run agents locally. OCS handles applications
                and interviews at scale. Hermes is a Rust peer-to-peer
                messenger.
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
                        <dt>My work</dt>
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
                      Open {project.title}
                    </Link>
                  </article>
                );
              })}
            </div>

            <Link className={styles.allWorkLink} href="/work">
              View all project pages
            </Link>
          </div>
        </section>

        <section
          className={styles.toolsSection}
          id="small-tools"
          aria-labelledby="tools-title"
        >
          <header className={styles.sectionHeading}>
            <p className={styles.marginLabel}>Side projects</p>
            <div>
              <h2 id="tools-title">Tools I built for myself</h2>
              <p>
                Sticker Cabinet sorts and rebuilds WhatsApp sticker packs.
                Zephyr adds push-to-talk dictation on Linux. Right Click Clear
                Folder adds a guarded Explorer shortcut. Spirit tests a desktop
                voice interface, and Better Terminal handles shell colors and
                completions.
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
                  View source
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
              <h2 id="open-source-title">Code I sent upstream</h2>
              <p>
                The repositories below aren’t mine. These are the pull requests
                and commits I contributed, all merged into the upstream
                projects.
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
            <h2 id="about-title">VIT, ACM, and a lot of CTFs</h2>
            <p>
              I’m a computer science student at VIT Vellore and a core committee
              member in ACM-VIT’s tech domain. I’ve judged and helped run
              Code2Create for 1,500+ participants, built a cryptic hunt played
              by 400+ people, and taught a MERN workshop. I also compete in
              CTFs; in April 2026, my team reached first in India and seventh
              worldwide on CTFTime.
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
            <h3 id="results-title">Competition results</h3>
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
            <h2 id="contact-title">Email me</h2>
            <p>
              Send me a note if you want to ask about one of these projects,
              work on an agent or developer tool together, or point out
              something I got wrong.
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
