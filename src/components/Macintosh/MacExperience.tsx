"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import MacDesktop from "./MacDesktop";
import styles from "./MacExperience.module.css";

const MacintoshScene = dynamic(() => import("./MacintoshScene"), {
  ssr: false,
  loading: () => <div className={styles.sceneLoading} aria-hidden="true" />,
});

export default function MacExperience() {
  const [screenFocused, setScreenFocused] = useState(false);
  const focusButtonRef = useRef<HTMLButtonElement>(null);
  const closeFocusRef = useRef<HTMLButtonElement>(null);
  const hasEnteredFocusMode = useRef(false);

  useEffect(() => {
    if (screenFocused) {
      hasEnteredFocusMode.current = true;
      closeFocusRef.current?.focus();
      return;
    }

    if (hasEnteredFocusMode.current) {
      focusButtonRef.current?.focus();
      hasEnteredFocusMode.current = false;
    }
  }, [screenFocused]);

  useEffect(() => {
    if (!screenFocused) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScreenFocused(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenFocused]);

  return (
    <main
      className={`${styles.experience}${screenFocused ? ` ${styles.screenFocused}` : ""}`}
      aria-label="Interactive Macintosh portfolio"
    >
      <h1 className={styles.srOnly}>
        Krishang Zinzuwadia — interactive Macintosh portfolio
      </h1>
      <div className={styles.ambientGrid} aria-hidden="true" />

      {!screenFocused ? (
        <div className={styles.sceneStage}>
          <MacintoshScene />
        </div>
      ) : null}

      <div className={styles.hardwareLabel} aria-hidden="true">
        <span>MACINTOSH CLASSIC</span>
        <span>1990 / 9-INCH CRT / 512 × 342</span>
      </div>

      <div className={styles.identityLabel}>
        <span>KRISHANG ZINZUWADIA</span>
        <strong>PORTFOLIO SYSTEM / ONLINE</strong>
      </div>

      <p className={styles.interactionHint}>
        Double-click—or tap—the desktop icons. Drag windows by their title bars.
      </p>

      {!screenFocused ? (
        <button
          ref={focusButtonRef}
          type="button"
          className={styles.focusButton}
          onClick={() => setScreenFocused(true)}
        >
          Enlarge desktop <span aria-hidden="true">↗</span>
        </button>
      ) : null}

      {screenFocused ? (
        <div
          className={styles.focusOverlay}
          role="dialog"
          aria-label="Enlarged Macintosh desktop"
        >
          <div className={styles.focusHardware}>
            <div className={styles.focusScreen}>
              <MacDesktop />
            </div>
            <div className={styles.focusBrand} aria-hidden="true">
              <span className={styles.rainbowMark} />
              Macintosh Classic
            </div>
          </div>

          <button
            ref={closeFocusRef}
            type="button"
            className={styles.closeFocus}
            onClick={() => setScreenFocused(false)}
          >
            Return to hardware <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : null}
    </main>
  );
}
