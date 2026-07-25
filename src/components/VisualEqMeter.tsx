import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Activity, Volume2, Sparkles, RefreshCw, Zap, Shield, Eye } from 'lucide-react';
import { barksdaleSynth } from '../utils/audioUtils';

interface EqBand {
  id: number;
  name: string;
  freq: number; // Hz
  gain: number; // dB (-18 to +18)
  q: number; // Q factor (0.5 to 10)
  type: 'lowshelf' | 'peaking' | 'highshelf' | 'lowpass' | 'highpass';
  color: string;
}

export const VisualEqMeter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [bands, setBands] = useState<EqBand[]>([
    { id: 1, name: 'SUB CUT', freq: 30, gain: 0, q: 0.7, type: 'highpass', color: '#ef4444' },
    { id: 2, name: 'BASS', freq: 80, gain: 2, q: 1.0, type: 'lowshelf', color: '#f97316' },
    { id: 3, name: 'LOW MID', freq: 250, gain: -1, q: 1.2, type: 'peaking', color: '#f59e0b' },
    { id: 4, name: 'MID', freq: 800, gain: 0, q: 1.4, type: 'peaking', color: '#10b981' },
    { id: 5, name: 'HIGH MID', freq: 2500, gain: 3, q: 1.5, type: 'peaking', color: '#06b6d4' },
    { id: 6, name: 'PRESENCE', freq: 5000, gain: 2, q: 1.2, type: 'peaking', color: '#3b82f6' },
    { id: 7, name: 'TREBLE', freq: 10000, gain: 4, q: 1.0, type: 'highshelf', color: '#8b5cf6' },
    { id: 8, name: 'AIR CUT', freq: 18000, gain: 0, q: 0.7, type: 'lowpass', color: '#ec4899' }
  ]);

  const [activeBandId, setActiveBandId] = useState<number>(4);
  const [isBypassed, setIsBypassed] = useState<boolean>(false);

  // Canvas Spectrum Curve Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
        canvas.height = 180 * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const analyser = barksdaleSynth.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const renderEq = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Dark Studio Grid Background
      ctx.fillStyle = '#0a0b10';
      ctx.fillRect(0, 0, w, h);

      // Draw Grid Lines (dB levels -18dB to +18dB)
      ctx.strokeStyle = '#1e2230';
      ctx.lineWidth = 1;

      // Horizontal zero-dB line
      const zeroY = h / 2;
      ctx.beginPath();
      ctx.strokeStyle = '#374151';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, zeroY);
      ctx.lineTo(w, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw dB grid lines (+12, +6, 0, -6, -12)
      [-12, -6, 6, 12].forEach(db => {
        const y = zeroY - (db / 18) * (h / 2 - 15);
        ctx.strokeStyle = '#1a1d29';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        ctx.fillStyle = '#4b5563';
        ctx.font = '9px monospace';
        ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 5, y - 2);
      });

      // Draw Frequency Labels (20Hz to 20kHz logarithmic markers)
      const freqs = [20, 100, 500, 1000, 5000, 20000];
      freqs.forEach(f => {
        const x = (Math.log10(f / 20) / Math.log10(20000 / 20)) * w;
        ctx.strokeStyle = '#1a1d29';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();

        ctx.fillStyle = '#4b5563';
        ctx.font = '9px monospace';
        ctx.fillText(f >= 1000 ? `${f / 1000}k` : `${f}Hz`, x + 2, h - 5);
      });

      // Draw Real-time Analyzer Spectrum Bars if available
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * h;
          const x = (i / bufferLength) * w;
          ctx.fillRect(x, h - barHeight, w / bufferLength - 1, barHeight);
        }
      } else {
        // Subtle ambient spectrum pulse
        const t = Date.now() * 0.003;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
        for (let x = 0; x < w; x += 6) {
          const barH = (Math.sin(x * 0.02 + t) + 1) * 20 + 10;
          ctx.fillRect(x, h - barH, 4, barH);
        }
      }

      // Draw Composite Parametric EQ Curve
      if (!isBypassed) {
        ctx.beginPath();
        ctx.lineWidth = 3;

        const curveGradient = ctx.createLinearGradient(0, 0, w, 0);
        curveGradient.addColorStop(0, '#ef4444');
        curveGradient.addColorStop(0.2, '#f59e0b');
        curveGradient.addColorStop(0.5, '#10b981');
        curveGradient.addColorStop(0.8, '#3b82f6');
        curveGradient.addColorStop(1, '#ec4899');

        ctx.strokeStyle = curveGradient;

        for (let x = 0; x <= w; x += 2) {
          // Logarithmic frequency calculation for pixel x
          const freq = 20 * Math.pow(20000 / 20, x / w);
          let totalGainDb = 0;

          bands.forEach(b => {
            const ratio = freq / b.freq;
            const diff = Math.log2(ratio);
            // Bell curve approximation for peak EQ
            const bell = Math.exp(-Math.pow(diff * b.q, 2));
            totalGainDb += b.gain * bell;
          });

          const y = zeroY - (totalGainDb / 18) * (h / 2 - 15);
          const clampedY = Math.max(10, Math.min(h - 10, y));

          if (x === 0) ctx.moveTo(x, clampedY);
          else ctx.lineTo(x, clampedY);
        }
        ctx.stroke();

        // Fill under curve
        ctx.lineTo(w, zeroY);
        ctx.lineTo(0, zeroY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.fill();
      }

      // Draw Band Control Nodes
      bands.forEach(b => {
        const nodeX = (Math.log10(b.freq / 20) / Math.log10(20000 / 20)) * w;
        const nodeY = isBypassed ? zeroY : zeroY - (b.gain / 18) * (h / 2 - 15);

        const isSelected = b.id === activeBandId;

        // Glow ring
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, isSelected ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = isSelected ? 0.4 : 0.2;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Solid node core
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Band number text inside
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.id.toString(), nodeX, nodeY - 10);
      });

      animRef.current = requestAnimationFrame(renderEq);
    };

    renderEq();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [bands, isBypassed, activeBandId]);

  const updateBandGain = (id: number, deltaGain: number) => {
    setBands(prev =>
      prev.map(b => (b.id === id ? { ...b, gain: Math.max(-18, Math.min(18, b.gain + deltaGain)) } : b))
    );
  };

  const activeBand = bands.find(b => b.id === activeBandId) || bands[3];

  return (
    <div className="bg-[#0c0d14] border border-amber-500/30 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sliders className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              PARAMETRIC 8-BAND VISUAL EQ METER & FREQUENCY ANALYZER
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                REAL-TIME DSP
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Interactive 8-band audio equalization curve, frequency response modeling, and zero-latency spectrum analyzer.
            </p>
          </div>
        </div>

        {/* EQ BYPASS & RESET */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBypassed(!isBypassed)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isBypassed
                ? 'bg-red-500/20 text-red-300 border-red-500/50'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {isBypassed ? 'EQ BYPASSED' : 'EQ ACTIVE'}
          </button>

          <button
            onClick={() =>
              setBands(prev => prev.map(b => ({ ...b, gain: 0 })))
            }
            className="px-3 py-1.5 bg-black/60 hover:bg-black border border-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-mono transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> FLATTEN
          </button>
        </div>
      </div>

      {/* CANVAS GRAPH DISPLAY */}
      <div className="bg-black/90 rounded-xl border border-gray-800 p-2 relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-[180px] rounded-lg block" />
      </div>

      {/* BAND SELECTION & GAIN KNOBS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {bands.map(b => {
          const isSelected = b.id === activeBandId;
          return (
            <div
              key={b.id}
              onClick={() => setActiveBandId(b.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all text-xs font-mono cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 shadow-md scale-105'
                  : 'bg-black/50 border-gray-850 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between w-full text-[9px] text-gray-400 font-bold">
                <span style={{ color: b.color }}>B{b.id}</span>
                <span>{b.freq >= 1000 ? `${b.freq / 1000}k` : `${b.freq}`}</span>
              </div>

              <div
                className="text-sm font-bold my-1"
                style={{ color: b.gain > 0 ? '#10b981' : b.gain < 0 ? '#ef4444' : '#ffffff' }}
              >
                {b.gain > 0 ? `+${b.gain}` : b.gain}dB
              </div>

              <div className="flex items-center gap-1 w-full">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    updateBandGain(b.id, -1);
                  }}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 rounded py-0.5 text-[10px] text-gray-300 font-bold border border-gray-800 cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    updateBandGain(b.id, 1);
                  }}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 rounded py-0.5 text-[10px] text-gray-300 font-bold border border-gray-800 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE BAND FINE CONTROLS */}
      <div className="bg-black/60 border border-gray-850 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400 flex items-center gap-1">
            SELECTED BAND {activeBand.id}: {activeBand.name}
          </span>
          <span className="text-gray-400">
            FREQ: <strong className="text-white">{activeBand.freq} Hz</strong> | Q FACTOR: <strong className="text-white">{activeBand.q}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-gray-400 text-[10px]">ADJUST GAIN:</span>
          <input
            type="range"
            min="-18"
            max="18"
            step="0.5"
            value={activeBand.gain}
            onChange={e => {
              const val = Number(e.target.value);
              setBands(prev => prev.map(b => (b.id === activeBand.id ? { ...b, gain: val } : b)));
            }}
            className="w-36 accent-amber-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
          />
          <span className="text-amber-300 font-bold w-12 text-right">
            {activeBand.gain > 0 ? `+${activeBand.gain}` : activeBand.gain} dB
          </span>
        </div>
      </div>
    </div>
  );
};
