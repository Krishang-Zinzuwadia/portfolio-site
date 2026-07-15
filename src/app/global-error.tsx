"use client";

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
        <main className="error-shell">
          <div className="error-card">
            <p>500 / SYSTEM FAULT</p>
            <h1>The main signal went quiet.</h1>
            <span>
              A critical error stopped the page
              {error.digest ? ` · ${error.digest}` : ""}.
            </span>
            <button type="button" onClick={() => unstable_retry()}>
              Restart the system ↻
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
