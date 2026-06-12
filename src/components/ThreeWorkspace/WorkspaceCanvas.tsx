"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import MonitorBezel from "./MonitorBezel";

export default function WorkspaceCanvas() {
  return (
    <div className="w-full h-full absolute inset-0 select-none pointer-events-none z-[1] overflow-hidden bg-[#161616]">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 3.05], fov: 46 }} // Framed tight to maximize screen space
        style={{ width: "100%", height: "100%" }}
      >
        {/* Dark solid background color for WebGL context */}
        <color attach="background" args={["#161616"]} />

        {/* Lighting Setup */}
        <ambientLight intensity={1.4} />
        
        {/* Main Desk Lamp Directional light (casts drop shadows behind casing) */}
        <directionalLight
          castShadow
          position={[4, 6, 3]}
          intensity={2.2}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />

        {/* Soft fill light from left */}
        <directionalLight
          position={[-4, 2, 2]}
          intensity={0.6}
          color="#d0e0ff"
        />

        {/* Emissive CRT screen reflection (subtle blue/cyan glow onto the plastic casing) */}
        <pointLight
          position={[0, 0.5, 1.2]}
          intensity={0.4}
          distance={3}
          color="#a0f0ff"
        />

        {/* Render 3D Monitor Bezel */}
        <Suspense fallback={null}>
          <MonitorBezel />
        </Suspense>
      </Canvas>
    </div>
  );
}
