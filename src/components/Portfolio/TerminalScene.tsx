"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/assets/models/krishang-signal-terminal.glb";
const CAMERA_POSITION = new THREE.Vector3(6.25, 4.45, 9.4);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function SignalTerminal({
  onReady,
  reducedMotion,
}: {
  onReady: () => void;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(reducedMotion ? 1 : 0);
  const { scene } = useGLTF(MODEL_URL);
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

  useEffect(() => {
    if (reducedMotion) reveal.current = 1;
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (reducedMotion) {
      group.current.position.set(0, -1.08, 0);
      group.current.rotation.set(-0.04, -0.34, 0);
      group.current.scale.setScalar(0.82);
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    reveal.current = THREE.MathUtils.damp(reveal.current, 1, 4.2, delta);
    const revealEase = 1 - Math.pow(1 - reveal.current, 3);
    const float = Math.sin(elapsed * 0.72) * 0.026;
    const sway = Math.sin(elapsed * 0.43 + 0.8) * 0.012;
    const follow = 1 - Math.exp(-delta * 5.5);

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * 0.035,
      follow
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      -1.15 + revealEase * 0.07 + float,
      follow
    );
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      Math.cos(elapsed * 0.55) * 0.018,
      follow
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -0.04 + state.pointer.y * 0.055 + sway,
      follow
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -0.47 + revealEase * 0.13 + state.pointer.x * 0.12,
      follow
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * -0.012 + Math.sin(elapsed * 0.38) * 0.004,
      follow
    );
    group.current.scale.setScalar(0.82 * (0.91 + revealEase * 0.09));
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

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame((state, delta) => {
    const camera = state.camera;
    if (reducedMotion) {
      camera.position.copy(CAMERA_POSITION);
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const targetX = CAMERA_POSITION.x + state.pointer.x * 0.15;
    const targetY =
      CAMERA_POSITION.y +
      state.pointer.y * 0.11 +
      Math.sin(elapsed * 0.3) * 0.025;
    const targetZ = CAMERA_POSITION.z + Math.cos(elapsed * 0.24) * 0.045;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      3.8,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      3.8,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      3.2,
      delta
    );
  });

  return null;
}

function AnimatedLights({ reducedMotion }: { reducedMotion: boolean }) {
  const keyLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!keyLight.current || !rimLight.current || reducedMotion) return;

    const elapsed = state.clock.getElapsedTime();
    keyLight.current.intensity = 5 + Math.sin(elapsed * 1.05) * 0.42;
    keyLight.current.position.x = -1.4 + Math.sin(elapsed * 0.44) * 0.18;
    keyLight.current.position.y = 1.2 + Math.cos(elapsed * 0.58) * 0.1;
    rimLight.current.intensity = 3 + Math.cos(elapsed * 0.74) * 0.3;
    rimLight.current.position.z = -1.2 + Math.sin(elapsed * 0.36) * 0.2;
  });

  return (
    <>
      <pointLight
        ref={keyLight}
        color="#a8ff66"
        intensity={5}
        distance={5}
        position={[-1.4, 1.2, 2.5]}
      />
      <pointLight
        ref={rimLight}
        color="#6973ff"
        intensity={3}
        distance={6}
        position={[3.4, 0.2, -1.2]}
      />
    </>
  );
}

function SignalParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(42 * 3);

    for (let index = 0; index < 42; index += 1) {
      const angle = index * 2.399963;
      const radius = 1.8 + ((index * 17) % 19) * 0.13;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = -0.8 + ((index * 29) % 31) * 0.095;
      values[index * 3 + 2] = -1.5 + ((index * 11) % 23) * 0.14;
    }

    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current || reducedMotion) return;
    points.current.rotation.y += delta * 0.018;
    points.current.position.y =
      Math.sin(state.clock.getElapsedTime() * 0.28) * 0.04;
  });

  return (
    <points ref={points} visible={!reducedMotion} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#91b938"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.38}
        depthWrite={false}
      />
    </points>
  );
}

export default function TerminalScene({
  onReady,
  active = true,
}: {
  onReady: () => void;
  active?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      className="terminal-canvas"
      camera={{
        position: CAMERA_POSITION.toArray(),
        fov: 35,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !reducedMotion ? "always" : "demand"}
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
      <AnimatedLights reducedMotion={reducedMotion} />

      <Suspense fallback={null}>
        <CameraRig reducedMotion={reducedMotion} />
        <SignalParticles reducedMotion={reducedMotion} />
        <SignalTerminal onReady={onReady} reducedMotion={reducedMotion} />
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
