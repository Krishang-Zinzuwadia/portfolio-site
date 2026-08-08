import type { MacSound } from "./useMacSounds";

export const MAC_PREFERENCES_STORAGE_KEY = "krishang-mac-control-panels-v1";
export const MAC_PREFERENCES_CHANGE_EVENT =
  "krishang-mac-control-panels-change";

export const DESKTOP_PATTERN_IDS = [
  "sage",
  "platinum",
  "blue",
  "graphite",
] as const;

export const HIGHLIGHT_COLOR_IDS = [
  "graphite",
  "blueberry",
  "grape",
  "rose",
] as const;

export const HOUR_CYCLE_IDS = ["system", "12", "24"] as const;
export const ALERT_SOUND_IDS = [
  "alarm",
  "success",
  "select",
  "error",
] as const satisfies readonly MacSound[];

export type DesktopPattern = (typeof DESKTOP_PATTERN_IDS)[number];
export type HighlightColor = (typeof HIGHLIGHT_COLOR_IDS)[number];
export type HourCycle = (typeof HOUR_CYCLE_IDS)[number];
export type AlertSound = (typeof ALERT_SOUND_IDS)[number];

export type MacPreferences = {
  pattern: DesktopPattern;
  highlightColor: HighlightColor;
  hourCycle: HourCycle;
  showSeconds: boolean;
  showWeekday: boolean;
  showAccessoryShelf: boolean;
  singleClickOpen: boolean;
  showDesktopHints: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  alertSound: AlertSound;
};

export const DEFAULT_MAC_PREFERENCES: MacPreferences = {
  pattern: "sage",
  highlightColor: "graphite",
  hourCycle: "system",
  showSeconds: false,
  showWeekday: true,
  showAccessoryShelf: true,
  singleClickOpen: false,
  showDesktopHints: true,
  highContrast: false,
  reduceMotion: false,
  alertSound: "alarm",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function includes<T extends string>(
  values: readonly T[],
  value: unknown
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function storedBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function parseStoredMacPreferences(raw: string | null): MacPreferences {
  if (!raw) return DEFAULT_MAC_PREFERENCES;

  let candidate: unknown;
  try {
    candidate = JSON.parse(raw);
  } catch {
    return DEFAULT_MAC_PREFERENCES;
  }

  if (!isRecord(candidate)) return DEFAULT_MAC_PREFERENCES;

  return {
    pattern: includes(DESKTOP_PATTERN_IDS, candidate.pattern)
      ? candidate.pattern
      : DEFAULT_MAC_PREFERENCES.pattern,
    highlightColor: includes(HIGHLIGHT_COLOR_IDS, candidate.highlightColor)
      ? candidate.highlightColor
      : DEFAULT_MAC_PREFERENCES.highlightColor,
    hourCycle: includes(HOUR_CYCLE_IDS, candidate.hourCycle)
      ? candidate.hourCycle
      : DEFAULT_MAC_PREFERENCES.hourCycle,
    showSeconds: storedBoolean(
      candidate.showSeconds,
      DEFAULT_MAC_PREFERENCES.showSeconds
    ),
    showWeekday: storedBoolean(
      candidate.showWeekday,
      DEFAULT_MAC_PREFERENCES.showWeekday
    ),
    showAccessoryShelf: storedBoolean(
      candidate.showAccessoryShelf,
      DEFAULT_MAC_PREFERENCES.showAccessoryShelf
    ),
    singleClickOpen: storedBoolean(
      candidate.singleClickOpen,
      DEFAULT_MAC_PREFERENCES.singleClickOpen
    ),
    showDesktopHints: storedBoolean(
      candidate.showDesktopHints,
      DEFAULT_MAC_PREFERENCES.showDesktopHints
    ),
    highContrast: storedBoolean(
      candidate.highContrast,
      DEFAULT_MAC_PREFERENCES.highContrast
    ),
    reduceMotion: storedBoolean(
      candidate.reduceMotion,
      DEFAULT_MAC_PREFERENCES.reduceMotion
    ),
    alertSound: includes(ALERT_SOUND_IDS, candidate.alertSound)
      ? candidate.alertSound
      : DEFAULT_MAC_PREFERENCES.alertSound,
  };
}

let fallbackPreferences = DEFAULT_MAC_PREFERENCES;
let volatilePreferences: MacPreferences | null = null;
let cachedRawPreferences: string | null | undefined;
let cachedPreferences = DEFAULT_MAC_PREFERENCES;

export function readMacPreferences() {
  if (typeof window === "undefined") return DEFAULT_MAC_PREFERENCES;
  if (volatilePreferences) return volatilePreferences;

  let rawPreferences: string | null;
  try {
    rawPreferences = window.localStorage.getItem(MAC_PREFERENCES_STORAGE_KEY);
  } catch {
    return fallbackPreferences;
  }

  if (rawPreferences === cachedRawPreferences) return cachedPreferences;
  cachedRawPreferences = rawPreferences;
  cachedPreferences = parseStoredMacPreferences(rawPreferences);
  fallbackPreferences = cachedPreferences;
  return cachedPreferences;
}

export function subscribeToMacPreferences(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(MAC_PREFERENCES_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(MAC_PREFERENCES_CHANGE_EVENT, listener);
  };
}

export function storeMacPreferences(preferences: MacPreferences) {
  fallbackPreferences = preferences;
  const serializedPreferences = JSON.stringify(preferences);
  cachedRawPreferences = serializedPreferences;
  cachedPreferences = preferences;

  try {
    window.localStorage.setItem(
      MAC_PREFERENCES_STORAGE_KEY,
      serializedPreferences
    );
    volatilePreferences = null;
  } catch {
    volatilePreferences = preferences;
  }

  window.dispatchEvent(new Event(MAC_PREFERENCES_CHANGE_EVENT));
}
