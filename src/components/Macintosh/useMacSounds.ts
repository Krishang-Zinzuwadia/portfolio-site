"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

export type MacSound = "startup" | "menu" | "open" | "close";

const MUTE_STORAGE_KEY = "krishang-mac-sound-muted";
const MUTE_CHANGE_EVENT = "krishang-mac-sound-change";
let fallbackMuted = false;

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "true";
  } catch {
    return fallbackMuted;
  }
}

function subscribeToMuted(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(MUTE_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(MUTE_CHANGE_EVENT, listener);
  };
}

function setStoredMuted(muted: boolean) {
  fallbackMuted = muted;

  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
  } catch {
    // The in-memory preference still works when storage is unavailable.
  }

  window.dispatchEvent(new Event(MUTE_CHANGE_EVENT));
}

function addTone(
  context: AudioContext,
  output: AudioNode,
  options: {
    frequency: number;
    endFrequency?: number;
    start: number;
    duration: number;
    volume: number;
    type: OscillatorType;
  }
) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const end = options.start + options.duration;

  oscillator.type = options.type;
  oscillator.frequency.setValueAtTime(options.frequency, options.start);
  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      options.endFrequency,
      end
    );
  }

  envelope.gain.setValueAtTime(0.0001, options.start);
  envelope.gain.exponentialRampToValueAtTime(
    options.volume,
    options.start + Math.min(0.018, options.duration * 0.18)
  );
  envelope.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(envelope);
  envelope.connect(output);
  oscillator.start(options.start);
  oscillator.stop(end + 0.02);
  oscillator.addEventListener("ended", () => {
    oscillator.disconnect();
    envelope.disconnect();
  });
}

function primeAudioContext(context: AudioContext) {
  const source = context.createBufferSource();
  source.buffer = context.createBuffer(1, 1, context.sampleRate);
  source.connect(context.destination);
  source.start();
  source.addEventListener("ended", () => source.disconnect(), { once: true });
}

function disposeAudioContext(context: AudioContext) {
  if (context.state === "closed") return;

  try {
    void context.close().catch(() => undefined);
  } catch {
    // Older WebKit implementations can throw while the context is changing state.
  }
}

function scheduleSound(context: AudioContext, sound: MacSound) {
  const now = context.currentTime + 0.012;
  const filter = context.createBiquadFilter();
  const master = context.createGain();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(sound === "startup" ? 3100 : 2400, now);
  master.gain.value = 0.88;
  filter.connect(master);
  master.connect(context.destination);

  if (sound === "startup") {
    const notes = [261.63, 392, 523.25, 659.25];
    notes.forEach((frequency, index) => {
      addTone(context, filter, {
        frequency,
        start: now + index * 0.055,
        duration: 1.35 - index * 0.035,
        volume: index === 0 ? 0.16 : 0.115,
        type: index < 2 ? "triangle" : "sine",
      });
    });
  } else if (sound === "open") {
    addTone(context, filter, {
      frequency: 330,
      endFrequency: 610,
      start: now,
      duration: 0.11,
      volume: 0.11,
      type: "triangle",
    });
  } else if (sound === "close") {
    addTone(context, filter, {
      frequency: 580,
      endFrequency: 280,
      start: now,
      duration: 0.095,
      volume: 0.1,
      type: "triangle",
    });
  } else {
    addTone(context, filter, {
      frequency: 740,
      endFrequency: 610,
      start: now,
      duration: 0.035,
      volume: 0.065,
      type: "square",
    });
  }

  const cleanupDelay = sound === "startup" ? 1700 : 250;
  window.setTimeout(() => {
    filter.disconnect();
    master.disconnect();
  }, cleanupDelay);
}

export function useMacSounds() {
  const muted = useSyncExternalStore(subscribeToMuted, readMuted, () => false);
  const contextRef = useRef<AudioContext | null>(null);

  const closeContext = useCallback(() => {
    const context = contextRef.current;
    contextRef.current = null;

    if (context) disposeAudioContext(context);
  }, []);

  useEffect(() => closeContext, [closeContext]);

  const getContext = useCallback(() => {
    const currentContext = contextRef.current;
    if (currentContext && currentContext.state !== "closed") {
      return currentContext;
    }

    const AudioContextConstructor =
      window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return null;

    let nextContext: AudioContext;
    try {
      nextContext = new AudioContextConstructor({ latencyHint: "interactive" });
    } catch {
      nextContext = new AudioContextConstructor();
    }
    contextRef.current = nextContext;
    return nextContext;
  }, []);

  const startSound = useCallback(
    (sound: MacSound) => {
      try {
        const context = getContext();
        if (!context) return;

        if (context.state === "running") {
          scheduleSound(context, sound);
          return;
        }

        // Starting a silent source during the original click/key gesture is
        // required to unlock Web Audio reliably in Safari and iOS browsers.
        primeAudioContext(context);
        void context
          .resume()
          .then(() => {
            if (
              contextRef.current === context &&
              context.state === "running" &&
              !readMuted()
            ) {
              scheduleSound(context, sound);
            }
          })
          .catch(() => {
            if (contextRef.current === context) contextRef.current = null;
            disposeAudioContext(context);
          });
      } catch {
        closeContext();
      }
    },
    [closeContext, getContext]
  );

  const playSound = useCallback(
    (sound: MacSound) => {
      if (typeof window === "undefined" || readMuted()) return;
      startSound(sound);
    },
    [startSound]
  );

  const toggleMuted = useCallback(() => {
    const nextMuted = !readMuted();
    setStoredMuted(nextMuted);

    if (nextMuted) {
      closeContext();
      return;
    }

    // Confirm that sound is active and unlock the engine in the same trusted
    // user gesture as the toggle click.
    startSound("menu");
  }, [closeContext, startSound]);

  return { muted, playSound, toggleMuted };
}
