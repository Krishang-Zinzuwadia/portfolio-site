"use client";

import Link from "next/link";

import styles from "@/components/Portfolio/ErrorPage.module.css";

export default function WorkError({
  unstable_retry,
}: {
  unstable_retry: () => void;
}) {
  return (
    <main className={styles.page} id="main-content">
      <section className={styles.note} aria-labelledby="work-error-title">
        <p className={styles.code}>500</p>
        <h1 className={styles.title} id="work-error-title">
          This project page failed to load.
        </h1>
        <p className={styles.message}>
          Try it again, or return to the project list.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.action}
            type="button"
            onClick={() => unstable_retry()}
          >
            Reload page
          </button>
          <Link className={styles.action} href="/work">
            Go to all projects
          </Link>
        </div>
      </section>
    </main>
  );
}
