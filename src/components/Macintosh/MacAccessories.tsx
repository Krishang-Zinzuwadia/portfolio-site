"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import styles from "./MacAccessories.module.css";
import type { MacSound } from "./useMacSounds";

export type AccessoryId =
  | "aboutMac"
  | "alarmClock"
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

type MacAccessoriesProps = {
  id: AccessoryId;
  onSound?: (sound: MacSound) => void;
  pattern: DesktopPattern;
  onPatternChange: (pattern: DesktopPattern) => void;
  trashEmpty: boolean;
  onEmptyTrash: () => void;
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

function AlarmClock({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [now, setNow] = useState(() => new Date());
  const [alarmEnabled, setAlarmEnabled] = useState(false);

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

  return (
    <div className={styles.alarmClock}>
      <p className={styles.eyebrow}>DESK ACCESSORY</p>
      <output aria-label={`Current time ${time}`}>{time}</output>
      <p>{date}</p>
      <button
        type="button"
        aria-pressed={alarmEnabled}
        onClick={() => {
          setAlarmEnabled((enabled) => !enabled);
          onSound?.(alarmEnabled ? "close" : "success");
        }}
      >
        <span aria-hidden="true">{alarmEnabled ? "◉" : "○"}</span>
        Alarm {alarmEnabled ? "set for 7:30 AM" : "is off"}
      </button>
    </div>
  );
}

type Operator = "+" | "−" | "×" | "÷";

function calculate(left: number, right: number, operator: Operator) {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  return right === 0 ? 0 : left / right;
}

function Calculator({ onSound }: Pick<MacAccessoriesProps, "onSound">) {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<{
    value: number;
    operator: Operator;
  } | null>(null);
  const [replaceDisplay, setReplaceDisplay] = useState(false);

  const pressDigit = (digit: string) => {
    onSound?.("key");
    setDisplay((current) =>
      replaceDisplay || current === "0"
        ? digit
        : `${current}${digit}`.slice(0, 10)
    );
    setReplaceDisplay(false);
  };

  const setOperator = (operator: Operator) => {
    onSound?.("menu");
    setPending({ value: Number(display), operator });
    setReplaceDisplay(true);
  };

  const resolve = () => {
    if (!pending) return;
    const result = calculate(pending.value, Number(display), pending.operator);
    setDisplay(String(Math.round(result * 100_000) / 100_000).slice(0, 10));
    setPending(null);
    setReplaceDisplay(true);
    onSound?.("success");
  };

  const buttons = [
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "×",
    "1",
    "2",
    "3",
    "−",
    "0",
    "C",
    "=",
    "+",
  ];

  return (
    <div className={styles.calculator}>
      <output aria-label={`Calculator display ${display}`}>{display}</output>
      <div className={styles.calculatorKeys}>
        {buttons.map((button) => (
          <button
            key={button}
            type="button"
            className={button === "=" ? styles.defaultKey : undefined}
            onClick={() => {
              if (/\d/.test(button)) pressDigit(button);
              else if (button === "C") {
                setDisplay("0");
                setPending(null);
                setReplaceDisplay(false);
                onSound?.("close");
              } else if (button === "=") resolve();
              else setOperator(button as Operator);
            }}
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
      return <AlarmClock onSound={props.onSound} />;
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
