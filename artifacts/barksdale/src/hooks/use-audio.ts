import * as Tone from 'tone';
import { useCallback, useRef, useEffect } from 'react';
import { useAudioStore } from './use-audio-store';

export function useAudio() {
  const { isPlaying, currentTrack, loop, play, pause, stop, toggleLoop } = useAudioStore();
  
  const synthsRef = useRef<{
    polySynth?: Tone.PolySynth;
    kick?: Tone.MembraneSynth;
    snare?: Tone.NoiseSynth;
    hihat?: Tone.MetalSynth;
  }>({});

  const initialized = useRef(false);

  const initAudio = useCallback(async () => {
    if (initialized.current) return;
    await Tone.start();
    
    synthsRef.current.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    synthsRef.current.polySynth.volume.value = -12;
    
    synthsRef.current.kick = new Tone.MembraneSynth().toDestination();
    synthsRef.current.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();
    synthsRef.current.hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
    }).toDestination();
    synthsRef.current.hihat.frequency.value = 200;
    synthsRef.current.hihat.volume.value = -10;

    initialized.current = true;
  }, []);

  const playPreview = useCallback(async (name: string, type: 'chord' | 'beat' = 'chord', chords?: string) => {
    await initAudio();
    stop(); // stop any current
    play(name);
    
    if (type === 'chord' && chords && synthsRef.current.polySynth) {
      // Very naive chord parsing, just to make a sound
      const time = Tone.now();
      synthsRef.current.polySynth.triggerAttackRelease(["C4", "E4", "G4"], "1n", time);
    } else if (type === 'beat' && synthsRef.current.kick) {
      const time = Tone.now();
      synthsRef.current.kick.triggerAttackRelease("C1", "8n", time);
      synthsRef.current.hihat?.triggerAttackRelease("32n", time + 0.25);
      synthsRef.current.snare?.triggerAttackRelease("16n", time + 0.5);
      synthsRef.current.hihat?.triggerAttackRelease("32n", time + 0.75);
    }
    
    // Auto stop after 2s for preview
    setTimeout(() => {
      stop();
    }, 2000);
  }, [initAudio, play, stop]);

  return {
    isPlaying,
    currentTrack,
    loop,
    playPreview,
    pause,
    stop,
    toggleLoop
  };
}
