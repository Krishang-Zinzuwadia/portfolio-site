"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import SceneShell from "@/components/Portfolio/SceneShell";
import {
  achievements,
  experience,
  identity,
  projects,
  signalStats,
  skills,
} from "@/data/portfolio";

const resumePath = "/Krishang-Zinzuwadia-Resume.pdf";

type RevealStyle = CSSProperties & { "--reveal-delay": string };

const revealDelay = (delay: number): RevealStyle => ({
  "--reveal-delay": `${delay}ms`,
});

export default function EditorialPortfolio() {
  const portfolioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = portfolioRef.current;

    if (!root) {
      return;
    }

    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const initialRevealLine = window.innerHeight * 0.94;

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top <= initialRevealLine) {
        item.classList.add("is-visible");
      }
    });

    root.classList.add("editorial-motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="editorial-portfolio" ref={portfolioRef}>
      <header className="site-header">
        <a
          className="brand-mark"
          href="#top"
          aria-label="Krishang Zinzuwadia, back to top"
        >
          <span>K</span>
          <i>/</i>
          <span>Z</span>
        </a>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#proof">Proof</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          className="header-resume"
          href={resumePath}
          target="_blank"
          rel="noreferrer"
        >
          Résumé <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span>01</span>
                AI SYSTEMS / FULL-STACK / SECURITY
              </p>

              <h1>
                Building systems that move from <em>idea</em> to action.
              </h1>

              <p className="hero-lede">
                I&apos;m Krishang—an AI systems builder, full-stack engineer,
                and cybersecurity competitor turning ambitious prompts into
                autonomous software that works in the real world.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  Explore selected work <span aria-hidden="true">↓</span>
                </a>
                <a
                  className="button button-quiet"
                  href={`mailto:${identity.email}`}
                >
                  Start a conversation
                </a>
              </div>

              <div className="hero-footnote">
                <span className="status-pulse" aria-hidden="true" />
                <span>
                  {identity.education} · {identity.school} ·{" "}
                  {identity.graduation}
                </span>
              </div>
            </div>

            <div className="hero-visual">
              <SceneShell />
            </div>
          </div>

          <div className="signal-strip" aria-label="Selected metrics">
            {signalStats.map((stat, index) => (
              <article
                className="signal-stat"
                data-reveal="up"
                key={`${stat.value}-${stat.label}`}
                style={revealDelay(index * 70)}
              >
                <span className="signal-index">0{index + 1}</span>
                <strong>{stat.value}</strong>
                <div>
                  <p>{stat.label}</p>
                  <span>{stat.note}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="work-section section-shell" id="work">
          <div className="section-heading" data-reveal="up">
            <p className="eyebrow">
              <span>02</span>
              SELECTED BUILDS
            </p>
            <h2>
              Software with a <em>pulse.</em>
            </h2>
            <p>
              Three systems, each designed around a hard problem: autonomy,
              coordination, or scale.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <article
                className={`project-card project-${project.tone}`}
                data-reveal="scale"
                key={project.slug}
                style={revealDelay(index * 100)}
              >
                <div className="project-card-top">
                  <span className="project-number">0{index + 1}</span>
                  <span className="project-date">{project.date}</span>
                </div>

                <div className="project-title-row">
                  <div>
                    <p>{project.recognition}</p>
                    <h3>{project.title}</h3>
                    <span>{project.subtitle}</span>
                  </div>
                  <div className="project-orbit" aria-hidden="true">
                    <i />
                  </div>
                </div>

                <p className="project-summary">{project.summary}</p>

                <ul className="project-details">
                  {project.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>

                <div className="project-metrics">
                  {project.metrics.map((metric) => (
                    <div key={`${metric.value}-${metric.label}`}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>

                <ul
                  className="project-tech"
                  aria-label={`${project.title} technologies`}
                >
                  {project.stack.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-inner section-shell">
            <div
              className="section-heading section-heading-light"
              data-reveal="up"
            >
              <p className="eyebrow">
                <span>03</span>
                OPERATING PRINCIPLES
              </p>
              <h2>
                Curious by default. <em>Rigorous</em> on delivery.
              </h2>
            </div>

            <div className="about-grid">
              <div className="about-statement" data-reveal="left">
                <p className="statement-lead">
                  I work where AI research, product engineering, and adversarial
                  thinking overlap.
                </p>
                <p>
                  That means understanding the whole system: the model and its
                  tools, the runtime and its failure modes, the interface and
                  the human who has to trust it. The result is software that
                  feels imaginative without becoming fragile.
                </p>
              </div>

              <aside className="education-card" data-reveal="right">
                <span className="card-kicker">CURRENTLY</span>
                <h3>{identity.school}</h3>
                <p>{identity.education}</p>
                <div>
                  <span>Vellore, India</span>
                  <span>{identity.graduation}</span>
                </div>
              </aside>
            </div>

            <article className="experience-row" data-reveal="up">
              <div className="experience-meta">
                <span>{experience.date}</span>
                <span>{experience.location}</span>
              </div>
              <div className="experience-title">
                <p>{experience.organization}</p>
                <h3>{experience.role}</h3>
              </div>
              <ul>
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>

            <div className="skills-grid">
              <article data-reveal="up" style={revealDelay(0)}>
                <span>01 / LANGUAGES</span>
                <ul>
                  {skills.languages.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
              <article data-reveal="up" style={revealDelay(90)}>
                <span>02 / SYSTEMS & FRAMEWORKS</span>
                <ul>
                  {skills.systems.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
              <article data-reveal="up" style={revealDelay(180)}>
                <span>03 / TOOLS & INFRA</span>
                <ul>
                  {skills.tools.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="proof-section section-shell" id="proof">
          <div className="section-heading proof-heading" data-reveal="up">
            <p className="eyebrow">
              <span>04</span>
              COMPETITIVE PROOF
            </p>
            <h2>
              Measured under <em>pressure.</em>
            </h2>
            <a href={identity.ctftimeTeam} target="_blank" rel="noreferrer">
              View CTFTime team <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="achievement-list">
            {achievements.map((achievement, index) => (
              <article
                data-reveal="line"
                key={`${achievement.title}-${achievement.date}`}
                style={revealDelay(index * 55)}
              >
                <span className="achievement-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{achievement.place}</strong>
                <div>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.context}</p>
                </div>
                <time>{achievement.date}</time>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-inner section-shell">
            <p className="eyebrow" data-reveal="up">
              <span>05</span>
              OPEN CHANNEL
            </p>

            <div className="contact-grid">
              <h2 data-reveal="left">
                Let&apos;s build what <em>should exist next.</em>
              </h2>
              <div
                className="contact-copy"
                data-reveal="right"
                style={revealDelay(110)}
              >
                <p>
                  Have an ambitious AI system, a hard engineering problem, or a
                  security-shaped challenge? Send the signal.
                </p>
                <a className="contact-email" href={`mailto:${identity.email}`}>
                  {identity.email} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <footer data-reveal="up">
              <div className="footer-links">
                <a href={identity.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a href={identity.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                <a href={identity.ctftime} target="_blank" rel="noreferrer">
                  CTFTime ↗
                </a>
                <a href={resumePath} target="_blank" rel="noreferrer">
                  Résumé ↗
                </a>
              </div>
              <p>© {new Date().getFullYear()} Krishang Zinzuwadia</p>
              <a href="#top">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
