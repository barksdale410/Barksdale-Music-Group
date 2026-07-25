import React, { useState, useRef } from 'react';
import { Music, Play, Download, Sparkles, Copy, Check, FileCode, Layers, Radio, Volume2 } from 'lucide-react';

interface ChordItem {
  numeral: string;
  name: string;
  notes: string[];
  frequencies: number[];
  duration: string;
}

interface ProgressionPreset {
  id: string;
  title: string;
  genre: string;
  key: string;
  bpm: number;
  chords: ChordItem[];
}

export const CHORD_PRESETS: ProgressionPreset[] = [
  {
    id: 'soul_70s',
    title: '1970s Crime Soul & Funk Velvet',
    genre: '1970s Soul / Funk',
    key: 'F Minor',
    bpm: 110,
    chords: [
      { numeral: 'i7', name: 'Fm7', notes: ['F3', 'Ab3', 'C4', 'Eb4'], frequencies: [174.61, 207.65, 261.63, 311.13], duration: '1 Bar' },
      { numeral: 'iv7', name: 'Bbm7', notes: ['Bb3', 'Db4', 'F4', 'Ab4'], frequencies: [233.08, 277.18, 349.23, 415.30], duration: '1 Bar' },
      { numeral: 'v7', name: 'Cm7', notes: ['C4', 'Eb4', 'G4', 'Bb4'], frequencies: [261.63, 311.13, 392.00, 466.16], duration: '1 Bar' },
      { numeral: 'VImaj7', name: 'Dbmaj7', notes: ['Db4', 'F4', 'Ab4', 'C5'], frequencies: [277.18, 349.23, 415.30, 523.25], duration: '1 Bar' }
    ]
  },
  {
    id: 'trap_melodic',
    title: 'Dark Melodic Trap & Glitch',
    genre: 'Hip Hop / Trap',
    key: 'C# Minor',
    bpm: 140,
    chords: [
      { numeral: 'i', name: 'C#m', notes: ['C#3', 'E3', 'G#3'], frequencies: [138.59, 164.81, 207.65], duration: '1 Bar' },
      { numeral: 'VI', name: 'Amaj', notes: ['A3', 'C#4', 'E4'], frequencies: [220.00, 277.18, 329.63], duration: '1 Bar' },
      { numeral: 'III', name: 'Emaj', notes: ['E3', 'G#3', 'B3'], frequencies: [164.81, 207.65, 246.94], duration: '1 Bar' },
      { numeral: 'VII', name: 'Bmaj', notes: ['B3', 'D#4', 'F#4'], frequencies: [246.94, 311.13, 369.99], duration: '1 Bar' }
    ]
  },
  {
    id: 'neo_soul_jazz',
    title: 'Neo-Soul & Jazz 9th Extension',
    genre: 'Jazz / R&B',
    key: 'Eb Major',
    bpm: 88,
    chords: [
      { numeral: 'ii9', name: 'Fm9', notes: ['F3', 'Ab3', 'C4', 'Eb4', 'G4'], frequencies: [174.61, 207.65, 261.63, 311.13, 392.00], duration: '1 Bar' },
      { numeral: 'V13', name: 'Bb13', notes: ['Bb3', 'D4', 'Ab4', 'C5', 'G5'], frequencies: [233.08, 293.66, 415.30, 523.25, 783.99], duration: '1 Bar' },
      { numeral: 'Imaj9', name: 'Ebmaj9', notes: ['Eb3', 'G3', 'Bb3', 'D4', 'F4'], frequencies: [155.56, 196.00, 233.08, 293.66, 349.23], duration: '1 Bar' },
      { numeral: 'VI7alt', name: 'C7alt', notes: ['C4', 'E4', 'Bb4', 'Db5', 'G#5'], frequencies: [261.63, 329.63, 466.16, 554.37, 830.61], duration: '1 Bar' }
    ]
  },
  {
    id: 'synthwave_80s',
    title: 'Synthwave 80s Cyber Cruise',
    genre: 'Synthwave / 80s',
    key: 'A Minor',
    bpm: 124,
    chords: [
      { numeral: 'i', name: 'Am', notes: ['A3', 'C4', 'E4'], frequencies: [220.00, 261.63, 329.63], duration: '1 Bar' },
      { numeral: 'VI', name: 'Fmaj', notes: ['F3', 'A3', 'C4'], frequencies: [174.61, 220.00, 261.63], duration: '1 Bar' },
      { numeral: 'III', name: 'Cmaj', notes: ['C4', 'E4', 'G4'], frequencies: [261.63, 329.63, 392.00], duration: '1 Bar' },
      { numeral: 'VII', name: 'Gmaj', notes: ['G3', 'B3', 'D4'], frequencies: [196.00, 246.94, 293.66], duration: '1 Bar' }
    ]
  }
];

export const ChordProgressionExporter: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('soul_70s');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeChordIdx, setActiveChordIdx] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const preset = CHORD_PRESETS.find(p => p.id === selectedPresetId) || CHORD_PRESETS[0];

  const playChord = (chord: ChordItem, idx: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      setActiveChordIdx(idx);

      chord.frequencies.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      });

      setTimeout(() => setActiveChordIdx(null), 1200);
    } catch (e) {
      setActiveChordIdx(null);
    }
  };

  const playFullProgression = () => {
    setIsPlaying(true);
    preset.chords.forEach((chord, idx) => {
      setTimeout(() => {
        playChord(chord, idx);
        if (idx === preset.chords.length - 1) {
          setTimeout(() => setIsPlaying(false), 1200);
        }
      }, idx * 1200);
    });
  };

  const handleCopyTextSheet = () => {
    const text = `BARKSDALE MUSIC GROUP - CHORD PROGRESSION EXPORT\nPreset: ${preset.title}\nGenre: ${preset.genre} | Key: ${preset.key} | BPM: ${preset.bpm}\n----------------------------------------\n` +
      preset.chords.map((c, i) => `Bar ${i + 1}: ${c.name} (${c.numeral}) -> Notes: ${c.notes.join(', ')}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMidiJson = () => {
    const midiJsonData = {
      title: preset.title,
      genre: preset.genre,
      key: preset.key,
      bpm: preset.bpm,
      timeSignature: '4/4',
      chords: preset.chords.map(c => ({
        name: c.name,
        numeral: c.numeral,
        notes: c.notes,
        frequenciesHz: c.frequencies
      }))
    };

    const blob = new Blob([JSON.stringify(midiJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${preset.id}_chord_progression.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0e0f17] border border-amber-500/30 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              STUDIO CHORD PROGRESSION EXPORTER & MIDI GENERATOR
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                MIDI / JSON / TEXT
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Generate, audition, and export multi-genre chord progressions and 9th extensions directly to your DAW.
            </p>
          </div>
        </div>

        {/* PLAY PROGRESSION BUTTON */}
        <button
          onClick={playFullProgression}
          disabled={isPlaying}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          {isPlaying ? 'PLAYING CHORDS...' : 'AUDITION PROGRESSION'}
        </button>
      </div>

      {/* PRESET SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        {CHORD_PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPresetId(p.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedPresetId === p.id
                ? 'bg-amber-950/60 border-amber-400 text-amber-300 shadow-md'
                : 'bg-black/50 border-gray-850 text-gray-400 hover:text-white'
            }`}
          >
            <div className="text-[9px] uppercase font-bold text-gray-500">{p.genre}</div>
            <div className="font-bold text-white text-xs truncate mt-0.5">{p.title}</div>
            <div className="text-[10px] text-amber-400 mt-1">Key: {p.key} • {p.bpm} BPM</div>
          </button>
        ))}
      </div>

      {/* CHORD CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {preset.chords.map((chord, idx) => {
          const isActive = activeChordIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => playChord(chord, idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 font-mono ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-300 scale-105 shadow-xl shadow-amber-500/30'
                  : 'bg-black/70 border-gray-850 hover:border-amber-500/50 text-white'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className={isActive ? 'text-black font-bold' : 'text-amber-400 font-bold'}>BAR {idx + 1}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-black text-amber-300' : 'bg-gray-800 text-gray-400'}`}>
                  {chord.numeral}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold">{chord.name}</h4>
                <p className={`text-[10px] mt-0.5 ${isActive ? 'text-black/80' : 'text-gray-400'}`}>
                  Notes: {chord.notes.join(' - ')}
                </p>
              </div>

              <div className="flex justify-between items-center text-[9px] pt-1 border-t border-gray-800/50">
                <span className={isActive ? 'text-black/70' : 'text-gray-500'}>TAP TO HEAR</span>
                <Volume2 className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPORT ACTIONS */}
      <div className="bg-black/50 border border-gray-850 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="text-gray-400 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-amber-400" />
          <span>DAW EXPORT FORMATS:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyTextSheet}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 rounded-lg flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY CHORD SHEET'}
          </button>

          <button
            onClick={handleDownloadMidiJson}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold border border-amber-400 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT MIDI/JSON FILE
          </button>
        </div>
      </div>
    </div>
  );
};
