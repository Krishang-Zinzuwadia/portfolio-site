"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";
import { WindowItem } from "@/store/types";

interface WindowProps {
  windowItem: WindowItem;
  children: React.ReactNode;
  tiledCoords?: { x: number; y: number; w: number; h: number };
}

export default function Window({ windowItem, children, tiledCoords }: WindowProps) {
  const { id, title, isOpen, isMinimized, isMaximized, x: fx, y: fy, w: fw, h: fh, zIndex } = windowItem;
  const { playSound } = useAudio();

  const {
    tilingMode,
    focusedWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowCoords,
  } = useOSStore();

  const [isCollapsed, setIsCollapsed] = useState(false); // Windowshade state

  // Framer Motion motionValues to track coordinate dragging in floating mode
  const mx = useMotionValue(fx);
  const my = useMotionValue(fy);

  // Sync state coordinates when they change externally (e.g. from state actions)
  useEffect(() => {
    mx.set(fx);
    my.set(fy);
  }, [fx, fy, mx, my]);

  if (!isOpen || isMinimized) return null;

  const isFocused = focusedWindowId === id;

  // Click on any part of the window elevates its z-index
  const handleMouseDown = () => {
    if (!isFocused) {
      focusWindow(id);
    }
  };

  // Close Window
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("click");
    closeWindow(id);
  };

  // Maximize Window
  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("click");
    maximizeWindow(id);
  };

  // Title bar double click rolls window up (Windowshade)
  const handleTitleBarDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("click");
    setIsCollapsed(!isCollapsed);
  };

  // Custom mouse resize handler
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);

    const startW = fw;
    const startH = fh;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaW = moveEvent.clientX - startX;
      const deltaH = moveEvent.clientY - startY;

      updateWindowCoords(id, {
        w: Math.max(windowItem.minW, startW + deltaW),
        h: Math.max(windowItem.minH, startH + deltaH),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Determine the display positioning style based on active window manager layout
  const isTiled = tilingMode === "tiling" && tiledCoords;
  const currentCoords = isTiled 
    ? tiledCoords 
    : isMaximized 
      ? { x: 0, y: 0, w: 1024, h: 744 } // Maximize covers desktop dimensions
      : { x: fx, y: fy, w: fw, h: fh };

  const windowStyle = isTiled
    ? {
        position: "absolute" as const,
        left: currentCoords.x,
        top: currentCoords.y,
        width: currentCoords.w,
        height: isCollapsed ? 22 : currentCoords.h,
        zIndex: zIndex,
      }
    : {
        position: "absolute" as const,
        left: isMaximized ? 0 : fx,
        top: isMaximized ? 0 : fy,
        width: isMaximized ? "100%" : fw,
        height: isCollapsed ? 22 : isMaximized ? "100%" : fh,
        zIndex: zIndex,
      };

  return (
    <motion.div
      onMouseDown={handleMouseDown}
      style={windowStyle}
      drag={tilingMode === "floating" && !isMaximized}
      dragHandleClassName="window-titlebar"
      dragElastic={0.05}
      dragMomentum={false}
      onDragEnd={(e, info) => {
        // Commit drag coordinates to store upon release
        updateWindowCoords(id, {
          x: Math.max(0, fx + info.offset.x),
          y: Math.max(0, fy + info.offset.y),
        });
      }}
      className={`
        flex flex-col bg-retro-bg border-2 border-retro-borderDarkest rounded select-none pointer-events-auto
        ${isFocused ? "shadow-retroActive" : "shadow-[1px_1px_0px_#808080]"}
      `}
    >
      {/* Title Bar Header */}
      <div
        onDoubleClick={handleTitleBarDoubleClick}
        className="window-titlebar h-5 border-b border-black flex items-center justify-between px-1 bg-retro-bg cursor-move relative"
      >
        {/* Left Side: Close square box */}
        <button
          onClick={handleClose}
          className="w-3.5 h-3.5 border border-black hover:bg-black flex items-center justify-center cursor-pointer bg-white"
          title="Close Window"
        />

        {/* Center: Title stripes and Text */}
        <div className="flex-1 px-3 flex items-center justify-center relative overflow-hidden h-full">
          {/* Chicago active grey horizontal lines overlay */}
          {isFocused && (
            <div 
              className="absolute inset-x-2 h-2.5 top-[5px] pointer-events-none" 
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, #808080, #808080 1px, transparent 1px, transparent 2px)",
                backgroundSize: "100% 2px",
              }}
            />
          )}
          <span 
            className={`
              relative z-10 px-2 bg-retro-bg text-[10px] font-chicago font-bold tracking-wide truncate max-w-[80%]
              ${isFocused ? "text-retro-activeHeader" : "text-retro-inactiveHeader"}
            `}
          >
            {title}
          </span>
        </div>

        {/* Right Side: Rollup & Maximize Boxes */}
        <div className="flex items-center space-x-1">
          {/* Minimize / Collapse Window */}
          <button
            onClick={() => {
              playSound("click");
              minimizeWindow(id);
            }}
            className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[8px] hover:bg-[#808080] bg-white cursor-pointer"
            title="Minimize"
          >
            _
          </button>
          
          {/* Maximize Window */}
          <button
            onClick={handleZoom}
            className="w-3.5 h-3.5 border border-black flex items-center justify-center hover:bg-[#808080] bg-white cursor-pointer"
            title="Maximize"
          >
            <div className="w-1.5 h-1.5 border border-black" />
          </button>
        </div>
      </div>

      {/* Window Content Display */}
      <div 
        className={`
          flex-1 overflow-auto bg-white p-3 text-black text-sm select-text
          ${isCollapsed ? "hidden" : "block"}
        `}
      >
        {children}
      </div>

      {/* Bottom Resize Handle (only visible in floating mode when not collapsed or maximized) */}
      {tilingMode === "floating" && !isMaximized && !isCollapsed && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize select-none bg-retro-bg border-t border-l border-black z-20 flex items-center justify-center flex-wrap p-0.5"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "3px 3px"
          }}
        />
      )}
    </motion.div>
  );
}
