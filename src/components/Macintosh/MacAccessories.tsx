"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import styles from "./MacAccessories.module.css";
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
  | "scrapbook"
  | "shortcuts"
  | "secret"
  | "trash";

export type DesktopPattern = "sage" | "platinum" | "blue" | "graphite";

export type AlarmSettings = {
  enabled: boolean;
  time: string;
  label: string;
};

type MacAccessoriesProps = {
  id: AccessoryId;
  onSound?: (sound: MacSound) => void;
  pattern: DesktopPattern;
  onPatternChange: (pattern: DesktopPattern) => void;
  trashEmpty: boolean;
  onEmptyTrash: () => void;
  alarmSettings: AlarmSettings;
  onAlarmChange: (settings: AlarmSettings) => void;
};

const PATTERNS: Array<{ id: DesktopPattern; label: string }> = [
  { id: "sage", label: "Sage dither" },
  { id: "platinum", label: "Platinum" },
  { id: "blue", label: "Blueberry" },
  { id: "graphite", label: "Graphite" },
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
}: Pick<
  MacAccessoriesProps,
  "onSound" | "alarmSettings" | "onAlarmChange"
>) {
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
          <button type="button" onClick={() => onSound?.("alarm")}>
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
  return rendered.length <= 11 ? rendered : rounded.toExponential(5).slice(0, 11);
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
      setDisplay(Number.isFinite(value) ? formatCalculatorValue(value / 100) : "Error");
      setWaitingForOperand(true);
      onSound?.("key");
    } else if (button === "⌫") {
      if (!waitingForOperand && display !== "Error") {
        setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
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

function ControlPanels({
  pattern,
  onPatternChange,
  onSound,
}: Pick<MacAccessoriesProps, "pattern" | "onPatternChange" | "onSound">) {
  return (
    <div className={styles.controlPanels}>
      <p className={styles.eyebrow}>DESKTOP PATTERN</p>
      <h3>Choose a classic desktop.</h3>
      <div className={styles.patternGrid}>
        {PATTERNS.map((option) => (
          <button
            key={option.id}
            type="button"
            data-pattern={option.id}
            aria-label={option.label}
            aria-pressed={pattern === option.id}
            onClick={() => {
              onPatternChange(option.id);
              onSound?.("select");
            }}
          >
            <span />
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles.controlHint}>
        Tip: Option-click the rainbow Apple for the secret about box.
      </p>
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

function Puzzle({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
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
        mark: "27",
        title: "Labyrinth",
        copy: "Twenty-seven agents coordinated through one designed system.",
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
          pattern={props.pattern}
          onPatternChange={props.onPatternChange}
          onSound={props.onSound}
        />
      );
    case "keyCaps":
      return <KeyCaps onSound={props.onSound} />;
    case "notePad":
      return <NotePad />;
    case "puzzle":
      return <Puzzle onSound={props.onSound} />;
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
