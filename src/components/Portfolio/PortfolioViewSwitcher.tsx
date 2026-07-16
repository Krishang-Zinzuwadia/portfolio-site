"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import styles from "./PortfolioViewSwitcher.module.css";
import {
  hasPortfolioEntryCompleted,
  PORTFOLIO_ENTRY_COMPLETE_EVENT,
  subscribeToPortfolioEntry,
} from "./portfolioEntryState";

type PortfolioView = "immersive" | "editorial";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    finished: Promise<void>;
  };
};

interface PortfolioViewSwitcherProps {
  immersive: ReactNode;
  editorial: ReactNode;
}

const DEFAULT_VIEW: PortfolioView = "immersive";
const STORAGE_KEY = "krishang-portfolio-view";
const VIEW_CHANGE_EVENT = "krishang-portfolio-view-change";

let fallbackView: PortfolioView = DEFAULT_VIEW;

function isPortfolioView(value: string | null): value is PortfolioView {
  return value === "immersive" || value === "editorial";
}

function readStoredView(): PortfolioView {
  if (!hasPortfolioEntryCompleted()) return DEFAULT_VIEW;

  try {
    const storedView = window.localStorage.getItem(STORAGE_KEY);
    return isPortfolioView(storedView) ? storedView : DEFAULT_VIEW;
  } catch {
    return fallbackView;
  }
}

function getServerView(): PortfolioView {
  return DEFAULT_VIEW;
}

function subscribeToView(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(VIEW_CHANGE_EVENT, listener);
  window.addEventListener(PORTFOLIO_ENTRY_COMPLETE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(VIEW_CHANGE_EVENT, listener);
    window.removeEventListener(PORTFOLIO_ENTRY_COMPLETE_EVENT, listener);
  };
}

function persistView(view: PortfolioView) {
  fallbackView = view;

  try {
    window.localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // The in-memory fallback still keeps switching functional when storage is unavailable.
  }

  window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
}

function transitionToView(view: PortfolioView) {
  const transitionDocument = document as ViewTransitionDocument;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!transitionDocument.startViewTransition || reducedMotion) {
    persistView(view);
    return;
  }

  document.documentElement.dataset.portfolioTransition = `to-${view}`;
  const transition = transitionDocument.startViewTransition(() =>
    persistView(view)
  );

  void transition.finished.finally(() => {
    delete document.documentElement.dataset.portfolioTransition;
  });
}

export default function PortfolioViewSwitcher({
  immersive,
  editorial,
}: PortfolioViewSwitcherProps) {
  const view = useSyncExternalStore(
    subscribeToView,
    readStoredView,
    getServerView
  );
  const entryComplete = useSyncExternalStore(
    subscribeToPortfolioEntry,
    hasPortfolioEntryCompleted,
    () => false
  );
  const optionClass = (option: PortfolioView) =>
    styles.option + (view === option ? " " + styles.active : "");

  return (
    <>
      {entryComplete ? (
        <div
          className={styles.switcher}
          role="group"
          aria-label="Portfolio view mode"
        >
          <button
            type="button"
            className={optionClass("immersive")}
            aria-pressed={view === "immersive"}
            onClick={() => {
              if (view !== "immersive") transitionToView("immersive");
            }}
          >
            Mac OS
          </button>
          <button
            type="button"
            className={optionClass("editorial")}
            aria-pressed={view === "editorial"}
            onClick={() => {
              if (view !== "editorial") transitionToView("editorial");
            }}
          >
            Editorial
          </button>
        </div>
      ) : null}

      {view === "immersive" ? immersive : editorial}
    </>
  );
}
