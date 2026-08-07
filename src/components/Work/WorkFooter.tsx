import Link from "next/link";

import { identity } from "@/data/portfolio";

import styles from "./WorkPages.module.css";

export default function WorkFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInvitation}>
        <p className={styles.sectionLabel}>Contact</p>
        <h2>Have a question about a project?</h2>
        <p>
          If something here is unclear, email me. I can explain the code, a
          decision, or what I’d change now.
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
          Built by {identity.name} · {new Date().getFullYear()}
        </small>
      </div>
    </footer>
  );
}
