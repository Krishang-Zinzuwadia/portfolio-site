"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/assets/models/krishang-signal-terminal.glb";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function SignalTerminal({ onReady }: { onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const reducedMotion = usePrefersReducedMotion();
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    onReady();
  }, [model, onReady]);

  useFrame((state) => {
    if (!group.current) return;

    const targetX = reducedMotion ? -0.04 : -0.04 + state.pointer.y * 0.07;
    const targetY = reducedMotion ? -0.34 : -0.34 + state.pointer.x * 0.14;
    group.current.rotation.x = targetX;
    group.current.rotation.y = targetY;
  });

  return (
    <group
      ref={group}
      position={[0, -1.08, 0]}
      rotation={[-0.04, -0.34, 0]}
      scale={0.82}
    >
      <primitive object={model} />
    </group>
  );
}

function PointerRenderController() {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    let frame = 0;
    const requestRender = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => invalidate());
    };

    gl.domElement.addEventListener("pointermove", requestRender, {
      passive: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      gl.domElement.removeEventListener("pointermove", requestRender);
    };
  }, [gl, invalidate]);

  return null;
}

export default function TerminalScene({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      className="terminal-canvas"
      camera={{ position: [6.25, 4.45, 9.4], fov: 35, near: 0.1, far: 100 }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="demand"
      shadows
    >
      <ambientLight intensity={1.45} color="#fff7e9" />
      <hemisphereLight args={["#dce8ff", "#1a1b18", 1.3]} />
      <directionalLight
        castShadow
        color="#fff0cf"
        intensity={3.2}
        position={[4.5, 7, 5]}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <pointLight
        color="#a8ff66"
        intensity={5}
        distance={5}
        position={[-1.4, 1.2, 2.5]}
      />
      <pointLight
        color="#6973ff"
        intensity={3}
        distance={6}
        position={[3.4, 0.2, -1.2]}
      />

      <Suspense fallback={null}>
        <PointerRenderController />
        <SignalTerminal onReady={onReady} />
        <ContactShadows
          position={[0, -1.22, 0]}
          opacity={0.42}
          scale={8}
          blur={2.7}
          far={4.2}
          frames={1}
          color="#11120f"
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
