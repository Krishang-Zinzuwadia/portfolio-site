# Phase 5 Handoff Notes: Tiling Window Manager Layouts (TWM)

This document logs the accomplishments, issues encountered, resolutions, and handover parameters for Phase 5 of the Retro 90s Desktop Portfolio Simulator.

---

## 1. Tasks Completed

- **Tiling Layout Hook**: Created `src/hooks/useTilingLayout.ts` which uses a `ResizeObserver` to track desktop canvas bounds and recalculate layouts dynamically on container/viewport size changes.
- **Master & Stack Layout**: Implemented the core Split-Pane layout algorithm placing the primary window on the left (controlled by the `splitRatio`) and stacking remaining windows vertically on the right.
- **Balanced Grid Layout**: Implemented a Grid algorithm that automatically computes row and column cells. Added custom math that stretches columns in the last row to fill the workspace if the window count is odd.
- **Monocle (Tabbed) Layout**: Implemented a fullscreen layout where all open windows scale to fill the full desktop area (minus gaps) overlapping each other, with focused window ordering bringing the active app to the front.
- **Framer Motion Layout Animations**: Appended the `layout` prop to the window `motion.div` wrapper, enabling smooth, fluid layout resize and coordinate animation transitions.
- **Interactive Drag Edge Snapping**: Integrated pointer position trackers inside the `onDrag` callback in `Window.tsx` that detect if a window is dragged near the left, right, top, or bottom edges of the desktop canvas.
- **Visual Drop Zone Guides**: Added diagonally-striped overlay blocks with dotted borders inside `Desktop.tsx` that render dynamically during dragging to preview the snapped window layout regions.
- **Layout Snap Actions**: Configured `onDragEnd` hooks to switch tiling modes and change layout formats dynamically on snap releases.

---

## 2. Issues Faced & Resolutions

### Issue A: Grid Blank Space Layout Inconsistencies
- **Symptom**: Standard Grid division leaves empty cells on the bottom row if the open window count does not form a perfect square.
- **Resolution**: Implemented specific last-row check logic inside `useTilingLayout.ts` that dynamically re-allocates cell widths for leftover bottom windows, stretching them symmetrically to cover the row width.

### Issue B: Initial Window Coordinate Tracking in Snap Switching
- **Symptom**: Swapping between floating mode and tiling mode back-and-forth could cause floating windows to lose their original custom positions.
- **Resolution**: Maintained separate coordinate trackers; `useTilingLayout` calculates temporary coordinates on the fly without overriding the user's manual floating coordinates `fx`/`fy` in the Zustand store.

---

## 3. Handoff for Next LLM / Phase 6

- **Next Goal**: **Phase 6: Keyboard Shortcuts & Focus Navigation**.
- **Context**:
  - Tiling layout algorithms and edge snapping are fully functional and animate beautifully.
  - The next phase introduces keyboard-only hotkey triggers to manage tiles and navigate.
- **Tasks for next agent**:
  - Implement a `useKeyboardShortcuts.ts` hook.
  - Bind global keyboard event listeners:
    - Alt+J / Alt+K: Cycle window focus.
    - Alt+Shift+J / Alt+Shift+K: Swap active window with master or cycle position in stack.
    - Alt+Space: Toggle between floating and tiling modes.
    - Alt+Enter: Toggle maximize.
    - Alt+H / Alt+L: Increase / decrease split ratio.
  - Guard input typing inside the `Terminal` application to prevent shortcut leakage.
