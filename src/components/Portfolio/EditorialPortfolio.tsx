"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import TechIcon from "@/components/Portfolio/TechIcon";
import {
  achievements,
  experience,
  identity,
  projects,
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
          <a href="#work">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#recognition">Recognition</a>
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
                KRISHANG ZINZUWADIA · COMPUTER SCIENCE, VIT
              </p>

              <h1>
                I build AI agents and <em>full-stack software.</em>
              </h1>

              <p className="hero-lede">
                Recent work includes a desktop automation agent, a 27-agent
                development system, and a recruitment platform used by 1,000+
                applicants.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  Explore projects <span aria-hidden="true">↓</span>
                </a>
                <a
                  className="button button-quiet"
                  href={`mailto:${identity.email}`}
                >
                  Email me
                </a>
              </div>
            </div>

            <figure
              className="hero-art"
              data-reveal="scale"
              style={revealDelay(140)}
            >
              <div className="hero-art-canvas">
                <Image
                  className="hero-art-image"
                  src="/assets/editorial/hero-systems-map.webp"
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="(max-width: 560px) calc(100vw - 2rem), (max-width: 860px) calc(100vw - 3rem), (max-width: 1120px) 42vw, 36rem"
                  fetchPriority="high"
                />

                <ol className="hero-art-labels" aria-label="Selected systems">
                  <li className="hero-art-label hero-art-label-atlas">
                    <span>01</span>
                    <span>
                      <strong>Atlas</strong>
                      <small>Local desktop agent</small>
                    </span>
                  </li>
                  <li className="hero-art-label hero-art-label-labyrinth">
                    <span>02</span>
                    <span>
                      <strong>Labyrinth</strong>
                      <small>27-agent dev system</small>
                    </span>
                  </li>
                  <li className="hero-art-label hero-art-label-ocs">
                    <span>03</span>
                    <span>
                      <strong>OCS</strong>
                      <small>Recruitment platform</small>
                    </span>
                  </li>
                </ol>
              </div>

              <figcaption className="hero-art-caption">
                <span>Selected systems</span>
                <span>2025—26</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="work-section section-shell" id="work">
          <div className="section-heading" data-reveal="up">
            <p className="eyebrow">
              <span>02</span>
              PROJECTS
            </p>
            <h2>
              Selected <em>projects.</em>
            </h2>
            <p>
              Three projects across desktop AI, multi-agent development, and
              recruitment infrastructure.
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

                <ul
                  className="project-tech"
                  aria-label={`${project.title} technologies`}
                >
                  {project.stack.map((technology) => (
                    <li key={technology}>
                      <TechIcon
                        className="project-tech-icon"
                        name={technology}
                      />
                      <span>{technology}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="experience">
          <div className="about-inner section-shell">
            <div
              className="section-heading section-heading-light"
              data-reveal="up"
            >
              <p className="eyebrow">
                <span>03</span>
                EXPERIENCE &amp; BACKGROUND
              </p>
              <h2>
                Experience and <em>background.</em>
              </h2>
            </div>

            <div className="about-grid">
              <div className="about-statement" data-reveal="left">
                <p className="statement-lead">
                  I&apos;m a computer science student at VIT and a member of
                  ACM&apos;s technical team.
                </p>
                <p>
                  My work spans model orchestration, desktop runtimes,
                  databases, and web interfaces. I also compete in CTFs, which
                  keeps security and failure modes part of how I think about
                  software.
                </p>
              </div>

              <aside className="education-card" data-reveal="right">
                <span className="card-kicker">EDUCATION</span>
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

            <div className="skills-grid skills-grid-compact">
              <article data-reveal="up">
                <span>SELECTED TOOLS</span>
                <ul>
                  {skills.featured.map((skill) => (
                    <li key={skill}>
                      <TechIcon className="skill-icon" name={skill} />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="proof-section section-shell" id="recognition">
          <div className="section-heading proof-heading" data-reveal="up">
            <p className="eyebrow">
              <span>04</span>
              RECOGNITION
            </p>
            <h2>
              Selected <em>results.</em>
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
              CONTACT
            </p>

            <div className="contact-grid">
              <h2 data-reveal="left">
                Get in <em>touch.</em>
              </h2>
              <div
                className="contact-copy"
                data-reveal="right"
                style={revealDelay(110)}
              >
                <p>
                  For project inquiries or technical collaborations, email me.
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
