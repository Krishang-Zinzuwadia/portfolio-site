import Link from "next/link";

import { identity } from "@/data/portfolio";

export default function WorkHeader() {
  return (
    <header className="work-site-header">
      <Link
        className="work-brand"
        href="/"
        aria-label="Krishang Zinzuwadia, home"
      >
        <span aria-hidden="true">
          K<i>/</i>Z
        </span>
        <strong>Krishang Zinzuwadia</strong>
      </Link>

      <nav className="work-nav" aria-label="Work navigation">
        <Link href="/work" aria-current="page">
          Case studies
        </Link>
        <Link href="/#experience">Experience</Link>
        <Link href="/#recognition">Recognition</Link>
      </nav>

      <a className="work-header-contact" href={`mailto:${identity.email}`}>
        Start a conversation <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
