import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentTrack: string | null;
  loop: boolean;
  play: (track: string) => void;
  pause: () => void;
  stop: () => void;
  toggleLoop: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentTrack: null,
  loop: false,
  play: (track: string) => set({ isPlaying: true, currentTrack: track }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ isPlaying: false, currentTrack: null }),
  toggleLoop: () => set((state) => ({ loop: !state.loop })),
}));
