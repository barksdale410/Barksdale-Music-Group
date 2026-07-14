import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  studioMode: 'ai' | 'expert';
  setStudioMode: (mode: 'ai' | 'expert') => void;
  daw: string;
  setDaw: (daw: string) => void;
  
  // Studio State
  tempo: number;
  setTempo: (tempo: number) => void;
  musicalKey: string;
  setKey: (key: string) => void;
  swing: number;
  setSwing: (swing: number) => void;
  
  selectedProducer: string | null;
  setSelectedProducer: (id: string | null) => void;
  genre: string;
  setGenre: (genre: string) => void;
  emotion: string;
  setEmotion: (emotion: string) => void;
  chordProgression: string;
  setChordProgression: (chords: string) => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      studioMode: 'ai',
      setStudioMode: (mode) => set({ studioMode: mode }),
      daw: 'FL Studio',
      setDaw: (daw) => set({ daw }),
      
      tempo: 78,
      setTempo: (tempo) => set({ tempo }),
      musicalKey: 'C Minor',
      setKey: (key) => set({ musicalKey: key }),
      swing: 54,
      setSwing: (swing) => set({ swing }),
      
      selectedProducer: null,
      setSelectedProducer: (id) => set({ selectedProducer: id }),
      genre: 'Trap',
      setGenre: (genre) => set({ genre }),
      emotion: 'Dark',
      setEmotion: (emotion) => set({ emotion }),
      chordProgression: '',
      setChordProgression: (chordProgression) => set({ chordProgression }),
    }),
    {
      name: 'barksdale-storage',
    }
  )
);
