# Plan: Retro 90s Desktop Portfolio Simulator

This document serves as the Product Requirements Document (PRD) and feature specification for the 90s Computer Model Portfolio Site. It details the product vision, user journey, app modules, window management behavior, and sensory aesthetic goals.

---

## 1. Product Vision & Concept

The goal is to create a highly immersive and responsive personal portfolio presented as a flat, fully interactive retro OS software platform, styled inside a 3D computer bezel frame to create a visual illusion of a 90s CRT monitor. 

Rather than rendering the entire interface inside a complex 3D WebGL scene (which degrades performance and makes standard text selection, keyboard navigation, and scrolling difficult), the website itself is a high-performance **2D software platform** (a desktop simulation of a classic retro Mac OS). 

The 3D model of the 90s computer is loaded in a WebGL canvas and serves as a visual frame/bezel overlay around the interactive screen area. The screen itself is a native HTML/CSS division nested perfectly within the monitor's display boundaries, creating a seamless 3D illusion with maximum interface performance.

The core metaphor consists of three layers:
1. **The 3D Computer Model Frame**: A 3D WebGL frame rendering a realistic 90s CRT computer monitor casing (with depth, lighting, and ambient shadow) that outlines the screen.
2. **The Flat Screen Canvas**: A standard 2D, high-performance HTML container presenting a simulated classic Macintosh Operating System (reminiscent of System 7 / Mac OS 8).
3. **The Window Manager**: A dual-mode windowing system supporting traditional floating windows and a modern, keyboard-centric **Tiling Window Manager** (like i3 or dwm) mapped inside the retro GUI.

```
+-----------------------------------------------------------------+
|  USER'S BROWSER VIEWPORT                                        |
|  +-----------------------------------------------------------+  |
|  |  [3D WebGL Monitor Frame / Bezel Casing]                  |  |
|  |                                                           |  |
|  |       +-------------------------------------------+       |  |
|  |       |  INTERACTIVE FLAT SCREEN AREA (HTML/CSS)  |       |  |
|  |       |  - retro-macOS simulation                 |       |  |
|  |       |  - Fully functional tiling window manager |       |  |
|  |       |  - Clicks, scrollbars, text are native    |       |  |
|  |       +-------------------------------------------+       |  |
|  |                                                           |  |
|  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------+
```

---

## 2. Target Audience & User Personas

### A. The Tech Recruiter
* **Goal**: Needs to see the candidate's skills, experience, and contact info quickly.
* **Pain Point**: Interactive 3D sites can be slow to load and difficult to navigate.
* **Feature Requirement**: Zero lag, fast initial page load, and a clear, clean folder structure containing readable documents (resume, skills). Ability to quickly toggle fullscreen mode to hide the 3D bezel framing entirely.

### B. The Fellow Developer
* **Goal**: Evaluates the candidate's technical prowess, frontend architecture, and attention to detail.
* **Pain Point**: Gimmicky portfolios with poor performance, laggy window dragging, or buggy layouts.
* **Feature Requirement**: A fully functional retro Terminal, robust keyboard bindings for tiling, smooth rendering under high window counts, and clean open-source code.

### C. The Casual Visitor
* **Goal**: Explores the site for entertainment and inspiration.
* **Pain Point**: Boring portfolios that feel like a PDF resume.
* **Feature Requirement**: Interactive easter eggs (retro game, trash bin physics, sound effects, system settings).

---

## 3. Core Features & Specifications

### 3.1. The 3D Monitor Frame & Bezel (The Illusion)
* **3D Asset**: A high-fidelity glTF/GLB model of a classic 90s computer monitor casing (beige, vintage CRT style).
* **Rendering & Setup**: 
  - Rendered in a fixed WebGL canvas overlay or background.
  - The camera is set to an orthographic or fixed perspective view, pointing straight at the screen face.
  - The interactive OS container is absolutely positioned over the screen texture space of the 3D model, scaling responsively to fit the physical viewport.
* **Interactions**:
  - **Parallax Tilt (Optional)**: A subtle, mouse-movement-based tilt of the 3D computer model relative to the mouse cursor, giving a strong sense of depth and 3D volume.
  - **Scale Animation**: Clicking a "Focus Screen" bezel button zooms/scales the screen window to occupy 100% of the viewport, fading the 3D monitor shell out of view.
* **Lighting**: A clean lighting setup that highlights the curved edges and plastic textures of the monitor bezel, throwing shadows behind it.

### 3.2. Retro OS Simulator (retro-macOS)
The simulator is rendered using high-performance standard HTML/CSS/JS elements positioned inside the monitor bezel space.
* **Desktop Grid**: Icons aligned to a retro pixel grid, which can be selected, double-clicked to open, and dragged around.
* **System Menu Bar**:
  - **Apple Menu ()**: System info, easter eggs, theme switcher.
  - **File Menu**: Open, Close Window, Empty Trash.
  - **Tiling Menu**: Layout options (Tile, Stack, Grid, Float), Toggle Keyboard Help.
  - **System Clock**: Real-time classic digital clock display in the top right.
* **Sensory Retro Aesthetics**:
  - **CRT Screen Effects**: CSS-based CRT scanlines, flicker, glass curvature vignette, and static animations that overlay the viewport.
  - **Retro Audio**: Clicky mechanical keyboard sounds when typing, clicking noise on folders/buttons, floppy insertion sounds on app launch, system error "beeps".
  - **Visual Styling**: System 7-style greyscale colors (#C0C0C0, #808080), 1-bit style pixel icons, Chicago and Geneva typography, checkered desktop patterns.

### 3.3. Dual-Mode Window Manager
The core functional highlight of the desktop. It supports two distinct layouts, switchable instantly:

#### Mode A: Classic Floating Window Manager (FWM)
* **Standard Controls**: Move by dragging the title bar; close via top-left square button; resize via bottom-right grid square; collapse/roll-up (Windowshade) by double-clicking the title bar.
* **Stacking Order**: Clicking a window raises its z-index to the top. Active window shows horizontal title-bar stripes, while inactive windows fade their headers.

#### Mode B: Retro Tiling Window Manager (TWM)
* **Behavior**: Windows do not overlap. Opening a new window automatically splits the desktop screen space. Closing a window dynamically adjusts the remaining windows to occupy the full screen.
* **Tiling Layouts**:
  1. **Master & Stack (Default)**: A large "Master" window occupies the left 60% of the screen. All other windows are stacked vertically on the right 40%.
  2. **Grid**: Windows are divided evenly in rows and columns (e.g., 4 windows = 2x2 grid).
  3. **Monocle**: The active window occupies 100% of the desktop space (full screen tabbed-like navigation).
* **Keyboard-Centric Control**: Implements standard window manager shortcuts (styled after `i3wm` or `dwm` but customizable):
  - `Mod` (e.g., `Alt` or `Cmd`) + `Enter`: Open Retro Terminal.
  - `Mod` + `j` / `k`: Cycle focus between tiled windows.
  - `Mod` + `Shift` + `j` / `k`: Swap active window position in stack.
  - `Mod` + `h` / `l`: Resize split ratio between Master and Stack.
  - `Mod` + `c` or `Shift` + `q`: Close active window.
  - `Mod` + `Space`: Toggle between Floating and Tiled modes.
* **Drag-and-Drop Tiling**: Users can drag a window near any edge of the desktop. A semi-transparent overlay shows a "drop zone preview". Releasing the window tiles it into that section.

---

## 4. Built-in Applications (Portfolio Sections)

| App Icon | Application | Function / Content |
| :--- | :--- | :--- |
| **SimpleText** | `About Me` | Reads a plain-text markdown file showing a short bio, photo, and background. |
| **Control Panel**| `Settings` | Allows the user to toggle sound effects, change desktop tiling layouts, adjust CRT shader parameters (scanline intensity, flicker, curve), and change desktop backgrounds (patterns/colors). |
| **HD Drive** | `Projects` | A classic Finder-like browser displaying folders of different projects. Clicking a project opens a detailed window with description, tech stack, screenshots, and an external link icon. |
| **MacTerminal**| `Terminal` | A fully interactive command-line terminal. Users can type `help`, `cat resume.txt`, `skills`, `ls`, `neofetch` (displays retro system info), or run mini ASCII games. |
| **MacMail** | `Contact` | A retro email composer interface where users can type a message. Submitting it sends a contact form email (via an API like EmailJS or Netlify Forms). |
| **Retro Play** | `Doom / Game` | A playable retro emulator or mini-game (e.g., 2D block-breaker, custom canvas-based Asteroids, or Wolfenstein 3D JS engine) styled as an easter egg. |
| **Trash Can** | `Trash` | Files or icons can be dragged and dropped into the trash can. Double-clicking it shows deleted items, with an "Empty Trash" sound effect. |

---

## 5. Sensory & Micro-Animations Specifications

* **Floppy Disk Startup Sequence**:
  1. Page load presents a black screen with a small floppy disk icon with a flashing question mark `?` (waiting for system).
  2. A mechanical disk insertion drive sound plays.
  3. The icon changes to a smiling "Happy Mac".
  4. A loading bar fills up at the bottom: "Welcome to RetroPortfolio (Loading Extensions...)".
  5. The famous retro chime plays, the screen flares white with a static fade, and the desktop loads.
* **CRT Screen Ripple**: Occasional static horizontal lines or flickers that sync with a hum sound effect (can be muted).
* **Click Physics**: Buttons should depress vertically by 1-2 pixels when clicked, simulating mechanical click travel.
* **Window Drag Outlines**: During floating mode, dragging can either move the window in real-time or draw a dashed outline (retro outline drag) depending on the "Performance/CPU Mode" in Control Panel.

---

## 6. Project Roadmap & Phases

- [x] **Phase 1: Environment & Project Setup** - Setup Next.js, Tailwind CSS, Zustand, and shadcn.
- [x] **Phase 2: Zustand State & Core Hooks** - Structure global stores for windows, layouts, settings.
- [x] **Phase 3: Core Desktop OS Layout** - CHICAGO and GENEVA retro fonts, MenuBar, and Desktop grid.
- [x] **Phase 4: Floating Window Manager (FWM)** - Drag constraints, z-index focus, and windowshade.
- [x] **Phase 5: Tiling Window Manager Layouts (TWM)** - Dynamic layout math (Grid, Master-Stack, Monocle).
- [x] **Phase 6: Keyboard Shortcuts & Focus Navigation** - Focus cycling, size ratios, and hotkeys.
- [x] **Phase 7: Built-in Desktop Applications** - SimpleText (About, Resume), Projects, Terminal, ControlPanel, Mail.
- [x] **Phase 8: Polish, 3D Bezel Illusion, and Launch** - 3D beige monitor R3F workspace, audio preloader cache, Empty Trash popup, and deployment compilation.
