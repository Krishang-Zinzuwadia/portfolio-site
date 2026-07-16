"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MacDesktop from "./MacDesktop";
import styles from "./MacExperience.module.css";
import { useMacSounds } from "./useMacSounds";

type BootPhase = "idle" | "powerOn" | "happyMac" | "welcome" | "ready";

let hasBootedInThisPage = false;

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

export default function MacExperience() {
  const [bootPhase, setBootPhase] = useState<BootPhase>(() =>
    hasBootedInThisPage ? "ready" : "idle"
  );
  const screenRef = useRef<HTMLDivElement>(null);
  const { muted, playSound, toggleMuted } = useMacSounds();

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

  useEffect(() => {
    if (bootPhase !== "ready") return;
    const frame = window.requestAnimationFrame(() =>
      screenRef.current?.focus()
    );
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

  const bootStatus =
    bootPhase === "ready"
      ? "Desktop ready"
      : bootPhase === "idle"
        ? ""
        : "Starting Macintosh";

  return (
    <main
      className={styles.experience}
      aria-labelledby="macintosh-portfolio-title"
    >
      <h1 id="macintosh-portfolio-title" className={styles.srOnly}>
        Krishang Zinzuwadia — interactive Macintosh portfolio
      </h1>
      <p className={styles.srOnly} role="status" aria-live="polite">
        {bootStatus}
      </p>

      <div className={styles.macintoshDisplay}>
        <div className={styles.screenBezel}>
          <div
            ref={screenRef}
            className={styles.screen}
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
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />
            {muted ? (
              <path d="m16 9 5 6m0-6-5 6" />
            ) : (
              <path d="M16 9c1.7 1.7 1.7 4.3 0 6m2.5-8.5c3 3 3 8 0 11" />
            )}
          </svg>
        </button>
      </div>
    </main>
  );
}
