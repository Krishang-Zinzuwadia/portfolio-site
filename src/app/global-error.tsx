"use client";

import styles from "@/components/Portfolio/ErrorPage.module.css";

import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className={styles.page}>
          <section className={styles.note} aria-labelledby="global-error-title">
            <p className={styles.code}>500</p>
            <h1 className={styles.title} id="global-error-title">
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
            </div>
            {error.digest ? (
              <small className={styles.reference}>
                Error reference: {error.digest}
              </small>
            ) : null}
          </section>
        </main>
      </body>
    </html>
  );
}
