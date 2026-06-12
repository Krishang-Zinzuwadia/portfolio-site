export type TilingMode = "floating" | "tiling";
export type TilingLayout = "master-stack" | "grid" | "monocle";
export type RetroTheme = "system7" | "vaporwave" | "dark-mode";

export interface WindowItem {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  // Coordinates for floating mode
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
  zIndex: number;
}

export interface OSState {
  // View states
  isViewportZoomed: boolean;
  isBypassed3D: boolean;
  isBooted: boolean;

  // Layout settings
  tilingMode: TilingMode;
  tilingLayout: TilingLayout;
  gaps: number;
  splitRatio: number; // Ratio of Master window (0.1 to 0.9)

  // Aesthetic settings
  soundEnabled: boolean;
  crtShaderIntensity: number;
  activeTheme: RetroTheme;

  // Window states
  windows: WindowItem[];
  focusedWindowId: string | null;
  activeDropZone: "left" | "right" | "top" | "bottom" | null;
}

export interface OSActions {
  // View actions
  zoomViewport: (zoom: boolean) => void;
  bypass3D: (bypass: boolean) => void;
  bootSystem: () => void;

  // Window management
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  closeAllWindows: () => void;
  minimizeAllWindows: () => void;
  cleanUpDesktop: () => void;
  updateWindowCoords: (
    id: string,
    coords: Partial<Pick<WindowItem, "x" | "y" | "w" | "h">>
  ) => void;

  // Layout actions
  setTilingMode: (mode: TilingMode) => void;
  setTilingLayout: (layout: TilingLayout) => void;
  setSplitRatio: (ratio: number) => void;
  setGaps: (gaps: number) => void;
  setActiveDropZone: (zone: "left" | "right" | "top" | "bottom" | null) => void;

  // Configuration actions
  toggleSound: () => void;
  setCrtIntensity: (intensity: number) => void;
  changeTheme: (theme: RetroTheme) => void;
}

export type OSStore = OSState & OSActions;
