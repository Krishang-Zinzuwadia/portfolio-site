# Phase 4 Handoff Notes: Floating Window Manager (FWM)

This document logs the accomplishments, issues encountered, resolutions, and handover parameters for Phase 4 of the Retro 90s Desktop Portfolio Simulator.

---

## 1. Tasks Completed

- **Window Component Skeleton**: Created `src/components/RetroOS/Window.tsx` implementing retro Chicago header stripes, drag handle cursor styling, collapse/Windowshade capabilities, and window sizing parameters.
- **Header-Only Window Dragging**: Integrated Framer Motion `useDragControls` and bound pointer actions so that only the title bar initiates dragging, avoiding conflict with child input text selects.
- **Drag Constraint Bounds**: Refactored the `Desktop` component to forward its DOM ref, allowing us to pass it as `dragConstraints` to `Window` containers. This keeps windows bounded inside the visible desktop canvas.
- **Coordinate Jump Mitigation**: Set `x` and `y` styles of `motion.div` directly to `MotionValue` instances and committed coordinates dynamically using `mx.get()` and `my.get()` on drag release. This resolves double-offset jumps upon state updates.
- **State Store Action Extensions**: Added `closeAllWindows`, `minimizeAllWindows`, and `cleanUpDesktop` to the Zustand store.
- **Special Dropdown Menu**: Created a classic "Special" menu in the top `MenuBar` allowing users to batch close/minimize windows, clean up/reset the desktop coordinates, or play a retro beep sound.
- **Dynamic Mounting**: Wired up window mapping in `src/app/page.tsx` rendering active applications dynamically as children of the `Desktop` workspace area.

---

## 2. Issues Faced & Resolutions

### Issue A: Framer Motion Drag Type Mismatch
- **Symptom**: Assigning `"both"` to the `drag` prop on `<motion.div>` raised type warnings in newer versions of `framer-motion` requiring a `boolean` or `"x"` | `"y"`.
- **Resolution**: Changed the prop value to `drag={tilingMode === "floating" && !isMaximized}` which evaluates to a typed boolean.

### Issue B: Missing dragHandleClassName Support
- **Symptom**: Using `dragHandleClassName` to limit dragging to the header resulted in standard React element attribute compilation errors (property does not exist).
- **Resolution**: Removed `dragHandleClassName`, added `dragListener={false}`, and instantiated Framer Motion's custom `useDragControls` hooked to `onPointerDown` inside the title bar.

### Issue C: Double Offset Coordinate Jumping on State Commits
- **Symptom**: Updating store coordinates on drag release changed the `left`/`top` CSS styles while Framer Motion's internal transform offsets remained active, resulting in a sudden offset jump.
- **Resolution**: Bound the component's position using the `x` and `y` properties in Framer Motion style configs mapped to active `MotionValue` variables.

---

## 3. Handoff for Next LLM / Phase 5

- **Next Goal**: **Phase 5: Tiling Window Manager Layouts (TWM)**.
- **Context**:
  - The floating window manager is fully complete, tested, and compiles cleanly.
  - The next phase builds layout algorithms to arrange windows side-by-side or stack them.
- **Tasks for next agent**:
  - Implement dynamic window coordinates algorithms for **Master-Stack**, **Grid**, and **Monocle (tabbed)** layouts.
  - Listen to `tilingMode` and `tilingLayout` from the Zustand store.
  - Calculate `tiledCoords` for each open window based on active layouts and apply them inside the window render loop.
  - Implement smooth transition animations when switching between floating and tiling modes using Framer Motion.
