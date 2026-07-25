import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, FastForward, Rewind, Sparkles, Activity, Clock, Sliders } from 'lucide-react';

export const BeatSeekMetronome: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(120);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [subdivision, setSubdivision] = useState<'quarter' | 'eighth' | 'sixteenth' | 'triplet'>('quarter');
  const [volume, setVolume] = useState<number>(80);
  const [currentBar, setCurrentBar] = useState<number>(1);

  // Tap tempo timestamp history
  const tapTimesRef = useRef<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio Context for synthesize real audible click
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = (isFirstBeat: boolean) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFirstBeat ? 1200 : 750, ctx.currentTime);

      const volLevel = (volume / 100) * 0.3;
      gain.gain.setValueAtTime(volLevel, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext fallback
    }
  };

  useEffect(() => {
    if (isPlaying) {
      let beatsPerBar = 4;
      let multiplier = 1;
      if (subdivision === 'eighth') multiplier = 2;
      if (subdivision === 'sixteenth') multiplier = 4;
      if (subdivision === 'triplet') multiplier = 3;

      const intervalMs = (60000 / bpm) / multiplier;

      timerRef.current = setInterval(() => {
        setCurrentBeat(prev => {
          const totalBeatsInBar = beatsPerBar * multiplier;
          const nextBeat = (prev % totalBeatsInBar) + 1;

          if (nextBeat === 1) {
            setCurrentBar(b => b + 1);
          }

          playClickSound(nextBeat === 1);
          return nextBeat;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, subdivision, volume]);

  const handleTapTempo = () => {
    const now = Date.now();
    const times = tapTimesRef.current;
    times.push(now);

    if (times.length > 5) {
      times.shift();
    }

    if (times.length > 1) {
      const intervals = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);

      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
      }
    }
  };

  const handleSeek = (barsDelta: number) => {
    setCurrentBar(prev => Math.max(1, prev + barsDelta));
    setCurrentBeat(1);
  };

  return (
    <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              BEAT SEEK STUDIO METRONOME
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                PRECISION DSP AUDIO CLICK
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Real-time tempo synchronization, tap tempo, subdivision clocking, and bar seeking.
            </p>
          </div>
        </div>

        {/* METRONOME VOLUME & BEAT DISP */}
        <div className="flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-xl border border-gray-800 text-xs font-mono">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-20 accent-amber-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
          />
          <span className="text-amber-300 font-bold">{volume}%</span>
        </div>
      </div>

      {/* METRONOME DISPLAY & CONTROLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* MAIN BPM & SEEK DISPLAY (5-span) */}
        <div className="md:col-span-5 bg-black/70 border border-gray-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-400">ACTIVE POSITION:</span>
            <span className="text-amber-300 font-bold text-sm bg-amber-950/40 border border-amber-900 px-2 py-0.5 rounded">
              BAR {currentBar} : BEAT {currentBeat}
            </span>
          </div>

          {/* BEAT TICKER LEDS */}
          <div className="grid grid-cols-4 gap-2 py-2">
            {[1, 2, 3, 4].map(b => {
              const isActive = (currentBeat - 1) % 4 === (b - 1);
              const isAccent = b === 1;

              return (
                <div
                  key={b}
                  className={`h-10 rounded-xl border flex flex-col items-center justify-center font-mono font-bold transition-all shadow-md ${
                    isActive
                      ? isAccent
                        ? 'bg-amber-500 text-black border-amber-300 scale-105 shadow-amber-500/50'
                        : 'bg-amber-400/80 text-black border-amber-300'
                      : 'bg-gray-900/80 border-gray-800 text-gray-500'
                  }`}
                >
                  <span className="text-xs">{b}</span>
                  <span className="text-[8px] opacity-75">{b === 1 ? 'DOWN' : 'UP'}</span>
                </div>
              );
            })}
          </div>

          {/* BAR SEEK CONTROLS */}
          <div className="flex items-center justify-between gap-1 text-xs font-mono pt-1 border-t border-gray-900">
            <span className="text-gray-500 text-[10px] uppercase">Seek Bars:</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleSeek(-4)}
                className="px-2 py-1 bg-black border border-gray-800 hover:border-amber-500/50 rounded text-amber-300 hover:text-white font-bold transition-all flex items-center gap-0.5 text-[10px]"
              >
                <Rewind className="w-3 h-3" /> -4
              </button>
              <button
                onClick={() => handleSeek(-1)}
                className="px-2 py-1 bg-black border border-gray-800 hover:border-amber-500/50 rounded text-amber-300 hover:text-white font-bold transition-all flex items-center gap-0.5 text-[10px]"
              >
                -1
              </button>
              <button
                onClick={() => handleSeek(1)}
                className="px-2 py-1 bg-black border border-gray-800 hover:border-amber-500/50 rounded text-amber-300 hover:text-white font-bold transition-all flex items-center gap-0.5 text-[10px]"
              >
                +1
              </button>
              <button
                onClick={() => handleSeek(4)}
                className="px-2 py-1 bg-black border border-gray-800 hover:border-amber-500/50 rounded text-amber-300 hover:text-white font-bold transition-all flex items-center gap-0.5 text-[10px]"
              >
                +4 <FastForward className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* BPM SLIDER & TAP TEMPO (7-span) */}
        <div className="md:col-span-7 space-y-4 bg-black/40 border border-gray-850 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isPlaying
                    ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/20'
                    : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'METRONOME ON' : 'START METRONOME'}
              </button>

              <button
                onClick={handleTapTempo}
                className="px-4 py-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-900/60 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> TAP TEMPO
              </button>
            </div>

            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-amber-400 tracking-tight">{bpm}</span>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">TEMPO BPM</span>
            </div>
          </div>

          {/* BPM SLIDER */}
          <div className="space-y-1">
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-500">
              <span>40 BPM (Largo)</span>
              <span>120 BPM (Andante)</span>
              <span>240 BPM (Presto)</span>
            </div>
          </div>

          {/* SUBDIVISION SELECTOR */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-850 text-xs font-mono">
            <span className="text-gray-400 uppercase text-[10px]">SUBDIVISION:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'quarter', label: '1/4 Beat' },
                { id: 'eighth', label: '1/8 Beat' },
                { id: 'sixteenth', label: '1/16 Beat' },
                { id: 'triplet', label: '1/12 Triplet' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSubdivision(sub.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    subdivision === sub.id
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-black/60 border border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
