import { identity } from "@/data/portfolio";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  email: `mailto:${identity.email}`,
  url: identity.linkedin,
  sameAs: [identity.linkedin, identity.github, identity.ctftime],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: identity.school,
  },
  knowsAbout: [
    "Artificial intelligence",
    "Autonomous agents",
    "Full-stack engineering",
    "Cybersecurity",
    "Competitive security",
  ],
};

export default function PortfolioJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
  );
}
