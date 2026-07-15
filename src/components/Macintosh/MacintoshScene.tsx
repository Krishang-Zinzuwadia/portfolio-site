"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ContactShadows, Html, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import MacDesktop from "./MacDesktop";
import styles from "./MacintoshScene.module.css";

const MODEL_URL = "/assets/models/macintosh-classic.glb";

// The Blender source is modeled at Apple-published physical dimensions in meters.
// These values are exported as named anchors in the GLB and kept here as the
// deterministic CSS-to-world bridge for the live 512 × 342 desktop surface.
const MODEL_SCALE = 12;
const SCREEN_CENTER: [number, number, number] = [0, 0.236, 0.1455];
const SCREEN_WIDTH_METERS = 0.181;
const SCREEN_DISTANCE_FACTOR = (SCREEN_WIDTH_METERS * 400) / 512;

type CameraTier = "compact" | "medium" | "wide";

function readCameraTier(): CameraTier {
  if (typeof window === "undefined") return "wide";
  if (window.innerWidth < 700) return "compact";
  if (window.innerWidth < 1100) return "medium";
  return "wide";
}

function useCameraTier() {
  const [tier, setTier] = useState<CameraTier>(readCameraTier);

  useEffect(() => {
    const update = () => setTier(readCameraTier());
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

function MacintoshHardware() {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
      }
    });
  }, [model]);

  return (
    <group position={[0, -1.1, 0]} scale={MODEL_SCALE}>
      <primitive object={model} />

      <Html
        transform
        position={SCREEN_CENTER}
        distanceFactor={SCREEN_DISTANCE_FACTOR}
        zIndexRange={[120, 80]}
        pointerEvents="auto"
      >
        <div
          className={styles.screenSurface}
          aria-label="Interactive System 7 portfolio desktop"
        >
          <MacDesktop />
        </div>
      </Html>
    </group>
  );
}

export default function MacintoshScene() {
  const cameraTier = useCameraTier();
  const cameraPosition: [number, number, number] =
    cameraTier === "compact"
      ? [0, 1.15, 14.2]
      : cameraTier === "medium"
        ? [0, 1.2, 11.4]
        : [0, 1.22, 9.25];

  return (
    <Canvas
      key={cameraTier}
      className={styles.canvas}
      camera={{ position: cameraPosition, fov: 32, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.9, 0.35)}
    >
      <ambientLight intensity={1.15} color="#fff8ea" />
      <hemisphereLight args={["#dfe4ff", "#29261f", 1.8]} />
      <directionalLight
        color="#fff2d6"
        intensity={4.8}
        position={[4.8, 7, 6]}
      />
      <directionalLight color="#7781ff" intensity={2.2} position={[-5, 2, 4]} />
      <pointLight
        color="#caff43"
        intensity={2.8}
        distance={8}
        position={[0, 0.8, 4.5]}
      />

      <Suspense fallback={null}>
        <MacintoshHardware />
        <ContactShadows
          position={[0, -1.02, 0.6]}
          opacity={0.52}
          scale={8}
          blur={2.6}
          far={5}
          frames={1}
          color="#050605"
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
