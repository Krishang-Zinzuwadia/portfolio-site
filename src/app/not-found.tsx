import Link from "next/link";

import styles from "@/components/Portfolio/ErrorPage.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.note} aria-labelledby="not-found-title">
        <p className={styles.code}>404</p>
        <h1 className={styles.title} id="not-found-title">
          That page isn’t here.
        </h1>
        <p className={styles.message}>
          The link may be old, or I may have moved it.
        </p>
        <div className={styles.actions}>
          <Link className={styles.action} href="/">
            Go back home
          </Link>
        </div>
      </section>
    </main>
  );
}
