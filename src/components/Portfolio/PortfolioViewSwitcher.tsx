"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import {
  hasPortfolioEntryCompleted,
  subscribeToPortfolioEntry,
} from "./portfolioEntryState";

type PortfolioView = "immersive" | "editorial";

interface PortfolioViewSwitcherProps {
  currentView: PortfolioView;
  waitForEntry?: boolean;
}

const viewRoutes: Record<PortfolioView, string> = {
  immersive: "/",
  editorial: "/editorial",
};

const viewLabels: Record<PortfolioView, string> = {
  immersive: "Mac OS",
  editorial: "Editorial",
};

export default function PortfolioViewSwitcher({
  currentView,
  waitForEntry = false,
}: PortfolioViewSwitcherProps) {
  const router = useRouter();
  const entryComplete = useSyncExternalStore(
    subscribeToPortfolioEntry,
    hasPortfolioEntryCompleted,
    () => false
  );

  if (waitForEntry && !entryComplete) {
    return null;
  }

  const prefetchOnIntent = (view: PortfolioView) => {
    if (view !== currentView) {
      router.prefetch(viewRoutes[view]);
    }
  };

  return (
    <nav className="portfolio-view-switcher" aria-label="Portfolio view mode">
      {(Object.keys(viewRoutes) as PortfolioView[]).map((view) => {
        const isActive = view === currentView;

        return (
          <Link
            key={view}
            href={viewRoutes[view]}
            prefetch={false}
            className={`portfolio-view-switcher__option${
              isActive ? " portfolio-view-switcher__option--active" : ""
            }`}
            aria-current={isActive ? "page" : undefined}
            onFocus={() => prefetchOnIntent(view)}
            onPointerEnter={() => prefetchOnIntent(view)}
            onTouchStart={() => prefetchOnIntent(view)}
          >
            {viewLabels[view]}
          </Link>
        );
      })}
    </nav>
  );
}
