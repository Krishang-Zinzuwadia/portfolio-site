# Design Specification: Retro 90s Desktop Portfolio Simulator

This document details the technical stack, system architecture, module designs, mathematical layout logic for the tiling manager, and implementation phases for the portfolio project.

---

## 1. Technology Stack Selection

To achieve a premium, high-performance, and visually striking experience, the following technology stack is selected:

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Core Framework** | **Next.js 14+ (App Router)** | Robust routing, server-side rendering/optimization options, and standardized modern development structure. |
| **3D Rendering** | **Three.js / React Three Fiber (R3F)** | Renders the 3D computer model bezel frame in a background WebGL canvas to create a physical depth illusion. |
| **3D helper library** | **@react-three/drei** | Provides `<useGLTF>` to load the 90s monitor model and basic lighting/camera setups. |
| **State Management** | **Zustand** | Lightweight (1.5kb), high performance, store outside React render tree (avoids unnecessary renders), ideal for coordinate tracking, layout mode, and window states. |
| **Styling & System** | **Tailwind CSS + shadcn/ui** | Tailwind for rapid layout assembly and retro pixel-grid styling. Shadcn/ui for accessible, modular interactive primitives (menus, dialouges, forms) styled with retro CSS/Tailwind classes. |
| **Animation Engine** | **Framer Motion** | Controls fullscreen screen scale transitions, window resizing animations, popups, and the desktop startup sequence. |
| **Audio Synthesis** | **HTML5 Audio API** | Plays lightweight, preloaded WAV/MP3 sound effects (click, keystrokes, disk chime) with minimal latency. |

---

## 2. Directory & Component Structure

The project will follow standard Next.js App Router conventions with TypeScript and Tailwind CSS v3:

```
portfolio-site/
├── public/
│   ├── assets/
│   │   ├── models/           # 90s monitor GLTF/GLB models
│   │   └── audio/            # System sound effects (click, startup, chime)
│   └── fonts/                # Chicago.ttf, Geneva.ttf, Chicago-pixel.woff2
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with Google Fonts & global stylesheet
│   │   ├── page.tsx          # Core client landing page coordinating 3D & OS overlays
│   │   └── globals.css       # Tailwind CSS v3 & global CRT styling rules
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (dialog, tooltip, input, form)
│   │   ├── ThreeWorkspace/   # 3D Canvas elements
│   │   │   ├── MonitorBezel.tsx # CRT monitor WebGL model frame
│   │   │   └── WorkspaceCanvas.tsx # Main 3D Canvas setup & lights
│   │   ├── RetroOS/          # 2D OS Simulation elements
│   │   │   ├── MenuBar.tsx   # Top Mac Menu (Apple logo, Tiling, Settings, Clock)
│   │   │   ├── Desktop.tsx   # Icon grids, desktop context, trash can
│   │   │   ├── Window.tsx    # Custom draggable window shell (Floating/Tiling wrapper)
│   │   │   └── CRTOverlay.tsx# Scanline overlay, screen flicker, corner curves
│   │   └── Apps/             # Applications inside windows
│   │       ├── SimpleText.tsx# Markdown viewer (About Me)
│   │       ├── Projects.tsx  # Double-click Finder-like project navigator
│   │       ├── Terminal.tsx  # Interactive input/output CLI command engine
│   │       ├── ControlPanel.tsx# Toggles for sound, tiling layout splits, CRT strength
│   │       └── Mail.tsx      # Retro email composer form
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts # TWM hotkey listener
│   │   └── useAudio.ts       # Preloaded audio engine
│   └── store/
│       └── useOSStore.ts     # Zustand state manager (window lists, tiling layouts, settings)
├── tailwind.config.js        # Tailwind CSS v3 configurations
├── postcss.config.js         # PostCSS configuration for Tailwind v3
├── tsconfig.json             # TypeScript config with paths mapping (@/*)
├── package.json
```

---

## 3. System Architecture & State Management

The core state of the OS (window sizes, active applications, tiling layouts, system settings) resides in a centralized Zustand store (`useOSStore.js`). This isolates state logic from R3F rendering and makes testing straightforward.

### 3.1. Store Interface Schema (`useOSStore.js`)

```javascript
import { create } from 'zustand';

const useOSStore = create((set, get) => ({
  // --- View States ---
  isViewportZoomed: false,     // Is the screen viewport zoomed to fullscreen (hiding the bezel)?
  isBypassed3D: false,         // Should we bypass the 3D workspace (mobile/performance mode)?
  isBooted: false,             // Has the boot startup sequence finished?

  // --- OS Settings ---
  tilingMode: 'floating',      // 'floating' | 'tiling'
  tilingLayout: 'master-stack',// 'master-stack' | 'grid' | 'monocle'
  gaps: 8,                     // Gap size in pixels between tiled windows
  splitRatio: 0.6,             // Master pane size ratio (0.1 to 0.9)
  soundEnabled: true,
  crtShaderIntensity: 0.8,     // Control scanlines/flicker visibility
  activeTheme: 'system7',      // 'system7' | 'vaporwave' | 'dark-mode'

  // --- Window Management ---
  windows: [
    /* Schema:
    {
      id: 'terminal',
      title: 'MacTerminal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      // Floating coordinates (used only in floating mode)
      x: 100, y: 80, w: 600, h: 400,
      minW: 300, minH: 200,
      zIndex: 10
    }
    */
  ],
  focusedWindowId: null,

  // --- Actions ---
  zoomViewport: (zoom) => set({ isViewportZoomed: zoom }),
  bypass3D: (bypass) => set({ isBypassed3D: bypass }),
  bootSystem: () => set({ isBooted: true }),
  
  openWindow: (id) => set((state) => { ... }),
  closeWindow: (id) => set((state) => { ... }),
  minimizeWindow: (id) => set((state) => { ... }),
  focusWindow: (id) => set((state) => { ... }),
  
  updateWindowCoords: (id, coords) => set((state) => { ... }),
  setTilingMode: (mode) => set({ tilingMode: mode }),
  setTilingLayout: (layout) => set({ tilingLayout: layout }),
  setSplitRatio: (ratio) => set({ splitRatio: ratio }),
  changeTheme: (theme) => set({ activeTheme: theme }),
}));
```

---

## 4. Tiling Window Manager Layout Mathematics

When `tilingMode = 'tiling'`, the position (`x, y`) and size (`w, h`) of each open, non-minimized window are computed dynamically. We ignore their stored floating coordinates and slice the workspace canvas.

### 4.1. Workspace Boundary Constants
* Desktop Width: $W$ (e.g., $1024\text{px}$)
* Desktop Height: $H$ (e.g., $768\text{px}$ minus Menu Bar height $24\text{px}$)
* Gaps: $g$ (pixels)

Let the active tiled window list be: $W_{\text{active}} = \{ w_0, w_1, \dots, w_{N-1} \}$ where $N = |W_{\text{active}}|$.

---

### 4.2. Layout Layout Algorithms

```
MASTER & STACK LAYOUT                     GRID LAYOUT
+------------------+---------+            +------------+------------+
|                  |  w_1    |            |            |            |
|                  +---------+            |    w_0     |    w_1     |
|     w_0          |  w_2    |            |            |            |
|   (Master)       +---------+            +------------+------------+
|                  |  w_3    |            |            |            |
|                  +---------+            |    w_2     |    w_3     |
+------------------+---------+            +------------+------------+
```

#### A. Master & Stack Layout (`master-stack`)
The first opened or focused window ($w_0$) is designated the "Master". The remaining $N-1$ windows stack vertically in the secondary pane.

* **Single Window ($N = 1$)**:
  $$x = g, \quad y = g, \quad w = W - 2g, \quad h = H - 2g$$

* **Multiple Windows ($N > 1$)**:
  * **Master Window ($w_0$)**:
    $$x = g, \quad y = g, \quad w = (W \times \text{splitRatio}) - \frac{3}{2}g, \quad h = H - 2g$$
  
  * **Stacked Windows ($w_i$ for $i \in [1, N-1]$)**:
    Let Stack Width be: $W_{\text{stack}} = W \times (1 - \text{splitRatio}) - \frac{3}{2}g$
    Let height of each stacked window be: $H_{\text{stacked}} = \frac{H - (N \times g)}{N - 1}$
    
    For the $i$-th stack window (using 1-based index $i$):
    $$x = (W \times \text{splitRatio}) + \frac{1}{2}g$$
    $$y = i \times g + (i - 1) \times H_{\text{stacked}}$$
    $$w = W_{\text{stack}}$$
    $$h = H_{\text{stacked}}$$

---

#### B. Grid Layout (`grid`)
Windows are split evenly into columns and rows based on screen division.
* Columns count: $C = \lceil\sqrt{N}\rceil$
* Rows count: $R = \lceil N / C\rceil$
* Average Cell Width: $W_{\text{cell}} = \frac{W - (C + 1)g}{C}$
* Average Cell Height: $H_{\text{cell}} = \frac{H - (R + 1)g}{R}$

For window $w_k$ (where $k \in [0, N-1]$):
* Row index: $r = \lfloor k / C \rfloor$
* Column index: $c = k \pmod C$

* Coordinates:
  $$x = (c + 1)g + c \times W_{\text{cell}}$$
  $$y = (r + 1)g + r \times H_{\text{cell}}$$
  $$w = W_{\text{cell}}$$
  $$h = H_{\text{cell}}$$

* *Edge Case adjustment*: If the last row contains fewer windows than $C$, stretch their widths to cover the empty columns.
  Let the count of windows in the last row be $L = N - (R - 1)C$.
  If $r = R-1$, the width is recalculated as:
  $$W_{\text{cell\_last}} = \frac{W - (L + 1)g}{L}$$
  $$x = (c + 1)g + c \times W_{\text{cell\_last}}$$
  $$w = W_{\text{cell\_last}}$$

---

#### C. Monocle Layout (`monocle`)
The currently focused window takes 100% of the screen area, acting like a fullscreen tabbed layout.
* For focused window $w_k$:
  $$x = g, \quad y = g, \quad w = W - 2g, \quad h = H - 2g$$
* All other windows ($w_j$ where $j \neq k$) are set to display: `none` or positioned offscreen.

---

## 5. Integrating the 3D Bezel Frame and 2D OS (The Illusion)

Rather than projecting the interactive DOM inside WebGL using Drei's CSS3D renderer, we use a hybrid layout where a standard 2D flat React app (`<RetroOS />`) is layered **directly over** the screen region of the 3D bezel container using absolute CSS coordinates. 

This provides a flawless 100% native browser typing/scrolling experience, keeping events pixel-perfect without visual skewing.

```
+-----------------------------------------------------------------+
|  ROOT CONTAINER (.app-container, relative)                     |
|                                                                 |
|  1. BASE LAYER: THREE.JS CANVAS (Absolute, Full Screen)        |
|     - Renders 3D Monitor Casing / Bezel                         |
|     - Camera locked facing the screen bezel flatly              |
|                                                                 |
|  2. INTERACTIVE LAYER: RetroOS (Absolute Overlay, Indexed High) |
|     - Scaled and centered to fit precisely inside the monitor   |
|       screen bezel boundaries:                                  |
|       width: 68%, height: 52%, top: 18%, left: 16% (responsive) |
|                                                                 |
|  3. EFFECTS LAYER: CRTOverlay (Absolute, pointer-events: none)  |
|     - Scanlines, screen shadow vignette, color aberration       |
+-----------------------------------------------------------------+
```

### 5.1. The Layer Layout Component (`src/app/page.tsx` Outline)

Here is how the main page coordinates the Three.js 3D monitor frame and the flat interactive `<RetroOS>` application using App Router conventions:

```tsx
"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useOSStore } from '@/store/useOSStore';
import MonitorBezel from '@/components/ThreeWorkspace/MonitorBezel';
import RetroOS from '@/components/RetroOS/RetroOS';
import CRTOverlay from '@/components/RetroOS/CRTOverlay';

export default function Home() {
  const isBypassed3D = useOSStore((state) => state.isBypassed3D);
  const isBooted = useOSStore((state) => state.isBooted);

  return (
    <div className="app-container">
      {/* 1. The 3D Monitor Bezel Canvas (Background Visual Framing) */}
      {!isBypassed3D && (
        <div className="three-canvas-container">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 2, 2]} intensity={1.5} />
            {/* Renders the 3D beige monitor frame pointing forward */}
            <MonitorBezel />
          </Canvas>
        </div>
      )}

      {/* 2. Interactive Retro OS Canvas nested inside Bezel bounds */}
      <div 
        className={`screen-viewport ${isBypassed3D ? 'fullscreen-mode' : 'bezel-aligned-mode'}`}
      >
        <RetroOS />
        
        {/* 3. CRT Scanlines & Visual Warp Effects Layer */}
        <CRTOverlay />
      </div>
    </div>
  );
}
```

### 5.2. Aligning the Screen with Bezel (Tailwind CSS)

Using Tailwind utility classes, the viewport scaling and alignment coordinates are applied directly to the JSX. Custom arbitrary values `[...]` align the 2D desktop screen exactly over the 3D bezel mockup.

#### JSX Implementation
```tsx
// src/app/page.tsx
<div className="relative w-screen h-screen overflow-hidden bg-[#1a1a1a] flex justify-center items-center">
  {/* WebGL 3D Monitor Base layer */}
  {!isBypassed3D && (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas> ... </Canvas>
    </div>
  )}

  {/* Flat Interactive OS screen container */}
  <div 
    className={`
      absolute overflow-hidden bg-[#c0c0c0] transition-all duration-300
      ${isBypassed3D || isViewportZoomed 
        ? 'z-20 inset-0 w-full h-full' 
        : 'z-10 aspect-[4/3] w-[min(80vw,680px)] h-auto shadow-[inset_0_0_20px_rgba(0,0,0,0.95)]'
      }
    `}
  >
    <RetroOS />
    <CRTOverlay />
  </div>
</div>
```

* **Responsive Scaler**: The `w-[min(80vw,680px)]` constraint combined with `aspect-[4/3]` guarantees the screen scale fits the bezel layout proportional to screen size without layout clipping.
* **Transition Effects**: The layout transition uses Tailwind's transition properties (`transition-all duration-300`) to animate the flat OS screen zooming from the bezel slot to full screen.

---

## 6. The CRT Sensory Screen Styling (`crt.css`)

To make the projected HTML feel like a real glass CRT monitor, we overlay a series of CSS scanlines and grid patterns over the `<RetroOS />` component.

```css
/* Scanline overlay wrapper */
.crt-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #c0c0c0;
}

/* Glass curve screen bezel shadow vignette */
.crt-container::after {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 9999;
}

/* Scanline lines simulation */
.crt-scanlines {
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.25) 50%
  ), linear-gradient(
    90deg, 
    rgba(255, 0, 0, 0.06), 
    rgba(0, 255, 0, 0.02), 
    rgba(0, 0, 255, 0.06)
  );
  background-size: 100% 4px, 6px 100%;
  pointer-events: none;
  z-index: 9998;
}

/* Screen flicker animation */
@keyframes crt-flicker {
  0% { opacity: 0.985; }
  50% { opacity: 1.0; }
  100% { opacity: 0.985; }
}

.crt-flicker {
  animation: crt-flicker 0.15s infinite;
  pointer-events: none;
}
```

---

## 7. Performance & Optimization Plan

Even without the heavy overhead of CSS3D projection, rendering a 3D model canvas alongside a complex window manager can load mobile processors. We will integrate specific performance fallback systems:

1. **3D Bypass Mode**: If the user is on a mobile device (detected via user-agent / screen width) or triggers "Performance Mode" in the Control Panel, the site bypasses loading the Three.js Canvas entirely. It renders the `<RetroOS>` container directly in the root viewport.
2. **Asset Preloading & Compression**:
   - The 90s computer model will be optimized with **Draco compression** to reduce size below 1.5MB.
   - System sounds will be compressed into low-bitrate OGG/MP3 formats and loaded asynchronously inside the boot loader.
3. **Outline Resizing (in Floating Mode)**: Real-time window resizing and dragging recalculates bounding boxes and triggers reflows. If performance dips, we toggle a "Retro outline drag" mode: dragging renders a simple dashed bounding box, and the window contents are updated only upon release (reminiscent of Windows 95 / Mac OS System 7 performance optimization).
4. **Zustand Selective Selectors**: Avoid `useOSStore()` calls that capture the entire state object. Instead, fetch specific properties (`const activeTheme = useOSStore(s => s.activeTheme)`) to prevent unnecessary component updates.
