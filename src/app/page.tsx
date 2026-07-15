import MacExperience from "@/components/Macintosh/MacExperience";
import EditorialPortfolio from "@/components/Portfolio/EditorialPortfolio";
import PortfolioViewSwitcher from "@/components/Portfolio/PortfolioViewSwitcher";
import { identity } from "@/data/portfolio";

export default function Home() {
  const jsonLd = {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PortfolioViewSwitcher
        immersive={<MacExperience />}
        editorial={<EditorialPortfolio />}
      />
    </>
  );
}
