"use client";

import Link from "next/link";

export default function WorkError({
  unstable_retry,
}: {
  unstable_retry: () => void;
}) {
  return (
    <main className="night-work-state" id="main-content">
      <p className="night-work-kicker">Error / Record interrupted</p>
      <h1>The build record could not be opened.</h1>
      <p>
        The project data is still intact. Retry this route or return to the
        case-study index.
      </p>
      <div>
        <button type="button" onClick={() => unstable_retry()}>
          Retry this record →
        </button>
        <Link href="/work">Open the case-study index ↗</Link>
      </div>
    </main>
  );
}
