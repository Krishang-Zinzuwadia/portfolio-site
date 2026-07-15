import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-shell">
      <div className="error-card">
        <p>404 / UNKNOWN COORDINATE</p>
        <h1>There&apos;s nothing broadcasting here.</h1>
        <span>
          The page you requested does not exist or has moved to a different
          orbit.
        </span>
        <Link href="/">Return to the portfolio ←</Link>
      </div>
    </main>
  );
}
