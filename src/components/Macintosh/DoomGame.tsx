"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./DoomGame.module.css";
import type { MacSound } from "./useMacSounds";

const PLAYER_URL = "/assets/doom/player.html";
const MESSAGE_SOURCE = "krishang-portfolio-doom";

type DoomPhase =
  | "loading"
  | "ready"
  | "starting"
  | "running"
  | "paused"
  | "error";

type DoomFrameMessage = {
  source: typeof MESSAGE_SOURCE;
  type: "launcher-ready" | "runtime-event" | "state";
  state?: DoomPhase;
  event?: string;
  message?: string;
};

type DoomGameProps = {
  isActive: boolean;
  muted?: boolean;
  onSound?: (sound: MacSound) => void;
};

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (milliseconds: number) => Promise<void>;
  }
}

const PHASE_LABELS: Record<DoomPhase, string> = {
  loading: "Loading local DOS runtime…",
  ready: "Ready to run the original DOOM.EXE",
  starting: "Mounting DOOM Shareware v1.9…",
  running: "DOOM.EXE is running",
  paused: "Paused while this window is inactive",
  error: "The DOS runtime reported an error",
};

export default function DoomGame({
  isActive,
  muted = false,
  onSound,
}: DoomGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [phase, setPhase] = useState<DoomPhase>("loading");
  const [error, setError] = useState<string | null>(null);

  const postCommand = useCallback((type: string, detail = {}) => {
    iframeRef.current?.contentWindow?.postMessage(
      { source: MESSAGE_SOURCE, type, ...detail },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      const frameWindow = iframeRef.current?.contentWindow;
      const data = event.data as Partial<DoomFrameMessage> | null;

      if (
        event.origin !== window.location.origin ||
        event.source !== frameWindow ||
        data?.source !== MESSAGE_SOURCE
      ) {
        return;
      }

      if (data.type === "launcher-ready") {
        setError(null);
        setPhase("ready");
        return;
      }

      if (data.type === "state" && data.state) {
        setPhase(data.state);
        setError(
          data.state === "error" ? (data.message ?? "Unknown error") : null
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    postCommand("set-active", { active: isActive });
  }, [isActive, postCommand]);

  useEffect(() => {
    postCommand("set-muted", { muted });
  }, [muted, postCommand]);

  useEffect(() => {
    const renderGameToText = () =>
      JSON.stringify({
        game: "DOOM Shareware v1.9",
        runtime: "Original DOOM.EXE under DOS emulation",
        iwad: "DOOM1.WAD",
        episode: "Knee-Deep in the Dead",
        phase,
        active: isActive,
        muted,
        error,
      });
    const advanceTime = (milliseconds: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, Math.max(0, Math.min(milliseconds, 1000)));
      });

    window.render_game_to_text = renderGameToText;
    window.advanceTime = advanceTime;

    return () => {
      if (window.render_game_to_text === renderGameToText) {
        delete window.render_game_to_text;
      }
      if (window.advanceTime === advanceTime) {
        delete window.advanceTime;
      }
    };
  }, [error, isActive, muted, phase]);

  const handleFrameLoad = () => {
    postCommand("set-active", { active: isActive });
    postCommand("set-muted", { muted });
  };

  const requestFullscreen = () => {
    onSound?.("select");
    const frame = iframeRef.current;
    if (!frame?.requestFullscreen) return;
    void frame.requestFullscreen().catch(() => undefined);
  };

  const resetGame = () => {
    onSound?.("open");
    setError(null);
    setPhase("loading");
    postCommand("reset");
  };

  return (
    <div
      className={styles.root}
      data-phase={phase}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
    >
      <div className={styles.gameStage}>
        <iframe
          ref={iframeRef}
          className={styles.playerFrame}
          src={PLAYER_URL}
          title="Original DOOM Shareware v1.9"
          allow="autoplay; fullscreen; gamepad"
          onLoad={handleFrameLoad}
        />

        {!isActive && (
          <div
            className={styles.inactiveShield}
            aria-label="Activate DOOM window"
          >
            <span>Click to activate DOOM</span>
          </div>
        )}
      </div>

      <div className={styles.controlStrip}>
        <div className={styles.runtimeStatus} role="status" aria-live="polite">
          <span
            className={styles.statusLight}
            data-running={phase === "running" ? "true" : undefined}
            aria-hidden="true"
          />
          <span title={error ?? PHASE_LABELS[phase]}>
            {error ?? PHASE_LABELS[phase]}
          </span>
        </div>

        <p className={styles.keys} aria-label="DOOM keyboard controls">
          <kbd>↑↓</kbd> move <kbd>←→</kbd> turn <kbd>Ctrl</kbd> fire{" "}
          <kbd>Space</kbd> use <kbd>Shift</kbd> run
        </p>

        <div className={styles.actions}>
          <span className={styles.soundState}>
            {muted ? "Music + SFX off" : "Original OPL music + SFX on"}
          </span>
          <button type="button" onClick={requestFullscreen}>
            Full Screen
          </button>
          <button
            type="button"
            onClick={resetGame}
            disabled={phase === "loading"}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
