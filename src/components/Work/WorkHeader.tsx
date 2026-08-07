import Link from "next/link";

import { identity } from "@/data/portfolio";

import styles from "./WorkPages.module.css";

export default function WorkHeader() {
  return (
    <header className={styles.masthead}>
      <div className={styles.mastheadInner}>
        <Link className={styles.wordmark} href="/">
          <strong>{identity.name}</strong>
          <span>Software, notes, and working papers</span>
        </Link>

        <nav className={styles.primaryNav} aria-label="Portfolio navigation">
          <Link href="/work">Projects</Link>
          <Link href="/mac">Macintosh detour</Link>
          <a href={`mailto:${identity.email}`}>Write to me</a>
        </nav>
      </div>
    </header>
  );
}
