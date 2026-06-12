"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";
import MenuBar from "@/components/RetroOS/MenuBar";
import Desktop from "@/components/RetroOS/Desktop";
import CRTOverlay from "@/components/RetroOS/CRTOverlay";
import Window from "@/components/RetroOS/Window";
import { useTilingLayout } from "@/hooks/useTilingLayout";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import SimpleText from "@/components/Apps/SimpleText";
import Terminal from "@/components/Apps/Terminal";
import Projects from "@/components/Apps/Projects";
import ControlPanel from "@/components/Apps/ControlPanel";
import Mail from "@/components/Apps/Mail";


export default function Home() {
  const isBooted = useOSStore((state) => state.isBooted);
  const bootSystem = useOSStore((state) => state.bootSystem);
  const isBypassed3D = useOSStore((state) => state.isBypassed3D);
  const isViewportZoomed = useOSStore((state) => state.isViewportZoomed);
  const windows = useOSStore((state) => state.windows);
  
  const { playSound } = useAudio();
  const desktopRef = useRef<HTMLDivElement>(null);
  const { tiledCoords } = useTilingLayout(desktopRef);
  useKeyboardShortcuts();

  // Boot sequence stages: 'insert-disk' | 'happy-mac' | 'welcome' | 'ready'
  const [bootStage, setBootStage] = useState<"insert-disk" | "happy-mac" | "welcome" | "ready">("insert-disk");
  const [progress, setProgress] = useState(0);

  // Run boot animations on initial mount
  useEffect(() => {
    if (isBooted) {
      setBootStage("ready");
      return;
    }

    // 1. Insert disk stage: Flash a question mark disk for 2.5 seconds
    const diskTimer = setTimeout(() => {
      playSound("disk"); // Drive whirring insertion sound
      setBootStage("happy-mac");

      // 2. Happy Mac stage: Show smile face for 1.5 seconds
      const macTimer = setTimeout(() => {
        setBootStage("welcome");
        playSound("chime"); // Play classic Mac OS boot chime!

        // 3. Welcome stage: Load extensions progress bar
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                bootSystem(); // Boot completed!
                setBootStage("ready");
              }, 400);
              return 100;
            }
            return prev + 5;
          });
        }, 100);

      }, 1500);

    }, 2500);

    return () => clearTimeout(diskTimer);
  }, [isBooted, bootSystem, playSound]);

  // Loading Screen Render
  if (bootStage !== "ready") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#555555] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px] select-none text-black">
        <div className="w-[320px] bg-[#c0c0c0] border-2 border-black p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center font-chicago">
          
          {bootStage === "insert-disk" && (
            <div className="flex flex-col items-center justify-center h-[120px] space-y-2">
              {/* Retro Floppy Disk with Flashing ? */}
              <div className="relative w-16 h-16 border-2 border-black bg-white rounded p-1 flex flex-col justify-between">
                <div className="w-full h-4 bg-black/10 border-b border-black"></div>
                <div className="w-10 h-10 border border-black self-center relative flex items-center justify-center">
                  <span className="text-xl font-bold animate-pulse">?</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider">Waiting for System...</span>
            </div>
          )}

          {bootStage === "happy-mac" && (
            <div className="flex flex-col items-center justify-center h-[120px] space-y-2">
              {/* Smiling Happy Mac OS Screen */}
              <div className="w-16 h-16 border-2 border-black bg-white rounded flex flex-col items-center justify-center">
                <span className="text-3xl">☺</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider">System Found!</span>
            </div>
          )}

          {bootStage === "welcome" && (
            <div className="flex flex-col items-center justify-center h-[120px] space-y-4">
              <span className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1">
                Welcome to RetroOS
              </span>
              <div className="w-full text-left space-y-1">
                <div className="text-[9px] uppercase font-bold flex justify-between">
                  <span>Loading Extensions...</span>
                  <span>{progress}%</span>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-4 border-2 border-black bg-white p-[2px]">
                  <div 
                    className="h-full bg-black transition-all duration-100" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Live OS Screen Render (Overlay Illusion)
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1a1a1a] flex justify-center items-center font-geneva">
      
      {/* 3D Monitor Frame Canvas Placeholder Layer (to be filled in Phase 8) */}
      {!isBypassed3D && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
          {/* Simulated beige monitor bezel wrapper */}
          <div className="w-[min(90vw,780px)] aspect-[4/3.2] bg-[#d2c2ad] border-[12px] border-[#c4b39e] rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex justify-center items-center">
            {/* Dark inner bezel shadow */}
            <div className="absolute inset-2 border-[4px] border-[#9c8b77] rounded-[24px]"></div>
            {/* Screen static screen texture */}
            <div className="w-[88%] h-[78%] bg-black rounded-[12px]"></div>
          </div>
        </div>
      )}

      {/* Flat OS Canvas positioned exactly inside the screen bounds */}
      <div 
        className={`
          absolute overflow-hidden bg-retro-bg transition-all duration-300 animate-screen-flare
          ${isBypassed3D || isViewportZoomed 
            ? 'z-20 inset-0 w-full h-full' 
            : 'z-10 aspect-[4/3] w-[min(78vw,660px)] h-auto shadow-[inset_0_0_16px_rgba(0,0,0,0.95)] border-4 border-[#121212] rounded-[8px]'
          }
        `}
      >
        <MenuBar />
        
        <Desktop ref={desktopRef}>
          {windows.map((w) => (
            <Window 
              key={w.id} 
              windowItem={w} 
              dragConstraints={desktopRef}
              tiledCoords={tiledCoords[w.id]}
            >
              {w.id === "about" && <SimpleText />}
              {w.id === "projects" && <Projects />}
              {w.id === "terminal" && <Terminal />}
              {w.id === "settings" && <ControlPanel />}
              {w.id === "contact" && <Mail />}
            </Window>
          ))}
        </Desktop>

        <CRTOverlay />
      </div>
    </div>
  );
}
