"use client";

import React from "react";
import { useOSStore } from "@/store/useOSStore";

export default function CRTOverlay() {
  const crtIntensity = useOSStore((state) => state.crtShaderIntensity);

  if (crtIntensity <= 0) return null;

  return (
    <>
      {/* Bezel glass curvature shadow vignette */}
      <div 
        className="crt-overlay-vignette absolute inset-0 pointer-events-none z-[9999]" 
        style={{ opacity: crtIntensity }} 
      />
      {/* Horizontal scanline screen grid overlay */}
      <div 
        className="crt-scanlines-lines absolute inset-0 pointer-events-none z-[9998] crt-flicker-effect" 
        style={{ opacity: crtIntensity * 0.9 }} 
      />
    </>
  );
}
