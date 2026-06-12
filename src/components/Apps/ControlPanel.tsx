"use client";

import React, { useState } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";

type SettingCategory = "general" | "display" | "layout";

export default function ControlPanel() {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>("general");
  const { playSound } = useAudio();

  const {
    soundEnabled,
    toggleSound,
    crtShaderIntensity,
    setCrtIntensity,
    activeTheme,
    changeTheme,
    isBypassed3D,
    bypass3D,
    isViewportZoomed,
    zoomViewport,
    tilingMode,
    setTilingMode,
    tilingLayout,
    setTilingLayout,
    splitRatio,
    setSplitRatio,
    gaps,
    setGaps,
  } = useOSStore();

  const handleCategoryChange = (category: SettingCategory) => {
    playSound("click");
    setActiveCategory(category);
  };

  const handleThemeChange = (themeName: "system7" | "vaporwave" | "dark-mode") => {
    playSound("chime");
    changeTheme(themeName);
  };

  const handleToggleSound = () => {
    toggleSound();
    // Play test sound if sound is being turned on
    if (!soundEnabled) {
      setTimeout(() => {
        playSound("click");
      }, 50);
    }
  };

  const handleToggleBypass3D = () => {
    playSound("click");
    bypass3D(!isBypassed3D);
  };

  const handleToggleZoom = () => {
    playSound("click");
    zoomViewport(!isViewportZoomed);
  };

  const handleToggleTilingMode = () => {
    playSound("click");
    setTilingMode(tilingMode === "floating" ? "tiling" : "floating");
  };

  const handleLayoutChange = (layout: "master-stack" | "grid" | "monocle") => {
    playSound("click");
    setTilingLayout(layout);
  };

  return (
    <div className="flex h-full w-full bg-[#c0c0c0] text-black font-geneva select-none border border-black shadow-[inset_1px_1px_0px_#fff]">
      {/* Left pane: Control panels menu */}
      <div className="w-[120px] bg-[#d0d0d0] border-r-2 border-black p-2 flex flex-col space-y-1.5 overflow-y-auto">
        <span className="text-[9px] font-chicago font-bold tracking-wider text-retro-inactiveHeader border-b border-black mb-1 pb-0.5 uppercase">
          Settings
        </span>
        
        <button
          onClick={() => handleCategoryChange("general")}
          className={`flex flex-col items-center justify-center p-2 border border-black rounded ${
            activeCategory === "general"
              ? "bg-black text-white shadow-none"
              : "bg-[#c0c0c0] shadow-retro active:shadow-none hover:bg-black/5"
          }`}
        >
          {/* General Icon */}
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-[9px] font-chicago font-bold">General</span>
        </button>

        <button
          onClick={() => handleCategoryChange("display")}
          className={`flex flex-col items-center justify-center p-2 border border-black rounded ${
            activeCategory === "display"
              ? "bg-black text-white shadow-none"
              : "bg-[#c0c0c0] shadow-retro active:shadow-none hover:bg-black/5"
          }`}
        >
          {/* Display Icon */}
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="text-[9px] font-chicago font-bold">Display</span>
        </button>

        <button
          onClick={() => handleCategoryChange("layout")}
          className={`flex flex-col items-center justify-center p-2 border border-black rounded ${
            activeCategory === "layout"
              ? "bg-black text-white shadow-none"
              : "bg-[#c0c0c0] shadow-retro active:shadow-none hover:bg-black/5"
          }`}
        >
          {/* Layout Icon */}
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="9" y1="12" x2="21" y2="12" />
          </svg>
          <span className="text-[9px] font-chicago font-bold">Layout</span>
        </button>
      </div>

      {/* Right pane: Controls container */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-4">
        {/* GENERAL SETTINGS PANEL */}
        {activeCategory === "general" && (
          <div className="space-y-4 text-[11px]">
            <h3 className="font-chicago font-bold border-b border-black pb-1 uppercase text-[10px]">
              General Settings
            </h3>

            {/* Themes Section */}
            <div className="space-y-2">
              <span className="font-bold block">Desktop Theme:</span>
              <div className="flex flex-col space-y-1 pl-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={activeTheme === "system7"}
                    onChange={() => handleThemeChange("system7")}
                    className="accent-black"
                  />
                  <span>System 7 Classic (Chicago Grey)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={activeTheme === "vaporwave"}
                    onChange={() => handleThemeChange("vaporwave")}
                    className="accent-black"
                  />
                  <span>Vaporwave (Teal Grid & Neon Pink)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={activeTheme === "dark-mode"}
                    onChange={() => handleThemeChange("dark-mode")}
                    className="accent-black"
                  />
                  <span>Dark Mode (Carbon & Grey Lines)</span>
                </label>
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="space-y-2 pt-2 border-t border-dotted border-black/30">
              <span className="font-bold block">Audio Effects:</span>
              <label className="flex items-center space-x-2 pl-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={handleToggleSound}
                  className="accent-black"
                />
                <span>Enable System Sound Effects</span>
              </label>
              <div className="flex space-x-2 pl-2 pt-1">
                <button
                  onClick={() => playSound("beep")}
                  disabled={!soundEnabled}
                  className="px-2 py-0.5 border border-black rounded bg-[#c0c0c0] shadow-retro hover:bg-black/5 disabled:opacity-50 active:shadow-none font-bold"
                >
                  Test Beep
                </button>
                <button
                  onClick={() => playSound("chime")}
                  disabled={!soundEnabled}
                  className="px-2 py-0.5 border border-black rounded bg-[#c0c0c0] shadow-retro hover:bg-black/5 disabled:opacity-50 active:shadow-none font-bold"
                >
                  Test Chime
                </button>
                <button
                  onClick={() => playSound("keystroke")}
                  disabled={!soundEnabled}
                  className="px-2 py-0.5 border border-black rounded bg-[#c0c0c0] shadow-retro hover:bg-black/5 disabled:opacity-50 active:shadow-none font-bold"
                >
                  Test Click
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DISPLAY SETTINGS PANEL */}
        {activeCategory === "display" && (
          <div className="space-y-4 text-[11px]">
            <h3 className="font-chicago font-bold border-b border-black pb-1 uppercase text-[10px]">
              Display Settings
            </h3>

            {/* CRT overlay slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span>CRT Scanline Intensity:</span>
                <span>{Math.round(crtShaderIntensity * 100)}%</span>
              </div>
              <div className="flex items-center space-x-3 pl-2">
                <span className="text-[9px] text-[#555]">Min</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={crtShaderIntensity * 100}
                  onChange={(e) => setCrtIntensity(Number(e.target.value) / 100)}
                  className="flex-grow accent-black h-1 bg-[#d0d0d0] border border-black appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-[#555]">Max</span>
              </div>
            </div>

            {/* Screen Toggles */}
            <div className="space-y-2 pt-2 border-t border-dotted border-black/30">
              <span className="font-bold block">Viewport Configurations:</span>
              <div className="flex flex-col space-y-1.5 pl-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBypassed3D}
                    onChange={handleToggleBypass3D}
                    className="accent-black"
                  />
                  <span>Flat Viewport (Bypass 3D Outer Monitor)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isViewportZoomed}
                    onChange={handleToggleZoom}
                    className="accent-black"
                  />
                  <span>Scale Zoom Viewport (Full Screen Fit)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT SETTINGS PANEL */}
        {activeCategory === "layout" && (
          <div className="space-y-4 text-[11px]">
            <h3 className="font-chicago font-bold border-b border-black pb-1 uppercase text-[10px]">
              Window Manager Configuration
            </h3>

            {/* Tiling Mode Toggle */}
            <div className="space-y-2">
              <span className="font-bold block">Window Shell Style:</span>
              <label className="flex items-center space-x-2 pl-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tilingMode === "tiling"}
                  onChange={handleToggleTilingMode}
                  className="accent-black"
                />
                <span>Enable Dynamic Tiling Layouts</span>
              </label>
            </div>

            {tilingMode === "tiling" && (
              <div className="space-y-4 pl-2 pt-2 border-t border-dotted border-black/30">
                {/* Layout Type Selection */}
                <div className="space-y-2">
                  <span className="font-bold block">Tiling Scheme:</span>
                  <div className="flex space-x-2">
                    {(["master-stack", "grid", "monocle"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLayoutChange(l)}
                        className={`px-3 py-1 border border-black rounded text-[10px] font-chicago font-bold ${
                          tilingLayout === l
                            ? "bg-black text-white"
                            : "bg-[#c0c0c0] shadow-retro hover:bg-black/5 active:shadow-none"
                        }`}
                      >
                        {l === "master-stack" ? "Master-Stack" : l === "grid" ? "Grid" : "Monocle"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Split Ratio Slider */}
                {tilingLayout === "master-stack" && (
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>Stack Split Ratio:</span>
                      <span>{Math.round(splitRatio * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-2 pl-1">
                      <span className="text-[9px]">Stack</span>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={splitRatio * 100}
                        onChange={(e) => setSplitRatio(Number(e.target.value) / 100)}
                        className="flex-grow accent-black h-1 bg-[#d0d0d0] border border-black appearance-none cursor-pointer"
                      />
                      <span className="text-[9px]">Master</span>
                    </div>
                  </div>
                )}

                {/* Gaps Adjustment */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Layout Gaps:</span>
                    <span>{gaps} px</span>
                  </div>
                  <div className="flex items-center space-x-3 pl-1">
                    <span className="text-[9px]">None</span>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={gaps}
                      onChange={(e) => setGaps(Number(e.target.value))}
                      className="flex-grow accent-black h-1 bg-[#d0d0d0] border border-black appearance-none cursor-pointer"
                    />
                    <span className="text-[9px]">32px</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
