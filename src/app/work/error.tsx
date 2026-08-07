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
          That didn’t load.
        </h1>
        <p className={styles.message}>
          Try once more. If it still breaks, email me.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.action}
            type="button"
            onClick={() => unstable_retry()}
          >
            Try again
          </button>
          <Link className={styles.action} href="/work">
            See all projects
          </Link>
        </div>
      </section>
    </main>
  );
}
