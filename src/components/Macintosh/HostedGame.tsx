"use client";

import { useEffect, useRef } from "react";

import styles from "./HostedGame.module.css";

export type HostedGameId = "minesweeper" | "pacman";

type HostedGameProps = {
  game: HostedGameId;
  isActive: boolean;
};

const GAME_FRAMES: Record<
  HostedGameId,
  {
    src: string;
    title: string;
    sandbox: string;
  }
> = {
  minesweeper: {
    src: "https://cdn.zone.msn.com/assets/games/microsoftminesweeper/buildarkzone/20260328T014347_2.1.12_1115f03_arkzone/index.html",
    title: "Microsoft Minesweeper",
    sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts",
  },
  pacman: {
    src: "/assets/pacman/player.html?rev=official-2",
    title: "PAC-MAN 30th Anniversary Google Doodle",
    sandbox: "allow-pointer-lock allow-scripts",
  },
};

export default function HostedGame({ game, isActive }: HostedGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frame = GAME_FRAMES[game];

  useEffect(() => {
    if (!isActive) return;

    const focusFrame = () => {
      iframeRef.current?.focus({ preventScroll: true });
      iframeRef.current?.contentWindow?.focus();
    };

    const animationFrame = window.requestAnimationFrame(focusFrame);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isActive]);

  return (
    <div className={styles.root} data-hosted-game={game}>
      <iframe
        ref={iframeRef}
        className={styles.frame}
        src={frame.src}
        title={frame.title}
        allow="autoplay; fullscreen; gamepad"
        sandbox={frame.sandbox}
        referrerPolicy="no-referrer"
        onLoad={() => {
          if (!isActive) return;
          iframeRef.current?.focus({ preventScroll: true });
          iframeRef.current?.contentWindow?.focus();
        }}
      />

      {!isActive && (
        <div className={styles.inactiveShield} aria-hidden="true" />
      )}
    </div>
  );
}
