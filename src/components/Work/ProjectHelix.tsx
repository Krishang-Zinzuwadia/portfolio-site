"use client";

import Link from "next/link";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
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

type HelixStyle = CSSProperties & {
  [property: `--${string}`]: string | number;
};

type CardGeometry = {
  active: boolean;
  near: boolean;
  style: HelixStyle;
  zIndex: number;
};

type LoopMetrics = {
  center: number;
  cycle: number;
  safeMaximum: number;
  safeMinimum: number;
  sectionTop: number;
  step: number;
  totalTravel: number;
};

const DEFAULT_SCENE = {
  width: 1280,
  height: 800,
};

const HELIX_PERSPECTIVE = 940;
const PROJECT_STEP_SVH = 72;
const IDEAL_LOOP_CYCLES = 256;
const MINIMUM_LOOP_CYCLES = 8;
const MAXIMUM_LOOP_TRAVEL = 4_000_000;

const fallbackMediaQueries = [
  "(max-width: 36rem)",
  "(max-height: 40rem)",
  "(prefers-reduced-motion: reduce)",
  "(forced-colors: active)",
  "print",
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function degrees(radians: number) {
  return (radians * 180) / Math.PI;
}

function scrollWindowInstantly(top: number) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: window.scrollX, behavior: "instant" });
  root.style.scrollBehavior = previousBehavior;
}

function wrapSlot(slot: number, count: number) {
  if (count < 2) return slot;

  const half = count / 2;
  let wrapped = slot;

  while (wrapped > half) wrapped -= count;
  while (wrapped < -half) wrapped += count;

  return wrapped;
}

function getCardGeometry(
  index: number,
  cursor: number,
  count: number,
  sceneWidth: number,
  sceneHeight: number
): CardGeometry {
  const compact = sceneWidth < 820;
  const slot = wrapSlot(index - cursor, count);
  const phaseStep = compact ? 1.08 : 1.22;
  const phase = slot * phaseStep;
  const sine = Math.sin(phase);
  const cosine = Math.cos(phase);
  const depth = (cosine + 1) / 2;
  const radius = compact
    ? Math.min(sceneWidth * 0.21, 155)
    : Math.min(sceneWidth * 0.27, 380);
  const verticalGap = sceneHeight * (compact ? 0.215 : 0.225);
  const depthAmplitude = compact ? 90 : Math.min(sceneWidth * 0.14, 180);
  const x = sine * radius;
  const y = slot * verticalGap;
  const z = cosine * depthAmplitude;
  const startFade = sceneHeight * 0.5;
  const endFade = sceneHeight * 0.74;
  const edgeFade =
    1 - clamp((Math.abs(y) - startFade) / (endFade - startFade), 0, 1);
  const scale = 0.56 + depth * 0.44;
  const opacity = edgeFade * (0.22 + depth * 0.78);
  const cameraZ = HELIX_PERSPECTIVE - z;
  const yawLimit = compact ? 18 : 28;
  const pitchLimit = compact ? 4 : 7;
  const rollLimit = compact ? 2.5 : 4.5;
  const yaw = clamp(
    degrees(Math.atan2(-x, cameraZ)) * 1.15,
    -yawLimit,
    yawLimit
  );
  const pitch =
    clamp(
      degrees(Math.atan2(y, Math.hypot(x, cameraZ))) * 0.35,
      -pitchLimit,
      pitchLimit
    ) * edgeFade;
  const tangentX = radius * phaseStep * cosine;
  const pathTangent = degrees(Math.atan2(tangentX, verticalGap));
  const roll =
    clamp(-pathTangent * 0.08 * (1 - depth), -rollLimit, rollLimit) * edgeFade;
  const centerBias = 1 - clamp(Math.abs(slot) / 0.75, 0, 1);
  const active = Math.abs(slot) < 0.5;

  return {
    active,
    near: edgeFade > 0.08,
    style: {
      "--helix-x": `${x.toFixed(2)}px`,
      "--helix-y": `${y.toFixed(2)}px`,
      "--helix-z": `${z.toFixed(2)}px`,
      "--helix-scale": scale.toFixed(4),
      "--helix-yaw": `${yaw.toFixed(2)}deg`,
      "--helix-pitch": `${pitch.toFixed(2)}deg`,
      "--helix-roll": `${roll.toFixed(2)}deg`,
      "--helix-opacity": opacity.toFixed(3),
    },
    zIndex: Math.round(100 + depth * 110 + centerBias * 35 - Math.abs(slot)),
  };
}

export default function ProjectHelix({ projects }: ProjectHelixProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stepProbeRef = useRef<HTMLSpanElement | null>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const fallbackLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const metricsRef = useRef<LoopMetrics | null>(null);
  const frameRef = useRef(0);
  const initialLoopTravel =
    PROJECT_STEP_SVH * projects.length * IDEAL_LOOP_CYCLES;

  const scrollToProject = useCallback(
    (index: number) => {
      const metrics = metricsRef.current;

      if (!metrics || projects.length < 2) return;

      const localPosition = window.scrollY - metrics.sectionTop;
      const cursor = positiveModulo(
        localPosition / metrics.step,
        projects.length
      );
      const nearestOffset = wrapSlot(index - cursor, projects.length);
      let targetPosition = localPosition + nearestOffset * metrics.step;

      if (
        targetPosition < metrics.safeMinimum ||
        targetPosition > metrics.safeMaximum
      ) {
        targetPosition =
          metrics.center + positiveModulo(targetPosition, metrics.cycle);
      }

      scrollWindowInstantly(metrics.sectionTop + targetPosition);
    },
    [projects.length]
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const stepProbe = stepProbeRef.current;

    if (!section || !stage || !stepProbe || projects.length === 0) return;

    const mediaQueries = fallbackMediaQueries.map((query) =>
      window.matchMedia(query)
    );
    let loopEnabled = mediaQueries.every((query) => !query.matches);
    let sceneWidth = stage.clientWidth || DEFAULT_SCENE.width;
    let sceneHeight = stage.clientHeight || DEFAULT_SCENE.height;
    let lastCursor = 0;
    let initialized = false;
    let measurementFrame = 0;
    let transitionFrame = 0;

    const measureLoop = () => {
      if (!loopEnabled) {
        metricsRef.current = null;
        delete section.dataset.ready;
        return;
      }

      const previousMetrics = metricsRef.current;
      let phaseCursor = lastCursor;

      if (previousMetrics) {
        phaseCursor = positiveModulo(
          (window.scrollY - previousMetrics.sectionTop) / previousMetrics.step,
          projects.length
        );
      } else if (!initialized) {
        const initialSectionTop =
          window.scrollY + section.getBoundingClientRect().top;
        const initialStep = Math.max(
          1,
          Math.round(stepProbe.getBoundingClientRect().height)
        );

        phaseCursor = positiveModulo(
          (window.scrollY - initialSectionTop) / initialStep,
          projects.length
        );
      }

      sceneWidth = stage.clientWidth || DEFAULT_SCENE.width;
      sceneHeight = stage.clientHeight || DEFAULT_SCENE.height;

      const step = Math.max(
        1,
        Math.round(stepProbe.getBoundingClientRect().height)
      );
      const cycle = step * projects.length;
      let totalCycles = Math.min(
        IDEAL_LOOP_CYCLES,
        Math.floor(MAXIMUM_LOOP_TRAVEL / cycle)
      );

      totalCycles = Math.max(MINIMUM_LOOP_CYCLES, totalCycles);
      if (totalCycles % 2 !== 0) totalCycles -= 1;

      section.style.setProperty("--loop-travel", `${totalCycles * cycle}px`);

      const realizedTravel = Math.max(
        section.offsetHeight - stage.offsetHeight,
        0
      );
      const realizedCycles = Math.floor(realizedTravel / cycle);

      if (
        realizedCycles < totalCycles &&
        realizedCycles >= MINIMUM_LOOP_CYCLES
      ) {
        totalCycles =
          realizedCycles % 2 === 0 ? realizedCycles : realizedCycles - 1;
        section.style.setProperty("--loop-travel", `${totalCycles * cycle}px`);
      }

      const totalTravel = totalCycles * cycle;
      const guardCycles = Math.min(
        Math.max(2, Math.floor(totalCycles / 4)),
        Math.floor(totalCycles / 2) - 1
      );
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const metrics: LoopMetrics = {
        center: (totalCycles / 2) * cycle,
        cycle,
        safeMaximum: (totalCycles - guardCycles) * cycle,
        safeMinimum: guardCycles * cycle,
        sectionTop,
        step,
        totalTravel,
      };

      metricsRef.current = metrics;
      lastCursor = phaseCursor;
      initialized = true;

      const localPosition = window.scrollY - sectionTop;
      const metricsChanged =
        !previousMetrics ||
        previousMetrics.step !== metrics.step ||
        previousMetrics.totalTravel !== metrics.totalTravel ||
        Math.abs(previousMetrics.sectionTop - metrics.sectionTop) > 0.5;

      if (
        metricsChanged ||
        localPosition < metrics.safeMinimum ||
        localPosition > metrics.safeMaximum
      ) {
        scrollWindowInstantly(
          sectionTop + metrics.center + phaseCursor * metrics.step
        );
      }

      section.dataset.ready = "true";
    };

    const renderScene = () => {
      frameRef.current = 0;
      const metrics = metricsRef.current;

      if (!loopEnabled || !metrics) return;

      let localPosition = window.scrollY - metrics.sectionTop;

      if (
        localPosition < metrics.safeMinimum ||
        localPosition > metrics.safeMaximum
      ) {
        const phasePosition = positiveModulo(localPosition, metrics.cycle);

        localPosition = metrics.center + phasePosition;
        scrollWindowInstantly(metrics.sectionTop + localPosition);
      }

      const cursor = positiveModulo(
        localPosition / metrics.step,
        projects.length
      );

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const geometry = getCardGeometry(
          index,
          cursor,
          projects.length,
          sceneWidth,
          sceneHeight
        );

        Object.entries(geometry.style).forEach(([property, value]) => {
          card.style.setProperty(property, String(value));
        });
        card.style.zIndex = String(geometry.zIndex);
        card.style.pointerEvents = geometry.near ? "auto" : "none";
        card.dataset.active = geometry.active ? "true" : "false";
      });

      const nextActive = positiveModulo(Math.round(cursor), projects.length);

      if (nextActive !== activeIndexRef.current) {
        activeIndexRef.current = nextActive;
        setActiveIndex(nextActive);
      }

      lastCursor = cursor;
    };

    const scheduleRender = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(renderScene);
    };

    const scheduleMeasurement = () => {
      if (measurementFrame) return;

      measurementFrame = window.requestAnimationFrame(() => {
        measurementFrame = 0;
        measureLoop();
        renderScene();
      });
    };

    const handleMediaChange = () => {
      const nextLoopEnabled = mediaQueries.every((query) => !query.matches);

      if (nextLoopEnabled === loopEnabled) return;

      const activeElement = document.activeElement;
      const focusedHelixIndex = cardRefs.current.findIndex((card) =>
        card?.contains(activeElement)
      );
      const focusedFallbackIndex = fallbackLinkRefs.current.findIndex(
        (link) => link === activeElement
      );

      loopEnabled = nextLoopEnabled;
      if (!loopEnabled) {
        const previousMetrics = metricsRef.current;

        if (previousMetrics) {
          lastCursor = positiveModulo(
            (window.scrollY - previousMetrics.sectionTop) /
              previousMetrics.step,
            projects.length
          );
        }

        metricsRef.current = null;
        delete section.dataset.ready;

        if (transitionFrame) window.cancelAnimationFrame(transitionFrame);
        transitionFrame = window.requestAnimationFrame(() => {
          transitionFrame = 0;
          const targetIndex =
            focusedHelixIndex >= 0 ? focusedHelixIndex : activeIndexRef.current;
          const target = fallbackLinkRefs.current[targetIndex];

          if (focusedHelixIndex >= 0) target?.focus({ preventScroll: true });
          target?.scrollIntoView({ block: "center", behavior: "instant" });
        });
        return;
      }

      if (focusedFallbackIndex >= 0) lastCursor = focusedFallbackIndex;
      scheduleMeasurement();

      if (focusedFallbackIndex >= 0) {
        if (transitionFrame) window.cancelAnimationFrame(transitionFrame);
        transitionFrame = window.requestAnimationFrame(() => {
          transitionFrame = 0;
          cardRefs.current[focusedFallbackIndex]
            ?.querySelector<HTMLAnchorElement>("a")
            ?.focus({ preventScroll: true });
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") scheduleMeasurement();
    };

    const resizeObserver = new ResizeObserver(scheduleMeasurement);

    resizeObserver.observe(stage);
    resizeObserver.observe(stepProbe);
    mediaQueries.forEach((query) =>
      query.addEventListener("change", handleMediaChange)
    );
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleMeasurement);
    window.addEventListener("pageshow", scheduleMeasurement);
    window.visualViewport?.addEventListener("resize", scheduleMeasurement);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    measureLoop();
    renderScene();

    return () => {
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleMeasurement);
      window.removeEventListener("pageshow", scheduleMeasurement);
      window.visualViewport?.removeEventListener("resize", scheduleMeasurement);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mediaQueries.forEach((query) =>
        query.removeEventListener("change", handleMediaChange)
      );
      resizeObserver.disconnect();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (measurementFrame) window.cancelAnimationFrame(measurementFrame);
      if (transitionFrame) window.cancelAnimationFrame(transitionFrame);
      metricsRef.current = null;
    };
  }, [projects.length]);

  return (
    <div className={styles.helixBrowser}>
      <noscript>
        <style>{`
          .${styles.scrollSection} { display: none !important; }
          .${styles.linearFallback} { display: block !important; }
        `}</style>
      </noscript>

      <nav className={styles.homeNav} aria-label="Site navigation">
        <Link className={styles.backHome} href="/">
          <span aria-hidden="true">←</span>
          Home
        </Link>
      </nav>

      <h1 className={styles.srOnly}>Projects by Krishang Zinzuwadia</h1>

      <section
        className={styles.scrollSection}
        ref={sectionRef}
        style={{ "--loop-travel": `${initialLoopTravel}svh` } as HelixStyle}
        aria-label="Infinite project spiral"
        aria-describedby="spiral-instructions"
      >
        <span
          className={styles.stepProbe}
          ref={stepProbeRef}
          aria-hidden="true"
        />

        <div className={styles.stickyStage} ref={stageRef}>
          <p className={styles.srOnly} id="spiral-instructions">
            Scroll to move through the repeating project spiral. All seven
            project links are listed once; Tab moves between them.
          </p>

          <ol className={styles.cardField}>
            {projects.map((project, index) => {
              const initialGeometry = getCardGeometry(
                index,
                0,
                projects.length,
                DEFAULT_SCENE.width,
                DEFAULT_SCENE.height
              );
              const titleId = `spiral-title-${project.slug}`;
              const summaryId = `spiral-summary-${project.slug}`;

              return (
                <li
                  className={styles.helixCard}
                  data-active={index === activeIndex ? "true" : "false"}
                  key={project.slug}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  style={{
                    ...initialGeometry.style,
                    zIndex: initialGeometry.zIndex,
                  }}
                >
                  <article>
                    <Link
                      className={styles.projectCard}
                      href={`/work/${project.slug}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      aria-labelledby={titleId}
                      aria-describedby={summaryId}
                      onFocus={() => scrollToProject(index)}
                    >
                      <div className={styles.projectArtwork} aria-hidden="true">
                        <ProjectSketch slug={project.slug} />
                      </div>

                      <div className={styles.cardCaption}>
                        <span className={styles.cardNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h2 id={titleId}>{project.title}</h2>
                          <p>{project.subtitle}</p>
                        </div>
                        <span className={styles.cardOpen} aria-hidden="true">
                          ↗
                        </span>
                      </div>

                      <span className={styles.srOnly} id={summaryId}>
                        {project.summary}
                      </span>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <ol className={styles.linearFallback}>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <article className={styles.fallbackCard}>
              <Link
                ref={(element) => {
                  fallbackLinkRefs.current[index] = element;
                }}
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
                  <h2 id={`fallback-title-${project.slug}`}>{project.title}</h2>
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
