"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useDragControls } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";
import { WindowItem } from "@/store/types";

interface WindowProps {
  windowItem: WindowItem;
  children: React.ReactNode;
  tiledCoords?: { x: number; y: number; w: number; h: number };
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
}

export default function Window({ windowItem, children, tiledCoords, dragConstraints }: WindowProps) {
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
    setTilingMode,
    setTilingLayout,
    setActiveDropZone,
  } = useOSStore();

  const [isCollapsed, setIsCollapsed] = useState(false); // Windowshade state
  const dragControls = useDragControls();

  // Determine coordinate changes based on tiling mode and maximize state
  const isTiled = tilingMode === "tiling" && tiledCoords;
  const currentX = isTiled ? tiledCoords.x : isMaximized ? 0 : fx;
  const currentY = isTiled ? tiledCoords.y : isMaximized ? 0 : fy;

  // Framer Motion motionValues to track coordinate dragging in floating mode
  const mx = useMotionValue(currentX);
  const my = useMotionValue(currentY);

  // Sync state coordinates when they change externally (e.g. from state actions)
  useEffect(() => {
    mx.set(currentX);
    my.set(currentY);
  }, [currentX, currentY, mx, my]);

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

  // Determine width and height depending on state
  const windowWidth = isTiled
    ? tiledCoords.w
    : isMaximized
      ? "100%"
      : fw;

  const windowHeight = isCollapsed
    ? 22
    : isTiled
      ? tiledCoords.h
      : isMaximized
        ? "100%"
        : fh;

  const windowStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    x: mx,
    y: my,
    width: windowWidth,
    height: windowHeight,
    zIndex: zIndex,
  };

  return (
    <motion.div
      layout
      onMouseDown={handleMouseDown}
      style={windowStyle}
      drag={tilingMode === "floating" && !isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragElastic={0.05}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      onDrag={(e, info) => {
        if (tilingMode !== "floating") return;
        const desktopElement = dragConstraints?.current;
        if (!desktopElement) return;

        const rect = desktopElement.getBoundingClientRect();
        const pointerX = info.point.x;
        const pointerY = info.point.y;

        const edgeThreshold = 60; // 60px edge threshold

        if (pointerX < rect.left + edgeThreshold) {
          setActiveDropZone("left");
        } else if (pointerX > rect.right - edgeThreshold) {
          setActiveDropZone("right");
        } else if (pointerY < rect.top + edgeThreshold + 24) {
          setActiveDropZone("top");
        } else if (pointerY > rect.bottom - edgeThreshold) {
          setActiveDropZone("bottom");
        } else {
          setActiveDropZone(null);
        }
      }}
      onDragEnd={() => {
        const activeZone = useOSStore.getState().activeDropZone;
        if (activeZone) {
          playSound("chime");
          setTilingMode("tiling");
          if (activeZone === "left" || activeZone === "right") {
            setTilingLayout("master-stack");
          } else if (activeZone === "top") {
            setTilingLayout("monocle");
          } else if (activeZone === "bottom") {
            setTilingLayout("grid");
          }
          setActiveDropZone(null);
        } else {
          // Commit drag coordinates to store upon release directly from motion values
          updateWindowCoords(id, {
            x: Math.max(0, Math.round(mx.get())),
            y: Math.max(0, Math.round(my.get())),
          });
        }
      }}
      className={`
        flex flex-col bg-retro-bg border-2 border-retro-borderDarkest rounded select-none pointer-events-auto
        ${isFocused ? "shadow-retroActive" : "shadow-[1px_1px_0px_#808080]"}
      `}
    >
      {/* Title Bar Header */}
      <div
        onDoubleClick={handleTitleBarDoubleClick}
        onPointerDown={(e) => {
          if (tilingMode === "floating" && !isMaximized) {
            dragControls.start(e);
          }
        }}
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
