"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import ProjectSketch from "@/components/Editorial/ProjectSketch";

import styles from "./ProjectHelix.module.css";

export type ProjectHelixItem = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  recognition: string;
  date?: string;
};

type ProjectHelixProps = {
  projects: ProjectHelixItem[];
};

type CustomProperties = CSSProperties & {
  [property: `--${string}`]: string | number;
};

type PointerGesture = {
  pointerId: number;
  startX: number;
  startY: number;
  dragging: boolean;
};

const rungCount = 23;
const rungStepPercent = 92 / (rungCount - 1);

function getStrandPosition(phase: number, strand: "a" | "b") {
  const projection = Math.cos(phase);
  const centerShift = Math.sin(phase) * 0.45;
  const halfWidth = 0.4 + Math.abs(projection) * 4.2;
  const strandADirection = projection >= 0 ? 1 : -1;
  const direction = strand === "a" ? strandADirection : -strandADirection;

  return centerShift + direction * halfWidth;
}

const helixGeometry = Array.from({ length: rungCount }, (_, index) => {
  const progress = index / (rungCount - 1);

  return {
    phase: progress * Math.PI * 5,
    top: 4 + progress * 92,
  };
});

const helixRungs = helixGeometry.map(({ phase, top }, index) => {
  const projection = Math.cos(phase);
  const depthA = (Math.sin(phase) + 1) / 2;
  const strandAIsLeft = projection < 0;
  const style: CustomProperties = {
    "--rung-top": `${top.toFixed(3)}%`,
    "--rung-width": `${(0.8 + Math.abs(projection) * 8.4).toFixed(3)}rem`,
    "--rung-shift": `${(Math.sin(phase) * 0.45).toFixed(3)}rem`,
    "--rung-tilt": `${(Math.sin(phase) * 8).toFixed(3)}deg`,
    "--left-color": strandAIsLeft ? "var(--wp-red)" : "var(--wp-blue)",
    "--right-color": strandAIsLeft ? "var(--wp-blue)" : "var(--wp-red)",
    "--left-opacity": strandAIsLeft
      ? (0.34 + depthA * 0.66).toFixed(2)
      : (1 - depthA * 0.66).toFixed(2),
    "--right-opacity": strandAIsLeft
      ? (1 - depthA * 0.66).toFixed(2)
      : (0.34 + depthA * 0.66).toFixed(2),
  };

  return {
    key: `rung-${index}`,
    style,
  };
});

const helixSegments = helixGeometry.slice(0, -1).flatMap((point, index) => {
  const nextPoint = helixGeometry[index + 1];
  const middlePhase = (point.phase + nextPoint.phase) / 2;

  return (["a", "b"] as const).map((strand) => {
    const start = getStrandPosition(point.phase, strand);
    const end = getStrandPosition(nextPoint.phase, strand);
    const strandADepth = (Math.sin(middlePhase) + 1) / 2;
    const depth = strand === "a" ? strandADepth : 1 - strandADepth;
    const width = Math.max(Math.abs(end - start), 0.08);
    const thickness = 1.1 + depth * 1.8;
    const cap = Math.min(45, (thickness / (width * 16)) * 100);
    const style: CustomProperties = {
      "--segment-top": `${point.top.toFixed(3)}%`,
      "--segment-height": `${(rungStepPercent + 0.16).toFixed(3)}%`,
      "--segment-left": `${Math.min(start, end).toFixed(3)}rem`,
      "--segment-width": `${width.toFixed(3)}rem`,
      "--segment-cap": `${cap.toFixed(3)}%`,
      "--segment-color": strand === "a" ? "var(--wp-red)" : "var(--wp-blue)",
      "--segment-opacity": (0.34 + depth * 0.66).toFixed(3),
      zIndex: depth >= 0.5 ? 2 : 1,
    };

    return {
      key: `segment-${index}-${strand}`,
      direction: end >= start ? "right" : "left",
      front: depth >= 0.5,
      style,
    };
  });
});

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), length - 1);
}

function getSlot(index: number, activeIndex: number, length: number) {
  let slot = index - activeIndex;
  const radius = Math.floor(length / 2);

  if (slot > radius) slot -= length;
  if (slot < -radius) slot += length;

  return slot;
}

export default function ProjectHelix({ projects }: ProjectHelixProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const gestureRef = useRef<PointerGesture | null>(null);
  const wheelStateRef = useRef({ accumulatedX: 0, lastStepAt: 0 });
  const suppressClickRef = useRef(false);

  const activeProject = projects[activeIndex];

  const selectProject = useCallback(
    (nextIndex: number) => {
      const next = clampIndex(nextIndex, projects.length);

      if (next === activeIndex) return;

      setPreviousIndex(activeIndex);
      setActiveIndex(next);
    },
    [activeIndex, projects.length]
  );

  const moveProject = useCallback(
    (amount: number) => {
      selectProject(activeIndex + amount);
    },
    [activeIndex, selectProject]
  );

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const handleWheel = (event: WheelEvent) => {
      if (!window.matchMedia("(min-width: 52.01rem)").matches) return;

      const multiplier =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 80 : 1;
      const deltaX = event.deltaX * multiplier;
      const deltaY = event.deltaY * multiplier;

      const horizontalIntent =
        Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= 1;
      const shiftedWheelIntent = event.shiftKey && Math.abs(deltaY) >= 1;

      if (!horizontalIntent && !shiftedWheelIntent) {
        wheelStateRef.current.accumulatedX = 0;
        return;
      }

      event.preventDefault();
      wheelStateRef.current.accumulatedX += horizontalIntent ? deltaX : deltaY;

      const now = performance.now();
      if (
        Math.abs(wheelStateRef.current.accumulatedX) < 60 ||
        now - wheelStateRef.current.lastStepAt < 300
      ) {
        return;
      }

      const direction = wheelStateRef.current.accumulatedX > 0 ? 1 : -1;
      selectProject(activeIndex + direction);
      wheelStateRef.current.accumulatedX = 0;
      wheelStateRef.current.lastStepAt = now;
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });

    return () => stage.removeEventListener("wheel", handleWheel);
  }, [activeIndex, selectProject]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = clampIndex(activeIndex - 1, projects.length);
        break;
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = clampIndex(activeIndex + 1, projects.length);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = projects.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectProject(nextIndex);
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      !window.matchMedia("(min-width: 52.01rem)").matches
    ) {
      return;
    }

    suppressClickRef.current = false;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;

    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.dragging) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 10) return;

      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        gestureRef.current = null;
        return;
      }

      gesture.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
  };

  const finishPointerGesture = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;

    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;

    if (gesture.dragging) {
      suppressClickRef.current = true;

      if (Math.abs(deltaX) >= 44) {
        moveProject(deltaX < 0 ? 1 : -1);
      }
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    gestureRef.current = null;
  };

  const cancelPointerGesture = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    gestureRef.current = null;
  };

  return (
    <div className={styles.helixBrowser}>
      <div className={styles.interactiveHelix}>
        <header className={styles.toolbar}>
          <div>
            <p className={styles.toolbarLabel}>Project index</p>
            <p className={styles.instructions} id="helix-instructions">
              Pick a name, use the arrow keys, or swipe across the spiral.
            </p>
          </div>

          <div className={styles.controls} aria-label="Project controls">
            <button
              type="button"
              onClick={() => moveProject(-1)}
              disabled={activeIndex === 0}
              aria-label="Show previous project"
            >
              <span aria-hidden="true">←</span>
              Previous
            </button>
            <output className={styles.counter} aria-hidden="true">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </output>
            <button
              type="button"
              onClick={() => moveProject(1)}
              disabled={activeIndex === projects.length - 1}
              aria-label="Show next project"
            >
              Next
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </header>

        <div className={styles.desktopLayout}>
          <div
            className={styles.stage}
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerGesture}
            onPointerCancel={cancelPointerGesture}
            onLostPointerCapture={cancelPointerGesture}
            onClickCapture={(event) => {
              if (!suppressClickRef.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressClickRef.current = false;
            }}
          >
            <div className={styles.spiral} aria-hidden="true">
              <span className={styles.spineLabel}>01—07</span>
              {helixSegments.map((segment) => (
                <span
                  className={`${styles.railSegment} ${
                    segment.front ? styles.railFront : ""
                  }`}
                  data-direction={segment.direction}
                  key={segment.key}
                  style={segment.style}
                />
              ))}
              {helixRungs.map((rung) => (
                <span
                  className={styles.helixRung}
                  key={rung.key}
                  style={rung.style}
                />
              ))}
            </div>

            <div
              className={styles.helixTabs}
              role="tablist"
              aria-label="Projects"
              aria-describedby="helix-instructions"
              aria-orientation="vertical"
            >
              {projects.map((project, index) => {
                const slot = getSlot(index, activeIndex, projects.length);
                const previousSlot = getSlot(
                  index,
                  previousIndex,
                  projects.length
                );
                const wrapped = Math.abs(slot - previousSlot) > 3;

                return (
                  <button
                    className={styles.helixTab}
                    data-slot={slot}
                    data-wrapped={wrapped ? "true" : undefined}
                    id={`helix-tab-${project.slug}`}
                    aria-controls={`helix-panel-${project.slug}`}
                    aria-label={project.title}
                    aria-selected={index === activeIndex}
                    key={project.slug}
                    onClick={() => selectProject(index)}
                    onKeyDown={handleTabKeyDown}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    role="tab"
                    tabIndex={index === activeIndex ? 0 : -1}
                    type="button"
                  >
                    <span className={styles.tabNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.tabTitle} aria-hidden="true">
                      {project.slug === "ocs" ? "OCS" : project.title}
                    </span>
                    <span className={styles.tabNode} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.panelStack}>
            {projects.map((project, index) => (
              <section
                className={styles.projectPanel}
                data-accent={index % 3}
                hidden={index !== activeIndex}
                id={`helix-panel-${project.slug}`}
                aria-labelledby={`helix-tab-${project.slug}`}
                key={project.slug}
                role="tabpanel"
              >
                <div className={styles.panelTopline}>
                  <p>{project.subtitle}</p>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className={styles.panelSketch}>
                  <ProjectSketch slug={project.slug} />
                </div>

                <div className={styles.panelCopy}>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>

                <div className={styles.panelFooter}>
                  <p>
                    <span>Where it’s at</span>
                    {project.recognition}
                    {project.date ? ` · ${project.date}` : ""}
                  </p>
                  <Link href={`/work/${project.slug}`}>
                    Open {project.title} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </section>
            ))}
          </div>
        </div>

        <p className={styles.liveStatus} aria-live="polite" aria-atomic="true">
          {activeProject.title}, project {activeIndex + 1} of {projects.length}
        </p>
      </div>

      <ol className={styles.linearFallback}>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <article className={styles.fallbackCard}>
              <Link
                href={`/work/${project.slug}`}
                aria-labelledby={`fallback-title-${project.slug}`}
                aria-describedby={`fallback-summary-${project.slug}`}
              >
                <div className={styles.fallbackSketch} aria-hidden="true">
                  <ProjectSketch slug={project.slug} />
                </div>
                <div className={styles.fallbackCopy}>
                  <p className={styles.fallbackEyebrow}>
                    {String(index + 1).padStart(2, "0")} · {project.subtitle}
                  </p>
                  <h3 id={`fallback-title-${project.slug}`}>{project.title}</h3>
                  <p id={`fallback-summary-${project.slug}`}>
                    {project.summary}
                  </p>
                  <span className={styles.fallbackLink}>
                    Open {project.title} ↗
                  </span>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
