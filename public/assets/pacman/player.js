(() => {
  "use strict";

  const GAME_WIDTH = 484;
  const GAME_HEIGHT = 208;
  const GOOGLE_ORIGIN = "https://www.google.com/";
  const GAME_SCRIPT = `${GOOGLE_ORIGIN}logos/js/pacman10-hp.12.js`;
  const STARTUP_TIMEOUT_MS = 12_000;
  const shell = document.getElementById("game-shell");
  let state = "loading";
  let readinessFrame = 0;

  function setState(nextState) {
    state = nextState;
    document.body.dataset.state = nextState;
  }

  function fitGame() {
    const scale = Math.min(
      window.innerWidth / GAME_WIDTH,
      window.innerHeight / GAME_HEIGHT
    );
    shell.style.setProperty("--game-scale", String(Math.max(0.1, scale)));
  }

  function showError() {
    window.cancelAnimationFrame(readinessFrame);
    setState("error");
  }

  function waitForGameReady() {
    const startedAt = performance.now();

    const check = () => {
      const canvas = document.getElementById("hplogo-c");
      const pacman = window.google?.pacman;

      if (canvas instanceof HTMLCanvasElement && pacman) {
        setState("running");
        return;
      }

      if (performance.now() - startedAt >= STARTUP_TIMEOUT_MS) {
        showError();
        return;
      }

      readinessFrame = window.requestAnimationFrame(check);
    };

    check();
  }

  function installSandboxStorage() {
    const values = new Map();
    const storage = {
      get length() {
        return values.size;
      },
      clear() {
        values.clear();
      },
      getItem(key) {
        return values.get(String(key)) ?? null;
      },
      key(index) {
        return Array.from(values.keys())[index] ?? null;
      },
      removeItem(key) {
        values.delete(String(key));
      },
      setItem(key, value) {
        values.set(String(key), String(value));
      },
    };

    try {
      window.localStorage.getItem("pacman-storage-check");
    } catch {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: storage,
      });
    }
  }

  function startOfficialGame() {
    installSandboxStorage();

    const base = document.createElement("base");
    base.href = GOOGLE_ORIGIN;
    document.head.prepend(base);

    window.google = window.google || {};
    window.google.doodle = window.google.doodle || {};
    window.google.doodle.pacManSound = true;
    window.google.doodle.pacManQuery = () => undefined;

    const script = document.createElement("script");
    script.src = GAME_SCRIPT;
    script.onload = waitForGameReady;
    script.onerror = showError;
    document.body.appendChild(script);
  }

  window.render_game_to_text = () =>
    JSON.stringify({
      game: "PAC-MAN 30th Anniversary Google Doodle",
      source: "Google-hosted original script and assets",
      state,
      controls: "Arrow keys move; click or Enter inserts a coin",
    });

  window.addEventListener("resize", fitGame);
  window.addEventListener("error", () => {
    if (state === "loading") showError();
  });
  window.addEventListener("unhandledrejection", () => {
    if (state === "loading") showError();
  });

  fitGame();
  startOfficialGame();
})();
