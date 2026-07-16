import type { CSSProperties } from "react";

import EditorialHeroArtwork from "@/components/Portfolio/EditorialHeroArtwork";
import EditorialRevealController from "@/components/Portfolio/EditorialRevealController";
import TechIcon from "@/components/Portfolio/TechIcon";
import {
  achievements,
  experience,
  identity,
  projects,
  skills,
} from "@/data/portfolio";

const resumePath = "/Krishang-Zinzuwadia-Resume.pdf";

const toolRoles: Record<string, string> = {
  TypeScript: "Language",
  Python: "Language",
  Rust: "Systems language",
  Go: "Backend language",
  "Next.js": "Web framework",
  React: "Interface layer",
  Tauri: "Desktop runtime",
  FastAPI: "API framework",
  LangGraph: "Agent orchestration",
  Redis: "Cache and queues",
  PostgreSQL: "Database",
  Docker: "Infrastructure",
};

type RevealStyle = CSSProperties & { "--reveal-delay": string };

const revealDelay = (delay: number): RevealStyle => ({
  "--reveal-delay": `${delay}ms`,
});

export default function EditorialPortfolio() {
  return (
    <div className="editorial-portfolio" id="editorial-portfolio">
      <EditorialRevealController rootId="editorial-portfolio" />
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
                <span>I build AI systems,</span>
                <em>end to end.</em>
              </h1>

              <p className="hero-lede">
                Desktop automation, multi-agent development, and production
                platforms used by 1,000+ applicants.
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

            <div
              className="hero-specimens-wrap"
              data-reveal="scale"
              style={revealDelay(140)}
            >
              <EditorialHeroArtwork />
            </div>
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

            <section
              className="toolkit-panel"
              data-reveal="up"
              aria-labelledby="toolkit-title"
            >
              <header className="toolkit-header">
                <div>
                  <span>TOOLCHAIN</span>
                  <h3 id="toolkit-title">Selected toolkit</h3>
                </div>
                <p>
                  <strong>{skills.featured.length}</strong>
                  <span>working set</span>
                </p>
              </header>

              <ol className="toolkit-grid">
                {skills.featured.map((skill, index) => (
                  <li
                    className="toolkit-item"
                    key={skill}
                    style={revealDelay(index * 35)}
                  >
                    <span className="toolkit-icon-shell">
                      <TechIcon className="toolkit-icon" name={skill} />
                    </span>
                    <span className="toolkit-copy">
                      <strong>{skill}</strong>
                      <span>{toolRoles[skill]}</span>
                    </span>
                    <span className="toolkit-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
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
