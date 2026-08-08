import Link from "next/link";

import ProjectSketch from "@/components/Editorial/ProjectSketch";
import { getProjectPresentation } from "@/components/Editorial/project-presentation";
import type { Project } from "@/data/portfolio";

import styles from "./WorkPages.module.css";

type ProjectContentsEntryProps = {
  project: Project;
};

export default function ProjectContentsEntry({
  project,
}: ProjectContentsEntryProps) {
  const presentation = getProjectPresentation(project.slug);
  const headingId = `project-${project.slug}`;
  const summaryId = `${headingId}-summary`;

  return (
    <article className={styles.contentsEntry}>
      <Link
        className={styles.contentsEntryLink}
        href={`/work/${project.slug}`}
        aria-labelledby={headingId}
        aria-describedby={summaryId}
      >
        <div className={styles.entrySketch} aria-hidden="true">
          <ProjectSketch slug={project.slug} />
        </div>

        <div className={styles.entryCopy}>
          <p className={styles.entryKind}>{project.subtitle}</p>
          <h3 id={headingId}>{project.title}</h3>
          <p id={summaryId} className={styles.entrySummary}>
            {presentation.summary}
          </p>
          <p className={styles.entryOutcome}>
            <span>Where it’s at</span>
            {project.recognition}
            {project.date ? `, ${project.date}` : ""}
          </p>
          <span className={styles.readCase}>Open {project.title}</span>
        </div>
      </Link>
    </article>
  );
}
