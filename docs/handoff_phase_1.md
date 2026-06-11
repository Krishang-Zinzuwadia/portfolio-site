# Phase 1 Handoff Notes: Environment & Project Setup

This document records the completed tasks, challenges, workarounds, and handover parameters for the next development phase of the Retro 90s Desktop Portfolio Simulator.

---

## 1. Tasks Completed

- **CLI Diagnostic**: Tested `create-next-app@latest --help` and `npx shadcn@latest init --help` to identify safe CLI setup arguments.
- **Next.js Bootstrapping**: Spooled up a Next.js App Router codebase in TypeScript inside the workspace.
- **Tailwind Version Downgrade**: Modified the default package list to replace Tailwind CSS v4 with the requested **Tailwind CSS v3** (`tailwindcss@3`, `postcss@8`, `autoprefixer@10`).
- **shadcn/ui Setup**: Initialized shadcn/ui with base configurations (`components.json`), generating the initial styling utility (`src/lib/utils.ts`) and button components.
- **ESLint & Prettier Integration**: Installed `prettier`, `eslint-config-prettier`, and `prettier-plugin-tailwindcss`. Wired ESLint's flat config (`eslint.config.mjs`) to defer formatting to Prettier, and added class-sorting rules to `.prettierrc`.
- **Core Dependencies**: Installed `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `framer-motion`, and `tailwindcss-animate`.
- **Git Organization**: Organized the setups into 18 granular, conventional commits on the `feature/phase-1-setup` branch.

---

## 2. Issues Faced & Resolutions

### Issue A: create-next-app Folder Verification Failure
- **Symptom**: `create-next-app` aborted execution on the target directory because `design.md`, `plan.md`, and `README_old.md` were present.
- **Resolution**: Initialized Next.js inside a temporary subdirectory `temp_setup/`, moved the generated items (including hidden dotfiles) to the root directory, and removed the temporary subfolder.

### Issue B: Default Tailwind v4 Override
- **Symptom**: Next.js 16 defaults to Tailwind v4, which bypasses `tailwind.config.js` and uses native CSS `@import "tailwindcss"` variables. This broke the user's requirement to utilize Tailwind v3 config files.
- **Resolution**: Downgraded packages to `tailwindcss@3`, uninstalled `@tailwindcss/postcss`, created standard `postcss.config.mjs` and `tailwind.config.js` setups, and restored standard `@tailwind base;` directives in `src/app/globals.css`.

---

## 3. Handoff for Next LLM / Phase 2

- **Next Goal**: **Phase 2: Zustand State & Core Hooks**.
- **Context**: 
  - The compiler runs on Next.js App Router (TypeScript) and Tailwind v3.
  - The package is fully configured. Run `npm run dev` to verify the dev server boots successfully.
- **Tasks for next agent**:
  - Define strict types in `src/store/useOSStore.ts` (e.g., coordinates, window items, layout configurations, window active ordering).
  - Write state management actions inside Zustand (opening windows, cycling focus, minimizing/maximizing, dragging coordinates offset trackers).
  - Prepare hooks like `useAudio.ts` or coordinate hooks.
