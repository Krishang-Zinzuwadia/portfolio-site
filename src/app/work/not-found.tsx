import Link from "next/link";

import styles from "@/components/Portfolio/ErrorPage.module.css";

export default function WorkNotFound() {
  return (
    <main className={styles.page} id="main-content">
      <section className={styles.note} aria-labelledby="work-not-found-title">
        <p className={styles.code}>404</p>
        <h1 className={styles.title} id="work-not-found-title">
          I couldn’t find that project.
        </h1>
        <p className={styles.message}>
          It may have been renamed, or the address may be wrong.
        </p>
        <div className={styles.actions}>
          <Link className={styles.action} href="/work">
            Go to all projects
          </Link>
        </div>
      </section>
    </main>
  );
}
