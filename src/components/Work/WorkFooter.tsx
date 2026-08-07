import Link from "next/link";

import { identity } from "@/data/portfolio";

export default function WorkFooter() {
  return (
    <footer className="night-work-footer">
      <p>Have a difficult system?</p>
      <a className="night-work-footer-email" href={`mailto:${identity.email}`}>
        {identity.email} ↗
      </a>

      <nav aria-label="Footer links">
        <Link href="/">Home</Link>
        <Link href="/work">Case studies</Link>
        <a href={identity.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a href={identity.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <Link href="/mac">Macintosh ↗</Link>
      </nav>

      <small>© {new Date().getFullYear()} Krishang Zinzuwadia</small>
    </footer>
  );
}
