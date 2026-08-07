"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_MAC_PREFERENCES,
  readMacPreferences,
  storeMacPreferences,
  subscribeToMacPreferences,
  type MacPreferences,
} from "./macPreferences";

export function useMacPreferences() {
  const preferences = useSyncExternalStore(
    subscribeToMacPreferences,
    readMacPreferences,
    () => DEFAULT_MAC_PREFERENCES
  );

  const setPreferences = useCallback((nextPreferences: MacPreferences) => {
    storeMacPreferences(nextPreferences);
  }, []);

  return { preferences, setPreferences };
}
