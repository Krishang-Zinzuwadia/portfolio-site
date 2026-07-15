"use client";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="error-shell">
      <div className="error-card">
        <p>500 / SIGNAL INTERRUPTED</p>
        <h1>Something slipped out of orbit.</h1>
        <span>
          The portfolio hit an unexpected error
          {error.digest ? ` · ${error.digest}` : ""}.
        </span>
        <button type="button" onClick={() => unstable_retry()}>
          Try the signal again ↻
        </button>
      </div>
    </main>
  );
}
