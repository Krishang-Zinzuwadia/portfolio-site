"use client";

import styles from "@/components/Portfolio/ErrorPage.module.css";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className={styles.page}>
      <section className={styles.note} aria-labelledby="error-title">
        <p className={styles.code}>500</p>
        <h1 className={styles.title} id="error-title">
          This page crashed.
        </h1>
        <p className={styles.message}>
          Try loading it again. If it keeps failing, the reference below may
          help explain what went wrong.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.action}
            type="button"
            onClick={() => unstable_retry()}
          >
            Reload page
          </button>
        </div>
        {error.digest ? (
          <small className={styles.reference}>Reference: {error.digest}</small>
        ) : null}
      </section>
    </main>
  );
}
