import { identity } from "@/data/portfolio";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const websiteId = new URL("/#website", SITE_URL).toString();
const profilePageId = new URL("/#profile-page", SITE_URL).toString();
const personId = new URL("/#person", SITE_URL).toString();
const schoolId = new URL("/#vit", SITE_URL).toString();

const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL.toString(),
      name: SITE_NAME,
      alternateName: "Krishang",
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": profilePageId,
      url: SITE_URL.toString(),
      name: `${SITE_NAME} — Portfolio`,
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: identity.name,
      alternateName: "Krishang",
      description: identity.role,
      jobTitle: identity.role,
      email: identity.email,
      url: SITE_URL.toString(),
      mainEntityOfPage: { "@id": profilePageId },
      sameAs: [identity.linkedin, identity.github, identity.ctftime],
      affiliation: [
        {
          "@type": "CollegeOrUniversity",
          "@id": schoolId,
          name: identity.school,
        },
        {
          "@type": "Organization",
          name: "ACM Student Chapter, VIT",
        },
      ],
      knowsAbout: [
        "Artificial intelligence",
        "Autonomous agents",
        "Full-stack engineering",
        "Cybersecurity",
        "Competitive security",
      ],
    },
  ],
};

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function PortfolioJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(portfolioJsonLd) }}
    />
  );
}
