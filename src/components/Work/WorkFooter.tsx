import Link from "next/link";

import { identity } from "@/data/portfolio";

import styles from "./WorkPages.module.css";

export default function WorkFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInvitation}>
        <p className={styles.sectionLabel}>Ask me something</p>
        <h2>Want to know more about one of these?</h2>
        <p>
          Email me if a decision is unclear, you want to talk through the code,
          or you are curious what I would change now.
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
          Made by {identity.name} · {new Date().getFullYear()}
        </small>
      </div>
    </footer>
  );
}
