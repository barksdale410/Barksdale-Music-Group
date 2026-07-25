import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Play, Pause, Download, ChevronDown, ChevronUp, Music, Sparkles, Volume2, Sliders, Layers, Activity, Database, RefreshCw, Settings, AlertTriangle, Compass, Grid, Zap, ShieldAlert, Award } from 'lucide-react';
import { AI_SCORE_ENGINES, ROOT_NOTES } from '../data/musicData';
import { barksdaleSynth } from '../utils/audioUtils';

// Audio Context helper for our native sampler simulation
let samplerAudioCtx: AudioContext | null = null;

export const EnginesTab: React.FC = () => {
  // Top level mode: Sampler Simulator vs AI Score Engines
  const [activeTab, setActiveTab] = useState<'sampler' | 'score'>('sampler');

  // AI Score Engine states (original feature updated to gold/bronze theme)
  const [expandedEngineId, setExpandedEngineId] = useState<string | null>(AI_SCORE_ENGINES[0].id);
  const [selectedEmotions, setSelectedEmotions] = useState<Record<string, string>>({
    engine_mafia: "Vengeful",
    engine_gospel: "Praise",
    engine_jazz: "Blue Lounge",
    engine_lofi: "Rainy Day",
    engine_trap: "Savage Mode",
    engine_orchestral: "Epic Hope",
    engine_rb: "Velvet Sheets",
    engine_boombap: "Queensbridge Grit"
  });

  const [selectedKeys, setSelectedKeys] = useState<Record<string, string>>({
    engine_mafia: "A",
    engine_gospel: "F",
    engine_jazz: "D",
    engine_lofi: "A",
    engine_trap: "F#",
    engine_orchestral: "C",
    engine_rb: "Eb",
    engine_boombap: "C"
  });

  const [customBpms, setCustomBpms] = useState<Record<string, number>>({
    engine_mafia: 84,
    engine_gospel: 95,
    engine_jazz: 100,
    engine_lofi: 78,
    engine_trap: 140,
    engine_orchestral: 72,
    engine_rb: 90,
    engine_boombap: 90
  });

  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);

  // SPITFIRE SAMPLER ENGINE STATES
  const [selectedLibrary, setSelectedLibrary] = useState<string>('bbc_so_strings');
  const [selectedArticulation, setSelectedArticulation] = useState<string>('legato');
  const [dynamicCC1, setDynamicCC1] = useState<number>(75); // 0-127 (velocity layers mix)
  const [expressionCC11, setExpressionCC11] = useState<number>(95); // 0-127 (volume offset)
  const [releaseCC21, setReleaseCC21] = useState<number>(45); // release time

  // Microphone signals (0 - 100)
  const [micClose, setMicClose] = useState<number>(80);
  const [micDecca, setMicDecca] = useState<number>(90);
  const [micOutrig, setMicOutrig] = useState<number>(30);
  const [micAmbient, setMicAmbient] = useState<number>(60);
  const [outputConfig, setOutputConfig] = useState<'stereo' | 'surround' | 'atmos'>('stereo');

  // Evolution Grid Peg Pins mapping (row = instrument, col = octave / pitch range)
  // EVO engines trigger generative crossfades
  const [evoGridPins, setEvoGridPins] = useState<Record<string, number>>({
    'Violins I': 2,
    'Violins II': 1,
    'Violas': 3,
    'Cellos': 0,
    'Basses': 4
  });

  // Keyboard notes mapping for playable visual MIDI zone
  const [activePianoKey, setActivePianoKey] = useState<number | null>(null);
  const [roundRobinCounter, setRoundRobinCounter] = useState<number>(1);
  const [totalPolyphony, setTotalPolyphony] = useState<number>(0);
  const [samplerDiskIOLatency, setSamplerDiskIOLatency] = useState<number>(1.2); // ms
  const [ramUsageMb, setRamUsageMb] = useState<number>(245.8);

  // Active Roadmap Tab
  const [roadmapTab, setRoadmapTab] = useState<'architecture' | 'uml' | 'legato' | 'pitfalls'>('architecture');

  // Local Web Audio synthesizer nodes for interactive real-time play
  const activeOscillatorsRef = useRef<Record<number, { oscs: any[], gain: GainNode, modulationTimer?: any }>>({});

  const toggleEngineExpand = (id: string) => {
    if (expandedEngineId === id) {
      setExpandedEngineId(null);
    } else {
      setExpandedEngineId(id);
    }
  };

  const handlePlayEnginePreview = (engine: any) => {
    if (activePlaybackId === engine.id) {
      barksdaleSynth.stopBeatSequencer();
      setActivePlaybackId(null);
    } else {
      barksdaleSynth.stopBeatSequencer();
      setActivePlaybackId(engine.id);

      const emotionName = selectedEmotions[engine.id];
      const emotionSpec = engine.emotions.find((e: any) => e.name === emotionName) || engine.emotions[0];
      const selectedKey = selectedKeys[engine.id];
      const customBpm = customBpms[engine.id] || engine.defaultBpm;

      const baseProgression = emotionSpec.progression;
      const transposedProgression = baseProgression.map((chord: string) => {
        let originalRoot = chord.substring(0, 1);
        let rest = chord.substring(1);
        if (rest.startsWith("#") || rest.startsWith("b")) {
          originalRoot += rest.substring(0, 1);
          rest = rest.substring(1);
        }
        return `${selectedKey}${rest}`;
      });

      const beatString = emotionSpec.beats;
      const parsedDrums = {
        kick:  Array(8).fill(false),
        snare: Array(8).fill(false),
        hat:   Array(8).fill(false),
        clap:  Array(8).fill(false)
      };

      for (let i = 0; i < Math.min(8, beatString.length); i++) {
        const symbol = beatString[i];
        if (symbol === 'K') parsedDrums.kick[i] = true;
        if (symbol === 'S') parsedDrums.snare[i] = true;
        if (symbol === 'H') parsedDrums.hat[i] = true;
        if (symbol === 'C') parsedDrums.clap[i] = true;
      }

      barksdaleSynth.startBeatSequencer(customBpm, parsedDrums, transposedProgression, () => {});
    }
  };

  // Real-time Web Audio sound synthesis for the Spitfire Instrument Sampler simulator
  const playSamplerSynthNote = (midiNote: number, frequency: number) => {
    try {
      if (!samplerAudioCtx) {
        samplerAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (samplerAudioCtx.state === 'suspended') {
        samplerAudioCtx.resume();
      }

      // Stop previous osc if hanging
      stopSamplerSynthNote(midiNote);

      const ctx = samplerAudioCtx;
      const now = ctx.currentTime;

      // Dynamics scalar based on CC#1 (Dynamics) and CC#11 (Expression)
      const dynamicsMultiplier = (dynamicCC1 / 127) * 0.8 + 0.2;
      const expressionMultiplier = expressionCC11 / 127;
      const masterVolume = 0.25 * dynamicsMultiplier * expressionMultiplier;

      // Simulate Microphone Mix ratios
      const mixSum = (micClose + micDecca + micOutrig + micAmbient) || 1;
      const closeRatio = micClose / mixSum;
      const ambientRatio = micAmbient / mixSum;
      const deccaRatio = micDecca / mixSum;

      // Create main voice nodes
      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0, now);

      // Lowpass Filter simulates orchestral frequency damping on lower dynamic layers
      const lowpassFilter = ctx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      // High CC1 dynamics opens up string brightness (simulating harder bowing brass raspiness)
      const maxFreq = selectedLibrary.includes('brass') ? 8000 : 4500;
      const minFreq = 800;
      const targetCutoff = minFreq + (dynamicCC1 / 127) * (maxFreq - minFreq);
      lowpassFilter.frequency.setValueAtTime(targetCutoff, now);
      lowpassFilter.Q.setValueAtTime(0.8, now);

      // Simple Stereo Panner based on stereo, surround, or atmos configuration
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) {
        // Base panning map by midiNote range (low is left, high is right like string seat layout)
        const notePan = ((midiNote - 60) / 24) * 0.6; // limit to -0.6 to 0.6
        panner.pan.setValueAtTime(Math.max(-0.8, Math.min(0.8, notePan)), now);
      }

      // Reverb simulation (Ambient mic signal controls a delay/feedback loop to replicate Hall acoustics)
      const delayNode = ctx.createDelay(1.0);
      const feedbackNode = ctx.createGain();
      // ambient microphone level drives the acoustic room reflection volume
      const roomReflectionVolume = 0.45 * (micAmbient / 100);
      feedbackNode.gain.setValueAtTime(roomReflectionVolume, now);
      delayNode.delayTime.setValueAtTime(0.18 + (micAmbient / 500), now); // 180ms to 380ms depending on room ambient mix

      // Wire reverb network
      delayNode.connect(feedbackNode);
      feedbackNode.connect(delayNode);

      // Osc bank representing multi-microphone orchestral layers
      const oscs: any[] = [];

      if (selectedLibrary === 'labs_piano') {
        // Felt soft piano: Subdued attack, rich harmonics
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(frequency, now);
        osc2.frequency.setValueAtTime(frequency * 2.002, now); // soft detune

        osc1.connect(voiceGain);
        osc2.connect(voiceGain);
        osc1.start(now);
        osc2.start(now);
        oscs.push(osc1, osc2);

        // Felt piano envelope
        voiceGain.gain.linearRampToValueAtTime(masterVolume * 1.5, now + 0.04);
        voiceGain.gain.exponentialRampToValueAtTime(masterVolume * 0.1, now + 1.2);
      } 
      else if (selectedArticulation === 'pizzicato') {
        // Plucked Orchestral strings
        const pluckOsc = ctx.createOscillator();
        pluckOsc.type = 'triangle';
        pluckOsc.frequency.setValueAtTime(frequency, now);

        // Simulating wood pluck transient
        const noiseOsc = ctx.createOscillator();
        noiseOsc.type = 'sine';
        noiseOsc.frequency.setValueAtTime(frequency * 5.01, now);

        pluckOsc.connect(voiceGain);
        noiseOsc.connect(voiceGain);
        pluckOsc.start(now);
        noiseOsc.start(now);
        oscs.push(pluckOsc, noiseOsc);

        // Ultra fast attack, rapid decay, zero sustain
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(masterVolume * 2.0, now + 0.005);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      } 
      else if (selectedArticulation === 'spiccato') {
        // Short, bouncy bowing (staccatissimo)
        const sawOsc = ctx.createOscillator();
        const triOsc = ctx.createOscillator();
        sawOsc.type = 'sawtooth';
        triOsc.type = 'triangle';
        sawOsc.frequency.setValueAtTime(frequency, now);
        triOsc.frequency.setValueAtTime(frequency * 0.998, now);

        sawOsc.connect(voiceGain);
        triOsc.connect(voiceGain);
        sawOsc.start(now);
        triOsc.start(now);
        oscs.push(sawOsc, triOsc);

        // Fast attack, short sharp decay
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(masterVolume * 2.2, now + 0.012);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      } 
      else if (selectedArticulation === 'tremolo') {
        // Bow trembling: Fast amplitude modulation
        const sawOsc = ctx.createOscillator();
        const triOsc = ctx.createOscillator();
        sawOsc.type = 'sawtooth';
        triOsc.type = 'triangle';
        sawOsc.frequency.setValueAtTime(frequency, now);
        triOsc.frequency.setValueAtTime(frequency * 1.002, now);

        sawOsc.connect(voiceGain);
        triOsc.connect(voiceGain);
        sawOsc.start(now);
        triOsc.start(now);
        oscs.push(sawOsc, triOsc);

        // Slow cinematic attack
        voiceGain.gain.linearRampToValueAtTime(masterVolume * 0.8, now + 0.25);

        // LFO Amplitude Modulation at 9.5Hz representing rapid bowing flutter
        const tremoloLFO = ctx.createGain();
        tremoloLFO.gain.setValueAtTime(1.0, now);
        voiceGain.connect(tremoloLFO);

        let count = 0;
        const intervalId = setInterval(() => {
          if (samplerAudioCtx) {
            const time = samplerAudioCtx.currentTime;
            // rapid flutter amplitude between 0.4 and 1.0
            const amp = 0.7 + Math.sin(count * 1.2) * 0.3;
            tremoloLFO.gain.setValueAtTime(amp, time);
            count++;
          }
        }, 35);

        // Save custom tremolo LFO timer to clean it up later
        activeOscillatorsRef.current[midiNote] = {
          oscs: oscs,
          gain: voiceGain,
          modulationTimer: intervalId
        };

        // Connect tremolo filter stream to main output
        tremoloLFO.connect(lowpassFilter);
        return; // handle custom save above
      } 
      else {
        // Sustained Legato/Longs
        const sawOsc = ctx.createOscillator();
        const triOsc = ctx.createOscillator();
        
        // Woodwinds are purely triangle/sine, Brass are pure sawtooth, Strings are blended
        if (selectedLibrary.includes('brass')) {
          sawOsc.type = 'sawtooth';
          triOsc.type = 'sawtooth';
          sawOsc.frequency.setValueAtTime(frequency, now);
          triOsc.frequency.setValueAtTime(frequency * 1.003, now); // raspy detune
        } else if (selectedLibrary.includes('woodwinds')) {
          sawOsc.type = 'triangle';
          triOsc.type = 'sine';
          sawOsc.frequency.setValueAtTime(frequency, now);
          triOsc.frequency.setValueAtTime(frequency * 1.001, now);
        } else {
          // strings
          sawOsc.type = 'sawtooth';
          triOsc.type = 'triangle';
          sawOsc.frequency.setValueAtTime(frequency, now);
          triOsc.frequency.setValueAtTime(frequency * 1.004, now);
        }

        sawOsc.connect(voiceGain);
        triOsc.connect(voiceGain);
        sawOsc.start(now);
        triOsc.start(now);
        oscs.push(sawOsc, triOsc);

        // Slow warm cinematic bow attack (ADSR)
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(masterVolume * 1.2, now + 0.18); // 180ms swell
        voiceGain.gain.setValueAtTime(masterVolume * 1.2, now + 0.3);
      }

      // Final signal chain route
      voiceGain.connect(lowpassFilter);

      // Apply microphone ambient signal reverb send
      if (roomReflectionVolume > 0) {
        lowpassFilter.connect(delayNode);
        delayNode.connect(ctx.destination);
      }

      if (panner) {
        lowpassFilter.connect(panner);
        panner.connect(ctx.destination);
      } else {
        lowpassFilter.connect(ctx.destination);
      }

      // Store references to stop sound later
      activeOscillatorsRef.current[midiNote] = {
        oscs: oscs,
        gain: voiceGain
      };

      // Set active polyphony count
      setTotalPolyphony(Object.keys(activeOscillatorsRef.current).length * 2);

    } catch (e) {
      console.warn("Web Audio sampler trigger failed:", e);
    }
  };

  const stopSamplerSynthNote = (midiNote: number) => {
    const voice = activeOscillatorsRef.current[midiNote];
    if (voice) {
      const now = samplerAudioCtx ? samplerAudioCtx.currentTime : 0;
      // Release envelope mapped to Release Slider CC21 (0-127 mapped to 0.05s to 2.5s)
      const releaseTime = 0.05 + (releaseCC21 / 127) * 2.2;

      try {
        if (voice.modulationTimer) {
          clearInterval(voice.modulationTimer);
        }

        // exponential decay on release
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

        // schedule stopping oscillators
        voice.oscs.forEach(osc => {
          try {
            osc.stop(now + releaseTime + 0.1);
          } catch (e) {}
        });
      } catch (e) {
        // Fallback fast stop
        voice.oscs.forEach(osc => {
          try { osc.stop(); } catch(err) {}
        });
      }

      delete activeOscillatorsRef.current[midiNote];
      setTotalPolyphony(Math.max(0, Object.keys(activeOscillatorsRef.current).length * 2));
    }
  };

  const handlePianoKeyDown = (midi: number, freq: number) => {
    setActivePianoKey(midi);
    playSamplerSynthNote(midi, freq);

    // Increment round robin counter (1-4 cycling to prevent machine gun repetition)
    setRoundRobinCounter(prev => (prev % 4) + 1);

    // Simulate disk latency variation
    setSamplerDiskIOLatency(parseFloat((0.6 + Math.random() * 0.9).toFixed(2)));

    // Simulate RAM memory sharing effect
    setRamUsageMb(parseFloat((240 + Math.sin(midi) * 12 + Math.random() * 2).toFixed(1)));
  };

  const handlePianoKeyUp = (midi: number) => {
    if (activePianoKey === midi) {
      setActivePianoKey(null);
    }
    stopSamplerSynthNote(midi);
  };

  // Preset Instruments info map
  const samplersPresetMap: Record<string, { name: string; desc: string; sampleCount: string; size: string; version: string; defaultKeys: string }> = {
    bbc_so_strings: {
      name: "BBC SO Professional Strings",
      desc: "67 string performers, 468 articulation techniques recorded at Maida Vale Studio One.",
      sampleCount: "128,450 Samples",
      size: "210 GB on disk",
      version: "v1.4.2",
      defaultKeys: "C1 - G6"
    },
    bbc_so_brass: {
      name: "BBC SO Professional Brass",
      desc: "17 brass performers (Trumpets, Horns, Trombones, Tuba) with rasping cuivré layers.",
      sampleCount: "82,300 Samples",
      size: "185 GB on disk",
      version: "v1.4.0",
      defaultKeys: "E1 - C5"
    },
    spitfire_chamber: {
      name: "Chamber Strings Pro",
      desc: "Delicate and intimate 16-player ensemble recorded at AIR Lyndhurst Hall.",
      sampleCount: "155,000 Samples",
      size: "84 GB on disk",
      version: "v2.1.0",
      defaultKeys: "C1 - F6"
    },
    labs_piano: {
      name: "LABS - Felt Soft Piano",
      desc: "Broadcast-quality felted acoustic piano with a warm, intimate character.",
      sampleCount: "820 Samples",
      size: "1.2 GB on disk",
      version: "v1.0.4",
      defaultKeys: "A0 - C8"
    },
    edna_synth: {
      name: "eDNA Earth Sample Synth",
      desc: "Granular sound synthesis warping orchestral loops into heavy hybrid textures.",
      sampleCount: "12,900 Samples",
      size: "45 GB on disk",
      version: "v3.0.1",
      defaultKeys: "C1 - C7"
    },
    evo_grid: {
      name: "Evolving Generative Grid",
      desc: "Generative textures shifting based on modular multi-octave patch peg pins.",
      sampleCount: "8,400 Samples",
      size: "28 GB on disk",
      version: "v2.0.0",
      defaultKeys: "F1 - C6"
    },
    swarm_granular: {
      name: "Swarm Granular Clouds",
      desc: "Lush micro-moment note clusters shifting randomly in pitch and velocity.",
      sampleCount: "18,200 Samples",
      size: "35 GB on disk",
      version: "v1.2.0",
      defaultKeys: "C2 - G5"
    }
  };

  const selectedLibMeta = samplersPresetMap[selectedLibrary] || samplersPresetMap.bbc_so_strings;

  // Custom EVOlution peg placement handler
  const handleToggleEvoPeg = (instrumentName: string, octaveIndex: number) => {
    setEvoGridPins(prev => ({
      ...prev,
      [instrumentName]: octaveIndex
    }));
    // Play sound on click to provide feedback
    const baseFreqs = [110, 146, 220, 293, 440];
    const targetFreq = baseFreqs[octaveIndex] || 220;
    if (samplerAudioCtx) {
      playSamplerSynthNote(60 + octaveIndex * 5, targetFreq);
      setTimeout(() => stopSamplerSynthNote(60 + octaveIndex * 5), 400);
    }
  };

  return (
    <div className="p-4 space-y-6" id="engines-tab-view">
      {/* Tab Controller Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#2c2c36] pb-4">
        <div>
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--bmg-accent-primary)]" /> Core Playback & Synthesis Workstation
          </h2>
          <p className="text-[11px] text-[#8e8e93] mt-1">Configure first-party sample streaming engines or access AI scoring blocks.</p>
        </div>

        {/* Tab Selection Switch */}
        <div className="bg-[#141416] p-1 rounded-lg border border-[#25252b] flex">
          <button
            onClick={() => setActiveTab('sampler')}
            className={`px-4 py-1.5 rounded text-[10px] uppercase font-bold tracking-wide transition-all ${
              activeTab === 'sampler'
                ? "bg-[var(--bmg-accent-primary)] text-black font-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Orchestral Stock Sampler (Spitfire Clone)
          </button>
          <button
            onClick={() => {
              barksdaleSynth.stopBeatSequencer();
              setActiveTab('score');
            }}
            className={`px-4 py-1.5 rounded text-[10px] uppercase font-bold tracking-wide transition-all ${
              activeTab === 'score'
                ? "bg-[var(--bmg-accent-primary)] text-black font-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            AI Score Block Engines
          </button>
        </div>
      </div>

      {/* RENDER SAMPLER SIMULATOR AND ENGINEERING SPEC */}
      {activeTab === 'sampler' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="stock-orchestral-sampler-view">
          
          {/* SAMPLER CONSOLE UI - Left & Middle 7 Columns */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Native Sampler Header Container */}
            <div className="bmg-card bg-[#141417] border-[var(--bmg-accent-primary)]/40 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--bmg-accent-primary)]/5 rounded-full blur-2xl"></div>
              
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-[#25252b] pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[var(--bmg-accent-primary)]/10 border border-[var(--bmg-accent-primary)]/30 flex items-center justify-center text-[var(--bmg-accent-primary)]">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[var(--bmg-accent-primary)] tracking-widest uppercase block">STOCK DAW Sampler Engine v1.0</span>
                    <h3 className="text-sm font-black text-white uppercase">{selectedLibMeta.name}</h3>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">{selectedLibMeta.size}</span>
                  <span className="text-[9px] font-mono bg-[var(--bmg-accent-primary)]/10 text-[var(--bmg-accent-primary)] px-2 py-0.5 rounded border border-[var(--bmg-accent-primary)]/20">{selectedLibMeta.sampleCount}</span>
                </div>
              </div>

              {/* Preset Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Select Instrument Library</label>
                  <select
                    value={selectedLibrary}
                    onChange={(e) => {
                      setSelectedLibrary(e.target.value);
                      // Default articulation mappings
                      if (e.target.value === 'labs_piano') {
                        setSelectedArticulation('legato');
                      }
                    }}
                    className="w-full bg-[#1c1c21] border border-[#2b2b34] p-2.5 rounded text-xs text-white outline-none font-bold"
                  >
                    <option value="bbc_so_strings">🎻 BBC SO Professional Strings</option>
                    <option value="bbc_so_brass">🎺 BBC SO Professional Brass</option>
                    <option value="spitfire_chamber">🎻 Chamber Strings Pro (AIR Studios)</option>
                    <option value="labs_piano">🎹 LABS Felt Soft Piano (Broadcasting felt)</option>
                    <option value="edna_synth">⚙️ eDNA Earth Granular Wavetable</option>
                    <option value="evo_grid">♾️ Generative EVO Grid (Lyndhurst Grid)</option>
                    <option value="swarm_granular">🐝 Swarm Strings Granular Cloud</option>
                  </select>
                </div>

                <div className="text-[10px] text-zinc-400 bg-zinc-900/60 p-2.5 rounded border border-zinc-800 flex flex-col justify-center leading-relaxed">
                  <span className="text-white font-bold block mb-0.5">Description:</span>
                  {selectedLibMeta.desc}
                </div>
              </div>

              {/* MIDI Expression, Dynamics & Release CC Parameters */}
              <div className="bg-zinc-900/50 border border-[#232328] p-3 rounded-xl space-y-3 mb-4">
                <span className="text-[9px] font-mono text-zinc-500 font-bold block uppercase tracking-wider">Performance CC Sliders (Simulate physical MIDI controllers)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Dynamics CC#1 */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-zinc-400 font-medium">Dynamics (CC#1)</span>
                      <span className="font-mono text-[var(--bmg-accent-primary)] font-bold">{dynamicCC1}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="127"
                      value={dynamicCC1}
                      onChange={(e) => setDynamicCC1(parseInt(e.target.value))}
                      className="w-full accent-[var(--bmg-accent-primary)] h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8px] text-zinc-600 block mt-0.5">Crossfading up to 11 velocity layers</span>
                  </div>

                  {/* Expression CC#11 */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-zinc-400 font-medium">Expression (CC#11)</span>
                      <span className="font-mono text-[var(--bmg-accent-primary)] font-bold">{expressionCC11}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="127"
                      value={expressionCC11}
                      onChange={(e) => setExpressionCC11(parseInt(e.target.value))}
                      className="w-full accent-[var(--bmg-accent-primary)] h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8px] text-zinc-600 block mt-0.5">Continuous volume attenuation</span>
                  </div>

                  {/* Release CC#21 */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-zinc-400 font-medium">Envelope Release</span>
                      <span className="font-mono text-[var(--bmg-accent-primary)] font-bold">{releaseCC21}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="127"
                      value={releaseCC21}
                      onChange={(e) => setReleaseCC21(parseInt(e.target.value))}
                      className="w-full accent-[var(--bmg-accent-primary)] h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8px] text-zinc-600 block mt-0.5">Sustain tail damping width</span>
                  </div>
                </div>
              </div>

              {/* Articulation Matrix Buttons */}
              <div className="space-y-2 mb-4">
                <label className="text-[9px] uppercase font-bold text-gray-500 block">Articulation Switching Panel (MIDI Key Switches)</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'legato', label: '🎻 Legato', desc: 'Slurred interval transitions', keyswitch: 'C-1' },
                    { id: 'spiccato', label: '🏹 Spiccato', desc: 'Short bounced bows', keyswitch: 'D-1' },
                    { id: 'pizzicato', label: '🤏 Pizzicato', desc: 'Finger plucked notes', keyswitch: 'E-1' },
                    { id: 'tremolo', label: '🌊 Tremolo', desc: 'Rapid flutter bow bows', keyswitch: 'F-1' },
                    { id: 'col_legno', label: '🪵 Col Legno', desc: 'Struck with wood of bow', keyswitch: 'G-1' }
                  ].map(art => {
                    const isActive = selectedArticulation === art.id;
                    const isDisabled = selectedLibrary === 'labs_piano'; // soft piano has only felt dynamics
                    return (
                      <button
                        key={art.id}
                        disabled={isDisabled}
                        onClick={() => setSelectedArticulation(art.id)}
                        className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all relative ${
                          isDisabled 
                            ? "opacity-35 cursor-not-allowed bg-zinc-900 border-zinc-800" 
                            : isActive
                              ? "bg-[var(--bmg-accent-primary)]/10 border-[var(--bmg-accent-primary)] text-white shadow-[0_0_10px_rgba(202,154,90,0.1)]"
                              : "bg-[#18181c] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-[11px] font-black">{art.label}</span>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-[7.5px] font-mono text-zinc-500">{art.desc}</span>
                          <span className={`text-[7.5px] font-mono px-1 rounded ${isActive ? "bg-[var(--bmg-accent-primary)] text-black font-bold" : "bg-zinc-800"}`}>{art.keyswitch}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* EVO GENERATIVE PEGPIN GRID - Only active when EVO library selected */}
              {selectedLibrary === 'evo_grid' && (
                <div className="bg-[#101012] border border-[#23232a] p-3 rounded-xl mb-4 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-[#202026] pb-2 mb-2">
                    <span className="text-[10px] font-black text-white uppercase flex items-center gap-1.5">
                      <Grid className="w-3.5 h-3.5 text-[var(--bmg-accent-primary)]" /> EVO Generative Matrix Grid ( AIR Studio Lyndhurst )
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500">Peg pins route textures by pitch zones</span>
                  </div>
                  
                  <div className="space-y-1">
                    {/* Grid Columns represent Range / Octaves */}
                    <div className="grid grid-cols-6 text-center text-[8px] font-bold text-zinc-500 mb-1">
                      <div>Voice</div>
                      <div>C1-C2 (Sub)</div>
                      <div>C2-C3 (Low)</div>
                      <div>C3-C4 (Mid)</div>
                      <div>C4-C5 (Hi-Mid)</div>
                      <div>C5-C6 (High)</div>
                    </div>

                    {['Violins I', 'Violins II', 'Violas', 'Cellos', 'Basses'].map((inst, rIdx) => {
                      const activePegIdx = evoGridPins[inst];
                      return (
                        <div key={inst} className="grid grid-cols-6 items-center text-center text-[10px] py-1 bg-zinc-900/50 rounded">
                          <div className="text-[9px] font-bold text-zinc-400 text-left pl-2 font-mono">{inst}</div>
                          {[0, 1, 2, 3, 4].map((cIdx) => {
                            const isPinned = activePegIdx === cIdx;
                            return (
                              <div key={cIdx} className="flex justify-center">
                                <button
                                  onClick={() => handleToggleEvoPeg(inst, cIdx)}
                                  className={`w-3 h-3 rounded-full border transition-all ${
                                    isPinned 
                                      ? "bg-[var(--bmg-accent-primary)] border-white scale-125 shadow-[0_0_6px_var(--bmg-accent-primary)]" 
                                      : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                                  }`}
                                  title={`Pin ${inst} to zone ${cIdx + 1}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Microphone Signal faders & Routing console */}
              <div className="bg-[#111113] border border-zinc-800/80 p-3.5 rounded-xl">
                <div className="flex flex-wrap justify-between items-center border-b border-[#1f1f25] pb-2 mb-3">
                  <span className="text-[10px] font-black text-white uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[var(--bmg-accent-primary)]" /> Multi-Microphone Phase-Aligned Signal Mixer
                  </span>
                  
                  {/* Spatial configuration format toggler */}
                  <div className="flex bg-zinc-950 p-0.5 rounded border border-zinc-800 text-[8px] font-bold font-mono">
                    <button 
                      onClick={() => setOutputConfig('stereo')} 
                      className={`px-2 py-0.5 rounded transition-all ${outputConfig === 'stereo' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                    >
                      STEREO
                    </button>
                    <button 
                      onClick={() => setOutputConfig('surround')} 
                      className={`px-2 py-0.5 rounded transition-all ${outputConfig === 'surround' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                    >
                      5.1 SURROUND
                    </button>
                    <button 
                      onClick={() => setOutputConfig('atmos')} 
                      className={`px-2 py-0.5 rounded transition-all ${outputConfig === 'atmos' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                    >
                      DOLBY ATMOS
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {/* Close fader */}
                  <div className="text-center">
                    <span className="text-[8px] font-bold text-zinc-500 block mb-1">C (Close Mic)</span>
                    <div className="h-20 bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-800">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        style={{ writingMode: 'vertical-lr' as any, WebkitAppearance: 'slider-vertical' as any }}
                        value={micClose}
                        onChange={(e) => setMicClose(parseInt(e.target.value))}
                        className="h-16 accent-[var(--bmg-accent-primary)]"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 block mt-1">{micClose}%</span>
                  </div>

                  {/* Decca tree fader */}
                  <div className="text-center">
                    <span className="text-[8px] font-bold text-zinc-500 block mb-1">T (Decca Tree)</span>
                    <div className="h-20 bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-800">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        style={{ writingMode: 'vertical-lr' as any, WebkitAppearance: 'slider-vertical' as any }}
                        value={micDecca}
                        onChange={(e) => setMicDecca(parseInt(e.target.value))}
                        className="h-16 accent-[var(--bmg-accent-primary)]"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 block mt-1">{micDecca}%</span>
                  </div>

                  {/* Outriggers fader */}
                  <div className="text-center">
                    <span className="text-[8px] font-bold text-zinc-500 block mb-1">O (Outriggers)</span>
                    <div className="h-20 bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-800">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        style={{ writingMode: 'vertical-lr' as any, WebkitAppearance: 'slider-vertical' as any }}
                        value={micOutrig}
                        onChange={(e) => setMicOutrig(parseInt(e.target.value))}
                        className="h-16 accent-[var(--bmg-accent-primary)]"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 block mt-1">{micOutrig}%</span>
                  </div>

                  {/* Ambient fader */}
                  <div className="text-center">
                    <span className="text-[8px] font-bold text-zinc-500 block mb-1">A (Ambient Room)</span>
                    <div className="h-20 bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-800">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        style={{ writingMode: 'vertical-lr' as any, WebkitAppearance: 'slider-vertical' as any }}
                        value={micAmbient}
                        onChange={(e) => setMicAmbient(parseInt(e.target.value))}
                        className="h-16 accent-[var(--bmg-accent-primary)]"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 block mt-1">{micAmbient}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PLAYABLE PIANO KEYBOARD WITH COLORED ARTICULATION RANGE */}
            <div className="bmg-card bg-[#0b0b0d] border-zinc-800 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[var(--bmg-accent-primary)]" />
                  <span className="text-[10px] uppercase font-black text-white">Playable Audition Range (Keys C4 - C5)</span>
                </div>
                
                {/* Engine telemetry readout */}
                <div className="flex gap-4 text-[8px] font-mono text-zinc-500">
                  <span>DISK I/O: <strong className="text-white">{samplerDiskIOLatency} ms</strong></span>
                  <span>POLYPHONY: <strong className="text-[var(--bmg-accent-primary)]">{totalPolyphony} Voices</strong></span>
                  <span>RAM ENGINE: <strong className="text-green-400">{ramUsageMb} MB</strong></span>
                  <span>ROUND ROBIN: <strong className="text-white">#{roundRobinCounter}</strong></span>
                </div>
              </div>

              {/* The Interactive Keyboard */}
              <div className="relative flex justify-center pb-1">
                {/* Visual keyswitch range marker bar */}
                <div className="absolute top-[-10px] left-[5%] w-[35%] h-[3px] bg-red-500/80 rounded" title="Keyswitch zone C-1 - G-1"></div>
                <div className="absolute top-[-15px] left-[5%] text-[7px] font-mono font-bold text-red-400">KEYSWITCH ZONE</div>

                <div className="absolute top-[-10px] left-[45%] w-[50%] h-[3px] bg-[var(--bmg-accent-primary)] rounded" title="Playable key range C4 - C5"></div>
                <div className="absolute top-[-15px] left-[45%] text-[7px] font-mono font-bold text-[var(--bmg-accent-primary)]">PLAYABLE ZONE</div>

                <div className="flex w-full select-none" style={{ height: '85px' }}>
                  {[
                    { note: 'C4', midi: 60, freq: 261.63, isBlack: false },
                    { note: 'C#4', midi: 61, freq: 277.18, isBlack: true },
                    { note: 'D4', midi: 62, freq: 293.66, isBlack: false },
                    { note: 'D#4', midi: 63, freq: 311.13, isBlack: true },
                    { note: 'E4', midi: 64, freq: 329.63, isBlack: false },
                    { note: 'F4', midi: 65, freq: 349.23, isBlack: false },
                    { note: 'F#4', midi: 66, freq: 369.99, isBlack: true },
                    { note: 'G4', midi: 67, freq: 392.00, isBlack: false },
                    { note: 'G#4', midi: 68, freq: 415.30, isBlack: true },
                    { note: 'A4', midi: 69, freq: 440.00, isBlack: false },
                    { note: 'A#4', midi: 70, freq: 466.16, isBlack: true },
                    { note: 'B4', midi: 71, freq: 493.88, isBlack: false },
                    { note: 'C5', midi: 72, freq: 523.25, isBlack: false }
                  ].map((key, i) => {
                    const isPressed = activePianoKey === key.midi;
                    if (key.isBlack) {
                      // Render Black Keys absolutely positioned over White Keys
                      return (
                        <button
                          key={key.midi}
                          onMouseDown={() => handlePianoKeyDown(key.midi, key.freq)}
                          onMouseUp={() => handlePianoKeyUp(key.midi)}
                          onMouseLeave={() => handlePianoKeyUp(key.midi)}
                          className={`h-[50px] w-5 bg-zinc-950 border border-zinc-800 rounded-b transition-all absolute z-30 cursor-pointer ${
                            isPressed ? "bg-[var(--bmg-accent-primary)]" : "hover:bg-zinc-800"
                          }`}
                          style={{
                            left: `calc(${(i * 7.5)}% - 6px)`
                          }}
                        />
                      );
                    } else {
                      // Render White Keys
                      return (
                        <button
                          key={key.midi}
                          onMouseDown={() => handlePianoKeyDown(key.midi, key.freq)}
                          onMouseUp={() => handlePianoKeyUp(key.midi)}
                          onMouseLeave={() => handlePianoKeyUp(key.midi)}
                          className={`flex-1 h-full bg-white border border-zinc-300 rounded-b transition-all cursor-pointer flex flex-col justify-end pb-2 items-center text-[8px] font-mono ${
                            isPressed 
                              ? "bg-gradient-to-t from-[var(--bmg-accent-primary)] to-[var(--bmg-accent-primary)] text-black font-black" 
                              : "hover:bg-zinc-100 text-zinc-400"
                          }`}
                        >
                          {key.note}
                        </button>
                      );
                    }
                  })}
                </div>
              </div>
              <p className="text-[9px] text-zinc-500 font-mono text-center mt-2">💡 Note: Click and hold piano keys to play real acoustic synthesis. Adjust faders & sliders above to hear the difference!</p>
            </div>
          </div>

          {/* ROADMAP / ARCHITECTURE SYSTEM - Right 5 Columns */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bmg-card bg-[#121215] border-zinc-800 p-4 h-full flex flex-col">
              
              <div className="border-b border-[#22222a] pb-3 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[var(--bmg-accent-primary)]" />
                  <h3 className="text-xs font-black text-white uppercase">Engine Architecture Roadmap</h3>
                </div>
                <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">SPITFIRE CLONE ROADMAP</span>
              </div>

              <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">
                A highly comprehensive, rigorous engineering implementation specification to replicate and embed Spitfire's elite sample streaming library.
              </p>

              {/* Roadmap sub-tab menus */}
              <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-900 text-[8.5px] font-mono font-bold mb-3">
                <button
                  onClick={() => setRoadmapTab('architecture')}
                  className={`py-1 rounded text-center transition-all ${roadmapTab === 'architecture' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                >
                  SYSTEM
                </button>
                <button
                  onClick={() => setRoadmapTab('uml')}
                  className={`py-1 rounded text-center transition-all ${roadmapTab === 'uml' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                >
                  UML MODEL
                </button>
                <button
                  onClick={() => setRoadmapTab('legato')}
                  className={`py-1 rounded text-center transition-all ${roadmapTab === 'legato' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                >
                  DSP LEGATO
                </button>
                <button
                  onClick={() => setRoadmapTab('pitfalls')}
                  className={`py-1 rounded text-center transition-all ${roadmapTab === 'pitfalls' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"}`}
                >
                  PITFALLS
                </button>
              </div>

              {/* ROADMAP TAB CONTENTS */}
              <div className="flex-1 overflow-y-auto max-h-[460px] pr-1.5 space-y-3 scrollbar-thin text-xs text-zinc-300 leading-relaxed font-sans">
                
                {roadmapTab === 'architecture' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase flex items-center gap-1">
                        <span className="text-[var(--bmg-accent-primary)]">1.</span> Disk-Streaming Sampler Engine (Direct From Disk)
                      </h4>
                      <p className="text-[10.5px] text-zinc-400 mt-1">
                        Pre-loads the initial transient block (first **64KB** or 100ms) of every sample voice to RAM. Direct-from-Disk (DFD) queues buffer the subsequent sample data asynchronously.
                      </p>
                      <div className="bg-[#18181c] p-2.5 rounded border border-zinc-800 font-mono text-[9.5px] text-[var(--bmg-accent-primary)] mt-1.5 space-y-1">
                        <div>• Sub-10ms Latency: Achieved via lock-free rings</div>
                        <div>• Ring Buffer: Pre-allocates memory to avoid RT Heap Alloc</div>
                        <div>• Global Memory Sharing: DEDUPs RAM across tracks</div>
                        <div>• Custom Codec: Lossless PCM Huffman compress (1.4TB ➔ 600GB)</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase flex items-center gap-1">
                        <span className="text-[var(--bmg-accent-primary)]">2.</span> Content Ingestion & Metadata Pipeline
                      </h4>
                      <p className="text-[10.5px] text-zinc-400 mt-1">
                        Automated tools ingest massive multi-microphone WAV files, perform auto-loop extraction using normalized cross-correlation, and bundle metadata in highly compressed custom `.sfz`/`BMG` patch binaries.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase flex items-center gap-1">
                        <span className="text-[var(--bmg-accent-primary)]">3.</span> Phase-Aligned Mic Mixing Matrix
                      </h4>
                      <p className="text-[10.5px] text-zinc-400 mt-1">
                        Sums 20 microphone tracks in real-time. Sub-sample phase alignment aligns Close, Decca, Ambient, and Outriggers to preserve transient snap. Supports Stereo, Surround, and Dolby Atmos 7.1.4 panning matrices.
                      </p>
                    </div>
                  </div>
                )}

                {roadmapTab === 'uml' && (
                  <div className="space-y-3 animate-in fade-in">
                    <span className="text-[9px] font-mono text-zinc-500 font-bold block uppercase">C++ Class Data Model Blueprint</span>
                    
                    <div className="bg-zinc-950 p-3 rounded border border-zinc-800 font-mono text-[9px] text-green-400 overflow-x-auto whitespace-pre leading-normal">
{`struct SampleData {
  uint32_t sampleRate;
  uint8_t bitDepth;      // 24/32/64-bit float
  uint32_t loopStart;    // Loop points metadata
  uint32_t loopEnd;
  float* ramPreBuffer;   // Transient pre-load
  string diskFilePath;   // DFD streaming route
};

struct LegatoTransition {
  int sourceMidiInterval; // e.g. -12 to +12
  uint32_t startOffset;   // Glide transient start
  uint32_t crossfadeMs;   // Bow-release blend ms
};

struct Articulation {
  string techniqueID;     // Legato, Spiccato etc
  int keySwitchMidi;      // CC keyswitch trigger
  int midiCCModulation;   // CC#1 Dynamics blend
  vector<SampleData*> roundRobinCycle[4]; 
  vector<LegatoTransition*> legatoMap;
};

struct Instrument {
  string instrumentID;    // "BBC_SO_Strings"
  string category;        // Orchestral, Cinematic
  vector<Articulation*> articulationList;
  float micSignalMatrix[20]; // Panning gain faders
};`}
                    </div>
                  </div>
                )}

                {roadmapTab === 'legato' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase">Real-Time Legato Crossfade Engine</h4>
                      <p className="text-[10.5px] text-zinc-400 mt-1">
                        Detects overlapping Note-On events. Triggers custom transitional sliding samples recorded specifically when passing between note pitches.
                      </p>
                      
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-800 font-mono text-[9px] text-[var(--bmg-accent-primary)] mt-2">
                        <span className="text-zinc-500 block mb-1">// Algorithm Logic Workflow:</span>
                        <div>1. OnNoteOn(note_2, vel_2):</div>
                        <div>   if (note_1.isActive) &#123;</div>
                        <div>     interval = note_2 - note_1;</div>
                        <div>     glide_sample = LegatoMap.get(interval);</div>
                        <div>     FadeOut(note_1, 45ms);</div>
                        <div>     Trigger(glide_sample);</div>
                        <div>     FadeIn(note_2, 60ms);</div>
                        <div>   &#125;</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase">Evolution (EVO) & Swarm Granular</h4>
                      <p className="text-[10.5px] text-zinc-400 mt-1">
                        The eDNA granular engine parses sample buffers into micro-moments. Swarm modulates note density dynamically using LFO-driven jitter values, creating shifting cinematic atmospheres.
                      </p>
                    </div>
                  </div>
                )}

                {roadmapTab === 'pitfalls' && (
                  <div className="space-y-3 animate-in fade-in">
                    <span className="text-[9.5px] font-mono text-red-400 font-bold block uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> High-Performance Pitfalls & Mitigations
                    </span>

                    <div className="space-y-2.5">
                      <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                        <span className="text-white font-bold block text-[10px]">Disk I/O Bottlenecks (SSD Starvation):</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          <strong>Mitigation:</strong> Implement a system-level I/O Priority Queue scheduler using native asynchronous `io_uring` (Linux) or `IOCP` (Windows). High-priority read tasks preempt background asset scans.
                        </p>
                      </div>

                      <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                        <span className="text-white font-bold block text-[10px]">Real-Time Thread Priority Inversion:</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          <strong>Mitigation:</strong> Audio thread strictly bypasses malloc allocations. Use lock-free atomics and pre-allocated ring buffers. Worker I/O threads handle streaming buffers safely off the audio execution thread.
                        </p>
                      </div>

                      <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                        <span className="text-white font-bold block text-[10px]">Polyphony Volatility & Voice Stealing:</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          <strong>Mitigation:</strong> Apply age-and-gain voice stealing heuristics. If virtual polyphony exceeds 512 voices, prune the lowest amplitude samples first using smooth exponential volume release ramp fades.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => {
                    const blob = new Blob([
                      "SPITFIRE AUDIO INSTRUMENT CLONING IMPLEMENTATION ROADMAP - FOR SENIOR AUDIO SOFTWARE ARCHITECT\n\n" +
                      "1. SAMPLE SAMPLER DIRECT-FROM-DISK ARCHITECTURE\n" +
                      "   - Transient preload sizing: 64KB per sound file\n" +
                      "   - Lossless Compression ratio: Differential PCM coding to achieve 2.3x compression.\n" +
                      "   - Memory deduplication: Global single-sample allocation footprint across multi-track instances.\n\n" +
                      "2. LEGATO SYSTEM & ARTICULATIONS SPEC\n" +
                      "   - Note overlapping triggers interval glide samples.\n" +
                      "   - Phase-aligned sum mapping to prevent cancellation.\n" +
                      "   - Multi-mic mixers summing up to 20 spatial signal paths in SIMD registers."
                    ], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Spitfire_Clone_SAMPLER_Specification.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="w-full bmg-button text-[10px] uppercase font-black tracking-widest gap-2 py-2 min-h-[38px] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Full Engineering Spec PDF/TXT
                </button>
              </div>

            </div>
          </div>
          
        </div>
      ) : (
        /* ORIGINAL AI SCORE BLOCKS - Updated to gorgeous luxury bronze/slate palette */
        <div className="space-y-3" id="engines-accordion-container">
          {AI_SCORE_ENGINES.map(engine => {
            const isExpanded = expandedEngineId === engine.id;
            const currentEmotionName = selectedEmotions[engine.id];
            const currentEmotionSpec = engine.emotions.find(e => e.name === currentEmotionName) || engine.emotions[0];
            const currentKey = selectedKeys[engine.id];
            const currentBpm = customBpms[engine.id] || engine.defaultBpm;

            return (
              <div 
                key={engine.id} 
                className={`bmg-card transition-all ${
                  isExpanded ? "border-[var(--bmg-accent-primary)] bg-[#131317]" : "border-zinc-800/80 bg-[#121215]"
                }`}
              >
                {/* Header Toggle Row */}
                <div 
                  onClick={() => toggleEngineExpand(engine.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bmg-accent-primary)]/10 border border-[var(--bmg-accent-primary)]/25 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-[var(--bmg-accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{engine.name}</h3>
                      <span className="text-[10px] text-zinc-500 block truncate max-w-[280px]">{engine.tagline}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-zinc-800 space-y-4 animate-in fade-in duration-200">
                    {/* Selector controls Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Key */}
                      <div>
                        <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Key Scale</label>
                        <select
                          value={currentKey}
                          onChange={(e) => setSelectedKeys(prev => ({ ...prev, [engine.id]: e.target.value }))}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs text-white outline-none font-bold"
                        >
                          {ROOT_NOTES.map(n => (
                            <option key={n} value={n} className="bg-zinc-950">{n} Maj/Min</option>
                          ))}
                        </select>
                      </div>

                      {/* Emotion */}
                      <div>
                        <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Emotion State</label>
                        <select
                          value={currentEmotionName}
                          onChange={(e) => setSelectedEmotions(prev => ({ ...prev, [engine.id]: e.target.value }))}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs text-white outline-none font-bold"
                        >
                          {engine.emotions.map(emo => (
                            <option key={emo.name} value={emo.name} className="bg-zinc-950">{emo.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* BPM */}
                      <div>
                        <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Tempo (BPM)</label>
                        <input
                          type="number"
                          min="60"
                          max="180"
                          value={currentBpm}
                          onChange={(e) => setCustomBpms(prev => ({ ...prev, [engine.id]: parseInt(e.target.value) || engine.defaultBpm }))}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs text-white outline-none font-mono text-center"
                        />
                      </div>
                    </div>

                    {/* Engine Details Infographic */}
                    <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-bold">Emotion Description:</span>
                        <span className="text-white italic text-[11px]">{currentEmotionSpec.description}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1.5 border-t border-zinc-900">
                        <span className="text-zinc-500 font-bold">Vocal Preamp Chain:</span>
                        <span className="font-mono text-[var(--bmg-accent-primary)] text-[10px]">{currentEmotionSpec.vocalChainPreset}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1.5 border-t border-zinc-900">
                        <span className="text-zinc-500 font-bold">Transposed Progression:</span>
                        <span className="font-mono text-[var(--bmg-accent-primary)] font-bold text-[11px]">
                          {currentEmotionSpec.progression.map(chord => {
                            let rest = chord.substring(1);
                            if (rest.startsWith("#") || rest.startsWith("b")) {
                              rest = rest.substring(1);
                            }
                            return `${currentKey}${rest}`;
                          }).join(" - ")}
                        </span>
                      </div>
                    </div>

                    {/* Multitrack Play Preview triggers */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayEnginePreview(engine)}
                        className={`flex-1 bmg-button-secondary py-2 min-h-[36px] text-xs font-bold gap-1.5 cursor-pointer ${
                          activePlaybackId === engine.id ? "border-red-600/50 text-red-500" : ""
                        }`}
                      >
                        {activePlaybackId === engine.id ? (
                          <>Stop Score Preview</>
                        ) : (
                          <><Play className="w-3.5 h-3.5 fill-current text-[var(--bmg-accent-primary)]" /> Play Live MIDI Score</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
