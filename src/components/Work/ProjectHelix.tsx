"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
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

const DEFAULT_SCENE = {
  width: 1280,
  height: 800,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
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
  const angleStep = compact ? 1.06 : 1.16;
  const angle = slot * angleStep;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const depth = (cosine + 1) / 2;
  const radius = compact
    ? Math.min(sceneWidth * 0.24, 180)
    : Math.min(sceneWidth * 0.3, 420);
  const verticalGap = sceneHeight * (compact ? 0.25 : 0.255);
  const depthAmplitude = compact ? 100 : Math.min(sceneWidth * 0.16, 220);
  const yawAmplitude = compact ? 18 : 30;
  const x = sine * radius;
  const y = slot * verticalGap;
  const z = cosine * depthAmplitude;
  const startFade = sceneHeight * 0.58;
  const endFade = sceneHeight * 0.86;
  const edgeFade =
    1 - clamp((Math.abs(y) - startFade) / (endFade - startFade), 0, 1);
  const scale = 0.56 + depth * 0.44;
  const opacity = edgeFade * (0.22 + depth * 0.78);
  const yaw = -sine * yawAmplitude;
  const roll = Math.sin(angle * 0.5) * 4;
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
      "--helix-roll": `${roll.toFixed(2)}deg`,
      "--helix-opacity": opacity.toFixed(3),
    },
    zIndex: Math.round(100 + depth * 100),
  };
}

export default function ProjectHelix({ projects }: ProjectHelixProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const frameRef = useRef(0);
  const transitionCount = Math.max(projects.length - 1, 0);
  const trackHeight = 136 + transitionCount * 72;

  const scrollToProject = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const section = sectionRef.current;

      if (!section || projects.length < 2) return;

      const viewportHeight = Math.max(window.innerHeight, 1);
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const travel = Math.max(section.offsetHeight - viewportHeight, 1);
      const hold = viewportHeight * 0.18;
      const usableTravel = Math.max(travel - hold * 2, 1);
      const progress = index / (projects.length - 1);

      window.scrollTo({
        top: sectionTop + hold + progress * usableTravel,
        behavior,
      });
    },
    [projects.length]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage || projects.length === 0) return;

    let nearViewport = true;
    let sceneWidth = stage.clientWidth || DEFAULT_SCENE.width;
    let sceneHeight = stage.clientHeight || DEFAULT_SCENE.height;

    const renderScene = () => {
      frameRef.current = 0;
      if (!nearViewport) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - sceneHeight, 1);
      const hold = sceneHeight * 0.18;
      const usableTravel = Math.max(travel - hold * 2, 1);
      const progress = clamp((-rect.top - hold) / usableTravel, 0, 1);
      const cursor = progress * transitionCount;

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

      stage.style.setProperty(
        "--scroll-progress",
        `${(progress * 100).toFixed(3)}%`
      );

      const nextActive = clamp(
        Math.round(cursor),
        0,
        Math.max(projects.length - 1, 0)
      );

      if (nextActive !== activeIndexRef.current) {
        activeIndexRef.current = nextActive;
        setActiveIndex(nextActive);
      }

      section.dataset.ready = "true";
    };

    const scheduleRender = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(renderScene);
    };

    const resizeObserver = new ResizeObserver(() => {
      sceneWidth = stage.clientWidth || DEFAULT_SCENE.width;
      sceneHeight = stage.clientHeight || DEFAULT_SCENE.height;
      scheduleRender();
    });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry.isIntersecting;
        if (nearViewport) scheduleRender();
      },
      { rootMargin: "100% 0%" }
    );

    resizeObserver.observe(stage);
    intersectionObserver.observe(section);
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);
    window.addEventListener("pageshow", scheduleRender);
    scheduleRender();

    return () => {
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      window.removeEventListener("pageshow", scheduleRender);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [projects.length, transitionCount]);

  return (
    <div className={styles.helixBrowser}>
      <noscript>
        <style>{`
          .${styles.scrollSection}, .${styles.skipSpiral} { display: none !important; }
          .${styles.linearFallback} { display: block !important; }
        `}</style>
      </noscript>

      <a className={styles.skipSpiral} href="#after-project-spiral">
        Skip project spiral
      </a>

      <section
        className={styles.scrollSection}
        ref={sectionRef}
        style={{ "--track-height": `${trackHeight}svh` } as HelixStyle}
        aria-label="Project spiral"
        aria-describedby="spiral-instructions"
      >
        <div className={styles.stickyStage} ref={stageRef}>
          <header className={styles.stageHeader} aria-hidden="true">
            <p>Project archive</p>
            <p className={styles.modeIndicator}>
              <span>spiral</span>
              <i />
              <span>scroll</span>
            </p>
            <p className={styles.stageCounter}>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </p>
          </header>

          <p className={styles.instructions} id="spiral-instructions">
            Scroll to move the projects through the spiral.
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
                      onFocus={() => scrollToProject(index, "auto")}
                    >
                      <div className={styles.projectArtwork} aria-hidden="true">
                        <ProjectSketch slug={project.slug} />
                      </div>

                      <div className={styles.cardCaption}>
                        <span className={styles.cardNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 id={titleId}>{project.title}</h3>
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

          <footer className={styles.stageFooter}>
            <div className={styles.progressTrack} aria-hidden="true">
              <span />
            </div>

            <nav className={styles.projectStops} aria-label="Jump to a project">
              {projects.map((project, index) => (
                <button
                  type="button"
                  aria-current={index === activeIndex ? "step" : undefined}
                  key={project.slug}
                  onClick={() => scrollToProject(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.slug === "ocs" ? "OCS" : project.title}</span>
                </button>
              ))}
            </nav>
          </footer>
        </div>
      </section>

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
