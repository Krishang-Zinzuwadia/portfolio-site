import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-shell">
      <div className="error-card">
        <p>404 / RECORD NOT FOUND</p>
        <h1>This page is not in the index.</h1>
        <span>
          The requested route may have moved, or it may never have been part of
          the public portfolio.
        </span>
        <Link href="/">Return to the portfolio →</Link>
      </div>
    </main>
  );
}
