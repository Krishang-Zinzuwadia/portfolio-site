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
        <p>500 / RECORD INTERRUPTED</p>
        <h1>The portfolio could not be rendered.</h1>
        <span>
          An unexpected error interrupted the build record
          {error.digest ? ` · ${error.digest}` : ""}.
        </span>
        <button type="button" onClick={() => unstable_retry()}>
          Retry the portfolio →
        </button>
      </div>
    </main>
  );
}
