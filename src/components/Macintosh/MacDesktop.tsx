"use client";

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
import type { MacSound } from "./useMacSounds";

const RESUME_PATH = "/Krishang-Zinzuwadia-Resume.pdf";

type WindowId =
  | "welcome"
  | "about"
  | "projects"
  | "achievements"
  | "contact"
  | "resume";

type MenuId = "apple" | "file" | "view" | "special";
type IconKind =
  | "computer"
  | "folder"
  | "project"
  | "trophy"
  | "mail"
  | "document";

type WindowDefinition = {
  title: string;
  icon: IconKind;
  x: number;
  y: number;
  width: number;
  height: number;
  status: string;
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
  onRestart?: () => void;
  onSound?: (sound: MacSound) => void;
};

const WINDOW_IDS: WindowId[] = [
  "welcome",
  "about",
  "projects",
  "achievements",
  "contact",
  "resume",
];

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
};

function createInitialWindows(): Record<WindowId, DesktopWindowState> {
  return WINDOW_IDS.reduce(
    (state, id, index) => {
      const definition = WINDOW_DEFINITIONS[id];
      state[id] = {
        open: id === "welcome",
        x: definition.x,
        y: definition.y,
        width: definition.width,
        height: definition.height,
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
}: {
  children: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onSelect}>
      <span>{children}</span>
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

export default function MacDesktop({ onRestart, onSound }: MacDesktopProps) {
  const [windows, setWindows] = useState(createInitialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("welcome");
  const [selectedIcon, setSelectedIcon] = useState<WindowId | null>("welcome");
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const [activeInteraction, setActiveInteraction] =
    useState<ActiveInteraction | null>(null);
  const [clock, setClock] = useState("--:--");

  const rootRef = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLElement | null>(null);
  const windowRefs = useRef<Partial<Record<WindowId, HTMLElement | null>>>({});
  const operationRef = useRef<PointerOperation | null>(null);
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
  const interactionFrameRef = useRef<number | null>(null);
  const nextZ = useRef(20);
  const titlePrefix = useId();

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date())
      );
    };

    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
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
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (interactionFrameRef.current !== null) {
        window.cancelAnimationFrame(interactionFrameRef.current);
      }
    },
    []
  );

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
      onSound?.("close");
      const wasActive = activeWindow === id;
      const nextActive = WINDOW_IDS.filter(
        (candidate) => candidate !== id && windows[candidate].open
      ).sort((left, right) => windows[right].z - windows[left].z)[0];

      setWindows((current) => ({
        ...current,
        [id]: { ...current[id], open: false },
      }));
      if (wasActive) setActiveWindow(nextActive ?? null);
      setActiveMenu(null);
      window.requestAnimationFrame(() => {
        if (wasActive && nextActive) {
          windowRefs.current[nextActive]?.focus();
        } else if (wasActive) {
          rootRef.current?.focus();
        }
      });
    },
    [activeWindow, onSound, windows]
  );

  const openAllWindows = useCallback(() => {
    if (WINDOW_IDS.some((id) => !windows[id].open)) onSound?.("open");
    const firstZ = nextZ.current + 1;
    nextZ.current += WINDOW_IDS.length;
    setWindows((current) =>
      WINDOW_IDS.reduce(
        (next, id, index) => {
          next[id] = { ...current[id], open: true, z: firstZ + index };
          return next;
        },
        {} as Record<WindowId, DesktopWindowState>
      )
    );
    setActiveWindow("resume");
    setSelectedIcon("resume");
    setActiveMenu(null);
    window.requestAnimationFrame(() => windowRefs.current.resume?.focus());
  }, [onSound, windows]);

  const resetDesktop = useCallback(() => {
    onSound?.("close");
    nextZ.current = 20;
    operationRef.current = null;
    pendingPointerRef.current = null;
    if (interactionFrameRef.current !== null) {
      window.cancelAnimationFrame(interactionFrameRef.current);
      interactionFrameRef.current = null;
    }
    setActiveInteraction(null);
    setWindows(createInitialWindows());
    setActiveWindow("welcome");
    setSelectedIcon("welcome");
    setActiveMenu(null);
    window.requestAnimationFrame(() => windowRefs.current.welcome?.focus());
  }, [onSound]);

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
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "w") {
      event.preventDefault();
      if (activeWindow) closeWindow(activeWindow);
      return;
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
    }
  };

  return (
    <div
      className={styles.desktop}
      ref={rootRef}
      tabIndex={-1}
      role="region"
      aria-label={`${identity.name} interactive portfolio desktop`}
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
            aria-label="Portfolio menu"
            aria-haspopup="true"
            aria-expanded={activeMenu === "apple"}
            onClick={() => toggleMenu("apple")}
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
                onSelect={() => performMenuAction(() => openWindow("about"))}
              >
                About This Portfolio…
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(() => openWindow("welcome"))}
              >
                Welcome
              </MenuAction>
              <span className={styles.menuDivider} role="separator" />
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
              <MenuAction onSelect={() => performMenuAction(openAllWindows)}>
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
                onSelect={() => performMenuAction(() => openWindow("contact"))}
              >
                Contact Krishang…
              </MenuAction>
              <MenuAction
                onSelect={() => performMenuAction(onRestart ?? resetDesktop)}
              >
                Restart…
              </MenuAction>
            </div>
          ) : null}
        </div>

        <time className={styles.clock}>{clock}</time>
      </nav>

      <nav className={styles.iconGrid} aria-label="Portfolio desktop items">
        {WINDOW_IDS.map((id) => {
          const definition = WINDOW_DEFINITIONS[id];
          const selected = selectedIcon === id;

          return (
            <button
              type="button"
              className={`${styles.desktopIcon}${selected ? ` ${styles.selectedIcon}` : ""}`}
              key={id}
              aria-label={`Open ${definition.title}`}
              aria-pressed={selected}
              onClick={() => setSelectedIcon(id)}
              onDoubleClick={() => openWindow(id)}
              onPointerUp={(event) => {
                if (event.pointerType !== "mouse") openWindow(id);
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
        const titleId = `${titlePrefix}-${id}-title`;

        return (
          <section
            className={`${styles.window}${active ? ` ${styles.activeWindow}` : ""}${state.maximized ? ` ${styles.maximizedWindow}` : ""}`}
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

            <div className={styles.windowBody}>{renderWindowContent(id)}</div>

            <footer className={styles.statusBar}>
              <span>{definition.status}</span>
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

            {active && !state.maximized
              ? RESIZE_DIRECTIONS.filter((direction) => direction !== "se").map(
                  (direction) => (
                    <span
                      key={direction}
                      className={`${styles.resizeEdge} ${styles[`resize${direction.toUpperCase()}` as keyof typeof styles]}`}
                      aria-hidden="true"
                      onPointerDown={(event) =>
                        beginPointerOperation(id, "resize", event, direction)
                      }
                    />
                  )
                )
              : null}
          </section>
        );
      })}

      <p className={styles.desktopHint} aria-hidden="true">
        Double-click an icon · Drag title bars · Use the corner grip to resize ·
        Esc closes
      </p>
      <p className={styles.touchHint} aria-hidden="true">
        Tap an icon · Drag title bars · Drag the corner grip to resize
      </p>
    </div>
  );
}
