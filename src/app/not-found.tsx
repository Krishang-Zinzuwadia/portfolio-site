import Link from "next/link";

import styles from "@/components/Portfolio/ErrorPage.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.note} aria-labelledby="not-found-title">
        <p className={styles.code}>404</p>
        <h1 className={styles.title} id="not-found-title">
          I couldn’t find that page.
        </h1>
        <p className={styles.message}>
          Check the address, or go back to the portfolio.
        </p>
        <div className={styles.actions}>
          <Link className={styles.action} href="/">
            Go to the homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
