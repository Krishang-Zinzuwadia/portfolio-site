"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  achievements,
  experience,
  identity,
  projects,
  signalStats,
  skills,
} from "@/data/portfolio";
import styles from "./MacDesktop.module.css";
import type { AccessoryId, AlarmSettings } from "./MacAccessories";
import { DEFAULT_MAC_PREFERENCES } from "./macPreferences";
import { useMacPreferences } from "./useMacPreferences";
import type { MacSound } from "./useMacSounds";

const MacAccessories = dynamic(() => import("./MacAccessories"), {
  loading: () => (
    <div className={styles.accessoryLoading}>Opening desk accessory…</div>
  ),
});

const DoomGame = dynamic(() => import("./DoomGame"), {
  ssr: false,
  loading: () => <div className={styles.gameLoading} aria-hidden="true" />,
});

const HostedGame = dynamic(() => import("./HostedGame"), {
  ssr: false,
  loading: () => <div className={styles.gameLoading} aria-hidden="true" />,
});

const RESUME_PATH = "/Krishang-Zinzuwadia-Resume.pdf";

type WindowId =
  | "welcome"
  | "about"
  | "projects"
  | "achievements"
  | "contact"
  | "resume"
  | "doom"
  | "minesweeper"
  | "pacman"
  | AccessoryId;

type DesktopTrayId = AccessoryId | "doom";

type MenuId = "apple" | "file" | "view" | "special";
type IconKind =
  | "computer"
  | "folder"
  | "project"
  | "trophy"
  | "mail"
  | "document"
  | "clock"
  | "stopwatch"
  | "calculator"
  | "chooser"
  | "control"
  | "keyboard"
  | "notepad"
  | "puzzle"
  | "scrapbook"
  | "shortcuts"
  | "doom"
  | "trash";

type WindowDefinition = {
  title: string;
  icon: IconKind;
  x: number;
  y: number;
  width: number;
  height: number;
  status?: string;
};

type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DesktopWindowState = WindowBounds & {
  open: boolean;
  z: number;
  maximized: boolean;
};

type ResizeDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

type PointerOperation = {
  mode: "move" | "resize";
  id: WindowId;
  pointerId: number;
  captureElement: HTMLElement;
  direction?: ResizeDirection;
  startClientX: number;
  startClientY: number;
  scaleX: number;
  scaleY: number;
  startBounds: WindowBounds;
};

type ActiveInteraction = Pick<PointerOperation, "id" | "mode">;

type WindowStyle = CSSProperties & {
  "--window-x": string;
  "--window-y": string;
  "--window-width": string;
  "--window-height": string;
};

type MacDesktopProps = {
  muted?: boolean;
  volume?: number;
  onRestart?: () => void;
  onShutdown?: () => void;
  onSound?: (sound: MacSound) => void;
  onToggleMuted?: () => void;
  onVolumeChange?: (volume: number) => void;
};

const DESKTOP_ICON_IDS: WindowId[] = [
  "welcome",
  "about",
  "projects",
  "achievements",
  "contact",
  "resume",
];

const DESKTOP_ACCESSORY_ICON_IDS: DesktopTrayId[] = [
  "doom",
  "aboutMac",
  "alarmClock",
  "stopwatch",
  "calculator",
  "notePad",
  "puzzle",
  "scrapbook",
  "chooser",
  "controlPanels",
  "keyCaps",
  "shortcuts",
];

const ACCESSORY_IDS: AccessoryId[] = [
  "aboutMac",
  "alarmClock",
  "stopwatch",
  "calculator",
  "chooser",
  "controlPanels",
  "keyCaps",
  "notePad",
  "puzzle",
  "slidingPuzzle",
  "scrapbook",
  "shortcuts",
  "secret",
  "trash",
];

const WINDOW_IDS: WindowId[] = [
  ...DESKTOP_ICON_IDS,
  "doom",
  "minesweeper",
  "pacman",
  ...ACCESSORY_IDS,
];

const FULL_BLEED_GAME_IDS: WindowId[] = ["doom", "minesweeper", "pacman"];

const RESIZE_DIRECTIONS: ResizeDirection[] = [
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
  "nw",
];

const WINDOW_MARGIN = 6;
const MIN_WINDOW_WIDTH = 220;
const MIN_WINDOW_HEIGHT = 132;
const DEFAULT_MAC_VOLUME = 0.82;
const DEFAULT_ALARM_SETTINGS: AlarmSettings = {
  enabled: false,
  time: "07:30",
  label: "Good morning",
};

type WindowProfile = {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  x: number;
  y: number;
};

const WINDOW_PROFILES: Record<WindowId, WindowProfile> = {
  welcome: {
    width: 0.65,
    height: 0.54,
    maxWidth: 840,
    maxHeight: 450,
    x: 0.025,
    y: 0.025,
  },
  about: {
    width: 0.72,
    height: 0.78,
    maxWidth: 920,
    maxHeight: 630,
    x: 0.035,
    y: 0.035,
  },
  projects: {
    width: 0.76,
    height: 0.84,
    maxWidth: 980,
    maxHeight: 680,
    x: 0.02,
    y: 0.02,
  },
  achievements: {
    width: 0.7,
    height: 0.76,
    maxWidth: 900,
    maxHeight: 610,
    x: 0.04,
    y: 0.04,
  },
  contact: {
    width: 0.56,
    height: 0.57,
    maxWidth: 700,
    maxHeight: 460,
    x: 0.1,
    y: 0.08,
  },
  resume: {
    width: 0.66,
    height: 0.7,
    maxWidth: 820,
    maxHeight: 560,
    x: 0.07,
    y: 0.055,
  },
  doom: {
    width: 0.8,
    height: 0.86,
    maxWidth: 940,
    maxHeight: 660,
    x: 0.035,
    y: 0.025,
  },
  minesweeper: {
    width: 0.82,
    height: 0.84,
    maxWidth: 1040,
    maxHeight: 700,
    x: 0.03,
    y: 0.025,
  },
  pacman: {
    width: 0.72,
    height: 0.56,
    maxWidth: 820,
    maxHeight: 450,
    x: 0.08,
    y: 0.08,
  },
  aboutMac: {
    width: 0.43,
    height: 0.53,
    maxWidth: 520,
    maxHeight: 410,
    x: 0.15,
    y: 0.12,
  },
  alarmClock: {
    width: 0.32,
    height: 0.42,
    maxWidth: 400,
    maxHeight: 340,
    x: 0.24,
    y: 0.16,
  },
  stopwatch: {
    width: 0.32,
    height: 0.5,
    maxWidth: 400,
    maxHeight: 410,
    x: 0.25,
    y: 0.11,
  },
  calculator: {
    width: 0.28,
    height: 0.5,
    maxWidth: 330,
    maxHeight: 410,
    x: 0.2,
    y: 0.1,
  },
  chooser: {
    width: 0.46,
    height: 0.48,
    maxWidth: 570,
    maxHeight: 390,
    x: 0.13,
    y: 0.13,
  },
  controlPanels: {
    width: 0.68,
    height: 0.72,
    maxWidth: 760,
    maxHeight: 560,
    x: 0.07,
    y: 0.06,
  },
  keyCaps: {
    width: 0.52,
    height: 0.53,
    maxWidth: 650,
    maxHeight: 430,
    x: 0.1,
    y: 0.1,
  },
  notePad: {
    width: 0.42,
    height: 0.62,
    maxWidth: 520,
    maxHeight: 510,
    x: 0.16,
    y: 0.07,
  },
  puzzle: {
    width: 0.58,
    height: 0.68,
    maxWidth: 720,
    maxHeight: 540,
    x: 0.08,
    y: 0.055,
  },
  slidingPuzzle: {
    width: 0.48,
    height: 0.58,
    maxWidth: 600,
    maxHeight: 470,
    x: 0.15,
    y: 0.09,
  },
  scrapbook: {
    width: 0.46,
    height: 0.55,
    maxWidth: 570,
    maxHeight: 450,
    x: 0.14,
    y: 0.09,
  },
  shortcuts: {
    width: 0.54,
    height: 0.67,
    maxWidth: 680,
    maxHeight: 540,
    x: 0.1,
    y: 0.065,
  },
  secret: {
    width: 0.52,
    height: 0.58,
    maxWidth: 650,
    maxHeight: 470,
    x: 0.11,
    y: 0.08,
  },
  trash: {
    width: 0.42,
    height: 0.5,
    maxWidth: 520,
    maxHeight: 410,
    x: 0.16,
    y: 0.12,
  },
};

type WorkArea = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getWorkArea(
  root: HTMLDivElement,
  menuBar: HTMLElement | null
): WorkArea {
  return {
    left: WINDOW_MARGIN,
    top: (menuBar?.offsetHeight ?? 27) + 2,
    right: Math.max(WINDOW_MARGIN, root.clientWidth - WINDOW_MARGIN),
    bottom: Math.max(WINDOW_MARGIN, root.clientHeight - WINDOW_MARGIN),
  };
}

function clampWindowBounds(bounds: WindowBounds, area: WorkArea): WindowBounds {
  const availableWidth = Math.max(1, area.right - area.left);
  const availableHeight = Math.max(1, area.bottom - area.top);
  const minimumWidth = Math.min(MIN_WINDOW_WIDTH, availableWidth);
  const minimumHeight = Math.min(MIN_WINDOW_HEIGHT, availableHeight);
  const width = clamp(bounds.width, minimumWidth, availableWidth);
  const height = clamp(bounds.height, minimumHeight, availableHeight);

  return {
    x: Math.round(clamp(bounds.x, area.left, area.right - width)),
    y: Math.round(clamp(bounds.y, area.top, area.bottom - height)),
    width: Math.round(width),
    height: Math.round(height),
  };
}

function resizeWindowBounds(
  bounds: WindowBounds,
  direction: ResizeDirection,
  deltaX: number,
  deltaY: number,
  area: WorkArea
): WindowBounds {
  let left = bounds.x;
  let top = bounds.y;
  let right = bounds.x + bounds.width;
  let bottom = bounds.y + bounds.height;
  const minimumWidth = Math.min(MIN_WINDOW_WIDTH, area.right - area.left);
  const minimumHeight = Math.min(MIN_WINDOW_HEIGHT, area.bottom - area.top);

  if (direction.includes("w")) {
    left = clamp(left + deltaX, area.left, right - minimumWidth);
  }
  if (direction.includes("e")) {
    right = clamp(right + deltaX, left + minimumWidth, area.right);
  }
  if (direction.includes("n")) {
    top = clamp(top + deltaY, area.top, bottom - minimumHeight);
  }
  if (direction.includes("s")) {
    bottom = clamp(bottom + deltaY, top + minimumHeight, area.bottom);
  }

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  };
}

function getResponsiveWindowBounds(id: WindowId, area: WorkArea): WindowBounds {
  const profile = WINDOW_PROFILES[id];
  const availableWidth = Math.max(1, area.right - area.left);
  const availableHeight = Math.max(1, area.bottom - area.top);
  const width = Math.min(
    availableWidth,
    Math.max(
      Math.min(MIN_WINDOW_WIDTH, availableWidth),
      Math.min(profile.maxWidth, availableWidth * profile.width)
    )
  );
  const height = Math.min(
    availableHeight,
    Math.max(
      Math.min(MIN_WINDOW_HEIGHT, availableHeight),
      Math.min(profile.maxHeight, availableHeight * profile.height)
    )
  );

  return clampWindowBounds(
    {
      x: area.left + availableWidth * profile.x,
      y: area.top + availableHeight * profile.y,
      width,
      height,
    },
    area
  );
}

const WINDOW_DEFINITIONS: Record<WindowId, WindowDefinition> = {
  welcome: {
    title: "Welcome",
    icon: "computer",
    x: 20,
    y: 40,
    width: 360,
    height: 270,
    status: "Portfolio ready",
  },
  about: {
    title: "About Krishang",
    icon: "folder",
    x: 24,
    y: 32,
    width: 420,
    height: 298,
    status: `${identity.school} · ${identity.graduation}`,
  },
  projects: {
    title: "Selected Projects",
    icon: "project",
    x: 12,
    y: 30,
    width: 432,
    height: 304,
    status: `${projects.length} selected builds`,
  },
  achievements: {
    title: "Achievements",
    icon: "trophy",
    x: 36,
    y: 36,
    width: 408,
    height: 292,
    status: `${achievements.length} competition records`,
  },
  contact: {
    title: "Contact",
    icon: "mail",
    x: 70,
    y: 54,
    width: 350,
    height: 232,
    status: identity.email,
  },
  resume: {
    title: "Résumé",
    icon: "document",
    x: 52,
    y: 42,
    width: 390,
    height: 278,
    status: "PDF document",
  },
  doom: {
    title: "DOOM",
    icon: "doom",
    x: 22,
    y: 32,
    width: 640,
    height: 438,
  },
  minesweeper: {
    title: "Microsoft Minesweeper",
    icon: "puzzle",
    x: 18,
    y: 28,
    width: 760,
    height: 520,
  },
  pacman: {
    title: "PAC-MAN",
    icon: "puzzle",
    x: 48,
    y: 54,
    width: 700,
    height: 340,
  },
  aboutMac: {
    title: "About This Macintosh",
    icon: "computer",
    x: 78,
    y: 52,
    width: 390,
    height: 290,
    status: "System Software 7.5 · Portfolio Finder",
  },
  alarmClock: {
    title: "Clock & Alarm",
    icon: "clock",
    x: 116,
    y: 66,
    width: 390,
    height: 340,
    status: "Clock · alarm scheduled locally",
  },
  stopwatch: {
    title: "Stopwatch",
    icon: "stopwatch",
    x: 128,
    y: 54,
    width: 350,
    height: 360,
    status: "Precision timer · lap memory",
  },
  calculator: {
    title: "Calculator",
    icon: "calculator",
    x: 102,
    y: 42,
    width: 282,
    height: 318,
    status: "Desk accessory",
  },
  chooser: {
    title: "Chooser",
    icon: "chooser",
    x: 64,
    y: 48,
    width: 420,
    height: 285,
    status: "AppleTalk ready",
  },
  controlPanels: {
    title: "Control Panels",
    icon: "control",
    x: 58,
    y: 44,
    width: 650,
    height: 470,
    status: "5 panels · preferences saved locally",
  },
  keyCaps: {
    title: "Key Caps",
    icon: "keyboard",
    x: 42,
    y: 38,
    width: 450,
    height: 305,
    status: "Chicago · 12 point",
  },
  notePad: {
    title: "Note Pad",
    icon: "notepad",
    x: 82,
    y: 34,
    width: 360,
    height: 330,
    status: "1 page",
  },
  puzzle: {
    title: "Puzzle",
    icon: "puzzle",
    x: 52,
    y: 36,
    width: 560,
    height: 410,
    status: "4 games · all play here",
  },
  slidingPuzzle: {
    title: "Sliding Puzzle",
    icon: "puzzle",
    x: 76,
    y: 48,
    width: 430,
    height: 320,
    status: "8 tiles · 1 empty space",
  },
  scrapbook: {
    title: "Scrapbook",
    icon: "scrapbook",
    x: 62,
    y: 40,
    width: 420,
    height: 310,
    status: "3 portfolio clippings",
  },
  shortcuts: {
    title: "Keyboard Shortcuts",
    icon: "shortcuts",
    x: 44,
    y: 34,
    width: 470,
    height: 360,
    status: "Finder quick keys",
  },
  secret: {
    title: "Secret About Box",
    icon: "computer",
    x: 50,
    y: 38,
    width: 450,
    height: 320,
    status: "Hello from 1984",
  },
  trash: {
    title: "Trash",
    icon: "trash",
    x: 78,
    y: 48,
    width: 380,
    height: 290,
    status: "3 items · 42K on disk",
  },
};

function createInitialWindows(
  area?: WorkArea
): Record<WindowId, DesktopWindowState> {
  return WINDOW_IDS.reduce(
    (state, id, index) => {
      const definition = WINDOW_DEFINITIONS[id];
      const bounds = area
        ? getResponsiveWindowBounds(id, area)
        : {
            x: definition.x,
            y: definition.y,
            width: definition.width,
            height: definition.height,
          };
      state[id] = {
        open: id === "welcome",
        ...bounds,
        z: index + 2,
        maximized: false,
      };
      return state;
    },
    {} as Record<WindowId, DesktopWindowState>
  );
}

function MacIcon({ kind }: { kind: IconKind }) {
  if (kind === "computer") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d="M6 3h34v30H6z" fill="#f0efe6" stroke="#111" strokeWidth="2" />
        <path
          d="M10 7h26v19H10z"
          fill="#83b5ad"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M14 11h17v2H14zm0 4h12v2H14z" fill="#fff" opacity=".82" />
        <path
          d="M18 33h10v5h7v4H11v-4h7z"
          fill="#d5d2c5"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M35 29h2v2h-2z" fill="#111" />
      </svg>
    );
  }

  if (kind === "folder" || kind === "project") {
    const fill = kind === "project" ? "#a9a1d8" : "#e7c46b";
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M4 12h16l4 5h20v24H4z"
          fill={fill}
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M4 12h16l4 5H4z"
          fill="#f7e5a3"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M4 20h40" fill="none" stroke="#111" strokeWidth="2" />
        {kind === "project" ? (
          <path
            d="m17 27-5 4 5 4m14-8 5 4-5 4m-8-10-3 12"
            fill="none"
            stroke="#111"
            strokeWidth="2"
          />
        ) : (
          <path d="M15 27h18v2H15zm0 5h13v2H15z" fill="#111" />
        )}
      </svg>
    );
  }

  if (kind === "trophy") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M14 5h20v7c0 10-4 17-10 17s-10-7-10-17z"
          fill="#efbd4f"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M14 9H7v8c0 6 5 9 11 9M34 9h7v8c0 6-5 9-11 9"
          fill="none"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M21 29h6v7h7v6H14v-6h7z"
          fill="#ded8c9"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="m24 10 2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#fff7cf" />
      </svg>
    );
  }

  if (kind === "mail") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d="M4 10h40v29H4z" fill="#d9f0ef" stroke="#111" strokeWidth="2" />
        <path
          d="m5 12 19 16 19-16M5 38l13-14m25 14L30 24"
          fill="none"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M8 14h31v3H8z" fill="#fff" opacity=".7" />
      </svg>
    );
  }

  if (kind === "clock") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d="M12 8 7 14m29-6 5 6" stroke="#111" strokeWidth="3" />
        <circle
          cx="24"
          cy="25"
          r="18"
          fill="#f4f1dd"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M24 11v4m0 20v4M10 25h4m20 0h4"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M24 25V16m0 9 8 5" fill="none" stroke="#111" strokeWidth="3" />
        <path d="M13 40 9 45m26-5 4 5" stroke="#111" strokeWidth="3" />
        <rect
          x="20"
          y="2"
          width="8"
          height="4"
          fill="#cfcec5"
          stroke="#111"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (kind === "stopwatch") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          x="19"
          y="2"
          width="11"
          height="5"
          fill="#d6d5cd"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M24 7v4m12 0 4 4" stroke="#111" strokeWidth="3" />
        <circle
          cx="24"
          cy="28"
          r="17"
          fill="#eef2e5"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M24 14v4m0 20v4M10 28h4m20 0h4"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M24 28V18m0 10 7 7"
          fill="none"
          stroke="#c43b35"
          strokeWidth="2"
        />
        <rect
          x="34"
          y="7"
          width="7"
          height="4"
          fill="#cfcec5"
          stroke="#111"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (kind === "calculator") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="3"
          width="32"
          height="42"
          rx="2"
          fill="#d4d3ca"
          stroke="#111"
          strokeWidth="2"
        />
        <rect
          x="12"
          y="8"
          width="24"
          height="9"
          fill="#dce9d8"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M15 12h16" stroke="#53645b" strokeWidth="2" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((column) => (
            <rect
              key={`${row}-${column}`}
              x={12 + column * 6}
              y={22 + row * 7}
              width="4"
              height="4"
              fill={column === 3 ? "#9ebfba" : "#f4f2e8"}
              stroke="#111"
            />
          ))
        )}
      </svg>
    );
  }

  if (kind === "chooser") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M12 5h24v15H12z"
          fill="#edf1e6"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M16 9h16v7H16z" fill="#93bbb5" stroke="#111" />
        <path d="M7 19h34v18H7z" fill="#d4d3ca" stroke="#111" strokeWidth="2" />
        <path
          d="M13 31h22v13H13z"
          fill="#f5f1df"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M17 35h14m-14 4h10" stroke="#777" strokeWidth="2" />
        <rect x="34" y="23" width="3" height="3" fill="#5c958b" />
      </svg>
    );
  }

  if (kind === "control") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          x="5"
          y="5"
          width="38"
          height="38"
          fill="#e3e1d7"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M12 14h24M12 24h24M12 34h24" stroke="#111" strokeWidth="2" />
        <rect
          x="17"
          y="10"
          width="7"
          height="8"
          fill="#7faea5"
          stroke="#111"
          strokeWidth="2"
        />
        <rect
          x="29"
          y="20"
          width="7"
          height="8"
          fill="#d9ba68"
          stroke="#111"
          strokeWidth="2"
        />
        <rect
          x="12"
          y="30"
          width="7"
          height="8"
          fill="#a89fd3"
          stroke="#111"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (kind === "keyboard") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M4 14h40l-3 24H7z"
          fill="#dddcd3"
          stroke="#111"
          strokeWidth="2"
        />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4].map((column) => (
            <rect
              key={`${row}-${column}`}
              x={9 + column * 6}
              y={19 + row * 5}
              width="4"
              height="3"
              fill="#faf8ee"
              stroke="#777"
            />
          ))
        )}
        <rect
          x="15"
          y="34"
          width="18"
          height="3"
          fill="#faf8ee"
          stroke="#777"
        />
      </svg>
    );
  }

  if (kind === "notepad") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d="M9 7h32v38H9z" fill="#fff2a8" stroke="#111" strokeWidth="2" />
        <path d="M9 7h32v7H9z" fill="#d6c25f" stroke="#111" strokeWidth="2" />
        <path d="M15 3v8m7-8v8m7-8v8m7-8v8" stroke="#111" strokeWidth="2" />
        <path
          d="M15 21h20m-20 6h20m-20 6h16m-16 6h12"
          stroke="#766c41"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (kind === "puzzle") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          x="5"
          y="5"
          width="38"
          height="38"
          fill="#c9c8bf"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M8 8h15v15H8zm17 0h15v15H25zM8 25h15v15H8z"
          fill="#a9a1d8"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M25 25h15v15H25z"
          fill="#f0eee3"
          stroke="#888"
          strokeDasharray="2 2"
        />
        <path
          d="M15 12v7m-3-4h6m11-3 6 7m0-7-6 7m-17 12h7"
          stroke="#111"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (kind === "scrapbook") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d="M8 4h33v40H8z" fill="#92775d" stroke="#111" strokeWidth="2" />
        <path
          d="M14 4h27v40H14z"
          fill="#d8c7a5"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M18 11h18v21H18z"
          fill="#f7f3e4"
          stroke="#111"
          strokeWidth="2"
        />
        <circle cx="27" cy="19" r="5" fill="#86afa8" stroke="#111" />
        <path d="m19 30 6-7 4 4 3-3 4 6" fill="#a9a1d8" stroke="#111" />
        <path d="M6 11h5m-5 8h5m-5 8h5m-5 8h5" stroke="#111" strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "shortcuts") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="8"
          width="40"
          height="32"
          rx="3"
          fill="#d9d8cf"
          stroke="#111"
          strokeWidth="2"
        />
        <rect
          x="9"
          y="14"
          width="14"
          height="19"
          fill="#f8f5e8"
          stroke="#111"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="14"
          width="13"
          height="19"
          fill="#a8c9c3"
          stroke="#111"
          strokeWidth="2"
        />
        <text
          x="16"
          y="28"
          fontFamily="serif"
          fontSize="13"
          textAnchor="middle"
          fill="#111"
        >
          ⌘
        </text>
        <text
          x="32.5"
          y="28"
          fontFamily="sans-serif"
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          fill="#111"
        >
          ?
        </text>
      </svg>
    );
  }

  if (kind === "doom") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d="M5 6h38v36H5z" fill="#181818" stroke="#111" strokeWidth="2" />
        <path d="M8 9h32v8H8z" fill="#b63624" />
        <path d="M8 17h32v4H8z" fill="#762116" />
        <path
          d="M11 12h5v15h-5zm7 0h5v15h-5zm7 0h5v15h-5zm7 0h5v15h-5z"
          fill="#e9d29a"
        />
        <path d="M12 30h5v5h-5zm19 0h5v5h-5z" fill="#ef3d28" />
        <path
          d="m9 31 5-8 6 5 4-6 5 6 5-5 5 8v8H9z"
          fill="#5e1712"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M19 35h10v3H19z" fill="#e9d29a" />
      </svg>
    );
  }

  if (kind === "trash") {
    return (
      <svg
        className={styles.pixelIcon}
        viewBox="0 0 48 48"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M11 13h27l-3 31H14z"
          fill="#e8e7df"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M8 9h33v6H8zM16 4h17v5H16z"
          fill="#cac9c0"
          stroke="#111"
          strokeWidth="2"
        />
        <path
          d="M19 19v18m6-18v18m6-18v18"
          fill="none"
          stroke="#777"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      className={styles.pixelIcon}
      viewBox="0 0 48 48"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        d="M9 3h23l8 8v34H9z"
        fill="#f5f1df"
        stroke="#111"
        strokeWidth="2"
      />
      <path d="M32 3v9h8" fill="#d8d3c3" stroke="#111" strokeWidth="2" />
      <path d="M15 18h19v2H15zm0 6h19v2H15zm0 6h15v2H15z" fill="#111" />
      <path d="M15 36h10v4H15z" fill="#c94e4e" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg className={styles.appleMark} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M11.5 3.2c.8-1 1-2 .9-2.7-1 .1-2 .7-2.6 1.5-.6.7-1 1.8-.8 2.7.9.1 1.8-.5 2.5-1.5ZM14.9 9.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.1-2.8.8-3.6.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-4 2.4-1.7 3-.4 7.5 1.2 9.9.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-3.1-1.2-3.1-4.2Z" />
    </svg>
  );
}

function MenuAction({
  children,
  onSelect,
  disabled = false,
  shortcut,
}: {
  children: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  shortcut?: string;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onSelect}>
      <span>{children}</span>
      {shortcut ? <kbd>{shortcut}</kbd> : null}
    </button>
  );
}

function WelcomeView({ openWindow }: { openWindow: (id: WindowId) => void }) {
  return (
    <div className={styles.welcomeView}>
      <header className={styles.welcomeHeader}>
        <span className={styles.largeIcon}>
          <MacIcon kind="computer" />
        </span>
        <div>
          <p className={styles.kicker}>WELCOME TO THE DESKTOP</p>
          <h3>{identity.name}</h3>
          <p>{identity.role}</p>
        </div>
      </header>

      <p className={styles.lede}>
        Building autonomous AI systems, full-stack products, and security work
        that moves from ambitious ideas to real-world execution.
      </p>

      <div className={styles.statGrid} aria-label="Selected portfolio metrics">
        {signalStats.map((stat) => (
          <article key={`${stat.value}-${stat.label}`}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.note}</small>
          </article>
        ))}
      </div>

      <div className={styles.educationStrip}>
        <span>{identity.school}</span>
        <span>{identity.education}</span>
        <span>{identity.graduation}</span>
      </div>

      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.macButton}
          onClick={() => openWindow("projects")}
        >
          Open Projects…
        </button>
        <button
          type="button"
          className={styles.macButton}
          onClick={() => openWindow("contact")}
        >
          Contact Krishang
        </button>
      </div>
    </div>
  );
}

function AboutView() {
  const skillGroups = [
    ["Languages", skills.languages],
    ["Systems & Frameworks", skills.systems],
    ["Tools & Infrastructure", skills.tools],
  ] as const;

  return (
    <div className={styles.aboutView}>
      <section className={styles.profilePanel}>
        <div className={styles.profileMonogram} aria-hidden="true">
          KZ
        </div>
        <div>
          <p className={styles.kicker}>ABOUT</p>
          <h3>{identity.name}</h3>
          <p>{identity.role}</p>
        </div>
      </section>

      <dl className={styles.factList}>
        <div>
          <dt>Education</dt>
          <dd>{identity.education}</dd>
        </div>
        <div>
          <dt>School</dt>
          <dd>{identity.school}</dd>
        </div>
        <div>
          <dt>Graduation</dt>
          <dd>{identity.graduation}</dd>
        </div>
      </dl>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionTitleRow}>
          <div>
            <p className={styles.kicker}>EXPERIENCE</p>
            <h3>{experience.organization}</h3>
          </div>
          <div className={styles.alignRight}>
            <strong>{experience.role}</strong>
            <span>{experience.date}</span>
            <span>{experience.location}</span>
          </div>
        </div>
        <ul className={styles.bulletList}>
          {experience.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section className={styles.sectionBlock}>
        <p className={styles.kicker}>TECHNICAL SKILLS</p>
        <div className={styles.skillGrid}>
          {skillGroups.map(([label, items]) => (
            <article key={label}>
              <h3>{label}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectsView() {
  return (
    <div className={styles.projectList}>
      {projects.map((project, index) => (
        <article className={styles.projectCard} key={project.slug}>
          <header>
            <span className={styles.projectIndex}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.subtitle}</p>
            </div>
            <div className={styles.projectMeta}>
              <time>{project.date}</time>
              <strong>{project.recognition}</strong>
            </div>
          </header>

          <p className={styles.projectSummary}>{project.summary}</p>

          <ul className={styles.bulletList}>
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>

          <div className={styles.projectFooter}>
            <ul
              className={styles.tagList}
              aria-label={`${project.title} technologies`}
            >
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <div className={styles.projectMetrics}>
              {project.metrics.map((metric) => (
                <span key={`${metric.value}-${metric.label}`}>
                  <strong>{metric.value}</strong> {metric.label}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function AchievementsView() {
  return (
    <div className={styles.achievementsView}>
      <header className={styles.listIntro}>
        <span className={styles.largeIcon}>
          <MacIcon kind="trophy" />
        </span>
        <div>
          <p className={styles.kicker}>COMPETITIVE PROOF</p>
          <h3>Measured under pressure.</h3>
          <p>Cybersecurity, AI systems, logic, and product engineering.</p>
        </div>
      </header>

      <ol className={styles.achievementList}>
        {achievements.map((achievement) => (
          <li key={`${achievement.title}-${achievement.date}`}>
            <span className={styles.placeBadge}>{achievement.place}</span>
            <div>
              <h3>{achievement.title}</h3>
              <p>{achievement.context}</p>
            </div>
            <time>{achievement.date}</time>
          </li>
        ))}
      </ol>

      <a
        className={styles.macButton}
        href={identity.ctftimeTeam}
        target="_blank"
        rel="noreferrer"
      >
        View CTFTime Team ↗
      </a>
    </div>
  );
}

function ContactView() {
  const contacts = [
    { label: "Email", value: identity.email, href: `mailto:${identity.email}` },
    { label: "GitHub", value: "Krishang-Zinzuwadia", href: identity.github },
    {
      label: "LinkedIn",
      value: "krishang-zinzuwadia",
      href: identity.linkedin,
    },
    { label: "CTFTime", value: "Competitor profile", href: identity.ctftime },
  ];

  return (
    <div className={styles.contactView}>
      <header className={styles.listIntro}>
        <span className={styles.largeIcon}>
          <MacIcon kind="mail" />
        </span>
        <div>
          <p className={styles.kicker}>OPEN CHANNEL</p>
          <h3>Contact {identity.name}</h3>
          <p>{identity.role}</p>
        </div>
      </header>

      <address className={styles.contactList}>
        {contacts.map((contact) => {
          const external = contact.href.startsWith("http");
          return (
            <a
              key={contact.label}
              href={contact.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              <span>{contact.label}</span>
              <strong>{contact.value}</strong>
              <i aria-hidden="true">↗</i>
            </a>
          );
        })}
      </address>
    </div>
  );
}

function ResumeView() {
  return (
    <div className={styles.resumeView}>
      <div className={styles.resumeSheet}>
        <span className={styles.largeIcon}>
          <MacIcon kind="document" />
        </span>
        <div>
          <p className={styles.kicker}>PORTABLE DOCUMENT FORMAT</p>
          <h3>{identity.name} — Résumé</h3>
          <p>{identity.role}</p>
        </div>

        <dl>
          <div>
            <dt>Education</dt>
            <dd>{identity.education}</dd>
          </div>
          <div>
            <dt>Institution</dt>
            <dd>{identity.school}</dd>
          </div>
          <div>
            <dt>Graduation</dt>
            <dd>{identity.graduation}</dd>
          </div>
          <div>
            <dt>Selected builds</dt>
            <dd>{projects.map((project) => project.title).join(" · ")}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.buttonRow}>
        <a
          className={styles.macButton}
          href={RESUME_PATH}
          target="_blank"
          rel="noreferrer"
        >
          Open Résumé…
        </a>
        <a className={styles.macButton} href={RESUME_PATH} download>
          Save a Copy
        </a>
      </div>
    </div>
  );
}

export default function MacDesktop({
  muted = false,
  volume = 0.82,
  onRestart,
  onShutdown,
  onSound,
  onToggleMuted,
  onVolumeChange,
}: MacDesktopProps) {
  const [windows, setWindows] = useState(createInitialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("welcome");
  const [selectedIcon, setSelectedIcon] = useState<WindowId | null>("welcome");
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const [closingWindows, setClosingWindows] = useState<
    Partial<Record<WindowId, boolean>>
  >({});
  const [activeInteraction, setActiveInteraction] =
    useState<ActiveInteraction | null>(null);
  const [clock, setClock] = useState("--:--");
  const { preferences, setPreferences } = useMacPreferences();
  const [trashEmpty, setTrashEmpty] = useState(false);
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>(
    DEFAULT_ALARM_SETTINGS
  );
  const [toast, setToast] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLElement | null>(null);
  const windowRefs = useRef<Partial<Record<WindowId, HTMLElement | null>>>({});
  const operationRef = useRef<PointerOperation | null>(null);
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
  const interactionFrameRef = useRef<number | null>(null);
  const closingTimersRef = useRef<Partial<Record<WindowId, number>>>({});
  const toastTimerRef = useRef<number | null>(null);
  const initialLayoutFittedRef = useRef(false);
  const secretBufferRef = useRef("");
  const lastAlarmMinuteRef = useRef<string | null>(null);
  const nextZ = useRef(20);
  const titlePrefix = useId();

  useEffect(() => {
    const updateClock = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
      };
      if (preferences.showWeekday) options.weekday = "short";
      if (preferences.showSeconds) options.second = "2-digit";
      if (preferences.hourCycle !== "system") {
        options.hour12 = preferences.hourCycle === "12";
      }

      setClock(new Intl.DateTimeFormat(undefined, options).format(new Date()));
    };

    updateClock();
    const timer = window.setInterval(
      updateClock,
      preferences.showSeconds ? 1_000 : 30_000
    );
    return () => window.clearInterval(timer);
  }, [preferences.hourCycle, preferences.showSeconds, preferences.showWeekday]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const fitWindowsToDesktop = () => {
      if (root.clientWidth <= 390) {
        const operation = operationRef.current;
        if (
          operation &&
          operation.captureElement.hasPointerCapture(operation.pointerId)
        ) {
          operation.captureElement.releasePointerCapture(operation.pointerId);
        }
        operationRef.current = null;
        pendingPointerRef.current = null;
        if (interactionFrameRef.current !== null) {
          window.cancelAnimationFrame(interactionFrameRef.current);
          interactionFrameRef.current = null;
        }
        setActiveInteraction(null);
        return;
      }

      const area = getWorkArea(root, menuBarRef.current);
      setWindows((current) => {
        if (!initialLayoutFittedRef.current) {
          initialLayoutFittedRef.current = true;
          return createInitialWindows(area);
        }

        let changed = false;
        const next = { ...current };

        WINDOW_IDS.forEach((id) => {
          const state = current[id];
          const bounds = clampWindowBounds(state, area);
          if (
            bounds.x !== state.x ||
            bounds.y !== state.y ||
            bounds.width !== state.width ||
            bounds.height !== state.height
          ) {
            changed = true;
            next[id] = { ...state, ...bounds };
          }
        });

        return changed ? next : current;
      });
    };

    fitWindowsToDesktop();
    const observer = new ResizeObserver(fitWindowsToDesktop);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (interactionFrameRef.current !== null) {
        window.cancelAnimationFrame(interactionFrameRef.current);
      }
      Object.values(closingTimersRef.current).forEach((timer) => {
        if (timer !== undefined) window.clearTimeout(timer);
      });
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    []
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2_600);
  }, []);

  const focusWindow = useCallback(
    (id: WindowId) => {
      if (activeWindow === id) return;

      const z = ++nextZ.current;
      setWindows((current) => ({
        ...current,
        [id]: { ...current[id], z },
      }));
      setSelectedIcon(id);
      setActiveWindow(id);
    },
    [activeWindow]
  );

  const openWindow = useCallback(
    (id: WindowId) => {
      const closingTimer = closingTimersRef.current[id];
      if (closingTimer !== undefined) {
        window.clearTimeout(closingTimer);
        delete closingTimersRef.current[id];
        setClosingWindows((current) => ({ ...current, [id]: false }));
      }

      if (windows[id].open) {
        focusWindow(id);
        setSelectedIcon(id);
        setActiveMenu(null);
        window.requestAnimationFrame(() => windowRefs.current[id]?.focus());
        return;
      }

      onSound?.("open");
      const z = ++nextZ.current;
      setWindows((current) => ({
        ...current,
        [id]: { ...current[id], open: true, z },
      }));
      setSelectedIcon(id);
      setActiveWindow(id);
      setActiveMenu(null);

      window.requestAnimationFrame(() => windowRefs.current[id]?.focus());
    },
    [focusWindow, onSound, windows]
  );

  const closeWindow = useCallback(
    (id: WindowId) => {
      if (!windows[id].open || closingWindows[id]) return;
      onSound?.("close");
      const wasActive = activeWindow === id;
      const nextActive = WINDOW_IDS.filter(
        (candidate) => candidate !== id && windows[candidate].open
      ).sort((left, right) => windows[right].z - windows[left].z)[0];

      setClosingWindows((current) => ({ ...current, [id]: true }));
      if (wasActive) setActiveWindow(nextActive ?? null);
      if (wasActive) setSelectedIcon(nextActive ?? null);
      setActiveMenu(null);
      closingTimersRef.current[id] = window.setTimeout(() => {
        setWindows((current) => ({
          ...current,
          [id]: { ...current[id], open: false },
        }));
        setClosingWindows((current) => ({ ...current, [id]: false }));
        delete closingTimersRef.current[id];
        if (wasActive && nextActive) {
          windowRefs.current[nextActive]?.focus();
        } else if (wasActive) {
          rootRef.current?.focus();
        }
      }, 180);
    },
    [activeWindow, closingWindows, onSound, windows]
  );

  const openAllWindows = useCallback(() => {
    if (DESKTOP_ICON_IDS.some((id) => !windows[id].open)) onSound?.("open");
    const firstZ = nextZ.current + 1;
    nextZ.current += DESKTOP_ICON_IDS.length;
    setWindows((current) =>
      DESKTOP_ICON_IDS.reduce(
        (next, id, index) => {
          next[id] = { ...current[id], open: true, z: firstZ + index };
          return next;
        },
        { ...current }
      )
    );
    setActiveWindow("resume");
    setSelectedIcon("resume");
    setActiveMenu(null);
    window.requestAnimationFrame(() => windowRefs.current.resume?.focus());
  }, [onSound, windows]);

  const arrangeWindows = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const area = getWorkArea(root, menuBarRef.current);

    setWindows((current) =>
      WINDOW_IDS.reduce(
        (next, id) => {
          next[id] = {
            ...current[id],
            ...getResponsiveWindowBounds(id, area),
            maximized: false,
          };
          return next;
        },
        { ...current }
      )
    );
    onSound?.("menu");
    showToast("Windows arranged for this desktop");
  }, [onSound, showToast]);

  const resetControlPanelPreferences = useCallback(() => {
    setPreferences(DEFAULT_MAC_PREFERENCES);
    onVolumeChange?.(DEFAULT_MAC_VOLUME);
    if (muted) {
      onToggleMuted?.();
    } else {
      onSound?.("success");
    }
    showToast("Control Panels restored to defaults");
  }, [
    muted,
    onSound,
    onToggleMuted,
    onVolumeChange,
    setPreferences,
    showToast,
  ]);

  const resetDesktop = useCallback(() => {
    onSound?.("close");
    nextZ.current = 20;
    operationRef.current = null;
    pendingPointerRef.current = null;
    if (interactionFrameRef.current !== null) {
      window.cancelAnimationFrame(interactionFrameRef.current);
      interactionFrameRef.current = null;
    }
    Object.values(closingTimersRef.current).forEach((timer) => {
      if (timer !== undefined) window.clearTimeout(timer);
    });
    closingTimersRef.current = {};
    setClosingWindows({});
    setActiveInteraction(null);
    const root = rootRef.current;
    const area = root ? getWorkArea(root, menuBarRef.current) : undefined;
    initialLayoutFittedRef.current = Boolean(area);
    setWindows(createInitialWindows(area));
    setActiveWindow("welcome");
    setSelectedIcon("welcome");
    setActiveMenu(null);
    setTrashEmpty(false);
    setAlarmSettings(DEFAULT_ALARM_SETTINGS);
    lastAlarmMinuteRef.current = null;
    setToast(null);
    window.requestAnimationFrame(() => windowRefs.current.welcome?.focus());
  }, [onSound]);

  const emptyTrash = useCallback(() => {
    if (trashEmpty) {
      onSound?.("error");
      showToast("The Trash is already empty.");
      return;
    }

    setTrashEmpty(true);
    onSound?.("trash");
    showToast("Trash emptied · 42K recovered");
  }, [onSound, showToast, trashEmpty]);

  const revealSecret = useCallback(() => {
    openWindow("secret");
    onSound?.("success");
    showToast("Secret about box unlocked");
  }, [onSound, openWindow, showToast]);

  useEffect(() => {
    if (!alarmSettings.enabled) {
      lastAlarmMinuteRef.current = null;
      return;
    }

    const checkAlarm = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${currentTime}`;
      if (
        currentTime !== alarmSettings.time ||
        lastAlarmMinuteRef.current === minuteKey
      ) {
        return;
      }

      lastAlarmMinuteRef.current = minuteKey;
      onSound?.(preferences.alertSound);
      showToast(`Alarm · ${alarmSettings.label}`);
      openWindow("alarmClock");
    };

    checkAlarm();
    const timer = window.setInterval(checkAlarm, 1_000);
    return () => window.clearInterval(timer);
  }, [alarmSettings, onSound, openWindow, preferences.alertSound, showToast]);

  const toggleMenu = useCallback(
    (menu: MenuId) => {
      onSound?.("menu");
      setActiveMenu((current) => (current === menu ? null : menu));
    },
    [onSound]
  );

  const performMenuAction = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  const toggleZoom = useCallback(
    (id: WindowId) => {
      const root = rootRef.current;
      if (!root || root.clientWidth <= 390) return;

      onSound?.("menu");
      setWindows((current) => ({
        ...current,
        [id]: {
          ...current[id],
          maximized: !current[id].maximized,
        },
      }));
      focusWindow(id);
    },
    [focusWindow, onSound]
  );

  const beginPointerOperation = (
    id: WindowId,
    mode: PointerOperation["mode"],
    event: ReactPointerEvent<HTMLElement>,
    direction?: ResizeDirection
  ) => {
    event.stopPropagation();
    if (!event.isPrimary || event.button !== 0) return;

    const root = rootRef.current;
    const windowElement = windowRefs.current[id];
    const state = windows[id];
    if (!root || !windowElement) return;

    windowElement.focus({ preventScroll: true });
    if (root.clientWidth <= 390 || state.maximized) {
      return;
    }

    const rootBounds = root.getBoundingClientRect();
    const windowBounds = windowElement.getBoundingClientRect();
    const scaleX = root.clientWidth / rootBounds.width;
    const scaleY = root.clientHeight / rootBounds.height;

    operationRef.current = {
      id,
      mode,
      pointerId: event.pointerId,
      captureElement: event.currentTarget,
      direction,
      startClientX: event.clientX,
      startClientY: event.clientY,
      scaleX,
      scaleY,
      startBounds: {
        x: (windowBounds.left - rootBounds.left) * scaleX,
        y: (windowBounds.top - rootBounds.top) * scaleY,
        width: windowBounds.width * scaleX,
        height: windowBounds.height * scaleY,
      },
    };
    pendingPointerRef.current = null;
    setActiveInteraction({ id, mode });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const applyPointerOperation = useCallback(
    (operation: PointerOperation, clientX: number, clientY: number) => {
      const root = rootRef.current;
      if (!root || root.clientWidth <= 390) return;

      const area = getWorkArea(root, menuBarRef.current);
      const deltaX = (clientX - operation.startClientX) * operation.scaleX;
      const deltaY = (clientY - operation.startClientY) * operation.scaleY;
      const start = operation.startBounds;
      const nextBounds =
        operation.mode === "resize" && operation.direction
          ? resizeWindowBounds(start, operation.direction, deltaX, deltaY, area)
          : clampWindowBounds(
              {
                ...start,
                x: start.x + deltaX,
                y: start.y + deltaY,
              },
              area
            );

      setWindows((current) => {
        if (current[operation.id].maximized) return current;
        return {
          ...current,
          [operation.id]: {
            ...current[operation.id],
            ...nextBounds,
          },
        };
      });
    },
    []
  );

  const movePointerOperation = (event: ReactPointerEvent<HTMLElement>) => {
    const operation = operationRef.current;
    if (!operation || operation.pointerId !== event.pointerId) return;

    pendingPointerRef.current = { x: event.clientX, y: event.clientY };
    if (interactionFrameRef.current === null) {
      interactionFrameRef.current = window.requestAnimationFrame(() => {
        interactionFrameRef.current = null;
        const activeOperation = operationRef.current;
        const point = pendingPointerRef.current;
        pendingPointerRef.current = null;
        if (activeOperation && point) {
          applyPointerOperation(activeOperation, point.x, point.y);
        }
      });
    }
    event.preventDefault();
  };

  const endPointerOperation = (event: ReactPointerEvent<HTMLElement>) => {
    const operation = operationRef.current;
    if (!operation || operation.pointerId !== event.pointerId) return;

    if (interactionFrameRef.current !== null) {
      window.cancelAnimationFrame(interactionFrameRef.current);
      interactionFrameRef.current = null;
    }
    const point =
      event.type === "pointerup"
        ? { x: event.clientX, y: event.clientY }
        : pendingPointerRef.current;
    if (point) applyPointerOperation(operation, point.x, point.y);

    operationRef.current = null;
    pendingPointerRef.current = null;
    setActiveInteraction(null);
    if (operation.captureElement.hasPointerCapture(event.pointerId)) {
      operation.captureElement.releasePointerCapture(event.pointerId);
    }
  };

  const resizeWithKeyboard = (
    id: WindowId,
    event: ReactKeyboardEvent<HTMLButtonElement>
  ) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      return;
    }

    const root = rootRef.current;
    if (!root || root.clientWidth <= 390 || windows[id].maximized) return;

    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 24 : 8;
    const deltaX =
      event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
    const deltaY =
      event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
    const area = getWorkArea(root, menuBarRef.current);

    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...resizeWindowBounds(current[id], "se", deltaX, deltaY, area),
      },
    }));
  };

  const handleDesktopKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isTypingTarget =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable;
    const primaryModifier = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();

    if (primaryModifier && event.altKey && event.key === "Escape") {
      event.preventDefault();
      onSound?.("error");
      showToast("Force Quit: no frozen applications found");
      return;
    }

    if (primaryModifier && event.shiftKey && event.key === "Backspace") {
      event.preventDefault();
      emptyTrash();
      return;
    }

    if (primaryModifier) {
      const portfolioIndex = Number(key) - 1;
      if (
        Number.isInteger(portfolioIndex) &&
        portfolioIndex >= 0 &&
        portfolioIndex < DESKTOP_ICON_IDS.length
      ) {
        event.preventDefault();
        openWindow(DESKTOP_ICON_IDS[portfolioIndex]);
        return;
      }

      const accessoryShortcut: Partial<Record<string, WindowId>> = {
        "7": "alarmClock",
        "8": "stopwatch",
        "9": "calculator",
      };
      const shortcutTarget = accessoryShortcut[key];
      if (shortcutTarget) {
        event.preventDefault();
        openWindow(shortcutTarget);
        return;
      }

      if (key === "o") {
        event.preventDefault();
        openWindow(selectedIcon ?? "welcome");
        return;
      }
      if (key === "w") {
        event.preventDefault();
        if (activeWindow) closeWindow(activeWindow);
        return;
      }
      if (key === "a" && event.shiftKey) {
        event.preventDefault();
        openAllWindows();
        return;
      }
      if (key === "k") {
        event.preventDefault();
        openWindow("controlPanels");
        return;
      }
      if (key === "d") {
        event.preventDefault();
        openWindow("doom");
        return;
      }
      if (key === "t") {
        event.preventDefault();
        openWindow("trash");
        return;
      }
      if (key === ".") {
        event.preventDefault();
        setActiveMenu(null);
        return;
      }
    }

    if (
      !isTypingTarget &&
      (event.key === "?" ||
        (event.key === "/" && event.shiftKey) ||
        event.key === "F1")
    ) {
      event.preventDefault();
      openWindow("shortcuts");
      return;
    }

    if (
      !isTypingTarget &&
      !primaryModifier &&
      !event.altKey &&
      event.key.length === 1
    ) {
      secretBufferRef.current =
        `${secretBufferRef.current}${event.key.toLowerCase()}`.slice(-12);
      if (
        secretBufferRef.current.endsWith("hello") ||
        secretBufferRef.current.endsWith("1984")
      ) {
        event.preventDefault();
        secretBufferRef.current = "";
        revealSecret();
        return;
      }
    }

    if (event.key !== "Escape") return;
    if (activeMenu) {
      setActiveMenu(null);
      return;
    }
    if (activeWindow) closeWindow(activeWindow);
  };

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case "welcome":
        return <WelcomeView openWindow={openWindow} />;
      case "about":
        return <AboutView />;
      case "projects":
        return <ProjectsView />;
      case "achievements":
        return <AchievementsView />;
      case "contact":
        return <ContactView />;
      case "resume":
        return <ResumeView />;
      case "doom":
        return <DoomGame isActive={activeWindow === "doom"} muted={muted} />;
      case "minesweeper":
        return (
          <HostedGame
            game="minesweeper"
            isActive={activeWindow === "minesweeper"}
          />
        );
      case "pacman":
        return (
          <HostedGame game="pacman" isActive={activeWindow === "pacman"} />
        );
      default:
        if (ACCESSORY_IDS.includes(id as AccessoryId)) {
          return (
            <MacAccessories
              id={id as AccessoryId}
              onSound={onSound}
              preferences={preferences}
              onPreferencesChange={setPreferences}
              muted={muted}
              volume={volume}
              onToggleMuted={onToggleMuted}
              onVolumeChange={onVolumeChange}
              onResetPreferences={resetControlPanelPreferences}
              onResetWindowLayout={arrangeWindows}
              onOpenGame={(game) => openWindow(game)}
              trashEmpty={trashEmpty}
              onEmptyTrash={emptyTrash}
              alarmSettings={alarmSettings}
              onAlarmChange={setAlarmSettings}
            />
          );
        }
        return null;
    }
  };

  return (
    <div
      className={styles.desktop}
      ref={rootRef}
      tabIndex={-1}
      role="region"
      aria-label={`${identity.name} interactive portfolio desktop`}
      data-pattern={preferences.pattern}
      data-highlight={preferences.highlightColor}
      data-contrast={preferences.highContrast ? "high" : "standard"}
      data-reduce-motion={preferences.reduceMotion ? "true" : "false"}
      onKeyDown={handleDesktopKeyDown}
      onPointerDown={() => setActiveMenu(null)}
    >
      <nav
        ref={menuBarRef}
        className={styles.menuBar}
        aria-label="Finder menu bar"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={styles.appleMenuButton}
            aria-label="Apple menu"
            aria-haspopup="true"
            aria-expanded={activeMenu === "apple"}
            onClick={(event) => {
              if (event.altKey) {
                revealSecret();
                setActiveMenu(null);
                return;
              }
              toggleMenu("apple");
            }}
          >
            <AppleMark />
          </button>
          {activeMenu === "apple" ? (
            <div
              className={styles.menuDropdown}
              role="group"
              aria-label="Portfolio actions"
            >
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("aboutMac"))}
              >
                About This Macintosh…
              </MenuAction>
              <span className={styles.menuDivider} role="separator" />
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("doom"))}
                shortcut="⌘D"
              >
                DOOM
              </MenuAction>
              <span className={styles.menuDivider} role="separator" />
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("alarmClock"))
                }
                shortcut="⌘7"
              >
                Clock &amp; Alarm
              </MenuAction>
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("calculator"))
                }
                shortcut="⌘9"
              >
                Calculator
              </MenuAction>
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("stopwatch"))
                }
                shortcut="⌘8"
              >
                Stopwatch
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("chooser"))}
              >
                Chooser
              </MenuAction>
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("controlPanels"))
                }
                shortcut="⌘K"
              >
                Control Panels
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("keyCaps"))}
              >
                Key Caps
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("notePad"))}
              >
                Note Pad
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("puzzle"))}
              >
                Puzzle
              </MenuAction>
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("scrapbook"))
                }
              >
                Scrapbook
              </MenuAction>
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("shortcuts"))
                }
                shortcut="?"
              >
                Keyboard Shortcuts…
              </MenuAction>
              <span className={styles.menuDivider} role="separator" />
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("welcome"))}
                shortcut="⌘1"
              >
                Welcome
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("contact"))}
              >
                Contact Krishang…
              </MenuAction>
            </div>
          ) : null}
        </div>

        <strong className={styles.finderLabel}>Finder</strong>

        <div className={styles.menuGroup}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={activeMenu === "file"}
            onClick={() => toggleMenu("file")}
          >
            File
          </button>
          {activeMenu === "file" ? (
            <div
              className={styles.menuDropdown}
              role="group"
              aria-label="File actions"
            >
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow(selectedIcon ?? "welcome"))
                }
                shortcut="⌘O"
              >
                Open Selected
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("resume"))}
              >
                Open Résumé…
              </MenuAction>
              <span className={styles.menuDivider} role="separator" />
              <MenuAction
                disabled={!activeWindow}
                onSelect={() =>
                  activeWindow &&
                  performMenuAction(() => closeWindow(activeWindow))
                }
                shortcut="⌘W"
              >
                Close Window
              </MenuAction>
            </div>
          ) : null}
        </div>

        <div className={`${styles.menuGroup} ${styles.optionalMenu}`}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={activeMenu === "view"}
            onClick={() => toggleMenu("view")}
          >
            View
          </button>
          {activeMenu === "view" ? (
            <div
              className={styles.menuDropdown}
              role="group"
              aria-label="View actions"
            >
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("projects"))}
              >
                Selected Projects
              </MenuAction>
              <MenuAction
                onSelect={() =>
                  performMenuAction(() => openWindow("achievements"))
                }
              >
                Achievements
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(openAllWindows)}
                shortcut="⌘⇧A"
              >
                Open All Windows
              </MenuAction>
            </div>
          ) : null}
        </div>

        <div className={`${styles.menuGroup} ${styles.optionalMenu}`}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={activeMenu === "special"}
            onClick={() => toggleMenu("special")}
          >
            Special
          </button>
          {activeMenu === "special" ? (
            <div
              className={`${styles.menuDropdown} ${styles.menuDropdownRight}`}
              role="group"
              aria-label="Special actions"
            >
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("trash"))}
                shortcut="⌘T"
              >
                Open Trash
              </MenuAction>
              <MenuAction
                disabled={trashEmpty}
                onSelect={() => performMenuAction(emptyTrash)}
                shortcut="⌘⇧⌫"
              >
                Empty Trash…
              </MenuAction>
              <span className={styles.menuDivider} role="separator" />
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("contact"))}
              >
                Contact Krishang…
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(onRestart ?? resetDesktop)}
              >
                Restart…
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(onShutdown ?? resetDesktop)}
              >
                Shut Down…
              </MenuAction>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={styles.clock}
          aria-label={`Open Clock and Alarm. Current time ${clock}`}
          title="Clock & Alarm"
          onClick={() => openWindow("alarmClock")}
        >
          <time>{clock}</time>
        </button>
      </nav>

      <nav className={styles.iconGrid} aria-label="Portfolio desktop items">
        {DESKTOP_ICON_IDS.map((id) => {
          const definition = WINDOW_DEFINITIONS[id];
          const selected = selectedIcon === id;

          return (
            <button
              type="button"
              className={`${styles.desktopIcon}${selected ? ` ${styles.selectedIcon}` : ""}`}
              key={id}
              aria-label={`Open ${definition.title}`}
              aria-pressed={selected}
              data-open={windows[id].open ? "true" : undefined}
              onClick={() => {
                if (preferences.singleClickOpen) {
                  openWindow(id);
                  return;
                }
                setSelectedIcon(id);
                onSound?.("select");
              }}
              onDoubleClick={() => openWindow(id)}
              onPointerUp={(event) => {
                if (
                  event.pointerType !== "mouse" &&
                  !preferences.singleClickOpen
                ) {
                  openWindow(id);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  openWindow(id);
                }
              }}
            >
              <span className={styles.iconArtwork}>
                <MacIcon kind={definition.icon} />
              </span>
              <span className={styles.iconLabel}>{definition.title}</span>
            </button>
          );
        })}
      </nav>

      {preferences.showAccessoryShelf ? (
        <nav
          className={styles.accessoryGrid}
          aria-label="Applications and desk accessories on the desktop"
        >
          {DESKTOP_ACCESSORY_ICON_IDS.map((id, index) => {
            const definition = WINDOW_DEFINITIONS[id];
            const selected = selectedIcon === id;

            return (
              <button
                type="button"
                className={`${styles.desktopIcon}${selected ? ` ${styles.selectedIcon}` : ""}`}
                style={
                  {
                    "--icon-delay": `${420 + index * 45}ms`,
                  } as CSSProperties
                }
                key={id}
                aria-label={`Open ${definition.title}`}
                aria-pressed={selected}
                data-open={windows[id].open ? "true" : undefined}
                onClick={() => {
                  if (preferences.singleClickOpen) {
                    openWindow(id);
                    return;
                  }
                  setSelectedIcon(id);
                  onSound?.("select");
                }}
                onDoubleClick={() => openWindow(id)}
                onPointerUp={(event) => {
                  if (
                    event.pointerType !== "mouse" &&
                    !preferences.singleClickOpen
                  ) {
                    openWindow(id);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    openWindow(id);
                  }
                }}
              >
                <span className={styles.iconArtwork}>
                  <MacIcon kind={definition.icon} />
                </span>
                <span className={styles.iconLabel}>{definition.title}</span>
              </button>
            );
          })}
        </nav>
      ) : null}

      <button
        type="button"
        className={`${styles.trashIcon}${selectedIcon === "trash" ? ` ${styles.selectedIcon}` : ""}`}
        aria-label="Open Trash"
        aria-pressed={selectedIcon === "trash"}
        data-empty={trashEmpty ? "true" : "false"}
        data-open={windows.trash.open ? "true" : undefined}
        onClick={() => {
          if (preferences.singleClickOpen) {
            openWindow("trash");
            return;
          }
          setSelectedIcon("trash");
          onSound?.("select");
        }}
        onDoubleClick={() => openWindow("trash")}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse" && !preferences.singleClickOpen) {
            openWindow("trash");
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            openWindow("trash");
          }
        }}
      >
        <span className={styles.iconArtwork}>
          <MacIcon kind="trash" />
        </span>
        <span className={styles.iconLabel}>Trash</span>
      </button>

      {WINDOW_IDS.map((id) => {
        const state = windows[id];
        const definition = WINDOW_DEFINITIONS[id];
        if (!state.open) return null;

        const windowStyle: WindowStyle = {
          "--window-x": `${state.x}px`,
          "--window-y": `${state.y}px`,
          "--window-width": `${state.width}px`,
          "--window-height": `${state.height}px`,
          zIndex: state.z,
        };
        const active = activeWindow === id;
        const interacting = activeInteraction?.id === id;
        const closing = Boolean(closingWindows[id]);
        const titleId = `${titlePrefix}-${id}-title`;
        const fullBleedGame = FULL_BLEED_GAME_IDS.includes(id);

        return (
          <section
            className={`${styles.window}${fullBleedGame ? ` ${styles.doomWindow}` : ""}${active ? ` ${styles.activeWindow}` : ""}${state.maximized ? ` ${styles.maximizedWindow}` : ""}`}
            key={id}
            ref={(element) => {
              windowRefs.current[id] = element;
            }}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            tabIndex={0}
            style={windowStyle}
            data-interaction={interacting ? activeInteraction.mode : undefined}
            data-maximized={state.maximized ? "true" : undefined}
            data-closing={closing ? "true" : undefined}
            data-window-id={id}
            onPointerDown={(event) => {
              event.stopPropagation();
              if (!active) focusWindow(id);
            }}
            onPointerMove={movePointerOperation}
            onPointerUp={endPointerOperation}
            onPointerCancel={endPointerOperation}
            onLostPointerCapture={endPointerOperation}
            onFocusCapture={() => {
              if (!active) focusWindow(id);
            }}
          >
            <div
              className={styles.titleBar}
              onPointerDown={(event) =>
                beginPointerOperation(id, "move", event)
              }
              onDoubleClick={(event) => {
                if ((event.target as HTMLElement).closest("button")) return;
                toggleZoom(id);
              }}
            >
              <button
                type="button"
                className={styles.closeBox}
                aria-label={`Close ${definition.title}`}
                disabled={!active}
                tabIndex={active ? 0 : -1}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  closeWindow(id);
                }}
              >
                <span className={styles.closeGlyph} aria-hidden="true" />
              </button>
              <span className={styles.titleStripes} aria-hidden="true" />
              <h2 id={titleId}>{definition.title}</h2>
              <span className={styles.titleStripes} aria-hidden="true" />
              <button
                type="button"
                className={styles.zoomBox}
                aria-label={`${state.maximized ? "Restore" : "Zoom"} ${definition.title}`}
                aria-pressed={state.maximized}
                disabled={!active}
                tabIndex={active ? 0 : -1}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleZoom(id);
                }}
              >
                <span className={styles.zoomGlyph} aria-hidden="true" />
              </button>
            </div>

            <div
              className={`${styles.windowBody}${fullBleedGame ? ` ${styles.doomWindowBody}` : ""}`}
            >
              {renderWindowContent(id)}
            </div>

            {!fullBleedGame ? (
              <footer className={styles.statusBar}>
                <span>
                  {id === "trash"
                    ? trashEmpty
                      ? "Trash is empty"
                      : definition.status
                    : definition.status}
                </span>
                <button
                  type="button"
                  className={styles.resizeBox}
                  aria-label={`Resize ${definition.title}. Use arrow keys; hold Shift for larger steps.`}
                  disabled={!active || state.maximized}
                  tabIndex={active && !state.maximized ? 0 : -1}
                  onPointerDown={(event) =>
                    beginPointerOperation(id, "resize", event, "se")
                  }
                  onKeyDown={(event) => resizeWithKeyboard(id, event)}
                >
                  <span aria-hidden="true" />
                </button>
              </footer>
            ) : null}

            {active && !state.maximized
              ? RESIZE_DIRECTIONS.filter(
                  (direction) => fullBleedGame || direction !== "se"
                ).map((direction) => (
                  <span
                    key={direction}
                    className={`${styles.resizeEdge} ${styles[`resize${direction.toUpperCase()}` as keyof typeof styles]}`}
                    aria-hidden="true"
                    onPointerDown={(event) =>
                      beginPointerOperation(id, "resize", event, direction)
                    }
                  />
                ))
              : null}
          </section>
        );
      })}

      {toast ? (
        <div className={styles.systemToast} role="status" aria-live="polite">
          <span aria-hidden="true">⌘</span>
          {toast}
        </div>
      ) : null}

      {preferences.showDesktopHints ? (
        <>
          <p className={styles.desktopHint} aria-hidden="true">
            {preferences.singleClickOpen ? "Click" : "Double-click"} an icon ·
            Drag title bars · ⌘1–9 opens apps · ? shows shortcuts
          </p>
          <p className={styles.touchHint} aria-hidden="true">
            Tap an icon · Drag title bars · Apple menu opens desk accessories
          </p>
        </>
      ) : null}
    </div>
  );
}
