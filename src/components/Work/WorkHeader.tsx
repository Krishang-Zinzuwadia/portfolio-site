import Link from "next/link";

import { identity } from "@/data/portfolio";

export default function WorkHeader() {
  return (
    <header className="night-work-header">
      <Link className="night-work-brand" href="/">
        <strong>Krishang Zinzuwadia</strong>
        <span>Build record</span>
      </Link>

      <nav className="night-work-nav" aria-label="Work navigation">
        <Link href="/work">Index 01—07</Link>
        <Link href="/">Portfolio</Link>
        <Link href="/mac">Macintosh</Link>
      </nav>

      <a className="night-work-contact" href={`mailto:${identity.email}`}>
        Email ↗
      </a>
    </header>
  );
}
