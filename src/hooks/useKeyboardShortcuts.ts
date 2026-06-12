import { useEffect } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";

export function useKeyboardShortcuts() {
  const { playSound } = useAudio();
  const windows = useOSStore((state) => state.windows);
  const focusedWindowId = useOSStore((state) => state.focusedWindowId);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const maximizeWindow = useOSStore((state) => state.maximizeWindow);

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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [windows, focusedWindowId, playSound, focusWindow, maximizeWindow]);
}
