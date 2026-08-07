import Link from "next/link";

import TechIcon from "@/components/Portfolio/TechIcon";
import type { Project } from "@/data/portfolio";

type WorkIndexCardProps = {
  index: number;
  project: Project;
};

export default function WorkIndexCard({ index, project }: WorkIndexCardProps) {
  return (
    <article className={`work-index-card work-tone-${project.tone}`}>
      <Link
        className="work-index-card-link"
        href={`/work/${project.slug}`}
        aria-label={`Read the ${project.title} case study`}
      >
        <div className="work-card-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.date ?? "Case study"}</span>
        </div>

        <div className="work-card-title">
          <p>{project.recognition}</p>
          <h2>{project.title}</h2>
          {project.fullTitle !== project.title ? (
            <span>{project.fullTitle}</span>
          ) : null}
        </div>

        <p className="work-card-summary">{project.summary}</p>

        <div className="work-card-lower">
          <ul aria-label={`${project.title} technologies`}>
            {project.stack.slice(0, 6).map((technology) => (
              <li key={technology}>
                <TechIcon name={technology} />
                {technology}
              </li>
            ))}
          </ul>
          <span className="work-card-cta">
            Open case study <i aria-hidden="true">↗</i>
          </span>
        </div>
      </Link>
    </article>
  );
}
