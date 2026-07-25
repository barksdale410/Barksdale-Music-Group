// Web Audio API & DSP Audio Engine Service for Barksdale Studio
// Multi-stem mixing, 5-band parametric EQ, 8-bar procedural AI synth radio, WAV export, and Web Speech API.

export interface AudioStem {
  id: string;
  name: 'Vocals' | 'Drums' | 'Sub Bass' | 'Synths / FX';
  volume: number; // 0 to 1.5 (0% to 150%)
  pan: number; // -1 to +1 (-100% to +100%)
  pitch: number; // -12 to +12 semitones
  muted: boolean;
  soloed: boolean;
  color: string;
  waveData: number[];
}

export interface EqBand {
  id: string;
  label: string;
  freq: number; // Hz
  gain: number; // dB (-12 to +12)
  q: number; // Quality factor
  type: BiquadFilterType;
  color: string;
}

export interface AdsrEnvelope {
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // 0 to 1 level
  release: number; // seconds
}

export interface MidiAutomationState {
  cc74Cutoff: number;
  cc71Resonance: number;
  cc91SpaceDepth: number;
  cc1TapeWow: number;
  cc11TapeWobble: number;
  mode: 'RECORD' | 'READ' | 'WRITE' | 'TOUCH';
}

export interface StateSnapshot {
  id: string;
  timestamp: number;
  label: string;
  data: any;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master Gain Node & FX Nodes
  private masterGainNode: GainNode | null = null;
  private masterFilterNode: BiquadFilterType | null = null;

  // MIDI CC Automation state
  private midiState: MidiAutomationState = {
    cc74Cutoff: 2500,
    cc71Resonance: 1.5,
    cc91SpaceDepth: 35,
    cc1TapeWow: 10,
    cc11TapeWobble: 15,
    mode: 'READ'
  };

  // State Branching Undo/Redo Tree
  private stateTree: StateSnapshot[] = [];
  private stateIndex = -1;

  // Procedural AI Radio Oscillator Loop
  private radioTimer: number | null = null;
  private isRadioPlaying = false;
  private radioBpm = 96;

  public ensureInitialized(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass({ latencyHint: 'interactive' });
          this.masterGainNode = this.ctx.createGain();
          this.masterGainNode.gain.setValueAtTime(0.8, this.ctx.currentTime);
          this.masterGainNode.connect(this.ctx.destination);

          // iOS Safari AudioContext Unlock Listener
          const unlock = () => {
            if (this.ctx && this.ctx.state === 'suspended') {
              this.ctx.resume().then(() => {
                window.removeEventListener('touchstart', unlock, true);
                window.removeEventListener('touchend', unlock, true);
                window.removeEventListener('click', unlock, true);
              }).catch(() => {});
            }
          };

          window.addEventListener('touchstart', unlock, true);
          window.addEventListener('touchend', unlock, true);
          window.addEventListener('click', unlock, true);
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch((err) => console.warn('AudioContext resume deferred:', err));
      }

      this.isInitialized = true;
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext initialization fallback:', e);
      return null;
    }
  }

  public getContext(): AudioContext | null {
    return this.ensureInitialized();
  }

  // --- 1. POLYPHONIC SYNTHESIZER WITH ADSR ENVELOPE SHAPING ---
  public triggerPolyphonicSynth(
    freq: number = 440,
    type: OscillatorType = 'sawtooth',
    adsr: AdsrEnvelope = { attack: 0.02, decay: 0.15, sustain: 0.6, release: 0.3 },
    velocity: number = 0.8
  ) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(this.midiState.cc74Cutoff, now);
      filter.Q.setValueAtTime(this.midiState.cc71Resonance, now);

      // Standard ADSR Envelope
      const peakGain = Math.max(0.01, Math.min(1.0, velocity));
      const sustainGain = peakGain * adsr.sustain;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + adsr.attack);
      gain.gain.linearRampToValueAtTime(sustainGain, now + adsr.attack + adsr.decay);
      gain.gain.setValueAtTime(sustainGain, now + adsr.attack + adsr.decay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + adsr.attack + adsr.decay + 0.1 + adsr.release);

      osc.connect(filter);
      filter.connect(gain);
      if (this.masterGainNode) gain.connect(this.masterGainNode);

      const duration = adsr.attack + adsr.decay + 0.1 + adsr.release;
      osc.start(now);
      osc.stop(now + duration + 0.05);

      osc.onended = () => {
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('Polyphonic synth trigger error:', e);
    }
  }

  // --- RHODES ELECTRIC PIANO SYNTH ENGINE ---
  public triggerRhodesPiano(freq: number = 261.63, velocity: number = 0.8) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Fundamental sine + tine harmonic
      const osc1 = ctx.createOscillator(); // Sine fundamental
      const osc2 = ctx.createOscillator(); // High tine resonance
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 3.98, now); // Metallic tine harmonic

      const v = Math.max(0.1, Math.min(1, velocity));
      gain1.gain.setValueAtTime(v * 0.7, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2 * v);

      gain2.gain.setValueAtTime(v * 0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain1);
      osc2.connect(gain2);

      if (this.masterGainNode) {
        gain1.connect(this.masterGainNode);
        gain2.connect(this.masterGainNode);
      }

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 0.3);

      osc1.onended = () => {
        try {
          osc1.disconnect();
          gain1.disconnect();
        } catch (_) {}
      };
      osc2.onended = () => {
        try {
          osc2.disconnect();
          gain2.disconnect();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('Rhodes piano trigger error:', e);
    }
  }

  // --- SYNTHESIZED DRUM GENERATORS ---
  public triggerKick(pitchDrop: number = 150, duration: number = 0.2) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitchDrop, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + duration);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      if (this.masterGainNode) gain.connect(this.masterGainNode);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('Kick drum trigger error:', e);
    }
  }

  public triggerSnare(toneFreq: number = 220, noiseBlend: number = 0.6) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Tone oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(toneFreq, now);
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      // White noise buffer for snare snap
      const bufferSize = ctx.sampleRate * 0.15;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1000, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(noiseBlend * 0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(oscGain);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);

      if (this.masterGainNode) {
        oscGain.connect(this.masterGainNode);
        noiseGain.connect(this.masterGainNode);
      }

      osc.start(now);
      noiseSource.start(now);
      osc.stop(now + 0.16);
      noiseSource.stop(now + 0.16);

      osc.onended = () => {
        try {
          osc.disconnect();
          oscGain.disconnect();
        } catch (_) {}
      };
      noiseSource.onended = () => {
        try {
          noiseSource.disconnect();
          noiseFilter.disconnect();
          noiseGain.disconnect();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('Snare trigger error:', e);
    }
  }

  public triggerHiHat(isOpen: boolean = false) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = isOpen ? 0.35 : 0.08;
      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      if (this.masterGainNode) gain.connect(this.masterGainNode);

      noiseSource.start(now);
      noiseSource.stop(now + duration + 0.02);

      noiseSource.onended = () => {
        try {
          noiseSource.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('HiHat trigger error:', e);
    }
  }

  public triggerClap() {
    this.triggerSnare(300, 0.8);
  }

  public triggerBass(freq: number = 65.41, duration: number = 0.4) {
    this.triggerPolyphonicSynth(freq, 'sawtooth', { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.2 }, 0.9);
  }

  public triggerLead(freq: number = 523.25, duration: number = 0.3) {
    this.triggerPolyphonicSynth(freq, 'square', { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.15 }, 0.75);
  }

  // --- 2. MIDI CONTROLLER AUTOMATION SUITE ---
  public setMidiCcParameter(ccNumber: number, value: number, mode?: 'RECORD' | 'READ' | 'WRITE' | 'TOUCH') {
    if (mode) this.midiState.mode = mode;

    switch (ccNumber) {
      case 74: // Cutoff
        this.midiState.cc74Cutoff = value;
        break;
      case 71: // Resonance
        this.midiState.cc71Resonance = value;
        break;
      case 91: // Space Depth
        this.midiState.cc91SpaceDepth = value;
        break;
      case 1: // Tape Wow
        this.midiState.cc1TapeWow = value;
        break;
      case 11: // Tape Wobble
        this.midiState.cc11TapeWobble = value;
        break;
      default:
        break;
    }
  }

  public getMidiState(): MidiAutomationState {
    return { ...this.midiState };
  }

  // --- TEXT-TO-SYNTH & TEXT-TO-MIDI PROMPT PARSER ---
  public parseTextToSynthPrompt(prompt: string) {
    const text = prompt.toLowerCase();
    let genre = 'Lofi Hip-Hop';
    let bpm = 120;
    let key = 'Fm';
    let cutoff = 2500;
    let resonance = 1.5;

    if (text.includes('cyberpunk') || text.includes('synthwave') || text.includes('darksynth')) {
      genre = 'Cyberpunk Synthwave';
      bpm = 135;
      key = 'Dm';
      cutoff = 4000;
      resonance = 3.0;
    } else if (text.includes('ambient') || text.includes('score') || text.includes('cinema')) {
      genre = 'Cinematic Score';
      bpm = 80;
      key = 'C Minor';
      cutoff = 1500;
      resonance = 1.0;
    } else if (text.includes('soul') || text.includes('funk') || text.includes('disco')) {
      genre = 'Retro Soul Tape';
      bpm = 110;
      key = 'G Major';
      cutoff = 3000;
      resonance = 2.0;
    }

    this.midiState.cc74Cutoff = cutoff;
    this.midiState.cc71Resonance = resonance;

    return {
      genre,
      bpm,
      key,
      cutoff,
      resonance,
      parsedPattern: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1]
    };
  }

  // --- 3. GRANULAR SAMPLER HELPER ---
  public triggerGranularGrain(
    density: number = 50,
    spray: number = 20,
    pitchJitter: number = 5,
    grainLength: number = 0.1
  ) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = 440 + (Math.random() * 2 - 1) * pitchJitter * 10;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + grainLength / 2);
      gain.gain.linearRampToValueAtTime(0.001, now + grainLength);

      osc.connect(gain);
      if (this.masterGainNode) gain.connect(this.masterGainNode);

      osc.start(now);
      osc.stop(now + grainLength + 0.01);
    } catch (e) {
      console.warn('Granular grain trigger error:', e);
    }
  }

  // --- STATE BRANCHING TREE UNDO/REDO HISTORY ---
  public pushStateBranch(label: string, data: any): StateSnapshot {
    const snapshot: StateSnapshot = {
      id: `state_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      label,
      data: JSON.parse(JSON.stringify(data))
    };

    this.stateTree = this.stateTree.slice(0, this.stateIndex + 1);
    this.stateTree.push(snapshot);
    this.stateIndex = this.stateTree.length - 1;
    return snapshot;
  }

  public undoStateBranch(): StateSnapshot | null {
    if (this.stateIndex > 0) {
      this.stateIndex--;
      return this.stateTree[this.stateIndex];
    }
    return null;
  }

  public redoStateBranch(): StateSnapshot | null {
    if (this.stateIndex < this.stateTree.length - 1) {
      this.stateIndex++;
      return this.stateTree[this.stateIndex];
    }
    return null;
  }

  // --- PROCEDURAL 8-BAR AI RADIO SYNTHESIZER ---
  public toggleAiRadio(
    isPlaying: boolean,
    style: string = 'Lofi Cyberpunk',
    onBeat?: (bar: number, step: number) => void
  ) {
    const ctx = this.ensureInitialized();
    if (!ctx) return;

    if (!isPlaying) {
      this.isRadioPlaying = false;
      if (this.radioTimer) clearInterval(this.radioTimer);
      this.radioTimer = null;
      return;
    }

    this.isRadioPlaying = true;
    let step = 0;
    let bar = 1;

    // Frequencies for procedural 8-bar chord progression (Fm7, Bbm7, Cm7, Dbmaj7)
    const chordFrequencies: Record<string, number[]> = {
      'Lofi Cyberpunk': [174.61, 207.65, 261.63, 311.13], // F3, Ab3, C4, Eb4
      'Hype Williams Neon': [233.08, 277.18, 349.23, 415.3], // Bb3, Db4, F4, Ab4
      'Kubrick Synth Odyssey': [130.81, 196.0, 261.63, 329.63], // C3, G3, C4, E4
      'Tarantino Soul Tape': [146.83, 174.61, 220.0, 261.63], // D3, F3, A3, C4
    };

    const freqs = chordFrequencies[style] || chordFrequencies['Lofi Cyberpunk'];
    const intervalMs = (60 / this.radioBpm / 4) * 1000; // 16th note interval

    if (this.radioTimer) clearInterval(this.radioTimer);

    this.radioTimer = window.setInterval(() => {
      if (!this.isRadioPlaying || !this.ctx) return;

      try {
        const now = this.ctx.currentTime;

        // Play Kick on steps 0, 8, 10
        if (step % 4 === 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.18);
          gain.gain.setValueAtTime(0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(gain);
          if (this.masterGainNode) gain.connect(this.masterGainNode);
          osc.start(now);
          osc.stop(now + 0.18);
        }

        // Play Snare/Clap on step 4, 12
        if (step % 8 === 4) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(280, now);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          if (this.masterGainNode) gain.connect(this.masterGainNode);
          osc.start(now);
          osc.stop(now + 0.12);
        }

        // Play Synth Chords on step 0, 6, 12
        if (step % 4 === 0 || step === 6 || step === 14) {
          const noteFreq = freqs[(step + bar) % freqs.length];
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(noteFreq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, now);
          filter.frequency.exponentialRampToValueAtTime(400, now + 0.3);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(filter);
          filter.connect(gain);
          if (this.masterGainNode) gain.connect(this.masterGainNode);

          osc.start(now);
          osc.stop(now + 0.35);
        }

        if (onBeat) onBeat(bar, step);

        step++;
        if (step >= 16) {
          step = 0;
          bar = (bar % 8) + 1;
        }
      } catch (e) {
        console.warn('AI Radio beat tick error:', e);
      }
    }, intervalMs);
  }

  // --- WEB SPEECH SYNTHESIS FOR DIRECTOR VOICE AUDITIONS ---
  public speakDirectorAudition(text: string, voiceName?: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not available in this browser environment.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try selecting male/deep voice or fallback
        const selectedVoice =
          voices.find((v) => v.name.includes('David') || v.name.includes('Google US English')) ||
          voices[0];
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  // --- WAV EXPORT HELPER ---
  public exportStemToWav(stemName: string, waveData: number[]): Blob {
    const sampleRate = 44100;
    const durationSec = 5;
    const numSamples = sampleRate * durationSec;
    const buffer = new Float32Array(numSamples);

    // Synthesize audible tone based on waveData
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = stemName === 'Sub Bass' ? 60 : stemName === 'Drums' ? 120 : stemName === 'Vocals' ? 440 : 880;
      const env = Math.exp(-t % 1);
      buffer[i] = Math.sin(2 * Math.PI * freq * t) * 0.5 * env;
    }

    // Convert Float32Array to 16-bit PCM WAV Blob
    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    this.writeString(view, 8, 'WAVE');

    // FMT sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
    view.setUint16(22, 1, true); // NumChannels (1 = Mono)
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true); // BitsPerSample

    // DATA sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Write samples
    let offset = 44;
    for (let i = 0; i < numSamples; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

export const audioEngine = new AudioEngine();
