"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import styles from "./MacAccessories.module.css";
import {
  type AlertSound,
  type DesktopPattern,
  type HighlightColor,
  type HourCycle,
  type MacPreferences,
} from "./macPreferences";
import type { MacSound } from "./useMacSounds";

export type AccessoryId =
  | "aboutMac"
  | "alarmClock"
  | "stopwatch"
  | "calculator"
  | "chooser"
  | "controlPanels"
  | "keyCaps"
  | "notePad"
  | "puzzle"
  | "slidingPuzzle"
  | "scrapbook"
  | "shortcuts"
  | "secret"
  | "trash";

export type AlarmSettings = {
  enabled: boolean;
  time: string;
  label: string;
};

export type MacGameWindowId =
  | "slidingPuzzle"
  | "minesweeper"
  | "doom"
  | "pacman";

type MacAccessoriesProps = {
  id: AccessoryId;
  onSound?: (sound: MacSound) => void;
  preferences: MacPreferences;
  onPreferencesChange: (preferences: MacPreferences) => void;
  muted: boolean;
  volume: number;
  onToggleMuted?: () => void;
  onVolumeChange?: (volume: number) => void;
  onResetPreferences: () => void;
  onResetWindowLayout: () => void;
  onOpenGame: (game: MacGameWindowId) => void;
  trashEmpty: boolean;
  onEmptyTrash: () => void;
  alarmSettings: AlarmSettings;
  onAlarmChange: (settings: AlarmSettings) => void;
};

const PATTERNS: Array<{
  id: DesktopPattern;
  label: string;
  detail: string;
}> = [
  { id: "sage", label: "Sage", detail: "Original dither" },
  { id: "platinum", label: "Platinum", detail: "System 7 neutral" },
  { id: "blue", label: "Blueberry", detail: "Diagonal weave" },
  { id: "graphite", label: "Graphite", detail: "Dark checkerboard" },
];

const HIGHLIGHT_COLORS: Array<{
  id: HighlightColor;
  label: string;
}> = [
  { id: "graphite", label: "Graphite" },
  { id: "blueberry", label: "Blueberry" },
  { id: "grape", label: "Grape" },
  { id: "rose", label: "Rose" },
];

const ALERT_SOUNDS: Array<{
  id: AlertSound;
  label: string;
  detail: string;
}> = [
  { id: "alarm", label: "Bell", detail: "Three bright rings" },
  { id: "success", label: "Glass", detail: "Warm three-note chord" },
  { id: "select", label: "Chirp", detail: "Short ascending tick" },
  { id: "error", label: "Sosumi", detail: "Low two-note alert" },
];

type ControlPanelId =
  | "appearance"
  | "finder"
  | "sound"
  | "clock"
  | "accessibility";

const CONTROL_PANEL_SECTIONS: Array<{
  id: ControlPanelId;
  label: string;
  mark: string;
  description: string;
}> = [
  {
    id: "appearance",
    label: "Appearance",
    mark: "▦",
    description: "Desktop pattern and Finder highlight color.",
  },
  {
    id: "finder",
    label: "Finder",
    mark: "▣",
    description: "Choose how desktop items and hints behave.",
  },
  {
    id: "sound",
    label: "Sound",
    mark: "◖",
    description: "Macintosh audio, alert volume, and alarm chime.",
  },
  {
    id: "clock",
    label: "Date & Time",
    mark: "◷",
    description: "Format the live clock in the Finder menu bar.",
  },
  {
    id: "accessibility",
    label: "Easy Access",
    mark: "◐",
    description: "Increase contrast and quiet interface motion.",
  },
];

const KEY_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "."],
];

const SOLVED_PUZZLE = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const SHUFFLED_PUZZLE = [1, 2, 3, 7, 4, 6, 0, 5, 8];
function AboutMacintosh() {
  return (
    <div className={styles.aboutMac}>
      <div className={styles.happyComputer} aria-hidden="true">
        <span className={styles.happyScreen}>⌣</span>
      </div>
      <div>
        <p className={styles.eyebrow}>ABOUT THIS MACINTOSH</p>
        <h3>System Software 7.5</h3>
        <p>Portfolio Finder · July 2026</p>
      </div>
      <dl className={styles.memoryPanel}>
        <div>
          <dt>Built-in Memory</dt>
          <dd>4,096K</dd>
        </div>
        <div>
          <dt>Largest Unused Block</dt>
          <dd>2,728K</dd>
        </div>
      </dl>
      <div className={styles.memoryBars} aria-label="Macintosh memory usage">
        <span style={{ "--memory": "66%" } as CSSProperties}>
          <i /> System
        </span>
        <span style={{ "--memory": "42%" } as CSSProperties}>
          <i /> Finder
        </span>
      </div>
      <small>© 1983–1996 Apple Computer, Inc. · Portfolio edition</small>
    </div>
  );
}

function AlarmClock({
  onSound,
  alarmSettings,
  onAlarmChange,
  alertSound,
}: Pick<MacAccessoriesProps, "onSound" | "alarmSettings" | "onAlarmChange"> & {
  alertSound: AlertSound;
}) {
  const [now, setNow] = useState(() => new Date());
  const [draftTime, setDraftTime] = useState(alarmSettings.time);
  const [draftLabel, setDraftLabel] = useState(alarmSettings.label);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(now);
  const hourAngle = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
  const minuteAngle = (now.getMinutes() + now.getSeconds() / 60) * 6;
  const secondAngle = now.getSeconds() * 6;

  const saveAlarm = () => {
    onAlarmChange({
      enabled: true,
      time: draftTime || "07:30",
      label: draftLabel.trim() || "Alarm",
    });
    onSound?.("success");
  };

  return (
    <div className={styles.alarmClock}>
      <div
        className={styles.analogClock}
        aria-hidden="true"
        style={
          {
            "--hour-angle": `${hourAngle}deg`,
            "--minute-angle": `${minuteAngle}deg`,
            "--second-angle": `${secondAngle}deg`,
          } as CSSProperties
        }
      >
        <i className={styles.hourHand} />
        <i className={styles.minuteHand} />
        <i className={styles.secondHand} />
        <b />
      </div>
      <div className={styles.clockReadout}>
        <p className={styles.eyebrow}>CLOCK &amp; ALARM</p>
        <output aria-label={`Current time ${time}`}>{time}</output>
        <p>{date}</p>
      </div>
      <div className={styles.alarmControls}>
        <label>
          <span>Alarm time</span>
          <input
            type="time"
            value={draftTime}
            onChange={(event) => setDraftTime(event.target.value)}
          />
        </label>
        <label>
          <span>Label</span>
          <input
            type="text"
            maxLength={28}
            value={draftLabel}
            onChange={(event) => setDraftLabel(event.target.value)}
          />
        </label>
        <div>
          <button
            type="button"
            aria-pressed={alarmSettings.enabled}
            onClick={saveAlarm}
          >
            <span aria-hidden="true">{alarmSettings.enabled ? "◉" : "○"}</span>
            {alarmSettings.enabled ? "Update Alarm" : "Set Alarm"}
          </button>
          <button
            type="button"
            disabled={!alarmSettings.enabled}
            onClick={() => {
              onAlarmChange({ ...alarmSettings, enabled: false });
              onSound?.("close");
            }}
          >
            Turn Off
          </button>
          <button type="button" onClick={() => onSound?.(alertSound)}>
            Test Chime
          </button>
        </div>
        <p role="status" aria-live="polite">
          {alarmSettings.enabled
            ? `${alarmSettings.label} · ${alarmSettings.time}`
            : "No alarm scheduled"}
        </p>
      </div>
    </div>
  );
}

function formatStopwatch(milliseconds: number) {
  const totalHundredths = Math.floor(milliseconds / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function Stopwatch({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    let frame = 0;
    const tick = () => {
      setElapsed(performance.now() - startedAtRef.current);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const toggleRunning = () => {
    if (running) {
      setRunning(false);
      onSound?.("close");
      return;
    }

    startedAtRef.current = performance.now() - elapsed;
    setRunning(true);
    onSound?.("success");
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    onSound?.("menu");
  };

  return (
    <div className={styles.stopwatch}>
      <p className={styles.eyebrow}>PRECISION TIMER</p>
      <div className={styles.stopwatchDial} aria-hidden="true">
        <span
          style={
            {
              "--stopwatch-angle": `${(elapsed / 1_000) * 6}deg`,
            } as CSSProperties
          }
        />
        <b />
      </div>
      <output aria-label={`Elapsed time ${formatStopwatch(elapsed)}`}>
        {formatStopwatch(elapsed)}
      </output>
      <div className={styles.stopwatchButtons}>
        <button type="button" onClick={toggleRunning}>
          {running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
        </button>
        <button
          type="button"
          disabled={!running}
          onClick={() => {
            setLaps((current) => [elapsed, ...current].slice(0, 4));
            onSound?.("key");
          }}
        >
          Lap
        </button>
        <button type="button" disabled={elapsed === 0} onClick={reset}>
          Reset
        </button>
      </div>
      <ol className={styles.lapList} aria-label="Stopwatch laps">
        {laps.length ? (
          laps.map((lap, index) => (
            <li key={`${lap}-${index}`}>
              <span>Lap {laps.length - index}</span>
              <time>{formatStopwatch(lap)}</time>
            </li>
          ))
        ) : (
          <li className={styles.noLaps}>Lap times appear here.</li>
        )}
      </ol>
    </div>
  );
}

type Operator = "+" | "−" | "×" | "÷";

function calculate(left: number, right: number, operator: Operator) {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  return right === 0 ? null : left / right;
}

function formatCalculatorValue(value: number) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Math.round(value * 100_000_000) / 100_000_000;
  const rendered = String(rounded);
  return rendered.length <= 11
    ? rendered
    : rounded.toExponential(5).slice(0, 11);
}

function Calculator({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperatorState] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      calculatorRef.current?.focus({ preventScroll: true })
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const pressDigit = (digit: string) => {
    onSound?.("key");
    setDisplay((current) =>
      waitingForOperand || current === "0" || current === "Error"
        ? digit
        : `${current}${digit}`.slice(0, 11)
    );
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    onSound?.("key");
    if (waitingForOperand || display === "Error") {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay(`${display}.`);
  };

  const clear = () => {
    setDisplay("0");
    setStoredValue(null);
    setOperatorState(null);
    setWaitingForOperand(false);
    onSound?.("close");
  };

  const setOperator = (nextOperator: Operator | null) => {
    onSound?.("menu");
    const inputValue = Number(display);

    if (!Number.isFinite(inputValue)) {
      if (nextOperator === null) return;
      setDisplay("0");
      setStoredValue(0);
      setOperatorState(nextOperator);
      setWaitingForOperand(true);
      return;
    }

    if (storedValue === null || operator === null || waitingForOperand) {
      setStoredValue(inputValue);
    } else {
      const result = calculate(storedValue, inputValue, operator);
      if (result === null) {
        setDisplay("Error");
        setStoredValue(null);
        setOperatorState(null);
        setWaitingForOperand(true);
        onSound?.("error");
        return;
      }
      setDisplay(formatCalculatorValue(result));
      setStoredValue(nextOperator === null ? null : result);
      onSound?.(nextOperator === null ? "success" : "menu");
    }

    setOperatorState(nextOperator);
    setWaitingForOperand(true);
  };

  const buttons = [
    "C",
    "±",
    "%",
    "÷",
    "7",
    "8",
    "9",
    "×",
    "4",
    "5",
    "6",
    "−",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "⌫",
    "=",
  ];

  const handleButton = (button: string) => {
    if (/\d/.test(button)) pressDigit(button);
    else if (button === "C") clear();
    else if (button === ".") inputDecimal();
    else if (button === "±") {
      if (display !== "Error" && display !== "0") {
        setDisplay((current) =>
          current.startsWith("-") ? current.slice(1) : `-${current}`
        );
      }
      onSound?.("key");
    } else if (button === "%") {
      const value = Number(display);
      setDisplay(
        Number.isFinite(value) ? formatCalculatorValue(value / 100) : "Error"
      );
      setWaitingForOperand(true);
      onSound?.("key");
    } else if (button === "⌫") {
      if (!waitingForOperand && display !== "Error") {
        setDisplay((current) =>
          current.length > 1 ? current.slice(0, -1) : "0"
        );
      }
      onSound?.("key");
    } else if (button === "=") setOperator(null);
    else setOperator(button as Operator);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyboardMap: Record<string, string> = {
      "/": "÷",
      "*": "×",
      "-": "−",
      "+": "+",
      Enter: "=",
      "=": "=",
      Escape: "C",
      Backspace: "⌫",
      "%": "%",
      ".": ".",
    };
    const button = /\d/.test(event.key) ? event.key : keyboardMap[event.key];
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    handleButton(button);
  };

  return (
    <div
      ref={calculatorRef}
      className={styles.calculator}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Calculator. Type numbers and operators or use the buttons."
    >
      <div className={styles.calculatorDisplay}>
        <small>{operator ? `${storedValue ?? ""} ${operator}` : "READY"}</small>
        <output aria-label={`Calculator display ${display}`} aria-live="polite">
          {display}
        </output>
      </div>
      <div className={styles.calculatorKeys}>
        {buttons.map((button) => (
          <button
            key={button}
            type="button"
            className={button === "=" ? styles.defaultKey : undefined}
            data-operator={"÷×−+".includes(button) ? "true" : undefined}
            onClick={() => handleButton(button)}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}

function Chooser({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [selection, setSelection] = useState("LaserWriter");
  return (
    <div className={styles.chooser}>
      <p className={styles.eyebrow}>APPLETALK</p>
      <div className={styles.chooserColumns}>
        <div>
          <strong>Select a printer:</strong>
          {["LaserWriter", "ImageWriter", "No printer"].map((printer) => (
            <button
              type="button"
              key={printer}
              aria-pressed={selection === printer}
              onClick={() => {
                setSelection(printer);
                onSound?.("select");
              }}
            >
              <span aria-hidden="true">▧</span> {printer}
            </button>
          ))}
        </div>
        <div className={styles.appleTalkZone}>
          <strong>AppleTalk Zones:</strong>
          <span>Krishang’s Room</span>
          <small>Status: portfolio network ready</small>
        </div>
      </div>
    </div>
  );
}

function formatControlClock(date: Date, preferences: MacPreferences) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  if (preferences.showWeekday) options.weekday = "short";
  if (preferences.showSeconds) options.second = "2-digit";
  if (preferences.hourCycle !== "system") {
    options.hour12 = preferences.hourCycle === "12";
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function SettingSwitch({
  checked,
  label,
  description,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={styles.settingSwitch}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
    >
      <span className={styles.switchBox} aria-hidden="true">
        {checked ? "✓" : ""}
      </span>
      <span className={styles.settingCopy}>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className={styles.settingState}>{checked ? "On" : "Off"}</span>
    </button>
  );
}

function DesktopPreview({
  preferences,
  clock,
}: {
  preferences: MacPreferences;
  clock: string;
}) {
  return (
    <div
      className={styles.desktopPreview}
      data-pattern={preferences.pattern}
      data-highlight={preferences.highlightColor}
      data-contrast={preferences.highContrast ? "high" : "standard"}
      aria-label="Preview of the current Finder appearance"
    >
      <div className={styles.previewMenuBar}>
        <span aria-hidden="true">◆</span>
        <strong>Finder</strong>
        <time>{clock}</time>
      </div>
      <span className={styles.previewDesktopIcon} aria-hidden="true">
        ▣<small>Projects</small>
      </span>
      <div className={styles.previewWindow} aria-hidden="true">
        <div>
          <i />
          <strong>Control Panels</strong>
          <i />
        </div>
        <p>Make this Macintosh yours.</p>
        <span>▦ Appearance</span>
      </div>
      {preferences.showAccessoryShelf ? (
        <div className={styles.previewShelf} aria-hidden="true">
          <span>◷</span>
          <span>▦</span>
          <span>▣</span>
          <span>◐</span>
        </div>
      ) : null}
      {preferences.showDesktopHints ? (
        <small className={styles.previewHint} aria-hidden="true">
          {preferences.singleClickOpen ? "Click" : "Double-click"} an icon to
          open
        </small>
      ) : null}
    </div>
  );
}

function ControlPanels({
  preferences,
  onPreferencesChange,
  muted,
  volume,
  onToggleMuted,
  onVolumeChange,
  onResetPreferences,
  onResetWindowLayout,
  onSound,
}: Pick<
  MacAccessoriesProps,
  | "preferences"
  | "onPreferencesChange"
  | "muted"
  | "volume"
  | "onToggleMuted"
  | "onVolumeChange"
  | "onResetPreferences"
  | "onResetWindowLayout"
  | "onSound"
>) {
  const [activePanel, setActivePanel] = useState<ControlPanelId>("appearance");
  const [clockPreview, setClockPreview] = useState("--:--");
  const [datePreview, setDatePreview] = useState("Local date");
  const [timeZone, setTimeZone] = useState("Local time");
  const [tabOrientation, setTabOrientation] = useState<
    "horizontal" | "vertical"
  >("vertical");
  const controlPanelsRef = useRef<HTMLDivElement>(null);
  const panelPrefix = useId();
  const activePanelMeta =
    CONTROL_PANEL_SECTIONS.find((panel) => panel.id === activePanel) ??
    CONTROL_PANEL_SECTIONS[0];
  const volumePercent = Math.round(volume * 100);

  useEffect(() => {
    const controlPanels = controlPanelsRef.current;
    if (!controlPanels || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextOrientation =
        entry.contentRect.width <= 360 ? "horizontal" : "vertical";
      setTabOrientation((current) =>
        current === nextOrientation ? current : nextOrientation
      );
    });
    observer.observe(controlPanels);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockPreview(formatControlClock(now, preferences));
      setDatePreview(
        new Intl.DateTimeFormat(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(now)
      );
      setTimeZone(
        Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll("_", " ")
      );
    };

    const frame = window.requestAnimationFrame(updateClock);
    const timer = window.setInterval(updateClock, 1_000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [preferences]);

  function applyPreference<K extends keyof MacPreferences>(
    key: K,
    value: MacPreferences[K],
    feedback: MacSound | null = "select"
  ) {
    onPreferencesChange({ ...preferences, [key]: value });
    if (feedback) onSound?.(feedback);
  }

  const selectPanel = (panel: ControlPanelId) => {
    if (panel === activePanel) return;
    setActivePanel(panel);
    onSound?.("menu");
  };

  const handlePanelKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const lastIndex = CONTROL_PANEL_SECTIONS.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextPanel = CONTROL_PANEL_SECTIONS[nextIndex];
    selectPanel(nextPanel.id);
    const tabs =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]'
      );
    window.requestAnimationFrame(() => tabs?.[nextIndex]?.focus());
  };

  return (
    <div ref={controlPanelsRef} className={styles.controlPanels}>
      <header className={styles.controlHeader}>
        <div>
          <p className={styles.eyebrow}>CONTROL PANELS</p>
          <h3>{activePanelMeta.label}</h3>
        </div>
        <p>{activePanelMeta.description}</p>
      </header>

      <div className={styles.controlWorkspace}>
        <div
          className={styles.controlRail}
          role="tablist"
          aria-label="Macintosh control panels"
          aria-orientation={tabOrientation}
        >
          {CONTROL_PANEL_SECTIONS.map((panel, index) => (
            <button
              key={panel.id}
              id={`${panelPrefix}-${panel.id}-tab`}
              type="button"
              className={styles.controlTab}
              role="tab"
              aria-selected={activePanel === panel.id}
              aria-controls={`${panelPrefix}-${panel.id}-panel`}
              tabIndex={activePanel === panel.id ? 0 : -1}
              onClick={() => selectPanel(panel.id)}
              onKeyDown={(event) => handlePanelKeyDown(event, index)}
            >
              <span className={styles.controlTabIcon} aria-hidden="true">
                {panel.mark}
              </span>
              <span>{panel.label}</span>
            </button>
          ))}
        </div>

        <section
          id={`${panelPrefix}-${activePanel}-panel`}
          className={styles.controlPane}
          role="tabpanel"
          aria-labelledby={`${panelPrefix}-${activePanel}-tab`}
          tabIndex={0}
        >
          {activePanel === "appearance" ? (
            <div className={styles.panelStack}>
              <DesktopPreview preferences={preferences} clock={clockPreview} />

              <fieldset className={styles.controlGroup}>
                <legend>Desktop pattern</legend>
                <div className={styles.patternGrid}>
                  {PATTERNS.map((option) => (
                    <label className={styles.patternOption} key={option.id}>
                      <input
                        type="radio"
                        name={`${panelPrefix}-pattern`}
                        value={option.id}
                        checked={preferences.pattern === option.id}
                        onChange={() => applyPreference("pattern", option.id)}
                      />
                      <span
                        className={styles.patternSwatch}
                        data-pattern={option.id}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.detail}</small>
                      </span>
                      <i aria-hidden="true">✓</i>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className={styles.controlGroup}>
                <legend>Highlight color</legend>
                <div className={styles.highlightGrid}>
                  {HIGHLIGHT_COLORS.map((option) => (
                    <label
                      className={styles.highlightOption}
                      data-highlight={option.id}
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name={`${panelPrefix}-highlight`}
                        value={option.id}
                        checked={preferences.highlightColor === option.id}
                        onChange={() =>
                          applyPreference("highlightColor", option.id)
                        }
                      />
                      <span aria-hidden="true" />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}

          {activePanel === "finder" ? (
            <div className={styles.panelStack}>
              <DesktopPreview preferences={preferences} clock={clockPreview} />
              <fieldset className={styles.controlGroup}>
                <legend>Desktop behavior</legend>
                <div className={styles.settingList}>
                  <SettingSwitch
                    checked={preferences.showAccessoryShelf}
                    label="Applications & desk accessories"
                    description="Keep the accessory shelf visible on the desktop."
                    onChange={() =>
                      applyPreference(
                        "showAccessoryShelf",
                        !preferences.showAccessoryShelf
                      )
                    }
                  />
                  <SettingSwitch
                    checked={preferences.singleClickOpen}
                    label="Open items with one click"
                    description="Otherwise, select once and double-click to open."
                    onChange={() =>
                      applyPreference(
                        "singleClickOpen",
                        !preferences.singleClickOpen
                      )
                    }
                  />
                  <SettingSwitch
                    checked={preferences.showDesktopHints}
                    label="Desktop help strip"
                    description="Show quick interaction hints along the bottom edge."
                    onChange={() =>
                      applyPreference(
                        "showDesktopHints",
                        !preferences.showDesktopHints
                      )
                    }
                  />
                </div>
              </fieldset>
              <p className={styles.controlHint}>
                The Control Panels remain available from the Apple menu and
                ⌘/Ctrl + K when the accessory shelf is hidden.
              </p>
            </div>
          ) : null}

          {activePanel === "sound" ? (
            <div className={styles.panelStack}>
              <div
                className={styles.soundPreview}
                data-muted={muted ? "true" : "false"}
                style={
                  { "--sound-level": `${volumePercent}%` } as CSSProperties
                }
              >
                <span aria-hidden="true">◖</span>
                <div>
                  <strong>
                    {muted ? "Macintosh sound is off" : "Sound is on"}
                  </strong>
                  <div aria-hidden="true">
                    {Array.from({ length: 12 }, (_, index) => (
                      <i key={index} />
                    ))}
                  </div>
                  <small>Finder alert volume · {volumePercent}%</small>
                </div>
              </div>

              <fieldset className={styles.controlGroup}>
                <legend>Sound output</legend>
                <div className={styles.settingList}>
                  <SettingSwitch
                    checked={!muted}
                    label="Macintosh sound"
                    description="Controls Finder effects and audio inside DOOM."
                    disabled={!onToggleMuted}
                    onChange={() => onToggleMuted?.()}
                  />
                  <label className={styles.volumeControl}>
                    <span>
                      <strong>Finder alert volume</strong>
                      <small>
                        Changes clicks, alarms, and interface effects.
                      </small>
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={volumePercent}
                      disabled={!onVolumeChange}
                      onChange={(event) =>
                        onVolumeChange?.(Number(event.target.value) / 100)
                      }
                      aria-label="Finder alert volume"
                    />
                    <output>{volumePercent}%</output>
                  </label>
                </div>
              </fieldset>

              <fieldset className={styles.controlGroup}>
                <legend>Alarm chime</legend>
                <div className={styles.alertSoundGrid}>
                  {ALERT_SOUNDS.map((option) => (
                    <label key={option.id}>
                      <input
                        type="radio"
                        name={`${panelPrefix}-alert`}
                        value={option.id}
                        checked={preferences.alertSound === option.id}
                        onChange={() => {
                          applyPreference("alertSound", option.id, null);
                          onSound?.(option.id);
                        }}
                      />
                      <span aria-hidden="true" />
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.previewButton}
                  onClick={() => onSound?.(preferences.alertSound)}
                >
                  Preview Chime
                </button>
              </fieldset>
            </div>
          ) : null}

          {activePanel === "clock" ? (
            <div className={styles.panelStack}>
              <div className={styles.clockPreview}>
                <output aria-label={`Clock preview ${clockPreview}`}>
                  {clockPreview}
                </output>
                <p>{datePreview}</p>
                <small>{timeZone}</small>
              </div>

              <fieldset className={styles.controlGroup}>
                <legend>Time format</legend>
                <div className={styles.segmentedControl}>
                  {(
                    [
                      ["system", "System"],
                      ["12", "12 hour"],
                      ["24", "24 hour"],
                    ] as Array<[HourCycle, string]>
                  ).map(([id, label]) => (
                    <label key={id}>
                      <input
                        type="radio"
                        name={`${panelPrefix}-hour-cycle`}
                        value={id}
                        checked={preferences.hourCycle === id}
                        onChange={() => applyPreference("hourCycle", id)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className={styles.controlGroup}>
                <legend>Menu bar clock</legend>
                <div className={styles.settingList}>
                  <SettingSwitch
                    checked={preferences.showWeekday}
                    label="Show weekday"
                    description="Adds the short day name before the current time."
                    onChange={() =>
                      applyPreference("showWeekday", !preferences.showWeekday)
                    }
                  />
                  <SettingSwitch
                    checked={preferences.showSeconds}
                    label="Show seconds"
                    description="Updates the Finder clock once every second."
                    onChange={() =>
                      applyPreference("showSeconds", !preferences.showSeconds)
                    }
                  />
                </div>
              </fieldset>
            </div>
          ) : null}

          {activePanel === "accessibility" ? (
            <div className={styles.panelStack}>
              <div
                className={styles.accessibilityPreview}
                data-contrast={preferences.highContrast ? "high" : "standard"}
              >
                <span aria-hidden="true">Aa</span>
                <div>
                  <strong>Readable at a glance.</strong>
                  <p>Controls keep their shape, labels, and keyboard focus.</p>
                </div>
              </div>
              <fieldset className={styles.controlGroup}>
                <legend>Visual assistance</legend>
                <div className={styles.settingList}>
                  <SettingSwitch
                    checked={preferences.highContrast}
                    label="Increase interface contrast"
                    description="Strengthens windows, menus, focus, and selected items."
                    onChange={() =>
                      applyPreference("highContrast", !preferences.highContrast)
                    }
                  />
                  <SettingSwitch
                    checked={preferences.reduceMotion}
                    label="Reduce interface motion"
                    description="Removes desktop, window, toast, and panel animation."
                    onChange={() =>
                      applyPreference("reduceMotion", !preferences.reduceMotion)
                    }
                  />
                </div>
              </fieldset>
              <p className={styles.controlHint}>
                Your operating system’s reduced-motion preference is always
                respected, even when this switch is off.
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <footer className={styles.controlFooter}>
        <span role="status">Settings save automatically on this device.</span>
        <div>
          <button type="button" onClick={onResetWindowLayout}>
            Arrange Windows
          </button>
          <button
            type="button"
            className={styles.defaultButton}
            onClick={() => {
              setActivePanel("appearance");
              onResetPreferences();
            }}
          >
            Restore Defaults
          </button>
        </div>
      </footer>
    </div>
  );
}

function KeyCaps({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [typed, setTyped] = useState("HELLO");
  return (
    <div className={styles.keyCaps}>
      <output aria-label={`Typed characters ${typed}`}>{typed || "▌"}</output>
      <div className={styles.keyboard} aria-label="Macintosh keyboard">
        {KEY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => {
                  setTyped((current) => `${current}${key}`.slice(-22));
                  onSound?.("key");
                }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <button
          type="button"
          className={styles.spaceKey}
          onClick={() => {
            setTyped((current) => `${current} `.slice(-22));
            onSound?.("key");
          }}
        >
          space
        </button>
        <button
          type="button"
          onClick={() => {
            setTyped("");
            onSound?.("close");
          }}
        >
          clear
        </button>
      </div>
    </div>
  );
}

function NotePad() {
  const [note, setNote] = useState(
    "Things to explore:\n• Open the Apple menu\n• Click the menu-bar clock\n• Try typing HELLO on the desktop\n• Empty the Trash"
  );

  return (
    <label className={styles.notePad}>
      <span>Note 1 of 1</span>
      <textarea
        value={note}
        aria-label="Note Pad page"
        spellCheck={false}
        onChange={(event) => setNote(event.target.value)}
      />
    </label>
  );
}

function GamePicker({ onOpenGame }: Pick<MacAccessoriesProps, "onOpenGame">) {
  return (
    <section
      className={styles.gameLibrary}
      aria-labelledby="game-library-title"
    >
      <header className={styles.gameLibraryHeader}>
        <span className={styles.gameLibraryIcon} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <div>
          <p className={styles.eyebrow}>PUZZLE · GAME LIBRARY</p>
          <h3 id="game-library-title">What do you want to play?</h3>
          <p>Pick a game. Each one opens here.</p>
        </div>
      </header>

      <nav className={styles.gamePickerGrid} aria-label="Choose a game">
        <button
          type="button"
          className={styles.gameCard}
          onClick={() => onOpenGame("slidingPuzzle")}
        >
          <span
            className={styles.gameCardIcon}
            data-game="sliding"
            aria-hidden="true"
          >
            8
          </span>
          <span className={styles.gameCardCopy}>
            <strong>Sliding Puzzle</strong>
            <small>Built-in desk accessory</small>
            <span>Put eight numbered tiles back in order.</span>
          </span>
          <span className={styles.gameCardAction}>
            Play here <b aria-hidden="true">→</b>
          </span>
        </button>

        <button
          type="button"
          className={styles.gameCard}
          onClick={() => onOpenGame("minesweeper")}
        >
          <span
            className={styles.gameCardIcon}
            data-game="minesweeper"
            aria-hidden="true"
          >
            ✱
          </span>
          <span className={styles.gameCardCopy}>
            <strong>Microsoft Minesweeper</strong>
            <small>Microsoft-hosted web edition</small>
            <span>Play the official Classic Mode inside this Macintosh.</span>
          </span>
          <span className={styles.gameCardAction}>
            Play here <b aria-hidden="true">→</b>
          </span>
        </button>

        <button
          type="button"
          className={styles.gameCard}
          onClick={() => onOpenGame("doom")}
        >
          <span
            className={styles.gameCardIcon}
            data-game="doom"
            aria-hidden="true"
          >
            D
          </span>
          <span className={styles.gameCardCopy}>
            <strong>DOOM</strong>
            <small>id Software · Shareware v1.9</small>
            <span>Run the original Episode One release.</span>
          </span>
          <span className={styles.gameCardAction}>
            Play here <b aria-hidden="true">→</b>
          </span>
        </button>

        <button
          type="button"
          className={styles.gameCard}
          onClick={() => onOpenGame("pacman")}
        >
          <span
            className={styles.gameCardIcon}
            data-game="pacman"
            aria-hidden="true"
          >
            <i />
          </span>
          <span className={styles.gameCardCopy}>
            <strong>PAC-MAN</strong>
            <small>Google Doodle · original 2010 release</small>
            <span>Original logic, graphics, sounds, and ghosts.</span>
          </span>
          <span className={styles.gameCardAction}>
            Play here <b aria-hidden="true">→</b>
          </span>
        </button>
      </nav>
    </section>
  );
}

function SlidingPuzzle({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [tiles, setTiles] = useState(SHUFFLED_PUZZLE);
  const solved = tiles.every((tile, index) => tile === SOLVED_PUZZLE[index]);

  const move = (index: number) => {
    const empty = tiles.indexOf(0);
    const adjacent =
      Math.abs(empty - index) === 3 ||
      (Math.abs(empty - index) === 1 &&
        Math.floor(empty / 3) === Math.floor(index / 3));
    if (!adjacent || tiles[index] === 0) {
      onSound?.("error");
      return;
    }

    const next = [...tiles];
    [next[empty], next[index]] = [next[index], next[empty]];
    setTiles(next);
    onSound?.(
      next.every((tile, tileIndex) => tile === SOLVED_PUZZLE[tileIndex])
        ? "success"
        : "key"
    );
  };

  return (
    <div className={styles.puzzle}>
      <div className={styles.puzzleBoard} aria-label="Sliding tile puzzle">
        {tiles.map((tile, index) => (
          <button
            type="button"
            key={tile || "empty"}
            className={tile === 0 ? styles.emptyTile : undefined}
            aria-label={tile === 0 ? "Empty puzzle space" : `Move tile ${tile}`}
            disabled={tile === 0}
            onClick={() => move(index)}
          >
            {tile || ""}
          </button>
        ))}
      </div>
      <div className={styles.puzzleCopy}>
        <p className={styles.eyebrow}>DESK ACCESSORY</p>
        <h3>{solved ? "Insanely great." : "Put the Finder back in order."}</h3>
        <p>Slide the numbered squares into place.</p>
        <button
          type="button"
          onClick={() => {
            setTiles(SHUFFLED_PUZZLE);
            onSound?.("menu");
          }}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}

function Scrapbook({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const clippings = useMemo(
    () => [
      {
        mark: "⌘",
        title: "Build systems, not demos.",
        copy: "A portfolio clipping from Krishang’s AI and agent work.",
      },
      {
        mark: "01",
        title: "1st in India · CTFTime",
        copy: "Proof saved from competitive security work, April 2026.",
      },
      {
        mark: "7",
        title: "Quark",
        copy: "Seven typed tools keep human decisions inside a bounded agent checkpoint.",
      },
    ],
    []
  );
  const [page, setPage] = useState(0);
  const clipping = clippings[page];

  return (
    <div className={styles.scrapbook}>
      <article key={page}>
        <span aria-hidden="true">{clipping.mark}</span>
        <div>
          <p className={styles.eyebrow}>CLIPPING {page + 1}</p>
          <h3>{clipping.title}</h3>
          <p>{clipping.copy}</p>
        </div>
      </article>
      <div>
        <button
          type="button"
          aria-label="Previous clipping"
          onClick={() => {
            setPage(
              (current) => (current + clippings.length - 1) % clippings.length
            );
            onSound?.("menu");
          }}
        >
          ◀
        </button>
        <span>
          {page + 1} of {clippings.length}
        </span>
        <button
          type="button"
          aria-label="Next clipping"
          onClick={() => {
            setPage((current) => (current + 1) % clippings.length);
            onSound?.("menu");
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

function SecretAboutBox({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  return (
    <div className={styles.secretBox}>
      <span className={styles.secretHello}>hello</span>
      <p>from Macintosh</p>
      <div className={styles.secretYear}>1984</div>
      <p className={styles.secretCopy}>
        “It is with considerable pride that I introduce a man who’s been like a
        father to me…”
      </p>
      <button type="button" onClick={() => onSound?.("startup")}>
        Replay the hello chord
      </button>
      <small>
        Designed in Cupertino · Rediscovered in Krishang’s portfolio
      </small>
    </div>
  );
}

function KeyboardShortcuts() {
  const shortcuts = [
    ["⌘ / Ctrl + 1–6", "Open a portfolio window"],
    ["⌘ / Ctrl + 7", "Open Clock & Alarm"],
    ["⌘ / Ctrl + 8", "Open Stopwatch"],
    ["⌘ / Ctrl + 9", "Open Calculator"],
    ["⌘ / Ctrl + O", "Open the selected desktop icon"],
    ["⌘ / Ctrl + W", "Close the active window"],
    ["⌘ / Ctrl + ⇧ + A", "Open all portfolio windows"],
    ["⌘ / Ctrl + D", "Open DOOM"],
    ["⌘ / Ctrl + K", "Open Control Panels"],
    ["⌘ / Ctrl + T", "Open the Trash"],
    ["⌘ / Ctrl + ⇧ + ⌫", "Empty the Trash"],
    ["? or F1", "Show this keyboard map"],
    ["Escape", "Close a menu or active window"],
  ];

  return (
    <div className={styles.shortcutSheet}>
      <header>
        <span aria-hidden="true">⌘</span>
        <div>
          <p className={styles.eyebrow}>FINDER QUICK KEYS</p>
          <h3>Keyboard Shortcuts</h3>
          <p>Command on Mac · Ctrl everywhere else</p>
        </div>
      </header>
      <dl>
        {shortcuts.map(([keys, action]) => (
          <div key={keys}>
            <dt>{keys}</dt>
            <dd>{action}</dd>
          </div>
        ))}
      </dl>
      <small>
        Bonus: type <strong>HELLO</strong> or <strong>1984</strong> on the
        desktop.
      </small>
    </div>
  );
}

function Trash({
  trashEmpty,
  onEmptyTrash,
}: Pick<MacAccessoriesProps, "trashEmpty" | "onEmptyTrash">) {
  return (
    <div className={styles.trashView} data-empty={trashEmpty}>
      {trashEmpty ? (
        <div className={styles.emptyTrashMessage}>
          <span aria-hidden="true">♲</span>
          <h3>The Trash is empty.</h3>
          <p>Everything is exactly where it isn’t.</p>
        </div>
      ) : (
        <>
          <p className={styles.eyebrow}>3 ITEMS · 42K ON DISK</p>
          <ul>
            <li>
              <span>▧</span>
              <strong>Untitled idea</strong>
              <small>12K</small>
            </li>
            <li>
              <span>▧</span>
              <strong>final-final-v2</strong>
              <small>26K</small>
            </li>
            <li>
              <span>◇</span>
              <strong>Corporate jargon</strong>
              <small>4K</small>
            </li>
          </ul>
          <button type="button" onClick={onEmptyTrash}>
            Empty Trash…
          </button>
        </>
      )}
    </div>
  );
}

export default function MacAccessories(props: MacAccessoriesProps) {
  switch (props.id) {
    case "aboutMac":
      return <AboutMacintosh />;
    case "alarmClock":
      return (
        <AlarmClock
          onSound={props.onSound}
          alarmSettings={props.alarmSettings}
          onAlarmChange={props.onAlarmChange}
          alertSound={props.preferences.alertSound}
        />
      );
    case "stopwatch":
      return <Stopwatch onSound={props.onSound} />;
    case "calculator":
      return <Calculator onSound={props.onSound} />;
    case "chooser":
      return <Chooser onSound={props.onSound} />;
    case "controlPanels":
      return (
        <ControlPanels
          preferences={props.preferences}
          onPreferencesChange={props.onPreferencesChange}
          muted={props.muted}
          volume={props.volume}
          onToggleMuted={props.onToggleMuted}
          onVolumeChange={props.onVolumeChange}
          onResetPreferences={props.onResetPreferences}
          onResetWindowLayout={props.onResetWindowLayout}
          onSound={props.onSound}
        />
      );
    case "keyCaps":
      return <KeyCaps onSound={props.onSound} />;
    case "notePad":
      return <NotePad />;
    case "puzzle":
      return <GamePicker onOpenGame={props.onOpenGame} />;
    case "slidingPuzzle":
      return <SlidingPuzzle onSound={props.onSound} />;
    case "scrapbook":
      return <Scrapbook onSound={props.onSound} />;
    case "shortcuts":
      return <KeyboardShortcuts />;
    case "secret":
      return <SecretAboutBox onSound={props.onSound} />;
    case "trash":
      return (
        <Trash
          trashEmpty={props.trashEmpty}
          onEmptyTrash={props.onEmptyTrash}
        />
      );
  }
}
