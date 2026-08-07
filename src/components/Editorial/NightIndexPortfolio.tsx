import Link from "next/link";

import {
  achievements,
  experience,
  identity,
  labProjects,
  openSourceContributions,
  projects,
  skills,
} from "@/data/portfolio";

const resumePath = "/Krishang-Zinzuwadia-Resume.pdf";

function number(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default function NightIndexPortfolio() {
  return (
    <div className="night-index">
      <a className="night-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="night-header">
        <a
          className="night-nameplate"
          href="#top"
          aria-label="Krishang Zinzuwadia, back to top"
        >
          <strong>Krishang Zinzuwadia</strong>
          <span>Systems &amp; product engineering</span>
        </a>

        <p className="night-header-index" aria-hidden="true">
          Index 01—07
        </p>

        <nav className="night-nav" aria-label="Primary navigation">
          <a href="#record">Work</a>
          <a href="#lab">Lab</a>
          <a href="#upstream">Upstream</a>
          <a href="#profile">About</a>
        </nav>

        <a className="night-header-email" href={`mailto:${identity.email}`}>
          Email ↗
        </a>
      </header>

      <main id="main-content">
        <section className="night-hero" id="top" aria-labelledby="hero-title">
          <div className="night-hero-coordinate" aria-hidden="true">
            <span>KZ / 26</span>
            <span>12.9716° N</span>
            <span>79.1589° E</span>
          </div>

          <h1 id="hero-title">
            I build software for the <span>messy part</span> between intent and
            outcome.
          </h1>

          <div className="night-hero-lower">
            <p className="night-hero-deck">
              Agent runtimes, local-first products, infrastructure, and small
              tools—mostly in TypeScript, Python, and Rust.
            </p>

            <p className="night-hero-identity">
              Computer science at VIT
              <br />
              ACM technical team
              <br />
              Vellore, India
            </p>

            <div className="night-hero-actions">
              <a href="#record">Read the build record ↓</a>
              <Link href="/mac">Open Macintosh version ↗</Link>
            </div>
          </div>

          <dl className="night-live-index" aria-label="Portfolio index">
            <div>
              <dt>Systems</dt>
              <dd>07</dd>
            </div>
            <div>
              <dt>Experiments</dt>
              <dd>05</dd>
            </div>
            <div>
              <dt>Upstream records</dt>
              <dd>06</dd>
            </div>
          </dl>

          <span className="night-scanline" aria-hidden="true" />
        </section>

        <section className="night-record" id="record" aria-labelledby="record-title">
          <header className="night-section-intro">
            <p className="night-kicker">01 / The build record</p>
            <h2 id="record-title">Seven systems, examined.</h2>
            <p>
              Each entry states the work, the recorded result, and where the
              public proof stops.
            </p>
          </header>

          <div className="night-project-ledger">
            {projects.map((project, index) => (
              <article className="night-project-row" key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  aria-labelledby={`home-project-${project.slug}`}
                  aria-describedby={`home-project-${project.slug}-summary`}
                >
                  <div className="night-project-number">
                    <span>{number(index)}</span>
                    <time>{project.date ?? "Date not listed"}</time>
                  </div>

                  <div className="night-project-title">
                    <p>{project.subtitle}</p>
                    <h3 id={`home-project-${project.slug}`}>{project.title}</h3>
                  </div>

                  <p
                    className="night-project-summary"
                    id={`home-project-${project.slug}-summary`}
                  >
                    {project.summary}
                  </p>

                  <dl className="night-project-proof">
                    <div>
                      <dt>Role</dt>
                      <dd>{project.caseStudy.role[0]}</dd>
                    </div>
                    <div>
                      <dt>Record</dt>
                      <dd>{project.recognition}</dd>
                    </div>
                  </dl>

                  <span className="night-project-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </article>
            ))}
          </div>

          <Link className="night-index-link" href="/work">
            Open the full case-study index <span aria-hidden="true">↗</span>
          </Link>
        </section>

        <section className="night-lab" id="lab" aria-labelledby="lab-title">
          <header className="night-inverse-heading">
            <p className="night-kicker">02 / Utility shelf</p>
            <h2 id="lab-title">Useful side projects.</h2>
            <p>Five small tools. Each one has a single job.</p>
          </header>

          <div className="night-lab-list">
            {labProjects.map((project, index) => (
              <article key={project.title}>
                <span className="night-lab-number">{number(index)}</span>
                <p className="night-lab-note">{project.note}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="night-lab-stack">{project.stack.join(" / ")}</p>
                <a href={project.href} target="_blank" rel="noreferrer">
                  Open {project.title} repository ↗
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="night-upstream"
          id="upstream"
          aria-labelledby="upstream-title"
        >
          <header className="night-section-intro night-section-intro-compact">
            <p className="night-kicker">03 / Contribution ledger</p>
            <h2 id="upstream-title">Upstream, not mine.</h2>
            <p>Merged contributions with the ownership boundary left intact.</p>
          </header>

          <div className="night-ledger-heading" aria-hidden="true">
            <span>No.</span>
            <span>Record / upstream</span>
            <span>Contribution</span>
            <span>Proof</span>
          </div>

          <ol className="night-contribution-ledger">
            {openSourceContributions.map((contribution, index) => (
              <li key={`${contribution.organization}-${contribution.title}`}>
                <span className="night-contribution-number">{number(index)}</span>
                <div className="night-contribution-title">
                  <h3>{contribution.title}</h3>
                  <p>{contribution.organization}</p>
                  <span>{contribution.proof}</span>
                </div>
                <p className="night-contribution-copy">
                  {contribution.contribution}
                </p>
                <a href={contribution.href} target="_blank" rel="noreferrer">
                  Open linked record ↗
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="night-profile" id="profile" aria-labelledby="profile-title">
          <div className="night-profile-sticky">
            <p className="night-kicker">04 / Background &amp; record</p>
            <h2 id="profile-title">
              Built through practice. Tested under pressure.
            </h2>
            <div className="night-profile-facts">
              <p>
                <span>Education</span>
                <strong>{identity.school}</strong>
                {identity.education}
                <br />
                {identity.graduation}
              </p>
              <p>
                <span>Current role</span>
                <strong>{experience.organization}</strong>
                {experience.role}
                <br />
                {experience.date}
              </p>
            </div>
          </div>

          <div className="night-profile-record">
            <section aria-labelledby="responsibility-title">
              <p className="night-kicker">Responsibilities</p>
              <h3 id="responsibility-title">ACM, VIT</h3>
              <ul>
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="results-title">
              <p className="night-kicker">Selected results / dated</p>
              <h3 id="results-title">Competition record</h3>
              <ol className="night-achievements">
                {achievements.map((achievement, index) => (
                  <li key={`${achievement.title}-${achievement.date}`}>
                    <span>{number(index)}</span>
                    <strong>{achievement.place}</strong>
                    <div>
                      <h4>{achievement.title}</h4>
                      <p>{achievement.context}</p>
                    </div>
                    <time>{achievement.date}</time>
                  </li>
                ))}
              </ol>
            </section>

            <section className="night-toolchain" aria-labelledby="toolchain-title">
              <p className="night-kicker">Working set</p>
              <h3 id="toolchain-title">Toolchain</h3>
              <p>
                {skills.featured.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </p>
            </section>
          </div>
        </section>

        <section className="night-contact" id="contact" aria-labelledby="contact-title">
          <p className="night-kicker">05 / Contact</p>
          <h2 id="contact-title">Building something technically ambitious?</h2>
          <p>For project inquiries or technical collaborations, email me.</p>
          <a className="night-contact-email" href={`mailto:${identity.email}`}>
            {identity.email} ↗
          </a>

          <footer className="night-footer">
            <p>© {new Date().getFullYear()} Krishang Zinzuwadia</p>
            <nav aria-label="External links">
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
              <Link href="/mac">Macintosh version ↗</Link>
            </nav>
            <a href="#top">Back to top ↑</a>
          </footer>
        </section>
      </main>
    </div>
  );
}
