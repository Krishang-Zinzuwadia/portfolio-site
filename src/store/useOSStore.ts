import { create } from "zustand";
import { OSStore } from "./types";
import { initialWindows } from "./initialWindows";

export const useOSStore = create<OSStore>((set, get) => ({
  // --- Initial State ---
  isViewportZoomed: false,
  isBypassed3D: false,
  isBooted: false,

  tilingMode: "floating",
  tilingLayout: "master-stack",
  gaps: 8,
  splitRatio: 0.6,

  soundEnabled: true,
  crtShaderIntensity: 0.8,
  activeTheme: "system7",

  windows: initialWindows,
  focusedWindowId: null,

  // --- View Actions ---
  zoomViewport: (zoom) => set({ isViewportZoomed: zoom }),
  bypass3D: (bypass) => set({ isBypassed3D: bypass }),
  bootSystem: () => set({ isBooted: true }),

  // --- Window Management ---
  openWindow: (id) => {
    set((state) => {
      const windows = state.windows.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false } : w
      );
      return { windows };
    });
    get().focusWindow(id);
  },
  closeWindow: (id) =>
    set((state) => {
      const windows = state.windows.map((w) =>
        w.id === id ? { ...w, isOpen: false } : w
      );
      // Determine the next highest window in the z-index stack to auto-focus
      const remaining = windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex);
      const nextFocusedId = remaining.length > 0 ? remaining[0].id : null;
      return { windows, focusedWindowId: nextFocusedId };
    }),
  minimizeWindow: (id) =>
    set((state) => {
      const windows = state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );
      // If the minimized window was focused, transfer focus to next highest window
      let nextFocusedId = state.focusedWindowId;
      if (state.focusedWindowId === id) {
        const remaining = windows
          .filter((w) => w.isOpen && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex);
        nextFocusedId = remaining.length > 0 ? remaining[0].id : null;
      }
      return { windows, focusedWindowId: nextFocusedId };
    }),
  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    })),
  focusWindow: (id) =>
    set((state) => {
      if (state.focusedWindowId === id) return {};
      const targetWindow = state.windows.find((w) => w.id === id);
      if (!targetWindow) return {};

      // Filter out target, then sort others by current depth (z-index)
      const otherWindows = state.windows
        .filter((w) => w.id !== id)
        .sort((a, b) => a.zIndex - b.zIndex);

      // Re-index others starting at base 10 to keep stack clean and low
      const reindexedOthers = otherWindows.map((w, idx) => ({
        ...w,
        zIndex: 10 + idx,
      }));

      // Set target window to top z-index and ensure it is un-minimized
      const updatedFocusedWindow = {
        ...targetWindow,
        isMinimized: false,
        zIndex: 10 + reindexedOthers.length,
      };

      const windows = state.windows.map((w) => {
        if (w.id === id) return updatedFocusedWindow;
        const matchingOther = reindexedOthers.find((o) => o.id === w.id);
        return matchingOther ? matchingOther : w;
      });

      return { windows, focusedWindowId: id };
    }),
  updateWindowCoords: (id, coords) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, ...coords } : w
      ),
    })),

  // --- Layout Actions (Skeletons) ---
  setTilingMode: (mode) => {},
  setTilingLayout: (layout) => {},
  setSplitRatio: (ratio) => {},
  setGaps: (gaps) => {},

  // --- Configuration Actions (Skeletons) ---
  toggleSound: () => {},
  setCrtIntensity: (intensity) => {},
  changeTheme: (theme) => {},
}));
