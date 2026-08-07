import Link from "next/link";

import { identity } from "@/data/portfolio";

import styles from "./WorkPages.module.css";

export default function WorkFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInvitation}>
        <p className={styles.sectionLabel}>Want to compare notes?</p>
        <h2>Tell me about the stubborn part.</h2>
        <p>
          I’m always happy to talk about agent runtimes, local-first products,
          developer tools, or a bug that turned out to be an architecture
          problem.
        </p>
        <a className={styles.footerEmail} href={`mailto:${identity.email}`}>
          {identity.email}
        </a>
      </div>

      <div className={styles.footerBase}>
        <nav aria-label="Footer links">
          <Link href="/">Home</Link>
          <Link href="/work">Projects</Link>
          <a href={identity.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={identity.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link href="/mac">Macintosh</Link>
        </nav>
        <small>
          Written and built by {identity.name}, {new Date().getFullYear()}.
        </small>
      </div>
    </footer>
  );
}
