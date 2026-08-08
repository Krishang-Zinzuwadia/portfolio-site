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
          <span>CS at VIT Vellore · usually building tools</span>
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
              <p className={styles.heroRole}>Hi, I’m Krishang.</p>

              <h1 className={styles.heroTitle} id="hero-title">
                Most of my projects start with an annoyance.
              </h1>

              <p className={styles.heroDeck}>
                Right now I’m spending most of my time on Helios, a local
                runtime for small coding models. The rest goes in very
                different directions: a phone check-in for stuck agents, an
                offline canvas, and a safer skill marketplace.
              </p>

              <div className={styles.heroActions}>
                <a href="#projects">See the main projects</a>
                <a href="#small-tools">Browse the small stuff</a>
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
              <h2 id="projects-title">
                Seven projects I can talk about for too long
              </h2>
              <p>
                Helios gets most of my attention at the moment. The other six
                came from very different irritations: stuck coding agents, flaky
                Wi-Fi, risky installs, clumsy application review, and messages
                that vanish when a peer goes offline.
              </p>
            </div>
          </header>

          <div className={styles.projectIndex}>
            <header className={styles.projectIndexHeading}>
              <p>Project list · 01—07</p>
              <span>Working on now: Helios</span>
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
                          Working on now ·{" "}
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
                        <dt>What I did</dt>
                        <dd>{project.caseStudy.role[0]}</dd>
                      </div>
                      <div>
                        <dt>Where it’s at</dt>
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

              <Link className={styles.projectEndcap} href="/work">
                <span>Project archive</span>
                <strong>See every project page</strong>
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
            <p className={styles.marginLabel}>Small stuff</p>
            <div>
              <h2 id="tools-title">Things I wanted, so I made them</h2>
              <p>
                None of these began as a grand product idea. I wanted cleaner
                sticker packs, push-to-talk dictation on Linux, a safer way to
                empty a folder, and a terminal that looked less grim. Spirit was
                me seeing how far I could push a Windows voice assistant.
              </p>
            </div>
          </header>

          <div className={styles.toolShelf}>
            {labProjects.map((project) => (
              <article className={styles.tool} key={project.title}>
                <p>{project.note}</p>
                <h3>{project.title}</h3>
                <span>{labDescriptions[project.title] ?? project.summary}</span>
                <ul aria-label={`Technologies used in ${project.title}`}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title} on GitHub`}
                >
                  Open on GitHub
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
              <h2 id="open-source-title">
                Changes that landed in other people’s repos
              </h2>
              <p>
                I’m not claiming these repositories as mine. This is the work I
                sent back and the maintainers merged: docs, bug fixes, product
                features, and one multiplayer puzzle.
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
            <h2 id="about-title">
              I learn by getting a little in over my head.
            </h2>
          </header>

          <div className={styles.aboutNarrative}>
            <p className={styles.aboutPrimary}>
              I’m Krishang, a computer science student at VIT Vellore. I bounce
              between agent systems, developer tools, and security because I
              like understanding what the computer is actually doing. Usually
              that means I keep poking at a project long after the first version
              works.
            </p>

            <div className={styles.aboutSecondary}>
              <p>
                I’m also on ACM-VIT’s tech committee. I’ve judged and helped run
                Code2Create for 1,500+ participants, built a cryptic hunt played
                by 400+ people, and taught a MERN workshop. CTFs are how I learn
                security; in April 2026, my team was first in India and seventh
                worldwide on CTFTime.
              </p>
              <div className={styles.aboutLinks}>
                <a href={identity.ctftime} target="_blank" rel="noreferrer">
                  My CTFTime profile
                </a>
                <a href={resumePath} target="_blank" rel="noreferrer">
                  Open my résumé
                </a>
              </div>
            </div>
          </div>

          <dl className={styles.aboutFacts}>
            <div>
              <dt>Right now</dt>
              <dd>
                <strong>B.Tech CSE</strong>
                <span>VIT Vellore · 2028</span>
              </dd>
            </div>
            <div>
              <dt>At ACM</dt>
              <dd>
                <strong>ACM-VIT</strong>
                <span>Tech committee</span>
              </dd>
            </div>
            <div>
              <dt>People reached</dt>
              <dd>
                <strong>1,500+ / 400+</strong>
                <span>Code2Create / cryptic hunt</span>
              </dd>
            </div>
          </dl>

          <aside className={styles.results} aria-labelledby="results-title">
            <header className={styles.resultsHeader}>
              <p>CTFs and hackathons</p>
              <h3 id="results-title">A few recent finishes</h3>
              <span>Six results · Oct 2025—Apr 2026</span>
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
          <p className={styles.footerLabel}>Say hello</p>

          <div className={styles.footerPitch}>
            <h2 id="contact-title">Tell me what you’re stuck on.</h2>
            <p>
              Send it over. I especially like hearing about agent tools,
              software that runs on your own machine, and bugs that only appear
              on the one computer that matters.
            </p>
          </div>

          <a className={styles.footerEmail} href={`mailto:${identity.email}`}>
            {identity.email}
          </a>

          <div className={styles.footerDirectory}>
            <nav className={styles.footerLinks} aria-label="External links">
              <a href={identity.github} target="_blank" rel="noreferrer">
                <span>My code</span>
                <strong>GitHub</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href={identity.linkedin} target="_blank" rel="noreferrer">
                <span>Elsewhere</span>
                <strong>LinkedIn</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href={resumePath} target="_blank" rel="noreferrer">
                <span>One page</span>
                <strong>Résumé</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href={identity.ctftime} target="_blank" rel="noreferrer">
                <span>CTFs</span>
                <strong>CTFTime</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </nav>

            <Link className={styles.macintoshCard} href="/mac">
              <span>The other version</span>
              <strong>Open the Macintosh desk</strong>
              <small>The same work, tucked inside a System 7 desktop.</small>
              <i aria-hidden="true">↗</i>
            </Link>
          </div>

          <div className={styles.footerMeta}>
            <p>
              © {new Date().getFullYear()} Krishang Zinzuwadia · Vellore, India
            </p>
            <a href="#top">Back to the top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
