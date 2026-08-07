import Link from "next/link";

import type { Project } from "@/data/portfolio";

type WorkIndexCardProps = {
  index: number;
  project: Project;
};

export default function WorkIndexCard({ index, project }: WorkIndexCardProps) {
  return (
    <article className="night-directory-entry">
      <Link
        className="night-directory-link"
        href={`/work/${project.slug}`}
        aria-labelledby={`directory-${project.slug}`}
        aria-describedby={`directory-${project.slug}-summary`}
      >
        <span className="night-directory-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="night-directory-title">
          <h3 id={`directory-${project.slug}`}>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>

        <div className="night-directory-scope">
          <span>Scope</span>
          <p id={`directory-${project.slug}-summary`}>{project.summary}</p>
        </div>

        <div className="night-directory-signal">
          <span>Record</span>
          <strong>{project.recognition}</strong>
        </div>

        <time>{project.date ?? "—"}</time>
        <span className="night-directory-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
    </article>
  );
}
