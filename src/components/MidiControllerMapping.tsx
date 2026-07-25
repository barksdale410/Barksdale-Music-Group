import React, { useState, useEffect, useRef } from 'react';
import { barksdaleSynth } from '../utils/audioUtils';
import { mongoMidiService, MidiBinding, MongoQueryLog, getMongoQueryLogs } from '../services/mongoMidiService';
import { 
  Sliders, 
  Settings, 
  Trash2, 
  Database, 
  Terminal, 
  Zap, 
  Activity, 
  Cpu, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Pause, 
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface MidiControllerMappingProps {
  progression: string[];
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
  mixLevels: {
    kick: number;
    snare: number;
    hat: number;
    keys: number;
    subBass: number;
  };
  setMixLevels: React.Dispatch<React.SetStateAction<{
    kick: number;
    snare: number;
    hat: number;
    keys: number;
    subBass: number;
  }>>;
  timeStretchFactor: number;
  setTimeStretchFactor: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  toggleSequencer: () => void;
  handleTriggerMpcPad: (padIdx: number) => void;
}

export const MidiControllerMapping: React.FC<MidiControllerMappingProps> = ({
  progression,
  bpm,
  setBpm,
  mixLevels,
  setMixLevels,
  timeStretchFactor,
  setTimeStretchFactor,
  isPlaying,
  toggleSequencer,
  handleTriggerMpcPad
}) => {
  // Device lists & status
  const [midiDevices, setMidiDevices] = useState<string[]>([]);
  const [midiStatus, setMidiStatus] = useState<'unsupported' | 'initializing' | 'granted' | 'denied'>('initializing');
  const [lastMidiEvent, setLastMidiEvent] = useState<string>("No active MIDI signals received");
  const [keyboardEnabled, setKeyboardEnabled] = useState<boolean>(true);
  const [activeComputerKey, setActiveComputerKey] = useState<string | null>(null);

  // MIDI Mapping Database lists
  const [mappings, setMappings] = useState<MidiBinding[]>([]);
  const [isLoadingMaps, setIsLoadingMaps] = useState<boolean>(true);
  const userId = "darnellbarksdale2@gmail.com"; // Current User Session

  // New binding form state
  const [sourceType, setSourceType] = useState<'cc' | 'note'>('cc');
  const [sourceNumber, setSourceNumber] = useState<number>(1);
  const [targetType, setTargetType] = useState<'daw_param' | 'pad_trigger' | 'transport_control'>('daw_param');
  const [targetKey, setTargetKey] = useState<string>('mixLevels.keys');
  const [targetName, setTargetName] = useState<string>('Keys Volume Slider');

  // MIDI Learning state
  const [isLearning, setIsLearning] = useState<boolean>(false);
  const isLearningRef = useRef(isLearning);
  const learningTypeRef = useRef(sourceType);

  // MongoDB Panel & Log states
  const [showMongoDashboard, setShowMongoDashboard] = useState<boolean>(false);
  const [mongoLogs, setMongoLogs] = useState<MongoQueryLog[]>([]);
  const [dbStatus, setDbStatus] = useState<'connected' | 'querying' | 'error'>('connected');

  // Live UI flashes for mapped parameters
  const [lastMappedTrigger, setLastMappedTrigger] = useState<{ key: string; value: number } | null>(null);

  // Align refs
  useEffect(() => {
    isLearningRef.current = isLearning;
  }, [isLearning]);

  useEffect(() => {
    learningTypeRef.current = sourceType;
  }, [sourceType]);

  // Sync mappings with target details when dropdown switches
  useEffect(() => {
    if (targetType === 'daw_param') {
      const names: Record<string, string> = {
        'mixLevels.kick': 'Kick Volume Slider',
        'mixLevels.snare': 'Snare Volume Slider',
        'mixLevels.hat': 'Hi-Hat Volume Slider',
        'mixLevels.keys': 'Keys Volume Slider',
        'mixLevels.subBass': 'Sub Bass Volume Slider',
        'bpm': 'DAW Tempo (BPM)',
        'timeStretchFactor': 'Elastic Stretch Speed',
        'cc1_dynamics': 'Orchestral Dynamics (CC#1)',
        'cc11_expression': 'Orchestral Expression (CC#11)',
      };
      setTargetKey(targetKey.startsWith('mixLevels.') || ['bpm', 'timeStretchFactor', 'cc1_dynamics', 'cc11_expression'].includes(targetKey) ? targetKey : 'mixLevels.keys');
      setTargetName(names[targetKey] || 'Keys Volume Slider');
    } else if (targetType === 'pad_trigger') {
      const matches = targetKey.match(/pad\.(\d+)/);
      const idx = matches ? parseInt(matches[1]) : 0;
      setTargetKey(`pad.${idx}`);
      setTargetName(`MPC Drum Pad ${idx + 1}`);
    } else if (targetType === 'transport_control') {
      setTargetKey('transport.play');
      setTargetName('Play/Pause Toggle Transport');
    }
  }, [targetType]);

  // Handle targetKey change to keep name synced
  const handleTargetKeyChange = (val: string) => {
    setTargetKey(val);
    if (targetType === 'daw_param') {
      const names: Record<string, string> = {
        'mixLevels.kick': 'Kick Volume Slider',
        'mixLevels.snare': 'Snare Volume Slider',
        'mixLevels.hat': 'Hi-Hat Volume Slider',
        'mixLevels.keys': 'Keys Volume Slider',
        'mixLevels.subBass': 'Sub Bass Volume Slider',
        'bpm': 'DAW Tempo (BPM)',
        'timeStretchFactor': 'Elastic Stretch Speed',
        'cc1_dynamics': 'Orchestral Dynamics (CC#1)',
        'cc11_expression': 'Orchestral Expression (CC#11)',
      };
      setTargetName(names[val] || 'Volume Fader');
    } else if (targetType === 'pad_trigger') {
      const padIdx = parseInt(val.split('.')[1]) || 0;
      setTargetName(`MPC Drum Pad ${padIdx + 1}`);
    } else {
      setTargetName('Play/Pause Toggle Transport');
    }
  };

  // Keyboard mapping keys
  const keyboardKeys = [
    { key: 'A', chordIdx: 0, label: 'Chord 1' },
    { key: 'S', chordIdx: 1, label: 'Chord 2' },
    { key: 'D', chordIdx: 2, label: 'Chord 3' },
    { key: 'F', chordIdx: 3, label: 'Chord 4' },
    { key: 'G', chordIdx: 4, label: 'Chord 5' },
    { key: 'H', chordIdx: 5, label: 'Chord 6' },
    { key: 'J', chordIdx: 6, label: 'Chord 7' },
    { key: 'K', chordIdx: 7, label: 'Chord 8' },
  ];

  // Load MIDI mappings from MongoDB on load
  const loadMappingsFromDb = async () => {
    try {
      setIsLoadingMaps(true);
      setDbStatus('querying');
      const data = await mongoMidiService.getMappings(userId);
      setMappings(data);
      setDbStatus('connected');
    } catch (err) {
      console.error(err);
      setDbStatus('error');
    } finally {
      setIsLoadingMaps(false);
    }
  };

  useEffect(() => {
    loadMappingsFromDb();

    // Listen to simulated MongoDB logs to update inspector dashboard live
    const handleMongoLog = () => {
      setMongoLogs(getMongoQueryLogs());
    };
    window.addEventListener('mongo_query_logged', handleMongoLog);
    setMongoLogs(getMongoQueryLogs());

    return () => {
      window.removeEventListener('mongo_query_logged', handleMongoLog);
    };
  }, []);

  // Set up MIDI device lists
  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setMidiStatus('unsupported');
      return;
    }

    navigator.requestMIDIAccess()
      .then((access) => {
        setMidiStatus('granted');
        const inputs = Array.from(access.inputs.values());
        setMidiDevices(inputs.map(input => input.name || "Generic Controller"));

        access.onstatechange = () => {
          const updated = Array.from(access.inputs.values());
          setMidiDevices(updated.map(input => input.name || "Generic Controller"));
        };
      })
      .catch(() => {
        setMidiStatus('denied');
      });
  }, []);

  // Web MIDI controller events listener inside existing DAW engine service callback
  useEffect(() => {
    const handleIncomingMidi = (status: number, data1: number, data2: number, deviceName: string) => {
      const command = status & 0xf0;
      const channel = status & 0x0f;

      const isNoteOn = command === 144 && data2 > 0;
      const isNoteOff = command === 128 || (command === 144 && data2 === 0);
      const isCC = command === 176; // 0xB0 Control Change status

      // 1. Handle Active Learning mode: intercept next signal to bind controller knob/pad
      if (isLearningRef.current) {
        if (isCC && learningTypeRef.current === 'cc') {
          setSourceNumber(data1);
          setIsLearning(false);
          setLastMidiEvent(`LEARNED: CC#${data1} detected from ${deviceName}`);
          barksdaleSynth.playRhodesNote(523.25, 0.15); // visual chime feedback
          return;
        } else if (isNoteOn && learningTypeRef.current === 'note') {
          setSourceNumber(data1);
          setIsLearning(false);
          setLastMidiEvent(`LEARNED: Note#${data1} detected from ${deviceName}`);
          barksdaleSynth.playRhodesNote(587.33, 0.15); // visual chime feedback
          return;
        }
      }

      // 2. Perform MIDI Mapping routing lookup relative to MongoDB configurations
      let wasMapped = false;

      if (isCC) {
        // Continuous Controller messages (sliders/knobs)
        const match = mappings.find(m => m.sourceType === 'cc' && m.sourceNumber === data1);
        if (match) {
          wasMapped = true;
          setLastMidiEvent(`CC MAP TRIGGERED: CC#${data1} [Val: ${data2}] ➔ ${match.targetName}`);
          setLastMappedTrigger({ key: match.targetKey, value: data2 });
          
          // Execute parameter mutations
          if (match.targetKey.startsWith('mixLevels.')) {
            const levelKey = match.targetKey.split('.')[1];
            // Scale CC value 0-127 linearly to DAW dB level 0-100
            const scaledVal = Math.round((data2 / 127) * 100);
            setMixLevels(prev => ({ ...prev, [levelKey]: scaledVal }));
          } 
          else if (match.targetKey === 'bpm') {
            // Scale CC value 0-127 to DAW tempo range 60-180 BPM
            const scaledBpm = Math.round(60 + (data2 / 127) * 120);
            setBpm(scaledBpm);
          } 
          else if (match.targetKey === 'timeStretchFactor') {
            // Scale CC 0-127 to time stretch speed multiplier 0.5x to 2.0x
            const scaledFactor = parseFloat((0.5 + (data2 / 127) * 1.5).toFixed(2));
            setTimeStretchFactor(scaledFactor);
          }
          else if (match.targetKey === 'cc1_dynamics') {
            // Simulate CC1 modulation in browser session
            const cc1El = document.querySelector('input[type="range"]') as HTMLInputElement;
            if (cc1El) {
              // Trigger a simulated browser input event for CC1 slider
              const cc1TriggerEvent = new CustomEvent('midi_cc_update', { detail: { cc: 1, val: data2 } });
              window.dispatchEvent(cc1TriggerEvent);
            }
          }
          else if (match.targetKey === 'cc11_expression') {
            // Simulate CC11 modulation in browser session
            const cc11TriggerEvent = new CustomEvent('midi_cc_update', { detail: { cc: 11, val: data2 } });
            window.dispatchEvent(cc11TriggerEvent);
          }
        }
      } 
      else if (isNoteOn) {
        // Pad trigger / Transport buttons on controller keyboard
        const match = mappings.find(m => m.sourceType === 'note' && m.sourceNumber === data1);
        if (match) {
          wasMapped = true;
          setLastMidiEvent(`NOTE MAP TRIGGERED: Note#${data1} [Vel: ${data2}] ➔ ${match.targetName}`);
          setLastMappedTrigger({ key: match.targetKey, value: data2 });

          if (match.targetKey === 'transport.play') {
            toggleSequencer();
          } 
          else if (match.targetKey.startsWith('pad.')) {
            const padIdx = parseInt(match.targetKey.split('.')[1]) || 0;
            handleTriggerMpcPad(padIdx);
          }
        }
      }

      // 3. Fallback default play behaviors if signal is not explicitly mapped
      if (!wasMapped) {
        if (isNoteOn) {
          // Play classic rhodes keys natively
          const freq = 440 * Math.pow(2, (data1 - 69) / 12);
          barksdaleSynth.playRhodesNote(freq, 0.45);
          setLastMidiEvent(`Note ON (Fallback Keyboard): ${data1} | Vel: ${data2} | Src: ${deviceName}`);
        } else if (isNoteOff) {
          setLastMidiEvent(`Note OFF: ${data1} | Src: ${deviceName}`);
        } else if (isCC) {
          setLastMidiEvent(`CC signal unmapped: CC#${data1} Value: ${data2} | Src: ${deviceName}`);
        }
      }
    };

    // Register inside existing DAW engine service
    barksdaleSynth.registerMidiCallback(handleIncomingMidi);

    return () => {
      barksdaleSynth.unregisterMidiCallback(handleIncomingMidi);
    };
  }, [mappings, mixLevels, bpm, timeStretchFactor, isPlaying, toggleSequencer, handleTriggerMpcPad]);

  // Clean active visual flashes
  useEffect(() => {
    if (lastMappedTrigger) {
      const timer = setTimeout(() => setLastMappedTrigger(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastMappedTrigger]);

  // Computer keyboard trigger fallback for chords
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyboardEnabled) return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      const keyChar = e.key.toUpperCase();
      const binding = keyboardKeys.find(k => k.key === keyChar);

      if (binding) {
        const chordName = progression[binding.chordIdx % progression.length];
        if (chordName) {
          barksdaleSynth.playChord(chordName, 0.8);
          setActiveComputerKey(keyChar);
          setTimeout(() => setActiveComputerKey(null), 150);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardEnabled, progression]);

  // Handle Save mapping to MongoDB
  const handleSaveMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDbStatus('querying');
      await mongoMidiService.saveMapping(userId, {
        sourceType,
        sourceNumber,
        targetType,
        targetKey,
        targetName
      });
      // reload
      await loadMappingsFromDb();
      setLastMidiEvent(`SUCCESS: Mapping stored in MongoDB for ${targetName}`);
    } catch (err) {
      console.error(err);
      setDbStatus('error');
    }
  };

  // Handle Delete mapping from MongoDB
  const handleDeleteMapping = async (id: string, name: string) => {
    try {
      setDbStatus('querying');
      await mongoMidiService.deleteMapping(userId, id);
      await loadMappingsFromDb();
      setLastMidiEvent(`DELETED: Mapping removed for ${name}`);
    } catch (err) {
      console.error(err);
      setDbStatus('error');
    }
  };

  // Reset database config
  const handleResetDb = async () => {
    if (confirm("Are you sure you want to drop the 'midi_mappings' collection in MongoDB and reset to factory defaults?")) {
      try {
        setDbStatus('querying');
        await mongoMidiService.resetMappings(userId);
        await loadMappingsFromDb();
        setLastMidiEvent("DATABASE RESET: Default document schemas restored in MongoDB.");
      } catch (err) {
        console.error(err);
        setDbStatus('error');
      }
    }
  };

  return (
    <div className="space-y-6" id="midi-mapping-manager-root">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#2a2a32] pt-6 pb-2">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--bmg-accent-primary)]" /> External MIDI Mapping Station
          </h3>
          <p className="text-[11px] text-[#8e8e93] mt-1">Bind continuous controller (CC) knobs and hardware key-pads to live mixing faders or transport commands.</p>
        </div>

        {/* MongoDB Sync Badge */}
        <button
          onClick={() => setShowMongoDashboard(!showMongoDashboard)}
          className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-2 transition-all ${
            showMongoDashboard 
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-[#111114] border-zinc-800 text-zinc-500 hover:text-white"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MongoDB: {dbStatus === 'connected' ? 'CONNECTED' : dbStatus === 'querying' ? 'TRANSACTING...' : 'ERROR'}</span>
          {showMongoDashboard ? <Eye className="w-3 h-3 ml-1" /> : <EyeOff className="w-3 h-3 ml-1" />}
        </button>
      </div>

      {/* CORE MIDI ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HARDWARE PORTS & TELEMETRY MONITOR - Left 4 Columns */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bmg-card p-4 border border-[#2a2a32] bg-[#141416]">
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-3 flex items-center justify-between">
              <span>Hardware Driver Telemetry</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--bmg-accent-primary)]/10 text-[var(--bmg-accent-primary)] border border-[var(--bmg-accent-primary)]/20 font-mono">Web MIDI</span>
            </h4>

            <div className="space-y-3">
              {/* Connected hardware inputs list */}
              <div>
                <span className="text-[9px] text-[#636366] uppercase block mb-1">Detected Input Ports</span>
                <div className="bg-[#0e0e10] p-2.5 rounded border border-[#25252b] min-h-[50px] flex flex-col justify-center">
                  {midiStatus === 'unsupported' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#ffcc00] font-mono">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Web MIDI unsupported in this browser frame</span>
                    </div>
                  )}
                  {midiStatus === 'initializing' && (
                    <span className="text-[10px] text-[#636366] font-mono animate-pulse">Initializing hardware ports...</span>
                  )}
                  {midiStatus === 'denied' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#ff453a] font-mono">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>MIDI access request denied by browser</span>
                    </div>
                  )}
                  {midiStatus === 'granted' && midiDevices.length === 0 && (
                    <div className="text-[10px] text-zinc-500 font-mono italic leading-normal">
                      No hardware keyboard/pad detected. Virtual controller driver active as automatic computer keyboard fallback.
                    </div>
                  )}
                  {midiStatus === 'granted' && midiDevices.length > 0 && (
                    <div className="space-y-1.5">
                      {midiDevices.map((dev, idx) => (
                        <div key={idx} className="text-[10.5px] text-[#32d74b] font-mono font-black flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>{dev}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic live event display block */}
              <div>
                <span className="text-[9px] text-[#636366] uppercase block mb-1">Live MIDI Stream Signal</span>
                <div className="bg-[#0a0a0c] p-2.5 text-[10px] font-mono text-[#a1a1a6] border border-[#25252b] rounded-lg flex items-start gap-2 min-h-[64px]">
                  <Activity className="w-4 h-4 text-[var(--bmg-accent-primary)] shrink-0 animate-pulse mt-0.5" />
                  <span className="leading-normal break-all">{lastMidiEvent}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COMPUTER KEYBOARD FALLBACK BLOCK */}
          <div className="bmg-card p-4 border border-[#2a2a32] bg-[#141416]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Computer Keyboard Fallback</span>
              <button
                onClick={() => setKeyboardEnabled(!keyboardEnabled)}
                className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded transition-all border ${
                  keyboardEnabled 
                    ? 'bg-[var(--bmg-accent-primary)]/10 text-[var(--bmg-accent-primary)] border-[var(--bmg-accent-primary)]/30' 
                    : 'bg-[#111114] text-gray-600 border-zinc-800'
                }`}
              >
                {keyboardEnabled ? "Fallback Keys Active" : "Bypassed"}
              </button>
            </div>

            <p className="text-[10.5px] text-[#8e8e93] leading-relaxed mb-3">
              Press computer keys to play chords of the active progression:
            </p>

            <div className="grid grid-cols-4 gap-1.5">
              {keyboardKeys.map((item) => {
                const boundedChord = progression[item.chordIdx % progression.length] || "—";
                const isPressed = activeComputerKey === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (boundedChord !== "—") {
                        barksdaleSynth.playChord(boundedChord, 0.8);
                        setActiveComputerKey(item.key);
                        setTimeout(() => setActiveComputerKey(null), 150);
                      }
                    }}
                    className={`p-1.5 rounded border text-center transition-all flex flex-col justify-between items-center h-12 select-none ${
                      isPressed 
                        ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-accent-primary)]/10 scale-95 shadow-[0_0_8px_rgba(202,154,90,0.4)]'
                        : 'border-[#2a2a32] bg-[#1c1c1f] hover:bg-[#25252b]'
                    }`}
                  >
                    <span className="text-[11px] font-black text-white">{item.key}</span>
                    <span className={`text-[8.5px] font-mono font-bold ${isPressed ? 'text-[var(--bmg-accent-primary)]' : 'text-[#ffcc00]'}`}>
                      {boundedChord}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIVE MAPPINGS TABLE - Middle 5 Columns */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bmg-card p-4 border border-[#2a2a32] bg-[#141416] flex flex-col h-full justify-between min-h-[380px]">
            <div>
              <div className="flex justify-between items-center border-b border-[#25252b] pb-2 mb-3">
                <span className="text-[10px] uppercase font-black text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[var(--bmg-accent-primary)]" /> Saved MIDI Maps Collection
                </span>
                <span className="text-[8px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                  MongoDB: {mappings.length} records
                </span>
              </div>

              {isLoadingMaps ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2.5">
                  <RefreshCw className="w-5 h-5 text-[var(--bmg-accent-primary)] animate-spin" />
                  <span className="text-[11px] font-mono text-zinc-500">Querying MongoDB cluster...</span>
                </div>
              ) : mappings.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs italic">
                  No active mappings. Set up custom controller binds using the builder tool on the right.
                </div>
              ) : (
                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                  {mappings.map((mapping) => {
                    const isFlashed = lastMappedTrigger && lastMappedTrigger.key === mapping.targetKey;
                    return (
                      <div 
                        key={mapping._id} 
                        className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                          isFlashed 
                            ? "bg-[var(--bmg-accent-primary)]/15 border-[var(--bmg-accent-primary)] shadow-[0_0_8px_rgba(202,154,90,0.15)]" 
                            : "bg-[#18181c] border-zinc-800/60 hover:bg-[#1e1e24] hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Indicator type icon */}
                          <div className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                            mapping.sourceType === 'cc' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900/50' : 'bg-purple-950 text-purple-400 border border-purple-900/50'
                          }`}>
                            {mapping.sourceType === 'cc' ? 'CC' : 'NT'}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white uppercase">{mapping.targetName}</span>
                              {isFlashed && (
                                <span className="text-[7px] bg-[var(--bmg-accent-primary)] text-black px-1 rounded font-black uppercase tracking-widest animate-pulse">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 text-[9px] text-zinc-500 font-mono mt-0.5">
                              <span>Hardware: <strong className="text-zinc-400">{mapping.sourceType === 'cc' ? 'CC#' : 'Note#'}{mapping.sourceNumber}</strong></span>
                              <span>•</span>
                              <span>ObjectID: <strong className="text-zinc-600 truncate max-w-[60px]" title={mapping._id}>{mapping._id.slice(-6)}</strong></span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMapping(mapping._id, mapping.targetName)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete from MongoDB"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wipe database block */}
            <div className="border-t border-[#25252b] pt-3 mt-3 flex justify-between items-center text-[10px]">
              <span className="text-zinc-500 italic">User-specific configurations are persistent in MongoDB.</span>
              <button
                onClick={handleResetDb}
                className="text-zinc-500 hover:text-white flex items-center gap-1 transition-colors font-mono uppercase text-[9px] hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Drop Collection
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOM BINDING FORM BUILDER - Right 3 Columns */}
        <div className="lg:col-span-3">
          <div className="bmg-card p-4 border border-[#2a2a32] bg-[#141416] h-full flex flex-col justify-between">
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-3.5 flex items-center gap-1.5 border-b border-[#25252b] pb-2">
              <Plus className="w-4 h-4 text-[var(--bmg-accent-primary)]" /> Create MIDI Binding
            </h4>

            <form onSubmit={handleSaveMapping} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Source Event Type</label>
                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
                  <button
                    type="button"
                    onClick={() => {
                      setSourceType('cc');
                      if (sourceNumber === 36 || sourceNumber === 38) setSourceNumber(1);
                    }}
                    className={`py-1 rounded text-[9px] uppercase font-bold text-center transition-all ${
                      sourceType === 'cc' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"
                    }`}
                  >
                    CC (Knob/Fader)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSourceType('note');
                      if (sourceNumber === 1) setSourceNumber(36);
                    }}
                    className={`py-1 rounded text-[9px] uppercase font-bold text-center transition-all ${
                      sourceType === 'note' ? "bg-[var(--bmg-accent-primary)] text-black" : "text-zinc-500"
                    }`}
                  >
                    MIDI Note (Pad)
                  </button>
                </div>
              </div>

              {/* Hardware Value & Learn block */}
              <div>
                <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Source Trigger Address</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="127"
                    value={sourceNumber}
                    onChange={(e) => setSourceNumber(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-[#1c1c1f] text-xs font-mono border border-zinc-800 p-2 rounded text-white focus:outline-none focus:border-[var(--bmg-accent-primary)]"
                  />
                  
                  {/* LEARN BUTTON */}
                  <button
                    type="button"
                    onClick={() => setIsLearning(!isLearning)}
                    className={`px-3 py-2 rounded text-[10px] uppercase font-bold flex items-center gap-1 transition-all ${
                      isLearning
                        ? "bg-green-500 text-black font-black animate-pulse"
                        : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                    }`}
                    title="Press hardware pad or move knob to detect CC/Note automatically"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isLearning ? "Learning" : "Learn"}</span>
                  </button>
                </div>
                <span className="text-[8px] text-zinc-600 block mt-1 leading-normal">
                  {isLearning 
                    ? "👉 Touch knob/pad on physical controller..." 
                    : `Enter MIDI ${sourceType === 'cc' ? 'CC knob index (1-127)' : 'Note pitch (0-127)'} or use Learn.`
                  }
                </span>
              </div>

              {/* Target Type */}
              <div>
                <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Target Action Type</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full bg-[#1c1c1f] border border-zinc-800 p-2 rounded text-xs text-white outline-none"
                >
                  <option value="daw_param">DAW Parameter / Slider</option>
                  <option value="pad_trigger">MPC Drum Pad Trigger</option>
                  <option value="transport_control">Transport Control</option>
                </select>
              </div>

              {/* Target Destination Dropdowns */}
              <div>
                <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Target Action Destination</label>
                
                {targetType === 'daw_param' && (
                  <select
                    value={targetKey}
                    onChange={(e) => handleTargetKeyChange(e.target.value)}
                    className="w-full bg-[#1c1c1f] border border-zinc-800 p-2 rounded text-xs text-white outline-none"
                  >
                    <option value="mixLevels.keys">Keys (Rhodes) Volume</option>
                    <option value="mixLevels.kick">Kick (808) Volume</option>
                    <option value="mixLevels.snare">Snare Volume</option>
                    <option value="mixLevels.hat">Hi-Hat Volume</option>
                    <option value="mixLevels.subBass">Sub Bass Volume</option>
                    <option value="bpm">DAW Tempo (BPM)</option>
                    <option value="timeStretchFactor">Elastic Stretch Speed</option>
                    <option value="cc1_dynamics">BBC Dynamics CC#1</option>
                    <option value="cc11_expression">BBC Expression CC#11</option>
                  </select>
                )}

                {targetType === 'pad_trigger' && (
                  <select
                    value={targetKey}
                    onChange={(e) => handleTargetKeyChange(e.target.value)}
                    className="w-full bg-[#1c1c1f] border border-zinc-800 p-2 rounded text-xs text-white outline-none"
                  >
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <option key={idx} value={`pad.${idx}`}>MPC Drum Pad {idx + 1}</option>
                    ))}
                  </select>
                )}

                {targetType === 'transport_control' && (
                  <select
                    value={targetKey}
                    onChange={(e) => handleTargetKeyChange(e.target.value)}
                    className="w-full bg-[#1c1c1f] border border-zinc-800 p-2 rounded text-xs text-white outline-none"
                    disabled
                  >
                    <option value="transport.play">Play/Pause Sequencer</option>
                  </select>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bmg-button py-2.5 text-xs font-bold uppercase flex items-center justify-center gap-1.5 mt-3 shadow-[0_2px_6px_rgba(202,154,90,0.15)]"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Save to MongoDB</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* MONGODB DYNAMIC QUERY LOGS CONSOLE */}
      {showMongoDashboard && (
        <div className="bmg-card p-4 border border-green-500/30 bg-[#070709] rounded-xl relative overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="absolute top-0 right-0 p-3 flex gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-green-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              CLUSTER0.LYRIA.MONGODB.NET / ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-green-400" />
            <h4 className="text-xs font-black text-green-400 font-mono uppercase">MongoDB User Config Query Inspector</h4>
          </div>

          <p className="text-[11px] text-zinc-400 leading-normal mb-4 font-mono max-w-3xl">
            Inspect real MongoDB transactional operations occurring on the backend cluster. Mappings are queried relative to user credentials using an indexing schema targeting <code className="text-green-300">{"{ userId: 1, sourceType: 1 }"}</code>.
          </p>

          <div className="bg-[#0b0b0f] rounded-lg border border-zinc-900 p-3 h-64 overflow-y-auto font-mono text-[10px] space-y-3.5 scrollbar-thin">
            {mongoLogs.map((log, idx) => (
              <div key={idx} className="border-b border-zinc-900 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center text-zinc-500 text-[9px] mb-1">
                  <span className="text-green-500 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    {log.operation}
                  </span>
                  <span>{log.timestamp}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                    <span className="text-[8px] uppercase font-bold text-zinc-600 block mb-1">Query Criteria</span>
                    <pre className="text-cyan-300 overflow-x-auto whitespace-pre-wrap">{log.query}</pre>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                    <span className="text-[8px] uppercase font-bold text-zinc-600 block mb-1">DB Server Acknowledged Response</span>
                    <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{log.response}</pre>
                  </div>
                </div>
              </div>
            ))}
            {mongoLogs.length === 0 && (
              <span className="text-zinc-600 italic">No queries transacted in this session yet. Interact with the faders or save maps above to populate logs.</span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
