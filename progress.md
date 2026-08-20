Original prompt: ad doom as a playable game in the macintosh portfolio part

## Progress

- Audited the Macintosh Finder desktop and current Next.js 16.2.9 client-component guidance.
- Chosen integration seam: a lazily loaded Finder application/window with an isolated same-origin DOS player frame.
- Added the DOOM icon, Finder window profile/chrome, Apple-menu entry, Cmd/Ctrl+D shortcut, loading state, and full-bleed game window styling without touching existing package changes.
- The user rejected the procedural ray-caster prototype and clarified that only authentic DOOM is acceptable; that prototype was removed completely.
- Downloaded id Software's canonical `doom19s.zip`, verified its SHA-256, extracted the original unmodified `DOOM.EXE` and `DOOM1.WAD`, and added a hash-gated bundle builder.
- Built a local DOOM Shareware v1.9 `.jsdos` bundle containing Episode One only. No registered/commercial `DOOM.WAD` is present.
- Self-hosted the js-dos 8.4.1 DOSBox runtime with GPL/source notices, plus the DOOM shareware license and provenance record.
- Added a polished original-release launcher, local emulator teardown, Macintosh sound-state sync, pause/resume on Finder focus, fullscreen/reset controls, and original control hints.
- Verified the authentic title screen, menu, E1M1, movement, turning, firing (ammo 50 to 49), background pause/resume, and the full Macintosh integration in the browser.
- Ran the required `web_game_playwright_client.js` flow against the real game; it reached E1M1, moved through the level, reported `state: running`, produced a gameplay screenshot, and emitted no console/page error artifact.
- Full-project ESLint, TypeScript, and the Next.js production build pass.
- Re-audited the final bundle: the embedded `DOOM.EXE` and `DOOM1.WAD` match the canonical hashes, and no commercial `DOOM.WAD` is present.
- Reviewed the final diff and preserved the user's pre-existing SEO and workspace files unchanged.
- Fixed the missing soundtrack by generating the `DEFAULT.CFG` that the original setup program normally creates: AdLib/OPL2 now renders DOOM's original MUS music while Sound Blaster 16 handles effects.
- Rebuilt the bundle without changing the canonical `DOOM.EXE` or `DOOM1.WAD`; no replacement MP3, MIDI, or custom soundtrack was added.
- Measured the final bundle's audio output at 44.1 kHz: 529,412 samples, 82.37% non-zero, RMS 0.09397, and peak 0.67587. A separate music-only probe also produced sustained non-zero audio with effects disabled.
- Re-ran the required gameplay client and in-app browser QA. The authentic attract-mode gameplay rendered correctly, reported music device 2, and emitted no console/page error artifact.

## TODO

- None.

## Native startup cleanup

- Removed the DOOM status/control strip, the DOOM-specific Finder footer, the visible inactive/pause overlays, the React `Loading DOOM…` fallback, the authored launcher, and the js-dos bundle-loading view.
- The iframe now starts DOOM automatically while remaining pure black until `ci-ready`; the first captured direct-player frame is the original `DOOM System Startup v1.9` output, followed by the official title art and gameplay.
- The required no-click web-game client ran for 48 captures, reached `state: running`, reported OPL music device 2, and produced no console/page error artifact.
- A focused gameplay run reached E1M1 and accepted movement/turn/use input with no errors.
- Browser QA confirmed a black DOOM window at 150–200 ms, native gameplay after startup, zero custom toolbar/footer/launcher/pause-card elements, empty iframe text, and the same clean behavior after closing and reopening DOOM.
- Final ESLint and Next.js 16.2.9 production build pass; the only build notice is the existing Intel One Mono fallback warning.

## Puzzle game picker

- Follow-up prompt: clicking Puzzle should open a picker for the existing sliding puzzle, Minesweeper, DOOM, and PAC-MAN; use official versions and do not build custom clones.
- Promoted the previously verified control-panel commit `cd7f1ac` to Vercel production before starting this change, as requested.
- Verified the publisher-hosted web options: Microsoft Minesweeper is playable on Microsoft Casual Games, while the Namco-supported PAC-MAN Google Doodle preserves the original logic, graphics, sounds, and bugs.
- Both official hosts prohibit third-party iframe embedding, so their picker cards launch the official playable pages in a new tab. No Microsoft or PAC-MAN assets, binaries, ROMs, or clone packages are copied into this repository.
- Added a System 7 game-library picker, routed Sliding Puzzle to its own Macintosh child window, and reused the existing authentic DOOM Shareware window/runtime.

## Puzzle game picker TODO

- Completed formatting, TypeScript, targeted and repository-wide ESLint, and the Next.js production build. The only build notice is the existing Intel One Mono fallback warning.
- Verified the picker at desktop and 390px mobile widths, including the one-column card layout, accessible names, keyboard-focus styling, and visible new-tab disclosures.
- Verified Sliding Puzzle interaction and singleton focus behavior, DOOM startup through the picker, and live E1M1 rendering with zero console errors.
- Verified Microsoft Minesweeper and the PAC-MAN Google Doodle open the exact official playable URLs in separate tabs.
- Re-ran the required web-game client for 60 captures; the final state reported authentic DOOM Shareware v1.9 running with AdLib OPL2 music and Sound Blaster 16 effects, with no error artifact.

## Embedded Minesweeper and PAC-MAN

- Follow-up prompt: replace the Minesweeper and PAC-MAN new-tab launches with playable Macintosh windows like DOOM.
- Confirmed that only those two game cards leave the app; the rest of the picker already uses the internal singleton window system.
- Confirmed Microsoft's shell page blocks framing, but its current official CDN game build is frameable and reaches the real difficulty menu.
- Confirmed Google's PAC-MAN document blocks third-party framing. Added an opaque-origin sandboxed wrapper that vendors no game code or assets and loads Google's original 2010 script, sprite, and audio from Google at runtime.
- Added dedicated full-bleed Minesweeper and PAC-MAN windows and converted both picker links to internal buttons.

## Embedded game TODO

- Verified in the live Macintosh UI that Minesweeper reaches its difficulty selector and board, PAC-MAN renders its original Google canvas and accepts keyboard input, and both survive Finder zoom/resize.
- Confirmed close/reopen behavior and a constant one-tab browser count throughout both launch flows.
- Added a PAC-MAN startup readiness check so the wrapper only reports success after the original canvas and game object initialize.
- Targeted formatting, JavaScript syntax validation, repository-wide ESLint, TypeScript, and the Next.js production build pass. The only build notice is the existing Intel One Mono fallback warning.
