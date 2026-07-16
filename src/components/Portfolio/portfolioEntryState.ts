export const PORTFOLIO_ENTRY_COMPLETE_EVENT =
  "krishang-portfolio-entry-complete";

const PORTFOLIO_VIEW_STORAGE_KEY = "krishang-portfolio-view";

let entryCompleteInThisPage = false;

export function hasPortfolioEntryCompleted() {
  return entryCompleteInThisPage;
}

export function markPortfolioEntryComplete() {
  if (entryCompleteInThisPage) return;

  entryCompleteInThisPage = true;

  try {
    window.localStorage.setItem(PORTFOLIO_VIEW_STORAGE_KEY, "immersive");
  } catch {
    // The in-memory entry state still keeps this page in the immersive view.
  }

  window.dispatchEvent(new Event(PORTFOLIO_ENTRY_COMPLETE_EVENT));
}

export function subscribeToPortfolioEntry(listener: () => void) {
  window.addEventListener(PORTFOLIO_ENTRY_COMPLETE_EVENT, listener);
  return () =>
    window.removeEventListener(PORTFOLIO_ENTRY_COMPLETE_EVENT, listener);
}
