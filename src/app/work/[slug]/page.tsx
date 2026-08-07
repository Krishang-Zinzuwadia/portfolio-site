import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectCaseStudy from "@/components/Work/ProjectCaseStudy";
import { getProjectBySlug, identity, projects } from "@/data/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const title = `${project.title} Case Study | ${identity.name}`;
  const description = project.summary;
  const canonical = `/work/${project.slug}`;
  const imageAlt = `${project.title} case study by ${identity.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    authors: [{ name: identity.name }],
    openGraph: {
      type: "article",
      locale: "en_IN",
      url: canonical,
      title,
      description,
      siteName: identity.name,
      authors: [identity.name],
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "/twitter-image.jpg",
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((project) => project.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const previousProject =
    projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <ProjectCaseStudy
      nextProject={nextProject}
      previousProject={previousProject}
      project={project}
    />
  );
}
