"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Custom component to load the GLTF model safely with fetch check
function CustomModel({ url }: { url: string }) {
  // Drei's useGLTF will load the GLB file
  const { scene } = useGLTF(url);
  
  // Set up shadow casting/receiving on all meshes in the loaded scene
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={[1.8, 1.8, 1.8]} position={[0, -0.6, 0]} />;
}

// Procedural 3D model fallback mimicking a 90s Macintosh SE/30
function ProceduralBezel() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. Main Beveled Outer Casing */}
      <mesh castShadow receiveShadow position={[0, 0.4, -0.4]}>
        <boxGeometry args={[3.2, 3.4, 2.6]} />
        <meshStandardMaterial
          color="#dfd3be" // Retro warm beige/grey
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Front Face Plate (Bezel Frame) */}
      <mesh castShadow position={[0, 0.4, 0.9]}>
        <boxGeometry args={[3.1, 3.3, 0.15]} />
        <meshStandardMaterial
          color="#d5c8b3" // Slightly darker beige for front plate accent
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Screen Bezel Frame Inner Cutout (Darker recess) */}
      <mesh position={[0, 0.65, 0.98]}>
        <boxGeometry args={[2.5, 1.9, 0.05]} />
        <meshStandardMaterial
          color="#b0a390" // Dusty bezel frame shade
          roughness={0.8}
        />
      </mesh>

      {/* 4. Screen Glass Mesh (slightly curved and shiny) */}
      <mesh position={[0, 0.65, 1.01]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[4.2, 32, 32, 0, Math.PI * 2, 0, 0.25]} />
        <meshStandardMaterial
          color="#0d0d0d" // Very dark CRT glass
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* 5. CRT Screen Inset Shadow Border (surrounds the screen glass) */}
      <mesh position={[0, 0.65, 0.99]}>
        <planeGeometry args={[2.35, 1.75]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      {/* 6. Floppy Disk Drive Slot */}
      <group position={[0.6, -0.7, 0.98]}>
        {/* The slot cutout */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.08, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        {/* Floppy drive detail line */}
        <mesh position={[0, -0.08, 0.01]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial color="#888888" roughness={0.5} />
        </mesh>
      </group>

      {/* 7. Ventilation Slits / Grooves (visualized as dark strips on front bottom) */}
      <mesh position={[-0.6, -0.7, 0.98]}>
        <boxGeometry args={[0.8, 0.1, 0.02]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      {/* 8. Retro Logo Badge (small rainbow-like decal box) */}
      <mesh position={[-1.1, -1.0, 0.99]}>
        <boxGeometry args={[0.12, 0.12, 0.03]} />
        <meshStandardMaterial color="#44aa44" roughness={0.5} />
      </mesh>

      {/* 9. Supporting Stand Base */}
      <mesh castShadow position={[0, -1.3, -0.4]}>
        <boxGeometry args={[2.8, 0.15, 2.4]} />
        <meshStandardMaterial color="#d5c8b3" roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function MonitorBezel() {
  const groupRef = useRef<THREE.Group>(null);
  const [hasCustomModel, setHasCustomModel] = useState(false);

  // Check if computer.glb is present on build/runtime to avoid crash
  useEffect(() => {
    fetch("/assets/models/computer.glb", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setHasCustomModel(true);
        }
      })
      .catch(() => {
        // Fallback silently if fetch fails
        setHasCustomModel(false);
      });
  }, []);

  // Gently rotate/drift the monitor group based on mouse movement coordinates
  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    
    // Smooth interpolation (lerp) towards target mouse coordinates
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.07, // Maximum 4 degrees yaw
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -y * 0.04, // Maximum 2.5 degrees pitch
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {hasCustomModel ? (
        <CustomModel url="/assets/models/computer.glb" />
      ) : (
        <ProceduralBezel />
      )}
    </group>
  );
}
