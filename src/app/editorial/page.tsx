import EditorialPortfolio from "@/components/Portfolio/EditorialPortfolio";
import PortfolioJsonLd from "@/components/Portfolio/PortfolioJsonLd";
import PortfolioViewSwitcher from "@/components/Portfolio/PortfolioViewSwitcher";

export default function EditorialPage() {
  return (
    <>
      <PortfolioJsonLd />
      <PortfolioViewSwitcher currentView="editorial" />
      <EditorialPortfolio />
    </>
  );
}
