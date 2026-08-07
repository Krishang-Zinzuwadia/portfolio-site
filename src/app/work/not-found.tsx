import Link from "next/link";

export default function WorkNotFound() {
  return (
    <main className="night-work-state" id="main-content">
      <p className="night-work-kicker">404 / Record unavailable</p>
      <h1>That case study is not in the index.</h1>
      <p>
        The requested record may have moved, or it may never have been part of
        the public portfolio.
      </p>
      <div>
        <Link href="/work">Return to the case-study index →</Link>
        <Link href="/">Return to the portfolio ↗</Link>
      </div>
    </main>
  );
}
