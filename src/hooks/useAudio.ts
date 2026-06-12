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
      const audio = new Audio(SOUND_PATHS[name]);
      audio.volume = 0.5;
      audio.play().catch((err) => {
        // Suppress browser autoplay policy errors silently
        console.warn("Audio autoplay blocked by browser policy:", err);
      });
    } catch (error) {
      console.error("Failed to play sound effect:", error);
    }
  };

  return { playSound };
}
