import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Volume2, Music, Mic, Film, Sparkles, Play, Pause, Activity } from 'lucide-react';
import { audioEngine, EqBand } from '../lib/audioEngine';
import { toast } from '../lib/toast';

export const SoundtrackSuite: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timecode, setTimecode] = useState<number>(0); // 0 to 120 seconds
  const [selectedBand, setSelectedBand] = useState<string>('mids');

  // 4 Tracks: Video, Dialogue, Music, Foley
  const [tracks, setTracks] = useState([
    { id: 'video', name: 'Video Audio', icon: Film, vol: 1.0, pan: 0, color: '#3b82f6', muted: false },
    { id: 'dialogue', name: 'Dialogue / Voiceover', icon: Mic, vol: 1.2, pan: 0, color: '#10b981', muted: false },
    { id: 'music', name: 'Score / Music Track', icon: Music, vol: 0.8, pan: 0, color: '#f59e0b', muted: false },
    { id: 'foley', name: 'SFX & Foley Cues', icon: Activity, vol: 1.0, pan: 0, color: '#ec4899', muted: false }
  ]);

  // 5-Band Parametric EQ
  const [eqBands, setEqBands] = useState<EqBand[]>([
    { id: 'sub', label: 'Sub-Bass', freq: 40, gain: 2, q: 1.0, type: 'lowshelf', color: '#ef4444' },
    { id: 'bass', label: 'Bass', freq: 150, gain: -1, q: 1.2, type: 'peaking', color: '#f59e0b' },
    { id: 'mids', label: 'Mids', freq: 1000, gain: 3, q: 0.7, type: 'peaking', color: '#10b981' },
    { id: 'highmids', label: 'High Mids', freq: 4000, gain: 1, q: 1.0, type: 'peaking', color: '#3b82f6' },
    { id: 'treble', label: 'Treble', freq: 12000, gain: 4, q: 0.8, type: 'highshelf', color: '#ec4899' }
  ]);

  const eqCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw 5-Band Parametric EQ curve on canvas
  useEffect(() => {
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, width, height);

    // Grid lines (dB levels & Frequency grid)
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;

    // dB grid
    [-12, -6, 0, 6, 12].forEach((db) => {
      const y = height / 2 - (db / 12) * (height / 2 - 10);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      ctx.fillStyle = '#6b7280';
      ctx.font = '9px monospace';
      ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 5, y - 3);
    });

    // Freq grid
    [100, 1000, 10000].forEach((freq) => {
      const x = (Math.log10(freq / 20) / Math.log10(20000 / 20)) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    });

    // EQ Curve math
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;

    for (let px = 0; px < width; px++) {
      const logFreq = 20 * Math.pow(20000 / 20, px / width);
      let totalGainDb = 0;

      eqBands.forEach((band) => {
        const dist = Math.abs(Math.log10(logFreq / band.freq));
        const influence = Math.exp(-dist * band.q * 3);
        totalGainDb += band.gain * influence;
      });

      const py = height / 2 - (totalGainDb / 12) * (height / 2 - 10);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Band Control Nodes
    eqBands.forEach((band) => {
      const nx = (Math.log10(band.freq / 20) / Math.log10(20000 / 20)) * width;
      const ny = height / 2 - (band.gain / 12) * (height / 2 - 10);

      ctx.beginPath();
      ctx.arc(nx, ny, 7, 0, Math.PI * 2);
      ctx.fillStyle = band.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(band.label, nx - 15, ny - 10);
    });
  }, [eqBands]);

  // Master Timecode Scrubber loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimecode((prev) => (prev + 0.1) % 120);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGainChange = (bandId: string, gain: number) => {
    setEqBands((prev) => prev.map((b) => (b.id === bandId ? { ...b, gain } : b)));
  };

  const handleFreqChange = (bandId: string, freq: number) => {
    setEqBands((prev) => prev.map((b) => (b.id === bandId ? { ...b, freq } : b)));
  };

  return (
    <div className="bg-[#121318] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] p-6 text-white space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> 4-TRACK SOUNDTRACK SUITE
            </span>
            <span className="text-xs font-mono text-gray-400">PARAMETRIC 5-BAND EQ</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1.5 uppercase tracking-wide">
            AUDIO MIXING CHASSIS & SOUNDTRACK EQUALIZER
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.ensureInitialized();
              setIsPlaying(!isPlaying);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
            <span>{isPlaying ? 'PAUSE TIMELINE' : 'PLAY SOUNDTRACK'}</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE 5-BAND PARAMETRIC EQ CANVAS */}
      <div className="bg-[#171821] border-2 border-black rounded-xl p-5 shadow-[2px_2px_0px_0px_#000] space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <span className="text-xs font-black uppercase text-amber-400 font-mono">
            Master 5-Band Parametric EQ Canvas (-12dB to +12dB)
          </span>
          <span className="text-[10px] font-mono text-gray-400">20Hz - 20kHz FREQUENCY SPECTRUM</span>
        </div>

        <div className="relative w-full h-44 bg-black rounded-xl overflow-hidden border border-gray-800">
          <canvas ref={eqCanvasRef} width={800} height={176} className="w-full h-full cursor-crosshair" />
        </div>

        {/* EQ BAND KNOBS / SLIDERS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {eqBands.map((band) => (
            <div
              key={band.id}
              onClick={() => setSelectedBand(band.id)}
              className={`p-3 rounded-xl border transition-all ${
                selectedBand === band.id
                  ? 'bg-amber-500/15 border-amber-500 text-white'
                  : 'bg-black/40 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                <span style={{ color: band.color }}>{band.label}</span>
                <span>{band.gain > 0 ? `+${band.gain}` : band.gain}dB</span>
              </div>

              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={band.gain}
                onChange={(e) => handleGainChange(band.id, parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex justify-between text-[8px] font-mono text-gray-500 mt-1">
                <span>FREQ: {band.freq}Hz</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-TRACK AUDIO MIXING CHASSIS */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase text-amber-400 font-mono flex justify-between items-center">
          <span>MULTITRACK TIMELINE (VIDEO / DIALOGUE / MUSIC / FOLEY)</span>
          <span className="text-emerald-400">TIMECODE: {timecode.toFixed(1)}s / 120.0s</span>
        </div>

        {tracks.map((tr) => {
          const IconComp = tr.icon;
          return (
            <div key={tr.id} className="bg-[#171821] border-2 border-black rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-56 shrink-0">
                <div className="p-2 rounded-lg bg-black/60 border border-gray-800 shrink-0">
                  <IconComp className="w-4 h-4" style={{ color: tr.color }} />
                </div>
                <div>
                  <div className="text-xs font-black text-white font-mono uppercase">{tr.name}</div>
                  <div className="text-[9px] font-mono text-gray-400">VOL: {Math.round(tr.vol * 100)}%</div>
                </div>
              </div>

              {/* TIMELINE TRACK WAVE CANVAS SIMULATION */}
              <div className="w-full flex-1 h-12 bg-black/80 border border-gray-850 rounded-lg relative overflow-hidden flex items-center px-2">
                <div className="w-full flex items-center gap-1 h-8">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${Math.sin(i * 0.5 + timecode) * 40 + 50}%`,
                        backgroundColor: (i / 40) * 120 <= timecode ? tr.color : '#374151'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* TRACK CONTROLS */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={tr.vol}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setTracks((prev) => prev.map((t) => (t.id === tr.id ? { ...t, vol: newVol } : t)));
                  }}
                  className="w-20 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
