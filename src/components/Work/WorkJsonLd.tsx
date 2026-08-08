import type { Project } from "@/data/portfolio";
import { absoluteUrl, SITE_NAME, WORK_DESCRIPTION } from "@/lib/site";

type WorkJsonLdProps =
  { kind: "index" } | { kind: "project"; project: Project };

const websiteId = absoluteUrl("/#website");
const personId = absoluteUrl("/#person");

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildIndexJsonLd() {
  const url = absoluteUrl("/work");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection-page`,
    url,
    name: `Projects | ${SITE_NAME}`,
    description: WORK_DESCRIPTION,
    inLanguage: "en-IN",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Portfolio",
          item: absoluteUrl(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: url,
        },
      ],
    },
  };
}

function buildProjectJsonLd(project: Project) {
  const url = absoluteUrl(`/work/${project.slug}`);
  const workUrl = absoluteUrl("/work");
  const pageId = `${url}#webpage`;
  const projectId = `${url}#project`;
  const breadcrumbId = `${url}#breadcrumb`;
  const publicEvidence = project.caseStudy.evidence.map((item) => item.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Portfolio",
            item: absoluteUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: workUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: url,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: `${project.title} | ${SITE_NAME}`,
        description: project.summary,
        inLanguage: "en-IN",
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": projectId },
      },
      {
        "@type": "CreativeWork",
        "@id": projectId,
        url,
        name: project.fullTitle,
        alternateName:
          project.fullTitle === project.title ? undefined : project.title,
        description: project.summary,
        creator: { "@id": personId },
        mainEntityOfPage: { "@id": pageId },
        keywords: project.stack,
        sameAs: publicEvidence.length > 0 ? publicEvidence : undefined,
      },
    ],
  };
}

export default function WorkJsonLd(props: WorkJsonLdProps) {
  const jsonLd =
    props.kind === "index"
      ? buildIndexJsonLd()
      : buildProjectJsonLd(props.project);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}
