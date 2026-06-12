"use client";

import React, { useState, useEffect } from "react";
import { useOSStore } from "@/store/useOSStore";
import { TilingLayout, TilingMode } from "@/store/types";
import { useAudio } from "@/hooks/useAudio";

export default function MenuBar() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { playSound } = useAudio();

  const {
    tilingMode,
    tilingLayout,
    activeTheme,
    setTilingMode,
    setTilingLayout,
    openWindow,
    changeTheme,
    cleanUpDesktop,
    minimizeAllWindows,
    closeAllWindows,
  } = useOSStore();

  // Clock ticks every 10 seconds
  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    tick();
    const timer = setInterval(tick, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleLayoutChange = (mode: TilingMode, layout?: TilingLayout) => {
    playSound("click");
    setTilingMode(mode);
    if (layout) {
      setTilingLayout(layout);
    }
  };

  const handleAppleClick = () => {
    playSound("click");
    openWindow("about");
  };

  const handleThemeChange = (theme: typeof activeTheme) => {
    playSound("click");
    changeTheme(theme);
  };

  return (
    <div className="relative h-6 w-full bg-retro-bg border-b-2 border-retro-borderDarkest flex items-center justify-between px-3 text-xs font-chicago shadow-[inset_1px_1px_0px_#fff,-1px_-1px_0px_#808080] select-none z-[9900]">
      {/* Left items */}
      <div className="flex items-center space-x-4">
        {/* Apple Logo Menu */}
        <button
          onClick={handleAppleClick}
          className="font-bold hover:bg-black hover:text-white px-2 py-0.5 rounded cursor-pointer"
        >
          
        </button>

        {/* Layout Mode Dropdown Menu wrapper */}
        <div className="group relative">
          <button className="hover:bg-black hover:text-white px-2 py-0.5 rounded cursor-pointer font-bold">
            Layouts
          </button>
          <div className="absolute left-0 mt-0.5 w-44 bg-retro-bg border-2 border-retro-borderDarkest shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hidden group-hover:block z-[9999]">
            <button
              onClick={() => handleLayoutChange("floating")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between ${
                tilingMode === "floating" ? "font-bold" : ""
              }`}
            >
              <span>Floating Mode</span>
              {tilingMode === "floating" && <span>✓</span>}
            </button>
            <hr className="border-t border-retro-borderDark border-dashed" />
            <button
              onClick={() => handleLayoutChange("tiling", "master-stack")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between ${
                tilingMode === "tiling" && tilingLayout === "master-stack"
                  ? "font-bold"
                  : ""
              }`}
            >
              <span>Master & Stack</span>
              {tilingMode === "tiling" && tilingLayout === "master-stack" && (
                <span>✓</span>
              )}
            </button>
            <button
              onClick={() => handleLayoutChange("tiling", "grid")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between ${
                tilingMode === "tiling" && tilingLayout === "grid" ? "font-bold" : ""
              }`}
            >
              <span>Grid Layout</span>
              {tilingMode === "tiling" && tilingLayout === "grid" && <span>✓</span>}
            </button>
            <button
              onClick={() => handleLayoutChange("tiling", "monocle")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between ${
                tilingMode === "tiling" && tilingLayout === "monocle" ? "font-bold" : ""
              }`}
            >
              <span>Monocle (Tabbed)</span>
              {tilingMode === "tiling" && tilingLayout === "monocle" && <span>✓</span>}
            </button>
          </div>
        </div>

        {/* Theme Menu */}
        <div className="group relative">
          <button className="hover:bg-black hover:text-white px-2 py-0.5 rounded cursor-pointer">
            Themes
          </button>
          <div className="absolute left-0 mt-0.5 w-36 bg-retro-bg border-2 border-retro-borderDarkest shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hidden group-hover:block z-[9999]">
            <button
              onClick={() => handleThemeChange("system7")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white ${
                activeTheme === "system7" ? "font-bold" : ""
              }`}
            >
              System 7 Grey
            </button>
            <button
              onClick={() => handleThemeChange("vaporwave")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white ${
                activeTheme === "vaporwave" ? "font-bold" : ""
              }`}
            >
              Vaporwave Teal
            </button>
            <button
              onClick={() => handleThemeChange("dark-mode")}
              className={`w-full text-left px-3 py-1 hover:bg-black hover:text-white ${
                activeTheme === "dark-mode" ? "font-bold" : ""
              }`}
            >
              Dark Mode
            </button>
          </div>
        </div>

        {/* Special Menu */}
        <div className="group relative">
          <button className="hover:bg-black hover:text-white px-2 py-0.5 rounded cursor-pointer">
            Special
          </button>
          <div className="absolute left-0 mt-0.5 w-40 bg-retro-bg border-2 border-retro-borderDarkest shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hidden group-hover:block z-[9999]">
            <button
              onClick={() => {
                playSound("click");
                cleanUpDesktop();
              }}
              className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
            >
              Clean Up Desktop
            </button>
            <button
              onClick={() => {
                playSound("click");
                minimizeAllWindows();
              }}
              className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
            >
              Minimize All
            </button>
            <button
              onClick={() => {
                playSound("click");
                closeAllWindows();
              }}
              className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
            >
              Close All Windows
            </button>
            <hr className="border-t border-retro-borderDark border-dashed" />
            <button
              onClick={() => {
                playSound("beep");
              }}
              className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
            >
              Beep Sound
            </button>
          </div>
        </div>
      </div>

      {/* Right side (System Clock) */}
      <div className="flex items-center space-x-2 font-bold pr-1">
        <span>{mounted ? currentTime : "--:--"}</span>
      </div>
    </div>
  );
}
