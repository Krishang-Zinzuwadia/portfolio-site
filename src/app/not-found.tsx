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
          The link may be old, or there may be a typo in the address.
        </p>
        <div className={styles.actions}>
          <Link className={styles.action} href="/">
            Back to the portfolio
          </Link>
        </div>
      </section>
    </main>
  );
}
