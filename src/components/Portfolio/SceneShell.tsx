"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const TerminalScene = dynamic(() => import("./TerminalScene"), {
  ssr: false,
  loading: () => <div className="scene-loading" aria-hidden="true" />,
});

export default function SceneShell() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div
      className={`scene-shell${isReady ? " scene-is-ready" : ""}`}
      role="img"
      aria-label="Interactive 3D model of Krishang's signal terminal"
    >
      <div className="scene-poster" aria-hidden="true" />
      <TerminalScene onReady={handleReady} />

      <div className="scene-label scene-label-top" aria-hidden="true">
        <span>ORIGINAL BLENDER BUILD</span>
        <span>GLB / REALTIME</span>
      </div>

      <div className="scene-label scene-label-bottom" aria-hidden="true">
        <span className="live-dot" />
        POINTER-REACTIVE SYSTEM OBJECT
      </div>

      <div className="scene-coordinate scene-coordinate-a" aria-hidden="true">
        AI / 27 AGENTS
      </div>
      <div className="scene-coordinate scene-coordinate-b" aria-hidden="true">
        CTF / IND 01
      </div>
    </div>
  );
}
