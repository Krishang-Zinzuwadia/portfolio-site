"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  hasPortfolioEntryCompleted,
  markPortfolioEntryComplete,
} from "../Portfolio/portfolioEntryState";
import MacDesktop from "./MacDesktop";
import styles from "./MacExperience.module.css";
import { useMacSounds } from "./useMacSounds";

type BootPhase = "idle" | "powerOn" | "happyMac" | "welcome" | "ready";
type IntroPhase = "cover" | "priming" | "zooming" | "complete";

type IntroMotionStyle = CSSProperties & {
  [key: `--intro-${string}`]: string | number;
};

let hasBootedInThisPage = false;

const INTRO_IMAGE = "/assets/intro/macintosh-entry-v2.png";
const INTRO_IMAGE_WIDTH = 1672;
const INTRO_IMAGE_HEIGHT = 941;
const INTRO_DURATION = 1900;
const PHOTO_SCREEN = {
  x: 892,
  y: 176,
  width: 351,
  height: 253,
};

const NEXT_BOOT_PHASE: Partial<Record<BootPhase, BootPhase>> = {
  powerOn: "happyMac",
  happyMac: "welcome",
  welcome: "ready",
};

const BOOT_DELAYS: Partial<Record<BootPhase, number>> = {
  powerOn: 280,
  happyMac: 850,
  welcome: 1650,
};

const REDUCED_BOOT_DELAYS: Partial<Record<BootPhase, number>> = {
  powerOn: 80,
  happyMac: 160,
  welcome: 320,
};

function HappyMacIcon() {
  return (
    <svg
      className={styles.happyMacIcon}
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d="M8 3h42v8h6v45H8z" fill="#fff" stroke="#111" strokeWidth="3" />
      <path d="M14 11h35v30H14z" fill="#d8d8d0" stroke="#111" strokeWidth="3" />
      <path d="M20 19h5v7h-5zm18 0h5v7h-5z" fill="#111" />
      <path d="M25 31h4v3h8v-3h4v6H25z" fill="#111" />
      <path d="M15 47h34v4H15z" fill="#111" />
      <path d="M51 4h5v7h-5z" fill="#111" />
    </svg>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" />
      ) : (
        <path d="M16 9c1.7 1.7 1.7 4.3 0 6m2.5-8.5c3 3 3 8 0 11" />
      )}
    </svg>
  );
}

export default function MacExperience() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    hasPortfolioEntryCompleted() ? "complete" : "cover"
  );
  const [introImageReady, setIntroImageReady] = useState(false);
  const [introStyle, setIntroStyle] = useState<IntroMotionStyle>();
  const [bootPhase, setBootPhase] = useState<BootPhase>(() =>
    hasBootedInThisPage
      ? "ready"
      : hasPortfolioEntryCompleted()
        ? "powerOn"
        : "idle"
  );
  const introStageRef = useRef<HTMLElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const introFrameRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const { muted, playSound, toggleMuted } = useMacSounds();
  const introActive = introPhase !== "complete";

  const finishIntro = useCallback(() => {
    if (introFrameRef.current !== null) {
      window.cancelAnimationFrame(introFrameRef.current);
      introFrameRef.current = null;
    }
    if (introTimerRef.current !== null) {
      window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }

    markPortfolioEntryComplete();
    setIntroPhase("complete");

    introFrameRef.current = window.requestAnimationFrame(() => {
      screenRef.current?.focus();
      introFrameRef.current = null;
    });
  }, []);

  useEffect(() => {
    const nextPhase = NEXT_BOOT_PHASE[bootPhase];
    if (!nextPhase) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const delays = reducedMotion ? REDUCED_BOOT_DELAYS : BOOT_DELAYS;
    const timer = window.setTimeout(() => {
      if (nextPhase === "ready") hasBootedInThisPage = true;
      setBootPhase(nextPhase);
    }, delays[bootPhase]);

    return () => window.clearTimeout(timer);
  }, [bootPhase]);

  useEffect(
    () => () => {
      if (introFrameRef.current !== null) {
        window.cancelAnimationFrame(introFrameRef.current);
      }
      if (introTimerRef.current !== null) {
        window.clearTimeout(introTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (introPhase !== "cover" || !introImageReady) return;

    const frame = window.requestAnimationFrame(() =>
      enterButtonRef.current?.focus({ preventScroll: true })
    );
    return () => window.cancelAnimationFrame(frame);
  }, [introImageReady, introPhase]);

  useEffect(() => {
    if (!introActive) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [introActive]);

  useEffect(() => {
    if (introPhase !== "priming" && introPhase !== "zooming") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      finishIntro();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", finishIntro);
    window.visualViewport?.addEventListener("resize", finishIntro);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", finishIntro);
      window.visualViewport?.removeEventListener("resize", finishIntro);
    };
  }, [finishIntro, introPhase]);

  useEffect(() => {
    if (bootPhase !== "ready") return;

    const frame = window.requestAnimationFrame(() => {
      const screen = screenRef.current;
      const activeElement = document.activeElement;
      if (
        !screen ||
        (activeElement &&
          activeElement !== document.body &&
          !screen.contains(activeElement))
      ) {
        return;
      }

      screen.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [bootPhase]);

  const startMac = useCallback(() => {
    playSound("startup");
    setBootPhase("powerOn");
  }, [playSound]);

  const restartMac = useCallback(() => {
    playSound("startup");
    setBootPhase("powerOn");
  }, [playSound]);

  const beginIntro = useCallback(() => {
    if (introPhase !== "cover" || !introImageReady) return;

    startMac();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      finishIntro();
      return;
    }

    const stageRect = introStageRef.current?.getBoundingClientRect();
    const targetRect = screenRef.current?.getBoundingClientRect();
    if (!stageRect || !targetRect || !stageRect.width || !stageRect.height) {
      finishIntro();
      return;
    }

    const portraitCrop = stageRect.width / stageRect.height <= 0.8;
    const imageScale = portraitCrop
      ? Math.max(
          stageRect.width / INTRO_IMAGE_WIDTH,
          stageRect.height / INTRO_IMAGE_HEIGHT
        )
      : Math.min(
          stageRect.width / INTRO_IMAGE_WIDTH,
          stageRect.height / INTRO_IMAGE_HEIGHT
        );
    const imageWidth = INTRO_IMAGE_WIDTH * imageScale;
    const imageHeight = INTRO_IMAGE_HEIGHT * imageScale;
    const imageLeft =
      (stageRect.width - imageWidth) * (portraitCrop ? 0.66 : 0.5);
    const imageTop = (stageRect.height - imageHeight) / 2;
    const sourceLeft = imageLeft + PHOTO_SCREEN.x * imageScale;
    const sourceTop = imageTop + PHOTO_SCREEN.y * imageScale;
    const sourceWidth = PHOTO_SCREEN.width * imageScale;
    const sourceHeight = PHOTO_SCREEN.height * imageScale;
    const sourceCenterX = sourceLeft + sourceWidth / 2;
    const sourceCenterY = sourceTop + sourceHeight / 2;
    const targetLeft = targetRect.left - stageRect.left;
    const targetTop = targetRect.top - stageRect.top;
    const targetCenterX = targetLeft + targetRect.width / 2;
    const targetCenterY = targetTop + targetRect.height / 2;
    const photoScale = Math.max(
      targetRect.width / sourceWidth,
      targetRect.height / sourceHeight
    );

    setIntroStyle({
      "--intro-photo-origin-x": `${sourceCenterX}px`,
      "--intro-photo-origin-y": `${sourceCenterY}px`,
      "--intro-photo-shift-x": `${targetCenterX - sourceCenterX}px`,
      "--intro-photo-shift-y": `${targetCenterY - sourceCenterY}px`,
      "--intro-photo-scale": photoScale,
      "--intro-flight-left": `${sourceLeft}px`,
      "--intro-flight-top": `${sourceTop}px`,
      "--intro-flight-width": `${sourceWidth}px`,
      "--intro-flight-height": `${sourceHeight}px`,
      "--intro-flight-shift-x": `${targetLeft - sourceLeft}px`,
      "--intro-flight-shift-y": `${targetTop - sourceTop}px`,
      "--intro-flight-scale-x": targetRect.width / sourceWidth,
      "--intro-flight-scale-y": targetRect.height / sourceHeight,
      "--intro-target-left": `${targetLeft}px`,
      "--intro-target-top": `${targetTop}px`,
      "--intro-target-width": `${targetRect.width}px`,
      "--intro-target-height": `${targetRect.height}px`,
      "--intro-target-radius": `${Math.max(
        6,
        Math.min(targetRect.width, targetRect.height) * 0.026
      )}px`,
      "--intro-flight-image-left": `${imageLeft - sourceLeft}px`,
      "--intro-flight-image-top": `${imageTop - sourceTop}px`,
      "--intro-flight-image-width": `${imageWidth}px`,
      "--intro-flight-image-height": `${imageHeight}px`,
    });
    setIntroPhase("priming");

    // Give React and the browser one complete painted frame with the measured
    // geometry before starting the transition. This prevents the first
    // transform frame from being skipped on fast devices.
    introFrameRef.current = window.requestAnimationFrame(() => {
      introFrameRef.current = window.requestAnimationFrame(() => {
        setIntroPhase("zooming");
        introFrameRef.current = null;
        introTimerRef.current = window.setTimeout(finishIntro, INTRO_DURATION);
      });
    });
  }, [finishIntro, introImageReady, introPhase, startMac]);

  const bootStatus = introActive
    ? introPhase === "cover"
      ? introImageReady
        ? "Portfolio entry ready"
        : "Loading portfolio entry"
      : "Opening Macintosh portfolio"
    : bootPhase === "ready"
      ? "Desktop ready"
      : bootPhase === "idle"
        ? ""
        : "Starting Macintosh";

  return (
    <main
      className={styles.experience}
      aria-labelledby="macintosh-portfolio-title"
      data-entry-phase={introPhase}
      style={introStyle}
    >
      <h1 id="macintosh-portfolio-title" className={styles.srOnly}>
        Krishang Zinzuwadia — interactive Macintosh portfolio
      </h1>
      <p className={styles.srOnly} role="status" aria-live="polite">
        {bootStatus}
      </p>

      <div
        className={`${styles.macintoshDisplay} ${
          introActive ? styles.displayBehindIntro : ""
        }`}
        aria-hidden={introActive}
        inert={introActive}
      >
        <div className={styles.screenBezel}>
          <div
            ref={screenRef}
            className={styles.screen}
            data-boot-phase={bootPhase}
            tabIndex={-1}
            aria-label={
              bootPhase === "ready"
                ? "Interactive Macintosh desktop"
                : "Macintosh startup screen"
            }
          >
            {bootPhase === "ready" ? (
              <MacDesktop onRestart={restartMac} onSound={playSound} />
            ) : (
              <div className={styles.startup} data-phase={bootPhase}>
                {bootPhase === "idle" ? (
                  <button
                    type="button"
                    className={styles.startButton}
                    onClick={startMac}
                  >
                    <span className={styles.powerIcon} aria-hidden="true" />
                    <strong>Start Macintosh</strong>
                    <small>Sound {muted ? "off" : "on"}</small>
                  </button>
                ) : null}

                {bootPhase === "powerOn" ? (
                  <span className={styles.crtGlow} aria-hidden="true" />
                ) : null}

                {bootPhase === "happyMac" ? (
                  <div className={styles.happyMac} aria-hidden="true">
                    <HappyMacIcon />
                  </div>
                ) : null}

                {bootPhase === "welcome" ? (
                  <div className={styles.welcomePanel} aria-hidden="true">
                    <HappyMacIcon />
                    <p>Welcome to Macintosh.</p>
                    <div className={styles.bootProgress}>
                      <span />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className={styles.brand} aria-hidden="true">
          <span className={styles.rainbowMark} />
          <span>Macintosh Classic</span>
        </div>

        <button
          type="button"
          className={styles.soundToggle}
          aria-label={
            muted ? "Turn Macintosh sounds on" : "Mute Macintosh sounds"
          }
          aria-pressed={muted}
          title={muted ? "Sound off" : "Sound on"}
          onClick={toggleMuted}
        >
          <SoundIcon muted={muted} />
        </button>
      </div>

      {introActive ? (
        <section
          ref={introStageRef}
          className={styles.intro}
          data-phase={introPhase}
          data-ready={introImageReady}
          aria-label="Portfolio introduction"
        >
          <button
            type="button"
            className={styles.introSoundToggle}
            aria-label={
              muted ? "Turn Macintosh sounds on" : "Mute Macintosh sounds"
            }
            aria-pressed={muted}
            title={muted ? "Sound off" : "Sound on"}
            onClick={toggleMuted}
          >
            <SoundIcon muted={muted} />
            <span>Sound {muted ? "off" : "on"}</span>
          </button>

          <div className={styles.introPhotoLayer} aria-hidden="true">
            <Image
              src={INTRO_IMAGE}
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              quality={90}
              sizes="100vw"
              className={styles.introPhoto}
              onLoad={() => setIntroImageReady(true)}
              onError={finishIntro}
            />
          </div>

          <div className={styles.screenFlight} aria-hidden="true">
            <Image
              src={INTRO_IMAGE}
              alt=""
              width={INTRO_IMAGE_WIDTH}
              height={INTRO_IMAGE_HEIGHT}
              loading="eager"
              fetchPriority="low"
              quality={90}
              className={styles.screenFlightImage}
            />
          </div>

          {introStyle ? (
            <>
              <div className={styles.screenHandoff} aria-hidden="true" />
            </>
          ) : null}

          <div className={styles.introVignette} aria-hidden="true" />

          <button
            ref={enterButtonRef}
            type="button"
            className={styles.enterButton}
            disabled={!introImageReady || introPhase !== "cover"}
            aria-label={
              introImageReady
                ? "Enter Krishang's Macintosh portfolio"
                : "Loading Krishang's Macintosh portfolio"
            }
            aria-busy={!introImageReady}
            onClick={beginIntro}
          >
            <span className={styles.enterEyebrow}>
              Krishang Zinzuwadia · Interactive portfolio
            </span>
            <span className={styles.enterAction}>
              <strong>{introImageReady ? "Enter" : "Loading"}</strong>
              <span aria-hidden="true">→</span>
            </span>
            <small>Macintosh boot · Sound {muted ? "off" : "on"}</small>
          </button>
        </section>
      ) : null}
    </main>
  );
}
