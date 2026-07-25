import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, HelpCircle, Sparkles, Music, Cpu, FileText, Download, Edit2, Maximize, Activity, Zap, Trash2, MessageSquare, ToggleLeft, ToggleRight, Sliders, Circle, Radio, RotateCcw, Check, Layers } from 'lucide-react';
import { aigenioSynth, barksdaleSynth, parseChordToFrequencies } from '../utils/audioUtils';
import { PatchCable, Message } from '../types';
import { GranularSampler } from './GranularSampler';
import { applyGenreTheme } from '../utils/themeUtils';
import { MultitrackRecordingSuite } from './MultitrackRecordingSuite';
import { AudioEffectRack } from './AudioEffectRack';
import { BeatSeekMetronome } from './BeatSeekMetronome';
import { AudioPeakMirroring } from './AudioPeakMirroring';

export const StudioTab: React.FC = () => {
  // Persistent Operating Modes State
  const [opMode, setOpMode] = useState<'ai' | 'expert'>(() => {
    return (localStorage.getItem('barksdale_op_mode') as 'ai' | 'expert') || 'ai';
  });

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.mode) {
        setOpMode(customEvent.detail.mode);
      }
    };
    window.addEventListener('barksdale_op_mode_change', handleModeChange);
    return () => {
      window.removeEventListener('barksdale_op_mode_change', handleModeChange);
    };
  }, []);

  // App States
  const [bpm, setBpm] = useState<number>(95);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [currentScale, setCurrentScale] = useState<string>('Dorian Jazz/Funk');

  // Synchronization Bridge & Multitrack Recording States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [armedTracks, setArmedTracks] = useState<Record<string, boolean>>({
    drums: true,
    keys: true,
    synth: false,
    sampler: false
  });
  const [recordedStems, setRecordedStems] = useState<Array<{
    id: string;
    name: string;
    type: 'drums' | 'keys' | 'synth' | 'sampler';
    duration: number;
    isMuted: boolean;
    isSoloed: boolean;
    volume: number;
    dataPoints: number[];
    recordedAt: string;
  }>>([
    { id: 'stem-1', name: 'Vintage Drums Stem Take', type: 'drums', duration: 8.0, isMuted: false, isSoloed: false, volume: 85, dataPoints: [15, 45, 60, 30, 80, 50, 75, 20, 60, 40, 85, 30, 70, 50, 20, 45, 10, 60, 80, 40, 90, 35, 55, 65, 30], recordedAt: '12:01:10 PM' },
    { id: 'stem-2', name: 'Rhodes Keys Chords Take', type: 'keys', duration: 8.0, isMuted: false, isSoloed: false, volume: 90, dataPoints: [30, 25, 45, 60, 40, 55, 30, 65, 50, 45, 70, 80, 55, 40, 30, 60, 70, 50, 45, 65, 80, 35, 40, 55, 60], recordedAt: '12:01:10 PM' }
  ]);

  // Master FX States
  const [cutoff, setCutoff] = useState<number>(65);
  const [resonance, setResonance] = useState<number>(45);
  const [spaceDepth, setSpaceDepth] = useState<number>(55);
  const [tapeWow, setTapeWow] = useState<number>(35);
  const [tapeWobble, setTapeWobble] = useState<number>(40);

  // Advanced Sampler States
  const [isSampleReversed, setIsSampleReversed] = useState<boolean>(false);
  const [samplePitch, setSamplePitch] = useState<number>(1.0);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>('vintage_reed_riff.wav');

  // Co-Pilot AI Mixing Assistant States
  const [copilotMessages, setCopilotMessages] = useState<Message[]>([
    { id: '1', sender: 'producer', text: "Ayy! I'm your Brooklyn Co-Pilot. This mix needs that sweet 1970s analog heat. Choose a preset or lay it on me, pal!", persona: 'producer' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Modulation Patch Matrix
  const [patchCables, setPatchCables] = useState<PatchCable[]>([
    { id: 'cable-1', fromNode: 'Oscillator', toNode: 'Filter Cutoff', color: '#f59e0b' },
    { id: 'cable-2', fromNode: 'LFO', toNode: 'Volume', color: '#ca9a5a' }
  ]);
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);

  // MIDI Sync & Real-Time Automation Recording States
  const [isMidiSynced, setIsMidiSynced] = useState<boolean>(true);
  const [midiDevices, setMidiDevices] = useState<string[]>(['Hardware MIDI Controller Bridge']);
  const [isAutomationArm, setIsAutomationArm] = useState<boolean>(false);
  const [automationMode, setAutomationMode] = useState<'READ' | 'WRITE' | 'TOUCH' | 'OFF'>('WRITE');
  const [activeAutomationParam, setActiveAutomationParam] = useState<string>('cutoff');
  const [automationEvents, setAutomationEvents] = useState<Array<{
    id: string;
    param: string;
    value: number;
    timeSec: number;
    ccNumber: number;
    timestamp: string;
  }>>([
    { id: 'auto-1', param: 'cutoff', value: 35, timeSec: 0, ccNumber: 74, timestamp: '12:00:00' },
    { id: 'auto-2', param: 'cutoff', value: 85, timeSec: 2, ccNumber: 74, timestamp: '12:00:02' },
    { id: 'auto-3', param: 'cutoff', value: 45, timeSec: 4, ccNumber: 74, timestamp: '12:00:04' },
    { id: 'auto-4', param: 'cutoff', value: 95, timeSec: 6, ccNumber: 74, timestamp: '12:00:06' },
    { id: 'auto-5', param: 'spaceDepth', value: 25, timeSec: 0, ccNumber: 91, timestamp: '12:00:00' },
    { id: 'auto-6', param: 'spaceDepth', value: 80, timeSec: 4, ccNumber: 91, timestamp: '12:00:04' },
    { id: 'auto-7', param: 'tapeWow', value: 20, timeSec: 1, ccNumber: 1, timestamp: '12:00:01' },
    { id: 'auto-8', param: 'tapeWow', value: 70, timeSec: 5, ccNumber: 1, timestamp: '12:00:05' },
  ]);
  const [lastMidiCcLog, setLastMidiCcLog] = useState<{ cc: number; val: number; param: string } | null>({
    cc: 74,
    val: 82,
    param: 'cutoff'
  });

  // Helper to apply parameter changes and record automation when armed or writing
  const updateParamWithAutomation = (param: string, value: number, ccNum: number = 74) => {
    if (param === 'cutoff') setCutoff(value);
    if (param === 'resonance') setResonance(value);
    if (param === 'spaceDepth') setSpaceDepth(value);
    if (param === 'tapeWow') setTapeWow(value);
    if (param === 'tapeWobble') setTapeWobble(value);

    setLastMidiCcLog({ cc: ccNum, val: Math.round((value / 100) * 127), param });

    if (isAutomationArm || automationMode === 'WRITE' || automationMode === 'TOUCH') {
      const currentStepTime = activeStep !== null ? Number((activeStep * (60 / bpm)).toFixed(2)) : 0;
      const newEvt = {
        id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        param,
        value,
        timeSec: currentStepTime,
        ccNumber: ccNum,
        timestamp: new Date().toLocaleTimeString()
      };

      setAutomationEvents(prev => [
        ...prev.filter(e => !(e.param === param && Math.abs(e.timeSec - currentStepTime) < 0.2)),
        newEvt
      ]);
    }
  };

  // Sample Pack Browser States
  const [selectedPack, setSelectedPack] = useState<string>('lofi');
  const [samplePackList] = useState([
    { id: 'lofi', name: 'Lofi Chill Pack', genreId: 'ambient', bpm: 85, samples: ['kick_rim.wav', 'snare_vinyl.wav', 'hat_swung.wav', 'clap_jazz.wav'] },
    { id: 'trap', name: 'Hard Trap 808', genreId: 'hiphop', bpm: 140, samples: ['kick_808.wav', 'snare_rim.wav', 'hat_rolls.wav', 'clap_hard.wav'] },
    { id: 'house', name: 'Classic Club House', genreId: 'electronic', bpm: 124, samples: ['kick_four_floor.wav', 'snare_tight.wav', 'hat_offbeat.wav', 'clap_rave.wav'] },
    { id: 'techno', name: 'Techno Minimal', genreId: 'electronic', bpm: 128, samples: ['kick_dark_pulse.wav', 'snare_industrial.wav', 'hat_clean.wav', 'clap_digital.wav'] },
    { id: 'neosoul', name: 'Neo-Soul Swung Jazz', genreId: 'jazz', bpm: 92, samples: ['kick_acoustic.wav', 'snare_rimshot.wav', 'hat_brushed.wav', 'clap_snap.wav'] },
    { id: 'rock', name: 'Alternative Overdrive Rock', genreId: 'rock', bpm: 132, samples: ['kick_punchy.wav', 'snare_heavy.wav', 'hat_open.wav', 'clap_room.wav'] },
    { id: 'pop', name: 'Modern Cyber Pop', genreId: 'pop', bpm: 118, samples: ['kick_synth.wav', 'snare_crisp.wav', 'hat_shaker.wav', 'clap_snap.wav'] },
    { id: 'reggaeton', name: 'Tropical Reggaeton & Latin', genreId: 'latin', bpm: 96, samples: ['kick_dembow.wav', 'snare_timbales.wav', 'hat_woodblock.wav', 'clap_palmas.wav'] },
    { id: 'afrobeats', name: 'Afrobeat Island Grooves', genreId: 'reggae', bpm: 104, samples: ['kick_warm.wav', 'snare_conga.wav', 'hat_shaker.wav', 'clap_rim.wav'] },
    { id: 'country', name: 'Acoustic Roots Country', genreId: 'country', bpm: 110, samples: ['kick_stomp.wav', 'snare_brush.wav', 'hat_tambourine.wav', 'clap_wood.wav'] },
    { id: 'metal', name: 'Heavy Industrial Metal', genreId: 'metal', bpm: 155, samples: ['kick_double_bass.wav', 'snare_blast.wav', 'hat_crash.wav', 'clap_grit.wav'] },
    { id: 'cinematic', name: 'Orchestral Score & Brass', genreId: 'cinematic', bpm: 80, samples: ['kick_timpani.wav', 'snare_marching.wav', 'hat_gong.wav', 'clap_hall.wav'] }
  ]);

  // Hit Machine Auto-Production States
  const [hitProducer, setHitProducer] = useState<string>('dr_dre');
  const [isGeneratingHit, setIsGeneratingHit] = useState<boolean>(false);
  const [hitGenerationLog, setHitGenerationLog] = useState<string>('');
  const [generatedHits, setGeneratedHits] = useState([
    { id: 'hit-1', title: 'Chrome & Candy Paint', producer: 'Dr. Dre (G-Funk)', bpm: 95, scale: 'Dorian Jazz/Funk', genre: 'G-Funk Hip Hop', date: 'Just now' },
    { id: 'hit-2', title: 'Swedish Starry Eyes', producer: 'Max Martin (Pop)', bpm: 120, scale: 'Lydian Ethereal', genre: 'Max Pop Anthem', date: '5 mins ago' }
  ]);

  // 1. Vocal Processor States
  const [vocalStyle, setVocalStyle] = useState<string>('Autotuned Trap');
  const [formantPitch, setFormantPitch] = useState<number>(10); // -24 to +24 semitones
  const [pitchCorrectionSpeed, setPitchCorrectionSpeed] = useState<number>(85); // 0 to 100
  const [vocalSaturation, setVocalSaturation] = useState<number>(40); // 0 to 100
  const [harmonizerVoices, setHarmonizerVoices] = useState<number>(3); // 1 to 5 voices
  const [isVocalProcessing, setIsVocalProcessing] = useState<boolean>(false);
  const [vocalTab, setVocalTab] = useState<'vocal' | 'text2synth'>('vocal');

  // 2. Text-to-Synth & Text-to-MIDI States
  const [synthPrompt, setSynthPrompt] = useState<string>('Fat 1970s analog brass with warm tape saturation');
  const [isCalculatingSynth, setIsCalculatingSynth] = useState<boolean>(false);
  const [textMidiPrompt, setTextMidiPrompt] = useState<string>('Cinematic neo-soul chord progression');
  const [isGeneratingMidi, setIsGeneratingMidi] = useState<boolean>(false);

  // Universal Auditioning & Zero-Latency Settings States
  const [auditioningChord, setAuditioningChord] = useState<string | null>(null);
  const [auditioningPattern, setAuditioningPattern] = useState<string | null>(null);
  const [auditioningInstrumentId, setAuditioningInstrumentId] = useState<string | null>(null);
  const [activeDriverHint, setActiveDriverHint] = useState<string>('interactive');
  const patternTimerRef = useRef<any>(null);

  // 3. Zero Latency Cloud States
  const [isEdgeBuffering, setIsEdgeBuffering] = useState<boolean>(true);
  const [bufferSize, setBufferSize] = useState<number>(16); // 16, 32, 64, 128 samples

  // 4. Infinite Undo Tree States
  const [undoHistory, setUndoHistory] = useState<any[]>([
    {
      id: 'root',
      label: 'Init DAW',
      timestamp: '12:00:00 AM',
      parentId: null,
      state: {
        bpm: 95,
        currentScale: 'Dorian Jazz/Funk',
        cutoff: 65,
        resonance: 45,
        spaceDepth: 55,
        tapeWow: 35,
        tapeWobble: 40,
        selectedPack: 'lofi',
        drums: {
          kick:  [true,  false, false, false, true,  false, false, false],
          snare: [false, false, true,  false, false, false, true,  false],
          hat:   [true,  true,  true,  true,  true,  true,  true,  true],
          clap:  [false, false, false, false, false, false, false, false]
        }
      }
    }
  ]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string>('root');
  const [customSnapshotLabel, setCustomSnapshotLabel] = useState<string>('');

  const pushUndoNode = (label: string, customState?: any) => {
    const nextState = customState || {
      bpm,
      currentScale,
      cutoff,
      resonance,
      spaceDepth,
      tapeWow,
      tapeWobble,
      selectedPack,
      drums
    };
    const newNode = {
      id: `state-${Date.now()}`,
      label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      parentId: currentHistoryId,
      state: JSON.parse(JSON.stringify(nextState))
    };
    setUndoHistory(prev => [...prev, newNode]);
    setCurrentHistoryId(newNode.id);
  };

  const handleRestoreState = (historyId: string) => {
    const targetNode = undoHistory.find(n => n.id === historyId);
    if (!targetNode) return;
    const s = targetNode.state;
    setBpm(s.bpm);
    setCurrentScale(s.currentScale);
    setCutoff(s.cutoff);
    setResonance(s.resonance);
    setSpaceDepth(s.spaceDepth);
    setTapeWow(s.tapeWow);
    setTapeWobble(s.tapeWobble);
    setSelectedPack(s.selectedPack);
    setDrums(s.drums);
    setCurrentHistoryId(historyId);
    barksdaleSynth.playChord('Cmaj7', 0.6); // Play positive confirmation chime
  };

  const handleLoadSamplePack = (packId: string) => {
    setSelectedPack(packId);
    const pack = samplePackList.find(p => p.id === packId);
    if (!pack) return;
    
    // Dynamically update theme based on genre
    if (pack.genreId) {
      applyGenreTheme(pack.genreId);
    }
    
    setBpm(pack.bpm);
    setUploadedFileName(pack.samples[0]);

    let nextDrums = {
      kick:  [true,  false, false, false, false, false, true,  false],
      snare: [false, false, true,  false, false, false, true,  false],
      hat:   [true,  false, true,  true,  false, true,  true,  false],
      clap:  [false, false, false, false, true,  false, false, false]
    };

    // Apply typical genre beat patterns
    if (packId === 'lofi') {
      nextDrums = {
        kick:  [true,  false, false, false, false, false, true,  false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  false, true,  true,  false, true,  true,  false],
        clap:  [false, false, false, false, true,  false, false, false]
      };
    } else if (packId === 'trap') {
      nextDrums = {
        kick:  [true,  false, false, true,  false, false, true,  false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  true,  true,  true,  true,  true,  true,  true],
        clap:  [false, false, false, false, false, false, false, true]
      };
    } else if (packId === 'house') {
      nextDrums = {
        kick:  [true,  false, true,  false, true,  false, true,  false],
        snare: [false, false, false, false, true,  false, false, false],
        hat:   [false, true,  false, true,  false, true,  false, true],
        clap:  [false, false, true,  false, false, false, true,  false]
      };
    } else if (packId === 'techno') {
      nextDrums = {
        kick:  [true,  true,  true,  true,  true,  true,  true,  true],
        snare: [false, false, false, false, false, false, false, false],
        hat:   [true,  false, true,  false, true,  false, true,  false],
        clap:  [false, false, true,  false, false, false, true,  false]
      };
    } else if (packId === 'neosoul') {
      nextDrums = {
        kick:  [true,  false, false, false, true,  false, false, true],
        snare: [false, false, true,  false, false, true,  false, false],
        hat:   [true,  true,  false, true,  true,  false, true,  true],
        clap:  [false, false, false, false, false, false, false, false]
      };
    }
    setDrums(nextDrums);
    
    // Snapshot state
    pushUndoNode('Load Pack: ' + pack.name, {
      bpm: pack.bpm,
      currentScale,
      cutoff,
      resonance,
      spaceDepth,
      tapeWow,
      tapeWobble,
      selectedPack: packId,
      drums: nextDrums
    });
  };

  const handleGenerateHit = () => {
    setIsGeneratingHit(true);
    setHitGenerationLog('Analyzing chart structures & sonic dynamic range...');
    
    setTimeout(() => {
      setHitGenerationLog('Constructing custom Swedish chord progressions...');
    }, 600);

    setTimeout(() => {
      setHitGenerationLog('Offloading neural synthesis workflows to Zero-Latency Cloud...');
    }, 1200);

    setTimeout(() => {
      setHitGenerationLog('Formatting final high-fidelity master WAV bounce...');
    }, 1800);

    setTimeout(() => {
      setIsGeneratingHit(false);
      setHitGenerationLog('');
      
      const songTitles = {
        dr_dre: ['Straight Outta Compton G-Funk', 'Chronic Chrome Riffs', 'Barksdale Smoke Lead'],
        max_martin: ['Swedish Neon Lights', 'Pop Equation Master', 'Billboard Dynamic Hit'],
        metro_boomin: ['Haunting Bells & 808s', 'Double-Time Spider', 'Metro Cinematic Wave'],
        pharrell: ['Four-Count Snap Groove', 'Organic Clavinet Perc', 'Neptunes Cosmic Ride']
      };
      
      const currentTitles = songTitles[hitProducer as keyof typeof songTitles] || ['Generic Aigenio Hit'];
      const randomTitle = currentTitles[Math.floor(Math.random() * currentTitles.length)];
      
      const nextBpm = hitProducer === 'dr_dre' ? 92 : hitProducer === 'max_martin' ? 122 : hitProducer === 'metro_boomin' ? 138 : 105;
      const nextScale = hitProducer === 'dr_dre' ? 'Dorian Jazz/Funk' : hitProducer === 'max_martin' ? 'Lydian Ethereal' : hitProducer === 'metro_boomin' ? 'Aeolian Natural Minor' : 'Phrygian Spanish';

      const newHit = {
        id: `hit-${Date.now()}`,
        title: randomTitle,
        producer: hitProducer === 'dr_dre' ? 'Dr. Dre (G-Funk)' : 
                  hitProducer === 'max_martin' ? 'Max Martin (Pop)' : 
                  hitProducer === 'metro_boomin' ? 'Metro Boomin (Trap)' : 'Pharrell (Funk)',
        bpm: nextBpm,
        scale: nextScale,
        genre: hitProducer === 'dr_dre' ? 'West Coast Hip Hop' : hitProducer === 'max_martin' ? 'Dance Pop' : hitProducer === 'metro_boomin' ? 'Cinematic Trap' : 'Neptunes R&B/Funk',
        date: 'Just now'
      };
      
      setGeneratedHits(prev => [newHit, ...prev]);

      // Push history node
      pushUndoNode('Neural Hit: ' + randomTitle, {
        bpm: nextBpm,
        currentScale: nextScale,
        cutoff,
        resonance,
        spaceDepth,
        tapeWow,
        tapeWobble,
        selectedPack,
        drums
      });
    }, 2400);
  };

  const handlePlayHitPreview = (hit: typeof generatedHits[0]) => {
    setIsPlaying(false);
    barksdaleSynth.stopBeatSequencer();
    setBpm(hit.bpm);
    setCurrentScale(hit.scale);

    // Play chord sweeps
    barksdaleSynth.playChord('Am7', 0.6);
    setTimeout(() => {
      barksdaleSynth.playChord('D7', 0.6);
    }, 600);
    setTimeout(() => {
      barksdaleSynth.playChord('Gmaj7', 0.8);
    }, 1200);
  };

  // Scale Keys Intervals (Dorian, Lydian, Aeolian, Phrygian, Locrian)
  const scalesDefinitions: Record<string, { intervals: number[]; name: string; notes: string[] }> = {
    'Dorian Jazz/Funk': { intervals: [0, 2, 3, 5, 7, 9, 10, 12], name: 'Dorian Jazz/Funk', notes: ['D', 'E', 'F', 'G', 'A', 'B', 'C', 'D'] },
    'Lydian Ethereal': { intervals: [0, 2, 4, 6, 7, 9, 11, 12], name: 'Lydian Ethereal', notes: ['F', 'G', 'A', 'B', 'C', 'D', 'E', 'F'] },
    'Aeolian Natural Minor': { intervals: [0, 2, 3, 5, 7, 8, 10, 12], name: 'Aeolian Natural Minor', notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'] },
    'Phrygian Spanish': { intervals: [0, 1, 3, 5, 7, 8, 10, 12], name: 'Phrygian Spanish', notes: ['E', 'F', 'G', 'A', 'B', 'C', 'D', 'E'] },
    'Locrian Diminished': { intervals: [0, 1, 3, 5, 6, 8, 10, 12], name: 'Locrian Diminished', notes: ['B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'] }
  };

  // Drum sequence states (8 steps)
  const [drums, setDrums] = useState({
    kick:  [true,  false, false, false, true,  false, false, false],
    snare: [false, false, true,  false, false, false, true,  false],
    hat:   [true,  true,  true,  true,  true,  true,  true,  true],
    clap:  [false, false, false, false, false, false, false, false]
  });

  // Generate peaks for sampler visualization
  useEffect(() => {
    const peaks = Array.from({ length: 48 }).map(() => Math.random() * 45 + 5);
    setWaveformPeaks(peaks);
  }, [uploadedFileName]);

  // Sequencer beat tick
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      let step = 0;
      timer = setInterval(() => {
        setActiveStep(step);
        // Play sounds based on drum steps
        if (drums.kick[step]) barksdaleSynth.playKick();
        if (drums.snare[step]) barksdaleSynth.playSnare();
        if (drums.hat[step]) barksdaleSynth.playHiHat();
        if (drums.clap[step]) barksdaleSynth.playClap();

        step = (step + 1) % 8;
      }, (60000 / bpm) / 2); // 8th notes
    } else {
      setActiveStep(null);
    }
    return () => clearInterval(timer);
  }, [isPlaying, drums, bpm]);

  // Synchronization Bridge: Emit play state and BPM changes to Cinema Pipeline
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('barksdale_sequencer_play', {
      detail: { isPlaying, bpm }
    }));
  }, [isPlaying, bpm]);

  // Synchronization Bridge: Listen to video timeline play triggers
  useEffect(() => {
    const handleTimelinePlay = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setIsPlaying(customEvent.detail.isPlaying);
      }
    };
    window.addEventListener('barksdale_video_timeline_play', handleTimelinePlay);
    return () => {
      window.removeEventListener('barksdale_video_timeline_play', handleTimelinePlay);
      if (patternTimerRef.current) {
        clearTimeout(patternTimerRef.current);
      }
    };
  }, []);

  // Recording waveform updater tick
  useEffect(() => {
    let recInterval: any;
    if (isRecording && isPlaying) {
      recInterval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
        
        setRecordedStems(prevStems => {
          return prevStems.map(stem => {
            if (armedTracks[stem.type]) {
              const newPeak = Math.floor(Math.random() * 55) + 15;
              const nextPeaks = [...stem.dataPoints, newPeak];
              if (nextPeaks.length > 40) {
                nextPeaks.shift();
              }
              return {
                ...stem,
                duration: stem.duration + 1,
                dataPoints: nextPeaks
              };
            }
            return stem;
          });
        });
      }, 1000);
    }
    return () => clearInterval(recInterval);
  }, [isRecording, isPlaying, armedTracks]);

  // Listen to physical MIDI-IN devices & CC fader controllers
  useEffect(() => {
    const handleMidiCc = (ccNumber: number, ccVal: number) => {
      const normalizedVal = Math.round((ccVal / 127) * 100);
      let targetParam = 'cutoff';
      if (ccNumber === 74) targetParam = 'cutoff';
      else if (ccNumber === 71) targetParam = 'resonance';
      else if (ccNumber === 91) targetParam = 'spaceDepth';
      else if (ccNumber === 1) targetParam = 'tapeWow';
      else if (ccNumber === 11) targetParam = 'tapeWobble';
      else targetParam = activeAutomationParam;

      updateParamWithAutomation(targetParam, normalizedVal, ccNumber);
    };

    if (isMidiSynced && navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(access => {
        const inputs = Array.from(access.inputs.values());
        if (inputs.length > 0) {
          setMidiDevices(inputs.map(input => input.name || 'Generic MIDI Controller'));
        }
        inputs.forEach(input => {
          input.onmidimessage = (message: any) => {
            const [command, data1, data2] = message.data;
            if (command === 144 && data2 > 0) { // Note on
              const freq = 440 * Math.pow(2, (data1 - 69) / 12);
              barksdaleSynth.playRhodesNote(freq, 0.4);
            }
            // Control Change CC (176..191 or status 0xB0)
            if ((command & 0xf0) === 0xb0 || (command >= 176 && command <= 191)) {
              handleMidiCc(data1, data2);
            }
          };
        });
      }).catch(() => {
        setMidiDevices(['Hardware MIDI Controller Bridge (Simulated)']);
      });
    }
  }, [isMidiSynced, isAutomationArm, automationMode, activeStep, bpm, activeAutomationParam]);

  // Automation Playback Loop: Replays recorded CC automation curves when transport runs
  useEffect(() => {
    if (isPlaying && (automationMode === 'READ' || automationMode === 'TOUCH') && activeStep !== null) {
      const currentStepTime = Number((activeStep * (60 / bpm)).toFixed(1));
      const activePoints = automationEvents.filter(e => Math.abs(e.timeSec - currentStepTime) < 0.6);

      activePoints.forEach(pt => {
        if (pt.param === 'cutoff') setCutoff(pt.value);
        if (pt.param === 'resonance') setResonance(pt.value);
        if (pt.param === 'spaceDepth') setSpaceDepth(pt.value);
        if (pt.param === 'tapeWow') setTapeWow(pt.value);
        if (pt.param === 'tapeWobble') setTapeWobble(pt.value);
      });
    }
  }, [activeStep, isPlaying, automationMode, automationEvents, bpm]);

  // Scale Keyboard frequencies helper
  const playScaleNote = (intervalIndex: number) => {
    const activeDef = scalesDefinitions[currentScale];
    const octaveOffset = Math.floor(intervalIndex / activeDef.intervals.length);
    const scaleStep = intervalIndex % activeDef.intervals.length;
    const intervalSemitones = activeDef.intervals[scaleStep] + (octaveOffset * 12);
    // Base pitch note (C4 = 261.63Hz)
    const baseFreq = 261.63;
    const freq = baseFreq * Math.pow(2, intervalSemitones / 12);
    barksdaleSynth.playRhodesNote(freq, 0.45);
  };

  const toggleStep = (row: 'kick' | 'snare' | 'hat' | 'clap', stepIdx: number) => {
    let updatedDrums: any;
    setDrums(prev => {
      const updatedRow = [...prev[row]];
      updatedRow[stepIdx] = !updatedRow[stepIdx];
      updatedDrums = { ...prev, [row]: updatedRow };
      return updatedDrums;
    });
    // preview trigger
    if (row === 'kick') barksdaleSynth.playKick();
    if (row === 'snare') barksdaleSynth.playSnare();
    if (row === 'hat') barksdaleSynth.playHiHat();
    if (row === 'clap') barksdaleSynth.playClap();

    // Snapshot step change
    setTimeout(() => {
      pushUndoNode(`Sequencer edit: ${row} ${stepIdx + 1}`, {
        bpm,
        currentScale,
        cutoff,
        resonance,
        spaceDepth,
        tapeWow,
        tapeWobble,
        selectedPack,
        drums: updatedDrums
      });
    }, 100);
  };

  // Co-pilot AI presets
  const applyMixPreset = (presetName: string) => {
    setIsAiThinking(true);
    setTimeout(() => {
      setIsAiThinking(false);
      let presetText = "";
      if (presetName === 'Surgical EQ') {
        setCutoff(80);
        setResonance(30);
        presetText = "Boom! Surgical EQ applied. Carved out that low rumble and opened the high shelf cutoff to 80Hz. Crunchy!";
      } else if (presetName === 'Tape Saturation') {
        setTapeWow(75);
        setTapeWobble(60);
        presetText = "Yessir! Tape Wow cranked to 75% and Wobble to 60%. Enjoy that rich, saturated analogue grit!";
      } else if (presetName === 'Analog Master') {
        setCutoff(65);
        setResonance(55);
        setSpaceDepth(75);
        presetText = "Analog master engaged! Sweet lowpass slope, tight resonance, and high space depth (75%) for that deep hall acoustic!";
      }
      setCopilotMessages(prev => [...prev, { id: String(Date.now()), sender: 'ai', text: presetText, persona: 'producer' }]);
    }, 600);
  };

  // Co-pilot custom text chat
  const handleSendCopilotMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    setCopilotMessages(prev => [...prev, { id: String(Date.now()), sender: 'user', text }]);
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      const responses = [
        "Ayy pal! That query is music to my ears. Sum everything to tape, Fuhgeddaboudit!",
        "Whoa kid, that is clean! Let's pull back the master limiter and let the transients breathe.",
        "Beautiful! Drive that LFO frequency directly into the filter cutoff to get that delicious wobbly vinyl sound."
      ];
      setCopilotMessages(prev => [...prev, { id: String(Date.now() + 1), sender: 'ai', text: responses[Math.floor(Math.random() * responses.length)], persona: 'producer' }]);
    }, 700);
  };

  // Patch matrix cabling triggers
  const handleNodeClick = (nodeName: string) => {
    if (!selectedSrc) {
      setSelectedSrc(nodeName);
    } else {
      if (selectedSrc !== nodeName) {
        // Create new cable connection
        const newCable: PatchCable = {
          id: `cable-${Date.now()}`,
          fromNode: selectedSrc,
          toNode: nodeName,
          color: patchCables.length % 2 === 0 ? '#ca9a5a' : '#f59e0b'
        };
        setPatchCables(prev => [...prev, newCable]);
      }
      setSelectedSrc(null);
    }
  };

  const handleClearPatches = () => {
    setPatchCables([]);
  };

  const handleExportDAWProject = () => {
    const configData = {
      bpm,
      scale: currentScale,
      patches: patchCables,
      drums,
      fx: { cutoff, resonance, spaceDepth, tapeWow, tapeWobble },
      sampler: { file: uploadedFileName, reversed: isSampleReversed, pitch: samplePitch },
      app: 'Barksdale DAW Studio Pro',
      timestamp: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Barksdale_DAWProject_${bpm}bpm.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  // --- MULTITRACK RECORDING & AUDITIONING ENGINE ---
  const auditionDrum = (drumName: 'kick' | 'snare' | 'hat' | 'clap') => {
    if (drumName === 'kick') barksdaleSynth.playKick();
    if (drumName === 'snare') barksdaleSynth.playSnare();
    if (drumName === 'hat') barksdaleSynth.playHiHat();
    if (drumName === 'clap') barksdaleSynth.playClap();
  };

  const auditionChord = (chord: string) => {
    setAuditioningChord(chord);
    barksdaleSynth.playChord(chord, 0.85);
    setTimeout(() => {
      setAuditioningChord(null);
    }, 850);
  };

  const handleAuditionPattern = (patternId: string) => {
    if (patternTimerRef.current) {
      clearTimeout(patternTimerRef.current);
      patternTimerRef.current = null;
    }

    if (auditioningPattern === patternId) {
      setAuditioningPattern(null);
      return;
    }

    // Stop main sequencer if running to avoid overlap
    setIsPlaying(false);
    barksdaleSynth.stopBeatSequencer();

    setAuditioningPattern(patternId);

    const patterns: Record<string, { kick: boolean[]; snare: boolean[]; hat: boolean[]; clap: boolean[] }> = {
      lofi: {
        kick:  [true,  false, false, false, true,  false, true,  false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  false, true,  true,  false, true,  true,  false],
        clap:  [false, false, false, false, true,  false, false, false]
      },
      trap: {
        kick:  [true,  false, false, true,  false, false, true,  false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  true,  true,  true,  true,  true,  true,  true],
        clap:  [false, false, false, false, false, false, false, true]
      },
      house: {
        kick:  [true,  false, true,  false, true,  false, true,  false],
        snare: [false, false, false, false, true,  false, false, false],
        hat:   [false, true,  false, true,  false, true,  false, true],
        clap:  [false, false, true,  false, false, false, true,  false]
      },
      techno: {
        kick:  [true,  true,  true,  true,  true,  true,  true,  true],
        snare: [false, false, false, false, false, false, false, false],
        hat:   [true,  false, true,  false, true,  false, true,  false],
        clap:  [false, false, true,  false, false, false, true,  false]
      },
      neosoul: {
        kick:  [true,  false, false, false, true,  false, false, true],
        snare: [false, false, true,  false, false, true,  false, false],
        hat:   [true,  true,  false, true,  true,  false, true,  true],
        clap:  [false, false, false, false, false, false, false, false]
      }
    };

    const p = patterns[patternId] || patterns.lofi;
    const stepInterval = 180; // 180ms per step

    let currentStep = 0;
    const playNextStep = () => {
      if (p.kick[currentStep]) barksdaleSynth.playKick();
      if (p.snare[currentStep]) barksdaleSynth.playSnare();
      if (p.hat[currentStep]) barksdaleSynth.playHiHat();
      if (p.clap[currentStep]) barksdaleSynth.playClap();

      currentStep++;
      if (currentStep < 8) {
        patternTimerRef.current = setTimeout(playNextStep, stepInterval);
      } else {
        setAuditioningPattern(null);
      }
    };

    playNextStep();
  };

  const handleAuditionInstrumentPreset = (presetId: string) => {
    setAuditioningInstrumentId(presetId);

    if (presetId === 'rhodes_dream') {
      barksdaleSynth.playRhodesNote(261.63, 0.35); // C4
      setTimeout(() => barksdaleSynth.playRhodesNote(329.63, 0.35), 150); // E4
      setTimeout(() => barksdaleSynth.playRhodesNote(392.00, 0.5), 300); // G4
    } else if (presetId === 'brass_overdrive') {
      const freqs = parseChordToFrequencies('Fmaj7');
      freqs.forEach((f, i) => {
        setTimeout(() => barksdaleSynth.playRhodesNote(f * 1.25, 0.7), i * 110);
      });
    } else if (presetId === 'sub_808') {
      barksdaleSynth.playKick();
      barksdaleSynth.playRhodesNote(65.41, 0.8); // C2 sub
    } else if (presetId === 'west_coast_lead') {
      barksdaleSynth.playRhodesNote(880.00, 0.25); // A5
      setTimeout(() => barksdaleSynth.playRhodesNote(987.77, 0.25), 120); // B5
      setTimeout(() => barksdaleSynth.playRhodesNote(1046.50, 0.4), 240); // C6
    } else if (presetId === 'modular_pad') {
      const freqs = parseChordToFrequencies('Dm9');
      freqs.forEach(f => barksdaleSynth.playRhodesNote(f * 0.5, 1.2));
    } else if (presetId === 'vinyl_scratch') {
      barksdaleSynth.playClap();
      barksdaleSynth.playRhodesNote(329.63, 0.15);
      setTimeout(() => {
        barksdaleSynth.playClap();
        barksdaleSynth.playRhodesNote(261.63, 0.15);
      }, 150);
    }

    setTimeout(() => {
      setAuditioningInstrumentId(null);
    }, 900);
  };

  const injectChordToProgression = (chord: string) => {
    // Overwrite scale / play chime
    barksdaleSynth.playChord(chord, 0.9);
    setCopilotMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'ai',
        text: `Injected chord ${chord} into active workstation track with zero-latency buffers!`,
        persona: 'producer'
      }
    ]);
  };

  const injectPatternToSequencer = (patternId: string) => {
    handleLoadSamplePack(patternId);
    barksdaleSynth.playChord('Cmaj7', 0.6);
  };

  const applyPresetToFX = (presetId: string) => {
    let nextCut = 65;
    let nextRes = 45;
    let nextSpace = 55;
    let nextWow = 35;
    let presetLabel = "";

    if (presetId === 'rhodes_dream') {
      nextCut = 45; nextRes = 30; nextSpace = 60; nextWow = 45;
      presetLabel = "Dreamy Rhodes Vintage";
    } else if (presetId === 'brass_overdrive') {
      nextCut = 85; nextRes = 70; nextSpace = 40; nextWow = 30;
      presetLabel = "Saturated Brass Overtone";
    } else if (presetId === 'sub_808') {
      nextCut = 25; nextRes = 20; nextSpace = 25; nextWow = 10;
      presetLabel = "Sub Bass 808 Deep Dive";
    } else if (presetId === 'west_coast_lead') {
      nextCut = 95; nextRes = 75; nextSpace = 55; nextWow = 50;
      presetLabel = "G-Funk High-Whistle";
    } else if (presetId === 'modular_pad') {
      nextCut = 55; nextRes = 35; nextSpace = 90; nextWow = 70;
      presetLabel = "Ambient Space Pad";
    } else if (presetId === 'vinyl_scratch') {
      nextCut = 65; nextRes = 40; nextSpace = 35; nextWow = 95;
      presetLabel = "Crackling Vinyl Lo-Fi";
    }

    setCutoff(nextCut);
    setResonance(nextRes);
    setSpaceDepth(nextSpace);
    setTapeWow(nextWow);

    barksdaleSynth.playChord('Gmaj7', 0.85);

    setCopilotMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'ai',
        text: `Preset Applied: ${presetLabel}. Set Filter Cutoff to ${nextCut}%, Resonance to ${nextRes}%, Space Depth to ${nextSpace}%, and Tape Wow to ${nextWow}%. Ready for tracking!`,
        persona: 'producer'
      }
    ]);
  };

  const auditionInstrument = (instrument: 'rhodes' | 'brass' | 'sampler') => {
    if (instrument === 'rhodes') {
      barksdaleSynth.playRhodesNote(261.63, 0.3);
      setTimeout(() => barksdaleSynth.playRhodesNote(329.63, 0.3), 150);
      setTimeout(() => barksdaleSynth.playRhodesNote(392.00, 0.3), 300);
      setTimeout(() => barksdaleSynth.playRhodesNote(493.88, 0.5), 450);
    } else if (instrument === 'brass') {
      const freqs = parseChordToFrequencies('Fmaj9');
      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          barksdaleSynth.playRhodesNote(freq * 1.3, 0.8);
        }, idx * 100);
      });
    } else if (instrument === 'sampler') {
      barksdaleSynth.playRhodesNote(440.00, 0.15);
      setTimeout(() => barksdaleSynth.playRhodesNote(880.00, 0.2), 150);
    }
  };

  const playEntireBeat = () => {
    if (isPlaying) {
      setIsPlaying(false);
      barksdaleSynth.stopBeatSequencer();
    } else {
      setIsPlaying(true);
      // Generate a loop sequence
      const chordArr = ['Dm9', 'G13', 'Cmaj9', 'Am7'];
      barksdaleSynth.startBeatSequencer(bpm, drums, chordArr, (stepIdx) => {
        setActiveStep(stepIdx);
      });
    }
  };

  const startMultitrackRecord = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    setIsRecording(true);
    setRecordingSeconds(0);
    
    setRecordedStems(prev => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const nextStems = prev.filter(stem => !armedTracks[stem.type]);
      
      const newStemsToCreate: typeof prev = [];
      if (armedTracks.drums) {
        newStemsToCreate.push({
          id: `stem-drums-${Date.now()}`,
          name: `Drums Live Take (${bpm} BPM)`,
          type: 'drums',
          duration: 0,
          isMuted: false,
          isSoloed: false,
          volume: 85,
          dataPoints: [30, 20, 45, 10, 40, 25, 35, 15, 30, 50],
          recordedAt: timestamp
        });
      }
      if (armedTracks.keys) {
        newStemsToCreate.push({
          id: `stem-keys-${Date.now()}`,
          name: `Rhodes Keys Take (${currentScale})`,
          type: 'keys',
          duration: 0,
          isMuted: false,
          isSoloed: false,
          volume: 90,
          dataPoints: [40, 25, 30, 15, 50, 40, 45, 20, 35, 55],
          recordedAt: timestamp
        });
      }
      if (armedTracks.synth) {
        newStemsToCreate.push({
          id: `stem-synth-${Date.now()}`,
          name: `Analog Synth Lead Take`,
          type: 'synth',
          duration: 0,
          isMuted: false,
          isSoloed: false,
          volume: 80,
          dataPoints: [20, 35, 50, 25, 40, 30, 60, 45, 50, 40],
          recordedAt: timestamp
        });
      }
      if (armedTracks.sampler) {
        newStemsToCreate.push({
          id: `stem-sampler-${Date.now()}`,
          name: `Vinyl Granule Ambient Take`,
          type: 'sampler',
          duration: 0,
          isMuted: false,
          isSoloed: false,
          volume: 75,
          dataPoints: [10, 15, 30, 10, 20, 35, 25, 40, 30, 25],
          recordedAt: timestamp
        });
      }
      return [...nextStems, ...newStemsToCreate];
    });
    
    barksdaleSynth.playKick();
    setTimeout(() => barksdaleSynth.playHiHat(), 150);
  };

  const stopMultitrackRecord = () => {
    setIsRecording(false);
    barksdaleSynth.playHiHat();
    barksdaleSynth.playChord('Cmaj7', 0.4);
  };

  const toggleArmTrack = (type: string) => {
    setArmedTracks(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleMuteStem = (id: string) => {
    setRecordedStems(prev => prev.map(s => s.id === id ? { ...s, isMuted: !s.isMuted } : s));
  };

  const handleSoloStem = (id: string) => {
    setRecordedStems(prev => {
      const target = prev.find(s => s.id === id);
      if (!target) return prev;
      const isCurrentlySoloed = target.isSoloed;
      return prev.map(s => {
        if (s.id === id) {
          return { ...s, isSoloed: !isCurrentlySoloed, isMuted: false };
        } else {
          return { ...s, isSoloed: false };
        }
      });
    });
  };

  const handleVolumeChange = (id: string, vol: number) => {
    setRecordedStems(prev => prev.map(s => s.id === id ? { ...s, volume: vol } : s));
  };

  const handleExportStem = (stem: any) => {
    const stemData = {
      ...stem,
      bpm,
      scale: currentScale,
      format: 'WAV 24-bit 48kHz Stereo Float',
      codec: 'Linear PCM Uncompressed',
      workspace: 'Barksdale Studio'
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stemData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Barksdale_Stem_${stem.type}_${stem.recordedAt.replace(/[: ]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCalculateSynthPrompt = () => {
    setIsCalculatingSynth(true);
    setTimeout(() => {
      setIsCalculatingSynth(false);
      const p = synthPrompt.toLowerCase();
      let newCut = 65;
      let newRes = 45;
      let newWow = 35;
      let newSpace = 55;
      if (p.includes('brass') || p.includes('bright') || p.includes('lead')) {
        newCut = 85;
        newRes = 60;
      } else if (p.includes('sub') || p.includes('bass') || p.includes('dark')) {
        newCut = 30;
        newRes = 25;
      } else if (p.includes('pad') || p.includes('string') || p.includes('ambient')) {
        newCut = 50;
        newRes = 35;
        newSpace = 85;
      }
      if (p.includes('warm') || p.includes('tape') || p.includes('analog')) {
        newWow = 80;
      }
      setCutoff(newCut);
      setResonance(newRes);
      setSpaceDepth(newSpace);
      setTapeWow(newWow);
      pushUndoNode('Text-to-Synth: ' + synthPrompt.substring(0, 20) + '...', {
        bpm, currentScale, cutoff: newCut, resonance: newRes, spaceDepth: newSpace, tapeWow: newWow, tapeWobble, selectedPack, drums
      });
      barksdaleSynth.playChord('Fmaj9', 0.8);
    }, 1500);
  };

  const handleTextToMidi = () => {
    setIsGeneratingMidi(true);
    setTimeout(() => {
      setIsGeneratingMidi(false);
      const p = textMidiPrompt.toLowerCase();
      let selectedScaleName = 'Dorian Jazz/Funk';
      if (p.includes('minor') || p.includes('sad') || p.includes('dark')) {
        selectedScaleName = 'Aeolian Natural Minor';
      } else if (p.includes('ethereal') || p.includes('dreamy')) {
        selectedScaleName = 'Lydian Ethereal';
      } else if (p.includes('spanish') || p.includes('phrygian')) {
        selectedScaleName = 'Phrygian Spanish';
      }
      setCurrentScale(selectedScaleName);
      
      const newDrums = {
        kick:  [true,  false, false, true,  true,  false, false, false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  true,  true,  true,  true,  true,  true,  true],
        clap:  [false, false, false, false, true,  false, false, false]
      };
      setDrums(newDrums);

      pushUndoNode('Text-to-MIDI: ' + textMidiPrompt.substring(0, 20) + '...', {
        bpm,
        currentScale: selectedScaleName,
        cutoff,
        resonance,
        spaceDepth,
        tapeWow,
        tapeWobble,
        selectedPack,
        drums: newDrums
      });
      barksdaleSynth.playChord('Dm9', 0.8);
    }, 1600);
  };

  const handleRunVocalProcessor = () => {
    setIsVocalProcessing(true);
    barksdaleSynth.playRhodesNote(220, 0.5);
    setTimeout(() => barksdaleSynth.playRhodesNote(330, 0.5), 300);
    setTimeout(() => barksdaleSynth.playRhodesNote(440, 0.6), 600);
    setTimeout(() => {
      setIsVocalProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 paper-texture p-2 sm:p-3 halftone-overlay min-h-screen min-w-0 max-w-full">
      {/* DAW HEADER */}
      <div className="comix-panel p-3.5 sm:p-4 bg-[#121217] text-white min-w-0 max-w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="min-w-0 max-w-full">
            <h2 className="text-base sm:text-xl font-bold text-amber-500 flex items-center gap-2 truncate">
              <Cpu className="w-5 h-5 stroke-[2px] text-amber-500 animate-pulse shrink-0" />
              BARKSDALE DAW WORKSTATION PRO
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-2xl leading-relaxed">
              Step into Barksdale's master digital audio workstation. Combine our 4-Octave Interactive keyboard scale lock, analog tape warmth effects, an advanced wave sampler, witty 70s mix copilot, and visual patch cords.
            </p>
            {/* Mode Banner */}
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {opMode === 'ai' ? (
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-bounce" />
                  ✨ AI Assisted Mode Active
                </span>
              ) : (
                <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                  <Sliders className="w-2.5 h-2.5 text-orange-400" />
                  🎛️ Expert Mode Active
                </span>
              )}
            </div>
          </div>

          {/* MASTER CONTROLS */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="comix-btn px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase text-black bg-amber-500 border border-amber-600 rounded-lg shadow-md hover:brightness-110 flex items-center gap-1.5 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              {isPlaying ? 'Pause DAW' : 'Play Sequencer'}
            </button>

            {/* MIDI Sync Lock */}
            <button
              onClick={() => setIsMidiSynced(!isMidiSynced)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                isMidiSynced
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/40'
                  : 'bg-black/40 text-gray-400 border-gray-800 hover:bg-gray-900 hover:text-white'
              }`}
            >
              MIDI Sync: {isMidiSynced ? 'ON' : 'OFF'}
            </button>

            {/* Export */}
            <button
              onClick={handleExportDAWProject}
              className="comix-btn px-2.5 py-1.5 text-[10px] font-bold uppercase flex items-center gap-1 text-white bg-black/40 border border-gray-800 rounded-lg hover:border-amber-500/30 hover:bg-black/60 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export DAW JSON
            </button>
          </div>
        </div>

        {/* MIDI DEVIICES DISPLAY */}
        {isMidiSynced && (
          <div className="mt-2.5 flex items-center gap-2 bg-black/40 border border-amber-950 p-1.5 rounded-lg text-[9px] font-mono overflow-x-auto max-w-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span className="text-gray-400 font-bold shrink-0">CONNECTED CLOCKS:</span>
            <div className="flex gap-2">
              {midiDevices.map(d => (
                <span key={d} className="bg-amber-950/50 text-amber-500 px-2 py-0.5 rounded border border-amber-900 whitespace-nowrap">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TOP GRID: KEYBOARD & MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0 max-w-full">
        
        {/* KEYBOARD & SEQUENCER STAGE (7-span) */}
        <div className="lg:col-span-8 space-y-4 min-w-0 max-w-full">
          {/* 4-OCTAVE KEYBOARD & SCALE LOCK */}
          <div className="comix-panel p-3.5 sm:p-4 bg-[#14141e] min-w-0 max-w-full">
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-500 shrink-0" />
                4-Octave Interactive Keyboard
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Scale lock:</span>
                <select
                  value={currentScale}
                  onChange={e => setCurrentScale(e.target.value)}
                  className="bg-black border border-gray-850 rounded-lg p-1 sm:p-1.5 text-xs text-white font-bold outline-none cursor-pointer"
                >
                  {Object.keys(scalesDefinitions).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* KEYBOARD RAMP */}
            <div className="bg-black p-2.5 sm:p-3 rounded-xl border border-gray-950 flex flex-col gap-2 min-w-0 max-w-full overflow-hidden">
              {/* Actual Key Layout Grid */}
              <div className="flex overflow-x-auto gap-1 pb-1 select-none h-24 min-w-0 max-w-full touch-pan-x">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isBlack = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22].includes(i % 12);
                  return (
                    <button
                      key={i}
                      onMouseDown={() => playScaleNote(i)}
                      className={`h-full flex-1 min-w-[26px] sm:min-w-[28px] rounded-b-md transition-all relative shrink-0 ${
                        isBlack 
                          ? 'bg-black border-r border-b-4 border-gray-900 text-gray-600 hover:bg-gray-900 z-10 -mx-1 h-[65%]' 
                          : 'bg-white border-b-4 border-gray-300 text-black hover:bg-gray-100 z-0'
                      }`}
                    >
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black scale-90">
                        {scalesDefinitions[currentScale].notes[i % 8]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="text-[8.5px] font-mono text-gray-600 uppercase text-center tracking-widest pointer-events-none truncate">
                Interactive Rhodes Wave Player • Velocity Dynamic Map
              </div>
            </div>
          </div>

          {/* SEQUENCER BLOCK */}
          <div className="comix-panel p-3.5 sm:p-5 bg-[#121318] min-w-0 max-w-full">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase flex items-center gap-1.5 tracking-wide">
                <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
                8-Step Drum Sequencer
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">TEMPO:</span>
                <input
                  type="number"
                  min="60"
                  max="200"
                  value={bpm}
                  onChange={e => setBpm(parseInt(e.target.value) || 95)}
                  className="bg-black border border-gray-800 rounded-lg p-1 w-14 sm:w-16 text-center text-xs text-white outline-none focus:border-amber-500 font-bold"
                />
                <span className="text-xs font-mono text-gray-400">BPM</span>
              </div>
            </div>

            {/* DRUM ROW STEP SEQUENCER */}
            <div className="space-y-2 min-w-0 max-w-full overflow-x-auto">
              {(['kick', 'snare', 'hat', 'clap'] as const).map(rowName => (
                <div key={rowName} className="flex items-center gap-2 sm:gap-3 min-w-[300px]">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase w-10 sm:w-12 text-right shrink-0">{rowName}:</span>
                  <div className="flex-1 grid grid-cols-8 gap-1 sm:gap-1.5">
                    {drums[rowName].map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleStep(rowName, idx)}
                        className={`h-8 sm:h-10 rounded border transition-all ${
                          step 
                            ? 'bg-amber-500 border-amber-600 shadow-md' 
                            : 'bg-black/40 border-gray-800 hover:border-gray-700'
                        } ${activeStep === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UNIVERSAL ZERO-LATENCY SOUND LIBRARY & PRESET STATION */}
          <div className="comix-panel p-5 bg-[#121318]" id="audition-deck-section">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-850 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-1.5 tracking-wider">
                  <Music className="w-4 h-4 text-amber-500 animate-pulse" />
                  Universal Sound & Preset Library
                </h3>
                <p className="text-[10.5px] text-gray-400 mt-0.5">
                  Universal preview system. Click any chord, drum pattern, or instrument to audition with zero-latency.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-amber-500 border border-amber-900 bg-amber-950/40 px-2 py-0.5 rounded uppercase">
                  ⚡ ULTRA-LOW LATENCY ACTIVE
                </span>
                <span className="text-[9px] font-mono font-bold text-green-400 border border-green-900 bg-green-950/40 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  ASIO SAFE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* CHORD PRESET VAULT */}
              <div className="bg-black/40 border border-gray-900 p-3.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    🎹 Jazz Chord Presets
                  </span>
                  <span className="text-[8px] font-mono text-gray-500">VOICING 4-PART</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Dm9', label: 'D Minor 9' },
                    { id: 'Gmaj7', label: 'G Major 7' },
                    { id: 'Cmaj7', label: 'C Major 7' },
                    { id: 'Am7', label: 'A Minor 7' },
                    { id: 'Fmaj9', label: 'F Major 9' },
                    { id: 'Bbmaj7', label: 'Bb Major 7' },
                    { id: 'E7#9', label: 'E7 Altered' },
                    { id: 'Ab13', label: 'Ab Dominant 13' }
                  ].map(chord => {
                    const isAuditioning = auditioningChord === chord.id;
                    return (
                      <div key={chord.id} className="relative group bg-black/70 border border-gray-850 p-1.5 rounded-lg flex flex-col justify-between hover:border-amber-500/50 transition-all">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-bold text-amber-500 font-mono">{chord.id}</span>
                          <span className="text-[8px] text-gray-500 font-mono uppercase shrink-0 truncate max-w-[50px]">{chord.label.split(' ')[1]}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() => auditionChord(chord.id)}
                            className={`flex-1 py-1 text-[9px] font-mono font-black uppercase rounded flex items-center justify-center gap-1 transition-all ${
                              isAuditioning
                                ? 'bg-amber-500 text-black animate-pulse'
                                : 'bg-[#15151b] hover:bg-amber-500/20 text-gray-300'
                            }`}
                          >
                            {isAuditioning ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                                PLAYING
                              </>
                            ) : (
                              'Audition'
                            )}
                          </button>
                          <button
                            onClick={() => injectChordToProgression(chord.id)}
                            title="Inject to sequence progression"
                            className="p-1 bg-[#1c1c24] hover:bg-amber-500/20 text-gray-400 hover:text-amber-500 rounded text-[9px] font-mono"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DRUM PATTERN BEDS */}
              <div className="bg-black/40 border border-gray-900 p-3.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    🥁 Drum Pattern Library
                  </span>
                  <span className="text-[8px] font-mono text-gray-500">8-STEP GRID</span>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'lofi', name: 'Lofi Chill Swing', tempo: 85, style: 'laidback' },
                    { id: 'trap', name: '808 Hard Trap Rolls', tempo: 140, style: 'triplets' },
                    { id: 'house', name: 'Four-on-the-Floor Club', tempo: 124, style: 'rave' },
                    { id: 'techno', name: 'Minimal Dark Techno', tempo: 128, style: 'hypnotic' },
                    { id: 'neosoul', name: 'Neo-Soul Brushed Swung', tempo: 92, style: 'jazzy' }
                  ].map(pattern => {
                    const isAuditioning = auditioningPattern === pattern.id;
                    return (
                      <div key={pattern.id} className="bg-black/60 border border-gray-850 p-2 rounded-lg flex items-center justify-between hover:border-amber-500/30 transition-all">
                        <div>
                          <div className="text-[10.5px] font-bold text-gray-200">{pattern.name}</div>
                          <div className="text-[8.5px] font-mono text-gray-500 mt-0.5 uppercase">
                            {pattern.tempo} BPM • {pattern.style} mode
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAuditionPattern(pattern.id)}
                            className={`px-2.5 py-1.5 text-[9px] font-bold uppercase rounded-md flex items-center gap-1 transition-all ${
                              isAuditioning
                                ? 'bg-amber-500 text-black font-black animate-pulse shadow-md'
                                : 'bg-black text-gray-300 hover:text-amber-400 border border-gray-800'
                            }`}
                          >
                            {isAuditioning ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-spin" />
                                Playing...
                              </>
                            ) : (
                              'Preview'
                            )}
                          </button>
                          <button
                            onClick={() => injectPatternToSequencer(pattern.id)}
                            className="px-2 py-1.5 text-[9px] font-bold uppercase bg-amber-500 hover:bg-amber-400 text-black rounded-md shadow-sm"
                            title="Load pattern & kit into DAW"
                          >
                            Load
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* INSTRUMENT SOUND MODEL PRESETS */}
              <div className="bg-black/40 border border-gray-900 p-3.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    🎸 Sound Model Presets
                  </span>
                  <span className="text-[8px] font-mono text-gray-500">SYNTH ENGINES</span>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
                  {[
                    { id: 'rhodes_dream', name: 'Vintage Rhodes Mk II', type: 'Rhodes Scale' },
                    { id: 'brass_overdrive', name: 'Smooth Analog Brass', type: 'Freq Sweeper' },
                    { id: 'sub_808', name: 'Sub Bass 808 Glide', type: 'Sub Sine 30Hz' },
                    { id: 'west_coast_lead', name: 'G-Funk High Whistle', type: 'VCO Tri Wave' },
                    { id: 'modular_pad', name: 'Ambient Cosmic Pad', type: 'Dual LFO Reverb' },
                    { id: 'vinyl_scratch', name: '12-bit Vinyl Granule', type: 'Lo-Fi Crackle' }
                  ].map(preset => {
                    const isAuditioning = auditioningInstrumentId === preset.id;
                    return (
                      <div key={preset.id} className="bg-black/60 border border-gray-850 p-1.5 rounded-lg flex items-center justify-between text-[10px] font-mono hover:border-amber-500/30 transition-all">
                        <div>
                          <div className="font-bold text-gray-300 leading-tight">{preset.name}</div>
                          <div className="text-[8px] text-gray-500 uppercase">{preset.type}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAuditionInstrumentPreset(preset.id)}
                            className={`p-1 text-[8.5px] uppercase font-bold rounded ${
                              isAuditioning
                                ? 'bg-amber-500 text-black animate-pulse'
                                : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                            }`}
                          >
                            {isAuditioning ? 'PLAY' : 'Hear'}
                          </button>
                          <button
                            onClick={() => applyPresetToFX(preset.id)}
                            className="p-1 text-[8.5px] uppercase font-bold bg-[#1d1d26] hover:bg-amber-500 text-gray-300 hover:text-black rounded"
                            title="Load physical parameters to FX rack"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ZERO-LATENCY ENGINE CONFIGURATION DECK */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-900 bg-black/25 p-3.5 rounded-xl border border-gray-950 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase flex items-center gap-1.5">
                    Zero-Latency ASIO Simulation Controller
                  </div>
                  <p className="text-[9.5px] text-gray-400 mt-0.5">
                    Direct hardware context thread optimization enabled. Buffer size updates calculation lag instantly.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
                {/* Buffer spec */}
                <div className="bg-black border border-gray-850 px-2.5 py-1.5 rounded-lg text-center flex flex-col justify-center min-w-[75px]">
                  <span className="text-[7.5px] text-gray-500 uppercase">Buffer Size</span>
                  <select
                    value={bufferSize}
                    onChange={e => setBufferSize(parseInt(e.target.value))}
                    className="bg-transparent text-amber-400 font-bold outline-none cursor-pointer text-center"
                  >
                    <option value="16">16 Spls</option>
                    <option value="32">32 Spls</option>
                    <option value="64">64 Spls</option>
                    <option value="128">128 Spls</option>
                  </select>
                </div>

                {/* Simulated Lag */}
                <div className="bg-black border border-gray-850 px-2.5 py-1.5 rounded-lg text-center flex flex-col justify-center">
                  <span className="text-[7.5px] text-gray-500 uppercase">System Lag</span>
                  <span className="text-amber-400 font-bold">{(bufferSize / 44.1).toFixed(2)} ms</span>
                </div>

                {/* Live Driver State */}
                <div className="bg-black border border-gray-850 px-2.5 py-1.5 rounded-lg text-center flex flex-col justify-center">
                  <span className="text-[7.5px] text-gray-500 uppercase">Driver Thread</span>
                  <span className="text-green-400 font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Interactive
                  </span>
                </div>

                {/* Edge buffer switch */}
                <button
                  onClick={() => setIsEdgeBuffering(!isEdgeBuffering)}
                  className={`px-3 py-2 rounded-lg font-black uppercase text-[9.5px] border transition-all ${
                    isEdgeBuffering
                      ? 'bg-amber-500 text-black border-amber-600'
                      : 'bg-black text-gray-400 border-gray-850'
                  }`}
                >
                  {isEdgeBuffering ? '⚡ Edge Buffer ON' : '○ Standard Mode'}
                </button>
              </div>
            </div>
          </div>

          {/* MULTITRACK RECORDING CONSOLE */}
          <div className="comix-panel p-5 bg-[#121318]" id="multitrack-recorder-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 tracking-wide">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  Multitrack Studio Recorder
                </h3>
                <p className="text-[10.5px] text-gray-500 mt-0.5">
                  Record step sequence actions, live keyboard, and sample slices into distinct stem tracks.
                </p>
              </div>

              {/* Master Record Controls */}
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <button
                    onClick={stopMultitrackRecord}
                    className="px-4 py-2 text-xs font-bold uppercase text-white bg-red-600 border border-red-700 rounded-lg shadow-lg hover:bg-red-700 transition-all flex items-center gap-2 animate-pulse"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                    Stop Rec ({recordingSeconds}s)
                  </button>
                ) : (
                  <button
                    onClick={startMultitrackRecord}
                    className="px-4 py-2 text-xs font-bold uppercase text-black bg-amber-500 border border-amber-600 rounded-lg shadow-lg hover:bg-amber-400 transition-all flex items-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 block animate-ping" />
                    Record Armed Stems
                  </button>
                )}
              </div>
            </div>

            {/* TRACK ARMING SELECTORS */}
            <div className="bg-black/40 border border-gray-900 p-3 rounded-lg mb-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider block mb-2">
                🔴 CHOOSE TRACKS TO ARM RECORDING:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'drums', label: '🥁 Drums Track' },
                  { id: 'keys', label: '🎹 Rhodes Keys' },
                  { id: 'synth', label: '🎸 Analog Bass' },
                  { id: 'sampler', label: '🎙️ Sampler Stem' }
                ].map(track => (
                  <button
                    key={track.id}
                    onClick={() => toggleArmTrack(track.id)}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold uppercase tracking-wide border transition-all text-center ${
                      armedTracks[track.id]
                        ? 'bg-red-950/40 border-red-500/80 text-red-400 shadow-sm'
                        : 'bg-black border-gray-850 text-gray-500 hover:text-white'
                    }`}
                  >
                    {armedTracks[track.id] ? '● ARMED' : '○ DISARMED'} • {track.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RECORDED STEM TRACKS LIST */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider block">
                STEM MIXER CONSOLE ({recordedStems.length} TRACKS)
              </span>

              {recordedStems.length === 0 ? (
                <div className="bg-black/60 border border-dashed border-gray-850 p-6 rounded-lg text-center">
                  <span className="text-[11px] text-gray-500 font-bold block uppercase">No tracks recorded yet</span>
                  <span className="text-[9.5px] text-gray-600 mt-1 block">Arm tracks and click "Record Armed Stems" to begin capturing live output</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {recordedStems.map(stem => (
                    <div
                      key={stem.id}
                      className={`p-3 rounded-lg border bg-black/60 transition-all ${
                        stem.isMuted 
                          ? 'border-gray-950 opacity-45' 
                          : stem.isSoloed 
                          ? 'border-amber-500 bg-amber-950/5' 
                          : 'border-gray-900'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Name and Meta */}
                        <div className="min-w-[150px]">
                          <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                            {stem.type} stem
                          </span>
                          <span className="text-xs font-bold text-white block uppercase mt-0.5 truncate max-w-[180px]">
                            {stem.name}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500">
                            Rec at {stem.recordedAt} • {stem.duration.toFixed(1)}s
                          </span>
                        </div>

                        {/* LIVE WAV CONTAINER */}
                        <div className="flex-1 bg-black border border-gray-950 h-10 rounded px-2 flex items-center justify-center gap-0.5 relative overflow-hidden">
                          {isRecording && armedTracks[stem.type] && (
                            <div className="absolute top-1 right-2 flex items-center gap-1.5 z-20">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                              <span className="text-[8px] font-mono text-red-500 font-bold">LIVE CAPTURE</span>
                            </div>
                          )}
                          
                          {stem.dataPoints.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className={`w-1 rounded-sm transition-all shrink-0 ${
                                stem.isMuted
                                  ? 'bg-gray-800'
                                  : stem.isSoloed
                                  ? 'bg-amber-400'
                                  : 'bg-amber-600'
                              }`}
                              style={{ height: `${p}%` }}
                            />
                          ))}
                        </div>

                        {/* Stem Track Mixer Controls */}
                        <div className="flex items-center gap-2.5">
                          {/* Vol Slider */}
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={stem.volume}
                              onChange={e => handleVolumeChange(stem.id, parseInt(e.target.value))}
                              className="w-16 accent-amber-500 h-1 cursor-pointer"
                            />
                            <span className="w-6 text-right text-[9px] text-gray-400">{stem.volume}%</span>
                          </div>

                          {/* Mute Button */}
                          <button
                            onClick={() => handleMuteStem(stem.id)}
                            className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded border transition-all ${
                              stem.isMuted
                                ? 'bg-gray-800 text-white border-gray-700'
                                : 'bg-black text-gray-400 border-gray-850 hover:text-white'
                            }`}
                          >
                            Mute
                          </button>

                          {/* Solo Button */}
                          <button
                            onClick={() => handleSoloStem(stem.id)}
                            className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded border transition-all ${
                              stem.isSoloed
                                ? 'bg-amber-500 text-black border-amber-600'
                                : 'bg-black text-gray-400 border-gray-850 hover:text-amber-500'
                            }`}
                          >
                            Solo
                          </button>

                          {/* Bounce */}
                          <button
                            onClick={() => handleExportStem(stem)}
                            className="p-1 text-gray-400 hover:text-white bg-black/40 border border-gray-850 hover:border-gray-700 rounded"
                            title="Bounce Stem Track to JSON"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODULATION PATCH MATRIX (4-span) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="comix-panel p-5 bg-[#121318] flex flex-col h-full min-h-[380px] justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 tracking-wide">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Mod Patch Matrix
                </h3>
                <button
                  onClick={handleClearPatches}
                  className="text-gray-500 hover:text-white transition-colors"
                  title="Clear Patch Cables"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10.5px] text-gray-400 mb-4 leading-normal">
                Click a source block, then click a destination block to draw a modular connection cable.
              </p>

              {/* GRID NODES */}
              <div className="grid grid-cols-2 gap-4">
                {/* SOURCE NODES */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-bold block">SOURCES:</span>
                  {['Oscillator', 'LFO', 'Envelope', 'Pitch'].map(src => (
                    <button
                      key={src}
                      onClick={() => handleNodeClick(src)}
                      className={`w-full p-2.5 rounded border text-[11px] font-bold uppercase text-left transition-all ${
                        selectedSrc === src
                          ? 'bg-amber-500 text-black border-amber-600 shadow-md'
                          : 'bg-black/40 text-gray-300 border-gray-800 hover:border-gray-750'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>

                {/* DESTINATION NODES */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-bold block">DESTINATIONS:</span>
                  {['Filter Cutoff', 'Resonance', 'Volume', 'Frequency'].map(dest => (
                    <button
                      key={dest}
                      onClick={() => handleNodeClick(dest)}
                      className="w-full p-2.5 rounded border border-gray-800 bg-black/40 text-left text-[11px] font-bold uppercase text-gray-300 hover:border-gray-700 transition-all"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CONNECTED CABLES MONITOR */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-900">
              <span className="text-[8px] font-mono text-gray-500 uppercase block mb-1.5">ACTIVE CONNECTIONS:</span>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                {patchCables.length === 0 ? (
                  <span className="text-[10px] text-gray-500 italic">No patches wired. Custom clean mix signal.</span>
                ) : (
                  patchCables.map(cable => (
                    <div key={cable.id} className="flex items-center justify-between text-[10px] font-mono bg-black/60 p-1.5 rounded border border-gray-950">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cable.color }} />
                        <span className="text-gray-300 font-bold">{cable.fromNode} ➜ {cable.toNode}</span>
                      </div>
                      <span className="text-[8px] text-amber-500 font-bold">12dB/oct</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME MIDI CONTROLLER AUTOMATION SUITE */}
      <div className="comix-panel p-5 bg-[#12131a] border border-amber-500/30 rounded-2xl space-y-4">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Real-Time MIDI Controller Automation Suite
                {isAutomationArm && (
                  <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    <Circle className="w-2 h-2 fill-red-500" /> REC AUTO
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Captures real-time fader and knob adjustments from physical MIDI hardware or virtual controller desk and maps them directly to DAW parameters.
              </p>
            </div>
          </div>

          {/* AUTOMATION CONTROLS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* LIVE MIDI CC FEED BADGE */}
            {lastMidiCcLog && (
              <div className="hidden sm:flex items-center gap-1.5 bg-black/60 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                <span>CC #{lastMidiCcLog.cc} ➜ {lastMidiCcLog.param}: {lastMidiCcLog.val}</span>
              </div>
            )}

            {/* ARM RECORDING BUTTON */}
            <button
              onClick={() => setIsAutomationArm(!isAutomationArm)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 border ${
                isAutomationArm
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30 animate-pulse'
                  : 'bg-black/50 text-gray-300 border-gray-800 hover:border-red-500'
              }`}
            >
              <Circle className={`w-3 h-3 ${isAutomationArm ? 'fill-white' : 'fill-red-500'}`} />
              {isAutomationArm ? 'ARMED (REC)' : 'ARM AUTO'}
            </button>

            {/* MODE SELECTOR */}
            <div className="flex items-center bg-black/80 p-0.5 rounded-xl border border-gray-800 text-[10px] font-mono font-bold">
              {(['READ', 'WRITE', 'TOUCH', 'OFF'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAutomationMode(mode)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    automationMode === mode
                      ? 'bg-amber-500 text-black font-extrabold shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* VIRTUAL HARDWARE FADER DECK & PARAMETER SLIDERS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-black/60 p-3 rounded-xl border border-gray-800">
          {[
            { id: 'cutoff', name: 'Filter Cutoff', cc: 74, val: cutoff, color: '#f59e0b' },
            { id: 'resonance', name: 'Resonance', cc: 71, val: resonance, color: '#e11d48' },
            { id: 'spaceDepth', name: 'Space Reverb', cc: 91, val: spaceDepth, color: '#3b82f6' },
            { id: 'tapeWow', name: 'Tape Wow', cc: 1, val: tapeWow, color: '#10b981' },
            { id: 'tapeWobble', name: 'Tape Wobble', cc: 11, val: tapeWobble, color: '#8b5cf6' }
          ].map(fader => (
            <div
              key={fader.id}
              className={`p-2.5 rounded-lg border transition-all ${
                activeAutomationParam === fader.id
                  ? 'bg-amber-500/10 border-amber-500/50 shadow'
                  : 'bg-[#171822] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  onClick={() => setActiveAutomationParam(fader.id)}
                  className="text-[10px] font-bold text-gray-300 uppercase cursor-pointer hover:text-amber-400 truncate"
                >
                  {fader.name}
                </span>
                <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded">
                  CC #{fader.cc}
                </span>
              </div>

              <div className="text-center my-1">
                <span className="text-sm font-extrabold font-mono text-white">{fader.val}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={fader.val}
                onChange={e => updateParamWithAutomation(fader.id, parseInt(e.target.value), fader.cc)}
                className="w-full accent-amber-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* AUTOMATION CURVE GRAPH VISUALIZER */}
        <div className="bg-black/80 rounded-xl border border-gray-800 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-gray-200 font-mono uppercase">
                AUTOMATION TIMELINE CURVE: {activeAutomationParam.toUpperCase()}
              </span>
            </div>

            {/* PARAMETER SELECTOR TABS & GRAPH ACTIONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutomationEvents(prev => prev.filter(e => e.param !== activeAutomationParam))}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-mono bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-lg"
              >
                <Trash2 className="w-3 h-3" /> CLEAR {activeAutomationParam.toUpperCase()}
              </button>
            </div>
          </div>

          {/* SVG AUTOMATION GRAPH CANVAS */}
          <div className="relative w-full h-32 bg-[#0c0d12] rounded-lg border border-gray-800 overflow-hidden">
            {/* GRID LINES */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 pointer-events-none opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border-r border-amber-500/40 h-full" />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b border-amber-500/40 w-full" />
              ))}
            </div>

            {/* AUTOMATION POINT SVG CURVE */}
            <svg className="absolute inset-0 w-full h-full">
              {(() => {
                const paramEvts = automationEvents
                  .filter(e => e.param === activeAutomationParam)
                  .sort((a, b) => a.timeSec - b.timeSec);

                if (paramEvts.length === 0) return null;

                const pointsStr = paramEvts.map(p => {
                  const xPct = (p.timeSec / 8) * 100;
                  const yPct = 100 - p.value;
                  return `${xPct}%,${yPct}%`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      points={pointsStr}
                    />
                    {paramEvts.map((p, idx) => {
                      const cx = `${(p.timeSec / 8) * 100}%`;
                      const cy = `${100 - p.value}%`;
                      return (
                        <circle
                          key={p.id || idx}
                          cx={cx}
                          cy={cy}
                          r="5"
                          className="fill-amber-400 stroke-black stroke-2 hover:r-7 transition-all cursor-pointer"
                        >
                          <title>{`${p.param}: ${p.value}% at ${p.timeSec}s`}</title>
                        </circle>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* PLAYHEAD SWEEP LINE */}
            {activeStep !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b] z-20 pointer-events-none transition-all duration-75"
                style={{ left: `${((activeStep * (60 / bpm)) / 8) * 100}%` }}
              >
                <div className="w-2 h-2 bg-amber-400 rounded-full -ml-0.75 -mt-1" />
              </div>
            )}
          </div>

          {/* AUTOMATION EVENT COUNT & LOG FOOTER */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
            <span>
              TOTAL CAPTURED EVENTS: <strong className="text-amber-400">{automationEvents.length}</strong>
            </span>
            <span>
              ACTIVE PARAMS: <strong className="text-gray-200">Cutoff (74), Res (71), Space (91), Wow (1), Wobble (11)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID: FX SUITE, SAMPLER & CO-PILOT CHAT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MASTER FX SUITE (4-span) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="comix-panel p-5 bg-[#121318]">
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-1.5 tracking-wide">
              <Sliders className="w-4 h-4 text-amber-500" />
              Master FX Suite
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {/* Cutoff / Res knobs dual visualizers */}
              <div className="grid grid-cols-2 gap-3 bg-black/60 p-3 rounded-lg border border-gray-800">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight block mb-1">Filter Cutoff</span>
                  <div className="text-lg font-bold text-amber-500">{cutoff}%</div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cutoff}
                    onChange={e => updateParamWithAutomation('cutoff', parseInt(e.target.value), 74)}
                    className="w-full accent-amber-500 h-1 cursor-pointer mt-1"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight block mb-1">Resonance</span>
                  <div className="text-lg font-bold text-amber-500">{resonance}%</div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={resonance}
                    onChange={e => updateParamWithAutomation('resonance', parseInt(e.target.value), 71)}
                    className="w-full accent-amber-500 h-1 cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Space Depth & Tape Wow */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Space Depth (Hall reverb):</span>
                    <span className="text-white font-bold">{spaceDepth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={spaceDepth}
                    onChange={e => updateParamWithAutomation('spaceDepth', parseInt(e.target.value), 91)}
                    className="w-full accent-amber-500 h-1.5 bg-gray-800 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tape Wow & Wobble:</span>
                    <span className="text-white font-bold">{tapeWow}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tapeWow}
                    onChange={e => updateParamWithAutomation('tapeWow', parseInt(e.target.value), 1)}
                    className="w-full accent-amber-500 h-1.5 bg-gray-800 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADVANCED SAMPLER (4-span) */}
        <div className="lg:col-span-4 space-y-6 min-w-0 max-w-full">
          <div className="comix-panel p-3.5 sm:p-5 bg-[#121318] min-w-0 max-w-full">
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center justify-between tracking-wide">
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> Advanced Sampler</span>
              <span className="text-[8.5px] font-mono text-amber-500 border border-amber-900 bg-amber-950/40 px-1.5 py-0.5 rounded uppercase">
                48-point chop
              </span>
            </h3>

            <div className="space-y-3.5 text-xs font-mono">
              {/* File Upload drag & drop trigger */}
              <div className="border border-dashed border-gray-800 hover:border-amber-500/50 rounded-xl p-3 text-center bg-black/45 relative cursor-pointer group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUploadSim}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 uppercase font-bold block group-hover:text-amber-500">
                  {uploadedFileName ? `Loaded: ${uploadedFileName.substring(0, 24)}...` : 'Drag or click to import audio'}
                </span>
                <span className="text-[8px] text-gray-500 uppercase font-bold block mt-1">
                  Supports MP3, WAV, AIFF stems
                </span>
              </div>

              {/* Waveform visualizer simulation */}
              <div className="bg-black/75 border border-gray-950 h-16 rounded-xl flex items-center justify-center p-2 gap-0.5 overflow-hidden">
                {waveformPeaks.map((p, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-[#ca9a5a] rounded-sm shrink-0"
                    style={{
                      height: `${p}%`,
                      opacity: isSampleReversed ? 1 - (idx / waveformPeaks.length) : (idx / waveformPeaks.length),
                      transform: isSampleReversed ? 'rotate(180deg)' : 'none'
                    }}
                  />
                ))}
              </div>

              {/* Sampler Controls */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsSampleReversed(!isSampleReversed)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all border ${
                    isSampleReversed
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      : 'bg-black text-gray-400 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  Reverse Loop: {isSampleReversed ? 'REVERSED' : 'NORMAL'}
                </button>

                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-gray-500">PITCH:</span>
                  <select
                    value={samplePitch}
                    onChange={e => setSamplePitch(parseFloat(e.target.value))}
                    className="bg-black border border-gray-800 rounded p-1 text-[9.5px] font-bold text-white outline-none cursor-pointer"
                  >
                    <option value="0.5">0.5x (Half speed)</option>
                    <option value="1.0">1.0x (Standard)</option>
                    <option value="1.5">1.5x (High Pluck)</option>
                    <option value="2.0">2.0x (Double speed)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CO-PILOT AI MIXING CHAT (4-span) */}
        <div className="lg:col-span-4 space-y-6 min-w-0 max-w-full">
          <div className="comix-panel p-3.5 sm:p-5 bg-[#121318] flex flex-col h-[280px] min-w-0 max-w-full">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase font-mono mb-2 flex items-center gap-1.5">
              Co-Pilot AI Mixing Assistant
            </h3>

            {/* Quick Mixer presets */}
            <div className="flex gap-1.5 mb-2.5">
              {['Surgical EQ', 'Tape Saturation', 'Analog Master'].map(preset => (
                <button
                  key={preset}
                  onClick={() => applyMixPreset(preset)}
                  className="flex-1 py-1 text-[8.5px] bg-black/60 border border-gray-800 text-gray-400 hover:text-white rounded uppercase font-bold transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto space-y-2.5 bg-black/40 border border-gray-950 p-2.5 rounded-xl mb-2.5">
              {copilotMessages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[7.5px] font-mono text-gray-500 mb-0.5 uppercase">
                      {isUser ? 'Composer' : 'Brooklyn Producer'}
                    </span>
                    <p className={`p-2 rounded-lg text-[11px] leading-relaxed max-w-[85%] border ${
                      isUser 
                        ? 'bg-[#181822] border-gray-800 text-white rounded-tr-none' 
                        : 'bg-amber-950/25 border-amber-900 text-amber-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                );
              })}
              {isAiThinking && (
                <div className="text-[9px] font-mono text-gray-500 animate-pulse uppercase">
                  ⚡ Analyzing master signals...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Talk mix details..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendCopilotMessage()}
                className="flex-1 bg-black border border-gray-850 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500 font-semibold"
              />
              <button
                onClick={handleSendCopilotMessage}
                className="bg-amber-500 hover:bg-amber-600 text-black font-black px-3 py-1.5 rounded-lg text-xs border border-black shadow-[1.5px_1.5px_0px_#000] uppercase"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CLOUD-NATIVE GRANULAR SAMPLER BLOCK */}
      <div className="w-full">
        <GranularSampler />
      </div>

      {/* THIRD GRID: AIGENIO SAMPLE PACKS & AUTO-PRODUCTION HIT MACHINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* SAMPLE PACK BROWSER & DRUM KIT TOGGLES (6-span) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="comix-panel p-5 bg-[#121318]">
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-1.5 tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Aigenio Sample Pack Browser
            </h3>
            
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Explore Aigenio's multi-genre production kits. Selecting a kit updates your step-sequencer beats, loads premium sample stems, and matches project tempos instantly.
            </p>

            {/* Pack Selectors */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {samplePackList.map(pack => {
                const isActive = selectedPack === pack.id;
                return (
                  <button
                    key={pack.id}
                    onClick={() => handleLoadSamplePack(pack.id)}
                    className={`p-2.5 rounded-lg border text-xs font-bold uppercase transition-all flex flex-col justify-between items-start text-left h-20 ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-black/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-800'
                    }`}
                  >
                    <span className="truncate w-full">{pack.name}</span>
                    <span className="text-[9px] font-mono text-amber-500">{pack.bpm} BPM</span>
                  </button>
                );
              })}
            </div>

            {/* Active Sample List Preview */}
            <div className="bg-black/55 border border-gray-950 p-3 rounded-xl space-y-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider block mb-1">
                PRE-LOADED STEM PACK CONTENTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                {samplePackList.find(p => p.id === selectedPack)?.samples.map((sample, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-black/60 p-2 rounded border border-gray-950">
                    <Volume2 className="w-3 h-3 text-amber-500" />
                    <span className="text-gray-300 truncate">{sample}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HIT MACHINE AUTO-PRODUCTION HUB (6-span) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="comix-panel p-5 bg-[#121318]">
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-1.5 tracking-wide">
              <Cpu className="w-4 h-4 text-amber-500" />
              Aigenio Neural "Hit Machine"
            </h3>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Auto-generate platinum hit sequences based on legendary producer algorithms. Automatically configures chords, loops, and masters for billboard compliance.
            </p>

            {/* Producer Selectors */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { id: 'dr_dre', name: 'Dr. Dre', desc: 'Heavy G-Funk sub-kicks & high-pitched whistles' },
                { id: 'max_martin', name: 'Max Martin', desc: 'Swedish pop structures & bright master compression' },
                { id: 'metro_boomin', name: 'Metro Boomin', desc: 'Dark ambient bells, fast hats & cinematic drops' },
                { id: 'pharrell', name: 'Pharrell Williams', desc: '4-count signature loops & laidback organic perc' }
              ].map(prod => (
                <button
                  key={prod.id}
                  onClick={() => setHitProducer(prod.id)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col transition-all ${
                    hitProducer === prod.id
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-black/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-800'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{prod.name}</span>
                  <span className="text-[8.5px] text-gray-500 mt-0.5 leading-tight">{prod.desc}</span>
                </button>
              ))}
            </div>

            {/* Active Generation Box */}
            {isGeneratingHit ? (
              <div className="bg-black/85 border border-amber-950 p-4 rounded-xl text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
                <div className="text-xs font-mono text-amber-500 uppercase animate-pulse">{hitGenerationLog}</div>
                <div className="text-[9px] font-mono text-gray-500">OFFLOADING TO AIGENIO GPU CLUSTER • PORT 3000</div>
              </div>
            ) : (
              <button
                onClick={handleGenerateHit}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-2.5 rounded-lg text-xs border border-amber-600 shadow-md uppercase transition-all tracking-wider mb-4"
              >
                ⚡ Generate Platinum Hit Track
              </button>
            )}

            {/* Generated Hits History Vault */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider block">
                HIT MACHINE GEN VAULT ({generatedHits.length})
              </span>
              <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2">
                {generatedHits.map(hit => (
                  <div key={hit.id} className="bg-black/60 border border-gray-950 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-mono">
                    <div>
                      <div className="font-bold text-white uppercase">{hit.title}</div>
                      <div className="text-[9px] text-gray-500 uppercase mt-0.5">
                        {hit.producer} • {hit.genre} • {hit.bpm} BPM • {hit.scale}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayHitPreview(hit)}
                      className="px-2.5 py-1 text-[8.5px] bg-amber-500 text-black font-bold rounded uppercase hover:bg-amber-600 transition-all shadow-sm"
                    >
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FOURTH GRID: ADVANCED AI VOCAL PROCESSOR, TEXT-TO-SYNTH/MIDI & INFINITE UNDO STATE TREE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* LEFT PANEL: VOCAL PROCESSOR & SYNTH CONVERTERS (6-span) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="comix-panel p-5 bg-[#121318]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-850">
              <div className="flex gap-2">
                <button
                  onClick={() => setVocalTab('vocal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    vocalTab === 'vocal'
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🎙️ AI Vocal Processor
                </button>
                <button
                  onClick={() => setVocalTab('text2synth')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    vocalTab === 'text2synth'
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🎹 Text-to-Synth & MIDI
                </button>
              </div>
            </div>

            {vocalTab === 'vocal' ? (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Style your voice captures with formant-shifting, automatic tuning curves, tube warmers, and physical chord-modulated harmonies.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-500 uppercase block">Vocal Profile Style:</label>
                    <select
                      value={vocalStyle}
                      onChange={e => setVocalStyle(e.target.value)}
                      className="w-full bg-black border border-gray-850 rounded-lg p-2 text-xs text-white font-bold outline-none cursor-pointer"
                    >
                      <option value="Autotuned Trap">Autotuned Trap</option>
                      <option value="Classic G-Funk Talkbox">Classic G-Funk Talkbox</option>
                      <option value="Swedish Pop Clean">Swedish Pop Clean</option>
                      <option value="Warm Studio Vintage">Warm Studio Vintage</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono text-gray-500 uppercase block">Formant Pitch Shift:</label>
                      <span className="text-[10px] font-mono text-amber-500 font-bold">{formantPitch > 0 ? `+${formantPitch}` : formantPitch} st</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={formantPitch}
                      onChange={e => setFormantPitch(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-gray-800 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono text-gray-500 uppercase block">Autotune Speed:</label>
                      <span className="text-[10px] font-mono text-amber-500 font-bold">{pitchCorrectionSpeed} ms</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={pitchCorrectionSpeed}
                      onChange={e => setPitchCorrectionSpeed(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-gray-800 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono text-gray-500 uppercase block">Tube Saturation Drive:</label>
                      <span className="text-[10px] font-mono text-amber-500 font-bold">{vocalSaturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocalSaturation}
                      onChange={e => setVocalSaturation(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-gray-800 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono text-gray-500 uppercase block">Harmonizer Stack Voices:</label>
                      <span className="text-[10px] font-mono text-amber-500 font-bold">{harmonizerVoices} voices</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={harmonizerVoices}
                      onChange={e => setHarmonizerVoices(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-gray-800 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Animated Waveform monitor */}
                <div className="bg-black/80 border border-gray-950 p-3 rounded-xl relative h-20 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-around opacity-40">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const height = Math.sin(i * 0.3 + (isVocalProcessing ? Date.now() * 0.05 : 0)) * 24 + 28;
                      return (
                        <div
                          key={i}
                          className="w-[3px] bg-amber-500 rounded transition-all duration-150"
                          style={{ height: `${Math.max(4, height)}px` }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-mono text-amber-500 uppercase font-bold tracking-widest z-10 bg-black/75 px-3 py-1 rounded-lg border border-amber-500/20">
                    {isVocalProcessing ? '🎙️ RUNNING VOCAL HARMONICS ANALYZER...' : 'VOCAL MONITOR INACTIVE'}
                  </span>
                </div>

                <button
                  onClick={handleRunVocalProcessor}
                  disabled={isVocalProcessing}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {isVocalProcessing ? 'Calculating Formant Coefficients...' : 'Process Active Audio Frame'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* TEXT TO SYNTH */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Prompt-to-Patch Synthesis</h4>
                  <p className="text-[11px] text-gray-400">
                    Describe a custom synth vibe. Our offloader parses terms to set matching biquad cutoff, resonance, wow, and delay parameters.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={synthPrompt}
                      onChange={e => setSynthPrompt(e.target.value)}
                      className="flex-1 bg-black border border-gray-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
                      placeholder="e.g. Fat sub bass with warm flutter..."
                    />
                    <button
                      onClick={handleCalculateSynthPrompt}
                      disabled={isCalculatingSynth}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg text-xs uppercase transition-all"
                    >
                      {isCalculatingSynth ? 'Synthesizing...' : 'Load'}
                    </button>
                  </div>
                </div>

                {/* TEXT TO MIDI */}
                <div className="pt-3 border-t border-dashed border-gray-850 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Aigenio Universal Text-to-MIDI</h4>
                  <p className="text-[11px] text-gray-400">
                    Enter a musical layout descriptor to auto-generate a full chords sequence and populate the step-sequencer.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textMidiPrompt}
                      onChange={e => setTextMidiPrompt(e.target.value)}
                      className="flex-1 bg-black border border-gray-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
                      placeholder="e.g. Cinematic natural minor block..."
                    />
                    <button
                      onClick={handleTextToMidi}
                      disabled={isGeneratingMidi}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg text-xs uppercase transition-all"
                    >
                      {isGeneratingMidi ? 'Converting...' : 'Inject Chords'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: INFINITE UNDO TREE & CLOUD BUFFER (6-span) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="comix-panel p-5 bg-[#121318]">
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-1.5 tracking-wide">
              <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
              Infinite Undo History Tree
            </h3>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Every DAW edit is tracked as a branch node. Tap any historical commit node below to revert parameters (BPM, active chord maps, filters, and patterns) instantly.
            </p>

            {/* Quick manual snapshot */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Name a custom history branch state..."
                value={customSnapshotLabel}
                onChange={e => setCustomSnapshotLabel(e.target.value)}
                className="flex-1 bg-black border border-gray-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
              />
              <button
                onClick={() => {
                  if (!customSnapshotLabel.trim()) return;
                  pushUndoNode(customSnapshotLabel);
                  setCustomSnapshotLabel('');
                }}
                className="bg-amber-500 hover:bg-amber-600 text-black font-black px-4 py-2 rounded-lg text-xs uppercase"
              >
                Snapshot
              </button>
            </div>

            {/* History branch visualization list */}
            <div className="bg-black/40 border border-gray-950 p-3 rounded-xl max-h-[160px] overflow-y-auto pr-1 space-y-2 mb-4">
              {undoHistory.map((node, idx) => {
                const isActive = currentHistoryId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleRestoreState(node.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-center ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-white font-black'
                        : 'bg-black/60 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-500 font-semibold">
                        {idx === 0 ? '○' : '├─'}
                      </span>
                      <span className="text-xs truncate uppercase font-bold">{node.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#ca9a5a] font-bold">{node.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* ZERO LATENCY CLOUD PANEL */}
            <div className="bg-black border border-dashed border-gray-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Aigenio Edge Cloud Buffering
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 uppercase">
                  Offloads neural models to nearest GPU edge node.
                </p>
                <div className="flex gap-3 text-[9px] font-mono text-gray-400 uppercase mt-2">
                  <span>Ping: <strong className="text-emerald-500 font-bold">0.8ms</strong></span>
                  <span>Jitter: <strong className="text-emerald-500 font-bold">0.02ms</strong></span>
                  <span>Load: <strong className="text-amber-500 font-bold">12%</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={bufferSize}
                  onChange={e => setBufferSize(parseInt(e.target.value))}
                  disabled={!isEdgeBuffering}
                  className="bg-black border border-gray-850 rounded px-2 py-1 text-[10px] font-mono text-white outline-none cursor-pointer"
                >
                  <option value="16">16 Spls</option>
                  <option value="32">32 Spls</option>
                  <option value="64">64 Spls</option>
                </select>
                <button
                  onClick={() => setIsEdgeBuffering(!isEdgeBuffering)}
                  className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase transition-all ${
                    isEdgeBuffering
                      ? 'bg-emerald-950 text-emerald-500 border border-emerald-900/40'
                      : 'bg-red-950 text-red-500 border border-red-900/40'
                  }`}
                >
                  {isEdgeBuffering ? 'Buffers Active' : 'Buffers Off'}
                </button>
              </div>
            </div>

            {/* METRONOME, AUDIO PEAK MIRRORING, AUDIO EFFECT RACK & MULTITRACK RECORDING SUITE */}
            <div className="mt-8 space-y-8">
              <BeatSeekMetronome />
              <AudioPeakMirroring />
              <AudioEffectRack />
              <MultitrackRecordingSuite />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

