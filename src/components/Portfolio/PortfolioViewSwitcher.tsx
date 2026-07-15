"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import styles from "./PortfolioViewSwitcher.module.css";

type PortfolioView = "immersive" | "editorial";

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

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(VIEW_CHANGE_EVENT, listener);
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

export default function PortfolioViewSwitcher({
  immersive,
  editorial,
}: PortfolioViewSwitcherProps) {
  const view = useSyncExternalStore(
    subscribeToView,
    readStoredView,
    getServerView
  );
  const optionClass = (option: PortfolioView) =>
    styles.option + (view === option ? " " + styles.active : "");

  return (
    <>
      <div
        className={styles.switcher}
        role="group"
        aria-label="Portfolio view mode"
      >
        <button
          type="button"
          className={optionClass("immersive")}
          aria-pressed={view === "immersive"}
          onClick={() => persistView("immersive")}
        >
          Mac OS
        </button>
        <button
          type="button"
          className={optionClass("editorial")}
          aria-pressed={view === "editorial"}
          onClick={() => persistView("editorial")}
        >
          Editorial
        </button>
      </div>

      {view === "immersive" ? immersive : editorial}
    </>
  );
}
