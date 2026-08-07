import Link from "next/link";

import { identity } from "@/data/portfolio";

export default function WorkFooter() {
  return (
    <footer className="work-footer">
      <div>
        <p>Have a system worth building?</p>
        <a href={`mailto:${identity.email}`}>
          {identity.email} <span aria-hidden="true">↗</span>
        </a>
      </div>

      <nav aria-label="Footer navigation">
        <Link href="/">Portfolio</Link>
        <a href={identity.github} target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a href={identity.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <p>© {new Date().getFullYear()} Krishang Zinzuwadia</p>
    </footer>
  );
}
