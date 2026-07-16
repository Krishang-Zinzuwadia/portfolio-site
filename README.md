# Krishang Zinzuwadia — Interactive Macintosh Portfolio

A two-mode portfolio centered on an original, browser-rendered 1990 Macintosh Classic. The default experience places a working System 7-inspired portfolio inside the modeled CRT; a persistent switch in the top-right opens a separate editorial version of the same verified resume content.

## Experience

- **Mac OS mode:** full-viewport Three.js workstation with a live 512 × 342 desktop projected onto the CRT.
- **Interactive desktop:** open, focus, close, and drag Finder-style windows for About, Projects, Achievements, Contact, and Resume.
- **Enlarged desktop:** a readable, keyboard-accessible view of the same OS for smaller screens.
- **Editorial mode:** responsive alternate portfolio with the same projects, achievements, experience, and links.
- **Responsive framing:** the Macintosh, CRT projection, labels, and controls adapt from phone to wide desktop without horizontal overflow.

All portfolio copy is sourced from `Krishang_Zinzuwadia_latest.pdf`. The public resume is available at `/Krishang-Zinzuwadia-Resume.pdf`.

## Original 3D assets

The Macintosh Classic, keyboard, mouse, cables, and the alternate Signal Terminal were modeled for this project through the official [`ahujasid/blender-mcp`](https://github.com/ahujasid/blender-mcp) server. No downloaded third-party computer model is used by the site.

- Browser model: `public/assets/models/macintosh-classic.glb`
- Transparent poster: `public/assets/blender/macintosh-classic.webp`
- Editable Blender source: `assets-source/blender/macintosh-classic.blend`
- Reproducible build: `scripts/blender/build_macintosh_classic.py`

The case follows Apple's published Macintosh Classic dimensions: 13.2 × 9.7 × 11.2 inches, with the characteristic 9-inch monochrome display.

The classic system face is [Chicago Kare](https://github.com/KingDuane/Chicago-Kare), distributed under the MIT License in `public/fonts/LICENSE-Chicago-Kare.txt`. Body and monospace text use local system fallbacks, so the repository does not redistribute Apple's original Geneva or Monaco font files.

This is an unofficial, fan-made recreation and is not affiliated with or endorsed by Apple Inc. Macintosh is a trademark of Apple Inc.

## Stack

- Next.js 16 App Router and React 19
- React Three Fiber, Drei, and Three.js
- CSS Modules for the projected desktop and view switcher
- Custom CSS for the editorial experience
- Blender 5.2 and Blender MCP for authored geometry

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

Production is deployed from `main` on Vercel at
[krishang-portfolio.vercel.app](https://krishang-portfolio.vercel.app).

## Main architecture

- `src/app/page.tsx` — server-rendered entry and structured data
- `src/components/Portfolio/PortfolioViewSwitcher.tsx` — persistent Mac OS / Editorial switch
- `src/components/Macintosh/MacExperience.tsx` — immersive scene and enlarged-desktop presentation
- `src/components/Macintosh/MacintoshScene.tsx` — GLB loading, camera framing, and precise CRT projection
- `src/components/Macintosh/MacDesktop.tsx` — interactive System 7-inspired desktop
- `src/components/Portfolio/EditorialPortfolio.tsx` — alternate editorial portfolio
- `src/data/portfolio.ts` — verified resume content shared across both views

## Blender MCP setup

The repository's generated assets work without Blender. To regenerate or inspect them, install Blender 5.2, enable the Blender MCP add-on, run its local server on `127.0.0.1:9876`, and execute the build script through the MCP `execute_blender_code` tool. Telemetry was disabled for the local server used to build these assets.
