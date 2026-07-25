import { logFunctionCall } from './logger';

export const createAudioUrlFromBase64 = (base64: string, mimeType: string): string => {
  logFunctionCall('createAudioUrlFromBase64', { base64Length: base64.length, mimeType });
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to decode audio base64:", e);
    return "";
  }
};

// --- WEBAUDIO SYNTHESIZER FOR REALTIME PLAYBACK ---

const NOTE_FREQS: Record<string, number> = {
  "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13, "E": 329.63, "F": 349.23,
  "F#": 369.99, "G": 392.00, "G#": 415.30, "A": 440.00, "A#": 466.16, "B": 493.88
};

// Helper to get frequencies for a chord name (e.g. "Cmaj7", "Am")
export function parseChordToFrequencies(chordName: string, octave = 4): number[] {
  // Parse root note
  let root = chordName.substring(0, 1).toUpperCase();
  let rest = chordName.substring(1);
  if (rest.startsWith("#") || rest.startsWith("b")) {
    root += rest.substring(0, 1);
    rest = rest.substring(1);
  }
  
  // Clean up b to # mapping if needed
  if (root === "Db") root = "C#";
  if (root === "Eb") root = "D#";
  if (root === "Gb") root = "F#";
  if (root === "Ab") root = "G#";
  if (root === "Bb") root = "A#";

  const rootFreq = NOTE_FREQS[root];
  if (!rootFreq) return [261.63]; // fallback to C4

  // Map root index in chromatic scale
  const roots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const rootIndex = roots.indexOf(root);
  
  // Set chord intervals
  let intervals = [0, 4, 7]; // Major default
  if (rest.startsWith("m9")) {
    intervals = [0, 3, 7, 10, 14];
  } else if (rest.startsWith("maj9") || rest.startsWith("m11")) {
    intervals = [0, 4, 7, 11, 14];
  } else if (rest.startsWith("maj7") || rest.startsWith("M7")) {
    intervals = [0, 4, 7, 11];
  } else if (rest.startsWith("m7") || rest.startsWith("min7")) {
    intervals = [0, 3, 7, 10];
  } else if (rest.startsWith("7alt") || rest.startsWith("alt")) {
    intervals = [0, 4, 10, 13]; // dom 7 b9
  } else if (rest.startsWith("7")) {
    intervals = [0, 4, 7, 10];
  } else if (rest.startsWith("m") || rest.startsWith("min")) {
    intervals = [0, 3, 7];
  } else if (rest.startsWith("dim")) {
    intervals = [0, 3, 6];
  } else if (rest.startsWith("aug")) {
    intervals = [0, 4, 8];
  } else if (rest.startsWith("sus4")) {
    intervals = [0, 5, 7];
  } else if (rest.startsWith("sus2")) {
    intervals = [0, 2, 7];
  }

  // Generate frequencies based on base note octave
  const baseMidi = 12 * (octave + 1) + rootIndex;
  return intervals.map(interval => {
    const midi = baseMidi + interval;
    // MIDI to Frequency formula: f = 440 * 2^((d-69)/12)
    return 440 * Math.pow(2, (midi - 69) / 12);
  });
}

class AigenioSynthManager {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentStep = 0;
  private sequencerTimer: any = null;
  private isSequencerRunning = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime); // safety volume
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64; // small buffer for high refresh rate visuals
      
      this.masterVolume.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initCtx();
    return this.analyser;
  }

  public setVolume(val: number) {
    this.initCtx();
    if (this.masterVolume && this.ctx) {
      this.masterVolume.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  // Plays a single pitch frequency with Rhodes-like synthesis
  public playRhodesNote(freq: number, duration = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterVolume) return;

    const t = this.ctx.currentTime;
    
    // Core sine oscillator (fundamental)
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, t);

    // Warm triangle oscillator (overtone for reed sound)
    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, t);

    // Gain stages for envelope
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    // Lowpass filter for warm tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 3, t);

    // ADSR Envelopes
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.4, t + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + duration);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.1, t + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    // Connections
    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);

    filter.connect(this.masterVolume);

    osc1.start(t);
    osc2.start(t);

    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  // Plays an entire parsed chord together
  public playChord(chordName: string, duration = 1.0) {
    const freqs = parseChordToFrequencies(chordName);
    freqs.forEach(freq => {
      this.playRhodesNote(freq, duration);
    });
  }

  // Drum Synthesizer: Kick (808 style punchy dive)
  public playKick() {
    this.initCtx();
    if (!this.ctx || !this.masterVolume) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.3);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1.0, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Drum Synthesizer: Snare (Filtered white noise crack)
  public playSnare() {
    this.initCtx();
    if (!this.ctx || !this.masterVolume) return;
    const t = this.ctx.currentTime;

    // Buffer creation for White Noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;

    // Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    // Tone oscillator for snap
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    osc.connect(oscGain);
    oscGain.connect(this.masterVolume);

    noiseSource.start(t);
    osc.start(t);

    noiseSource.stop(t + 0.2);
    osc.stop(t + 0.2);
  }

  // Drum Synthesizer: Hi-Hat (Metallic high-frequency tick)
  public playHiHat() {
    this.initCtx();
    if (!this.ctx || !this.masterVolume) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 8000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noise.start(t);
    noise.stop(t + 0.05);
  }

  // Drum Synthesizer: Hand Clap
  public playClap() {
    this.initCtx();
    if (!this.ctx || !this.masterVolume) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1500;

    const gain = this.ctx.createGain();
    // Simulate multiple fast hand overlaps
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
    gain.gain.linearRampToValueAtTime(0.6, t + 0.015);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.025);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noise.start(t);
    noise.stop(t + 0.15);
  }

  // Sequences 8-step loops
  public startBeatSequencer(
    bpm: number, 
    steps: { kick: boolean[]; snare: boolean[]; hat: boolean[]; clap: boolean[] },
    chordsList: string[], // list of up to 4 chords to trigger on steps 0, 2, 4, 6
    onStepTrigger: (stepIndex: number) => void
  ) {
    this.initCtx();
    if (this.isSequencerRunning) {
      this.stopBeatSequencer();
    }

    this.isSequencerRunning = true;
    this.currentStep = 0;

    const intervalMs = (60 / bpm / 2) * 1000; // eighth notes

    const runSeq = () => {
      const step = this.currentStep;

      // 1. Trigger chord on steps 0, 2, 4, 6
      if (chordsList.length > 0 && step % 2 === 0) {
        const chordIndex = (step / 2) % chordsList.length;
        const currentChord = chordsList[chordIndex];
        if (currentChord) {
          this.playChord(currentChord, (60 / bpm) * 0.9);
        }
      }

      // 2. Trigger Drums
      if (steps.kick[step]) this.playKick();
      if (steps.snare[step]) this.playSnare();
      if (steps.hat[step]) this.playHiHat();
      if (steps.clap[step]) this.playClap();

      // UI callback
      onStepTrigger(step);

      this.currentStep = (this.currentStep + 1) % 8;
      this.sequencerTimer = setTimeout(runSeq, intervalMs);
    };

    runSeq();
  }

  public stopBeatSequencer() {
    if (this.sequencerTimer) {
      clearTimeout(this.sequencerTimer);
      this.sequencerTimer = null;
    }
    this.isSequencerRunning = false;
  }

  public toggleBeatSequencer(bpm = 95, onStepTrigger?: (stepIndex: number) => void) {
    if (this.isSequencerRunning) {
      this.stopBeatSequencer();
    } else {
      const defaultSteps = {
        kick: [true, false, false, false, true, false, false, false],
        snare: [false, false, true, false, false, false, true, false],
        hat: [true, true, true, true, true, true, true, true],
        clap: [false, false, false, false, true, false, false, false]
      };
      this.startBeatSequencer(bpm, defaultSteps, ['Fm7', 'Bbm7', 'Cm7', 'Dbmaj7'], onStepTrigger || (() => {}));
    }
  }

  // --- NATIVE WEB MIDI CONTROLLER ENGINE SERVICE INTEGRATION ---
  private midiCallbacks: ((status: number, data1: number, data2: number, deviceName: string) => void)[] = [];
  private midiAccessRequested = false;

  public registerMidiCallback(cb: (status: number, data1: number, data2: number, deviceName: string) => void) {
    this.midiCallbacks.push(cb);
    this.initMidiAccess();
  }

  public unregisterMidiCallback(cb: (status: number, data1: number, data2: number, deviceName: string) => void) {
    this.midiCallbacks = this.midiCallbacks.filter(c => c !== cb);
  }

  private initMidiAccess() {
    if (this.midiAccessRequested) return;
    this.midiAccessRequested = true;

    if (!navigator.requestMIDIAccess) {
      console.warn("Web MIDI API not supported in this browser environment.");
      return;
    }

    navigator.requestMIDIAccess()
      .then((access) => {
        const inputs = Array.from(access.inputs.values());
        inputs.forEach(input => {
          input.onmidimessage = (msg) => this.handleIncomingMidiMessage(msg, input.name || "External Controller");
        });

        access.onstatechange = (e: any) => {
          if (e.port && e.port.type === 'input' && e.port.state === 'connected') {
            e.port.onmidimessage = (msg: any) => this.handleIncomingMidiMessage(msg, e.port.name || "External Controller");
          }
        };
      })
      .catch((err) => {
        console.error("Failed to initialize Web MIDI Access inside audioUtils:", err);
      });
  }

  private handleIncomingMidiMessage(message: any, deviceName: string) {
    const data = message.data;
    if (!data || data.length < 3) return;

    const status = data[0];
    const data1 = data[1];
    const data2 = data[2];

    // Propagate to all registered mapping and visualizers
    this.midiCallbacks.forEach(cb => {
      try {
        cb(status, data1, data2, deviceName);
      } catch (err) {
        console.error("Error in MIDI listener callback:", err);
      }
    });
  }
}

export const aigenioSynth = new AigenioSynthManager();
export const barksdaleSynth = aigenioSynth;
