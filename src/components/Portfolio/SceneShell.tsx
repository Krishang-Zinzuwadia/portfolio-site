"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const TerminalScene = dynamic(() => import("./TerminalScene"), {
  ssr: false,
  loading: () => <div className="scene-loading" aria-hidden="true" />,
});

export default function SceneShell() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const handleReady = useCallback(() => setIsReady(true), []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let isIntersecting = true;
    const updateActivity = () =>
      setIsActive(isIntersecting && document.visibilityState === "visible");
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateActivity();
      },
      { rootMargin: "120px", threshold: 0.01 }
    );

    observer.observe(shell);
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, []);

  return (
    <div
      ref={shellRef}
      className={`scene-shell${isReady ? " scene-is-ready" : ""}`}
      role="img"
      aria-label="Interactive 3D model built for Krishang's portfolio"
    >
      <div className="scene-poster" aria-hidden="true" />
      <TerminalScene onReady={handleReady} active={isActive} />

      <div className="scene-label scene-label-top" aria-hidden="true">
        <span>INTERACTIVE 3D MODEL</span>
        <span>WEBGL</span>
      </div>

      <div className="scene-label scene-label-bottom" aria-hidden="true">
        <span className="live-dot" />
        MOVE YOUR POINTER TO EXPLORE
      </div>
    </div>
  );
}
