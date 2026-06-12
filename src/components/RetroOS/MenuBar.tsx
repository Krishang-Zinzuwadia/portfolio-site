"use client";

import React, { useState, useEffect } from "react";
import { useOSStore } from "@/store/useOSStore";
import { TilingLayout, TilingMode } from "@/store/types";
import { useAudio } from "@/hooks/useAudio";

export default function MenuBar() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showHelpDialog, setShowHelpDialog] = useState(false);
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
      {/* Retro Shortcuts Help Dialog */}
      {showHelpDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999] pointer-events-auto font-geneva">
          <div className="w-[350px] bg-retro-bg border-2 border-black p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black select-text">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-1 mb-3">
              <span className="font-chicago font-bold text-xs uppercase tracking-wider">Keyboard Shortcuts</span>
              <button 
                onClick={() => { playSound("click"); setShowHelpDialog(false); }}
                className="w-4 h-4 border border-black hover:bg-black hover:text-white flex items-center justify-center font-bold text-[9px] cursor-pointer"
              >
                X
              </button>
            </div>
            {/* Content */}
            <div className="text-[11px] space-y-2 leading-relaxed">
              <p className="font-bold border-b border-retro-borderDark border-dashed pb-1">TWM Control Keys (Alt + Key):</p>
              <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1">
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt + J/K</span>
                <span>Cycle active window focus</span>
                
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt+Shift+J/K</span>
                <span>Swap window layout stack</span>
                
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt + Space</span>
                <span>Toggle Tiling vs Floating</span>
                
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt+Shift+Spc</span>
                <span>Cycle tiling formats</span>
                
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt + H/L</span>
                <span>Adjust stack size ratio</span>
                
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt + Enter</span>
                <span>Toggle maximize window</span>
                
                <span className="font-mono font-bold text-retro-borderDarkest bg-white/50 px-1 rounded">Alt + W</span>
                <span>Close focused window</span>
              </div>
            </div>
            {/* Footer */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => { playSound("click"); setShowHelpDialog(false); }}
                className="px-4 py-1 border-2 border-black font-chicago hover:bg-black hover:text-white text-xs cursor-pointer bg-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
