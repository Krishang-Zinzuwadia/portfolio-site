import { useEffect } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";

export function useKeyboardShortcuts() {
  const { playSound } = useAudio();
  const windows = useOSStore((state) => state.windows);
  const focusedWindowId = useOSStore((state) => state.focusedWindowId);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const maximizeWindow = useOSStore((state) => state.maximizeWindow);
  const tilingMode = useOSStore((state) => state.tilingMode);
  const tilingLayout = useOSStore((state) => state.tilingLayout);
  const setTilingMode = useOSStore((state) => state.setTilingMode);
  const setTilingLayout = useOSStore((state) => state.setTilingLayout);
  const cycleWindowOrder = useOSStore((state) => state.cycleWindowOrder);
  const splitRatio = useOSStore((state) => state.splitRatio);
  const setSplitRatio = useOSStore((state) => state.setSplitRatio);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Guard check: do not trigger shortcuts if focus is inside typing fields
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase();
        const isEditable = tag === "input" || tag === "textarea" || activeEl.hasAttribute("contenteditable");
        if (isEditable) return;
      }

      // 2. Validate Alt key is held down
      if (!e.altKey) return;

      const key = e.key.toLowerCase();

      // Focus Next Window (Alt+J)
      if (key === "j" && !e.shiftKey) {
        e.preventDefault();
        const open = windows.filter((w) => w.isOpen && !w.isMinimized);
        if (open.length <= 1) return;
        const currentIdx = open.findIndex((w) => w.id === focusedWindowId);
        const nextIdx = (currentIdx + 1) % open.length;
        playSound("click");
        focusWindow(open[nextIdx].id);
      }

      // Focus Previous Window (Alt+K)
      if (key === "k" && !e.shiftKey) {
        e.preventDefault();
        const open = windows.filter((w) => w.isOpen && !w.isMinimized);
        if (open.length <= 1) return;
        const currentIdx = open.findIndex((w) => w.id === focusedWindowId);
        const prevIdx = (currentIdx - 1 + open.length) % open.length;
        playSound("click");
        focusWindow(open[prevIdx].id);
      }

      // Maximize / Zoom Window (Alt+Enter)
      if (e.key === "Enter") {
        e.preventDefault();
        if (focusedWindowId) {
          playSound("click");
          maximizeWindow(focusedWindowId);
        }
      }

      // Swap Window Order Stack (Alt+Shift+J/K)
      if (key === "j" && e.shiftKey) {
        e.preventDefault();
        if (focusedWindowId) {
          playSound("click");
          cycleWindowOrder(focusedWindowId, "next");
        }
      }
      if (key === "k" && e.shiftKey) {
        e.preventDefault();
        if (focusedWindowId) {
          playSound("click");
          cycleWindowOrder(focusedWindowId, "prev");
        }
      }

      // Toggle floating vs tiling layouts (Alt+Space)
      // Cycle tiling layouts (Alt+Shift+Space)
      if (e.code === "Space") {
        e.preventDefault();
        if (e.shiftKey) {
          if (tilingMode === "tiling") {
            playSound("click");
            const layouts: ("master-stack" | "grid" | "monocle")[] = ["master-stack", "grid", "monocle"];
            const currentIdx = layouts.indexOf(tilingLayout);
            const nextLayout = layouts[(currentIdx + 1) % layouts.length];
            setTilingLayout(nextLayout);
          }
        } else {
          playSound("click");
          setTilingMode(tilingMode === "floating" ? "tiling" : "floating");
        }
      }

      // Adjust split ratio in tiling layouts (Alt+H/L)
      if (key === "h") {
        e.preventDefault();
        playSound("click");
        setSplitRatio(splitRatio - 0.05);
      }
      if (key === "l") {
        e.preventDefault();
        playSound("click");
        setSplitRatio(splitRatio + 0.05);
      }

      // Close Active Window (Alt+W)
      if (key === "w") {
        e.preventDefault();
        if (focusedWindowId) {
          playSound("click");
          closeWindow(focusedWindowId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    windows,
    focusedWindowId,
    playSound,
    focusWindow,
    closeWindow,
    maximizeWindow,
    tilingMode,
    tilingLayout,
    setTilingMode,
    setTilingLayout,
    cycleWindowOrder,
    splitRatio,
    setSplitRatio,
  ]);}
