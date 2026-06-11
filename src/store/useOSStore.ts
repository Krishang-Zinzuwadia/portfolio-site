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
  minimizeWindow: (id) => {},
  maximizeWindow: (id) => {},
  focusWindow: (id) => {},
  updateWindowCoords: (id, coords) => {},

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
