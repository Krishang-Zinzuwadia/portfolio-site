import Image from "next/image";
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
const editorialProjects = [
  "helios",
  "aisle",
  "scatterfield",
  "quark",
  "ocs",
  "hermes",
  "atlas",
].map((slug) => projects.find((project) => project.slug === slug)!);

export default function WorkingPapersPortfolio() {
  return (
    <div className={styles.page} id="top">
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <header className={styles.masthead}>
        <a
          className={styles.nameplate}
          href="#top"
          aria-label="Krishang Zinzuwadia, back to top"
        >
          <strong>Krishang Zinzuwadia</strong>
          <span>Computer science student · VIT Vellore</span>
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
            <div className={styles.heroCopy}>
              <p className={styles.heroRole}>Selected work</p>

              <h1 className={styles.heroTitle} id="hero-title">
                I build the parts a quick demo skips.
              </h1>

              <p className={styles.heroDeck}>
                Quark calls me when a coding agent gets stuck. Scatterfield
                keeps its canvas working without Wi-Fi. Aisle checks a skill
                before it can be installed.
              </p>

              <div className={styles.heroActions}>
                <a href="#projects">Read the projects</a>
                <a href="#small-tools">Browse small tools</a>
              </div>
            </div>

            <figure className={styles.heroArtwork} aria-hidden="true">
              <Image
                className={styles.heroPhone}
                src="/assets/editorial/hero-phone-cutout.png"
                alt=""
                width={1084}
                height={928}
                preload
                sizes="(max-width: 768px) 70vw, 38vw"
              />
              <div
                className={`${styles.heroSketch} ${styles.heroScatterfield}`}
              >
                <ProjectSketch slug="scatterfield" />
              </div>
              <div className={`${styles.heroSketch} ${styles.heroAisle}`}>
                <ProjectSketch slug="aisle" />
              </div>
            </figure>
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
              <h2 id="projects-title">Seven projects</h2>
              <p>
                Start with Helios. It’s the local-model runtime I’m putting the
                most work into. The other six cover agent tools, an offline
                canvas, desktop automation, recruitment software, and
                peer-to-peer messaging.
              </p>
            </div>
          </header>

          <div className={styles.projectIndex}>
            <header className={styles.projectIndexHeading}>
              <p>Project index · 01—07</p>
              <span>Current focus: Helios</span>
            </header>

            <div className={styles.projectGrid}>
              {editorialProjects.map((project) => {
                const presentation = getProjectPresentation(project.slug);

                return (
                  <article className={styles.projectCard} key={project.slug}>
                    <div className={styles.smallDrawing}>
                      <span className={styles.projectInitial}>
                        {presentation.initial}
                      </span>
                      <ProjectSketch slug={project.slug} />
                    </div>
                    <p className={styles.projectKind}>
                      {project.slug === "helios" ? (
                        <span className={styles.currentFocus}>
                          Current focus ·{" "}
                        </span>
                      ) : null}
                      {project.subtitle}
                    </p>
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
                        <dt>Status</dt>
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

              <Link className={styles.projectEndcap} href="/work">
                <span>Complete index</span>
                <strong>View all project pages</strong>
                <i aria-hidden="true">↗</i>
              </Link>
            </div>
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
          <header className={styles.aboutLead}>
            <p className={styles.marginLabel}>About</p>
            <h2 id="about-title">I care what happens after it works once.</h2>
          </header>

          <div className={styles.aboutNarrative}>
            <p className={styles.aboutPrimary}>
              I’m Krishang, a computer science student at VIT Vellore. Most of
              my work sits between agent systems, developer tools, and security.
              The first demo is rarely the interesting part; I keep going until
              permissions, recovery, offline state, and failure paths make
              sense.
            </p>

            <div className={styles.aboutSecondary}>
              <p>
                At ACM-VIT, I’ve judged and helped run Code2Create for more than
                1,500 participants, built a cryptic hunt played by 400+ people,
                and taught a MERN workshop. I also compete in CTFs. In April
                2026, my team ranked first in India and seventh worldwide on
                CTFTime.
              </p>
              <div className={styles.aboutLinks}>
                <a href={identity.ctftime} target="_blank" rel="noreferrer">
                  See CTFTime
                </a>
                <a href={resumePath} target="_blank" rel="noreferrer">
                  Read my résumé
                </a>
              </div>
            </div>
          </div>

          <dl className={styles.aboutFacts}>
            <div>
              <dt>Study</dt>
              <dd>
                <strong>B.Tech CSE</strong>
                <span>VIT Vellore · 2028</span>
              </dd>
            </div>
            <div>
              <dt>Community</dt>
              <dd>
                <strong>ACM-VIT</strong>
                <span>Core tech committee</span>
              </dd>
            </div>
            <div>
              <dt>Events</dt>
              <dd>
                <strong>1,500+ / 400+</strong>
                <span>Code2Create / cryptic hunt</span>
              </dd>
            </div>
          </dl>

          <aside className={styles.results} aria-labelledby="results-title">
            <header className={styles.resultsHeader}>
              <p>Competition ledger</p>
              <h3 id="results-title">Recent results</h3>
              <span>Six finishes · Oct 2025—Apr 2026</span>
            </header>
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
      </main>

      <footer
        className={styles.siteFooter}
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className={styles.footerFrame}>
          <p className={styles.footerLabel}>Contact</p>

          <div className={styles.footerPitch}>
            <h2 id="contact-title">Tell me what you’re building.</h2>
            <p>
              If you’re working on agents, developer tools, local-first
              software, or a bug that makes no sense, email me. I read
              everything.
            </p>
          </div>

          <a className={styles.footerEmail} href={`mailto:${identity.email}`}>
            {identity.email}
          </a>

          <div className={styles.footerDirectory}>
            <nav className={styles.footerLinks} aria-label="External links">
              <a href={identity.github} target="_blank" rel="noreferrer">
                <span>Code</span>
                <strong>GitHub</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href={identity.linkedin} target="_blank" rel="noreferrer">
                <span>Work</span>
                <strong>LinkedIn</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href={resumePath} target="_blank" rel="noreferrer">
                <span>Document</span>
                <strong>Résumé</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href={identity.ctftime} target="_blank" rel="noreferrer">
                <span>Scores</span>
                <strong>CTFTime</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </nav>

            <Link className={styles.macintoshCard} href="/mac">
              <span>After hours</span>
              <strong>Open the Macintosh desk</strong>
              <small>A second portfolio built like a System 7 desktop.</small>
              <i aria-hidden="true">↗</i>
            </Link>
          </div>

          <div className={styles.footerMeta}>
            <p>
              © {new Date().getFullYear()} Krishang Zinzuwadia · Vellore, India
            </p>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
