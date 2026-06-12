import { useOSStore } from "@/store/useOSStore";

type SoundName = "click" | "beep" | "chime" | "trash" | "disk" | "keystroke";

const SOUND_PATHS: Record<SoundName, string> = {
  click: "/assets/audio/click.mp3",
  beep: "/assets/audio/beep.mp3",
  chime: "/assets/audio/chime.mp3",
  trash: "/assets/audio/trash.mp3",
  disk: "/assets/audio/disk.mp3",
  keystroke: "/assets/audio/keystroke.mp3",
};

export function useAudio() {
  const soundEnabled = useOSStore((state) => state.soundEnabled);

  const playSound = (name: SoundName) => {
    if (!soundEnabled) return;

    try {
      // Look for preloaded DOM element for zero-latency playback
      const domAudio = typeof document !== "undefined" 
        ? (document.getElementById(`audio-${name}`) as HTMLAudioElement | null)
        : null;

      if (domAudio) {
        domAudio.volume = name === "keystroke" ? 0.35 : 0.5; // lower volume for typing clicks
        domAudio.currentTime = 0;
        domAudio.play().catch((err) => {
          console.warn(`Audio '${name}' play blocked:`, err);
        });
      } else {
        const audio = new Audio(SOUND_PATHS[name]);
        audio.volume = name === "keystroke" ? 0.35 : 0.5;
        audio.play().catch((err) => {
          console.warn(`Dynamic audio '${name}' play blocked:`, err);
        });
      }
    } catch (error) {
      console.error(`Failed to play sound effect '${name}':`, error);
    }
  };

  return { playSound };
}
