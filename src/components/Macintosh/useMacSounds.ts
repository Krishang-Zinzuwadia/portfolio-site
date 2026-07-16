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

function scheduleSound(context: AudioContext, sound: MacSound) {
  const now = context.currentTime + 0.012;
  const filter = context.createBiquadFilter();
  const master = context.createGain();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(sound === "startup" ? 3100 : 2400, now);
  master.gain.value = 0.78;
  filter.connect(master);
  master.connect(context.destination);

  if (sound === "startup") {
    const notes = [261.63, 392, 523.25, 659.25];
    notes.forEach((frequency, index) => {
      addTone(context, filter, {
        frequency,
        start: now + index * 0.055,
        duration: 1.35 - index * 0.035,
        volume: index === 0 ? 0.09 : 0.065,
        type: index < 2 ? "triangle" : "sine",
      });
    });
  } else if (sound === "open") {
    addTone(context, filter, {
      frequency: 330,
      endFrequency: 610,
      start: now,
      duration: 0.11,
      volume: 0.045,
      type: "triangle",
    });
  } else if (sound === "close") {
    addTone(context, filter, {
      frequency: 580,
      endFrequency: 280,
      start: now,
      duration: 0.095,
      volume: 0.042,
      type: "triangle",
    });
  } else {
    addTone(context, filter, {
      frequency: 740,
      endFrequency: 610,
      start: now,
      duration: 0.035,
      volume: 0.024,
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

  useEffect(
    () => () => {
      const context = contextRef.current;
      contextRef.current = null;
      if (context && context.state !== "closed") void context.close();
    },
    []
  );

  const playSound = useCallback(
    (sound: MacSound) => {
      if (muted || typeof window === "undefined") return;

      const AudioContextConstructor =
        window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      if (!AudioContextConstructor) return;

      try {
        const context =
          contextRef.current ??
          (contextRef.current = new AudioContextConstructor());

        if (context.state === "running") {
          scheduleSound(context, sound);
          return;
        }

        void context
          .resume()
          .then(() => scheduleSound(context, sound))
          .catch(() => undefined);
      } catch {
        // Audio is progressive enhancement; the desktop remains fully usable.
      }
    },
    [muted]
  );

  const toggleMuted = useCallback(() => {
    setStoredMuted(!readMuted());
  }, []);

  return { muted, playSound, toggleMuted };
}
