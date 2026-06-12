import { useEffect } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";

export function useKeyboardShortcuts() {
  const { playSound } = useAudio();
  const windows = useOSStore((state) => state.windows);
  const focusedWindowId = useOSStore((state) => state.focusedWindowId);

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

      // Placeholder handlers to be extended incrementally in subsequent commits
      if (key === "j") {
        e.preventDefault();
        console.log("Alt+J triggered");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [windows, focusedWindowId, playSound]);
}
