import React, { useState, useEffect } from 'react';
import { Activity, Volume2, Sparkles, RefreshCw, Zap, Disc, Waves, FlipHorizontal } from 'lucide-react';

export const AudioPeakMirroring: React.FC = () => {
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [peakLeft, setPeakLeft] = useState<number>(-12);
  const [peakRight, setPeakRight] = useState<number>(-14);
  const [rmsLeft, setRmsLeft] = useState<number>(-18);
  const [rmsRight, setRmsRight] = useState<number>(-20);
  const [phaseCorrelation, setPhaseCorrelation] = useState<number>(0.85); // -1.0 to +1.0
  const [hasClipped, setHasClipped] = useState<boolean>(false);

  // Simulate real-time audio peak levels with dynamic randomness & peaks
  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic random simulation with peaks
      const rawL = -24 + Math.random() * 22; // -24dB to -2dB
      const rawR = -24 + Math.random() * 22;

      setPeakLeft(Number(rawL.toFixed(1)));
      setPeakRight(Number(rawR.toFixed(1)));

      setRmsLeft(Number((rawL - 6).toFixed(1)));
      setRmsRight(Number((rawR - 6).toFixed(1)));

      // Phase correlation fluctuates near +0.8 to +0.95
      setPhaseCorrelation(Number((0.75 + Math.random() * 0.22).toFixed(2)));

      if (rawL > -0.5 || rawR > -0.5) {
        setHasClipped(true);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const resetClip = () => {
    setHasClipped(false);
  };

  // Convert dB value to bar percentage width (from -60dB to +3dB)
  const getPercentFromDb = (db: number) => {
    const clamped = Math.max(-60, Math.min(3, db));
    return ((clamped + 60) / 63) * 100;
  };

  return (
    <div className="bg-[#0b0c12] border border-amber-500/30 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              STEREO AUDIO PEAK MIRRORING & RMS ANALYZER
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                DUAL CHANNEL DSP
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Precise Left/Right channel peak level metering, phase correlation alignment, and horizontal mirror mode.
            </p>
          </div>
        </div>

        {/* MIRROR TOGGLE & RESET CLIP */}
        <div className="flex items-center gap-2">
          {hasClipped && (
            <button
              onClick={resetClip}
              className="px-2.5 py-1 bg-red-500 text-white font-mono text-[10px] font-bold rounded-lg border border-red-400 animate-bounce"
            >
              CLIP WARNING! RESET
            </button>
          )}

          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isMirrored
                ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/20'
                : 'bg-black/60 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            MIRROR MODE: {isMirrored ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* METERS SECTION */}
      <div className="space-y-4">
        {/* LEFT & RIGHT METERS (Standard vs Mirrored Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT CHANNEL */}
          <div className={`bg-black/60 border border-gray-850 p-4 rounded-xl space-y-2 ${isMirrored ? 'order-1' : ''}`}>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                LEFT CHANNEL (L)
              </span>
              <span className="text-gray-400">
                PEAK: <strong className={peakLeft > -1 ? 'text-red-500 font-bold' : 'text-amber-300'}>{peakLeft} dB</strong> | RMS: {rmsLeft} dB
              </span>
            </div>

            {/* PEAK BAR */}
            <div className="w-full bg-gray-900/90 h-4 rounded-lg overflow-hidden border border-gray-800 relative flex items-center">
              <div
                className={`h-full transition-all duration-100 ${
                  peakLeft > -1 ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                }`}
                style={{ width: `${getPercentFromDb(peakLeft)}%` }}
              />
              <div className="absolute inset-0 flex justify-between px-2 text-[8px] font-mono text-gray-400 pointer-events-none">
                <span>-60dB</span>
                <span>-18dB</span>
                <span>-6dB</span>
                <span>0dB</span>
              </div>
            </div>
          </div>

          {/* RIGHT CHANNEL (FLIPPED HORIZONTALLY IN MIRROR MODE) */}
          <div className={`bg-black/60 border border-gray-850 p-4 rounded-xl space-y-2 ${isMirrored ? 'order-2' : ''}`}>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                RIGHT CHANNEL (R) {isMirrored ? '(MIRRORED)' : ''}
              </span>
              <span className="text-gray-400">
                PEAK: <strong className={peakRight > -1 ? 'text-red-500 font-bold' : 'text-cyan-300'}>{peakRight} dB</strong> | RMS: {rmsRight} dB
              </span>
            </div>

            {/* PEAK BAR (REVERSED IF MIRRORED) */}
            <div className={`w-full bg-gray-900/90 h-4 rounded-lg overflow-hidden border border-gray-800 relative flex items-center ${isMirrored ? 'flex-row-reverse' : ''}`}>
              <div
                className={`h-full transition-all duration-100 ${
                  peakRight > -1 ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                }`}
                style={{ width: `${getPercentFromDb(peakRight)}%` }}
              />
              <div className="absolute inset-0 flex justify-between px-2 text-[8px] font-mono text-gray-400 pointer-events-none">
                <span>{isMirrored ? '0dB' : '-60dB'}</span>
                <span>-18dB</span>
                <span>{isMirrored ? '-60dB' : '0dB'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEREO PHASE CORRELATION BAR */}
        <div className="bg-black/40 border border-gray-850 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400">
            <Waves className="w-4 h-4 text-amber-400" />
            <span>STEREO PHASE ALIGNMENT CORRELATION:</span>
            <strong className="text-amber-300">{phaseCorrelation} (+1.0 = Perfect In-Phase)</strong>
          </div>

          <div className="w-full sm:w-64 bg-gray-900 h-3 rounded-full border border-gray-800 relative overflow-hidden flex items-center">
            {/* Center line */}
            <div className="absolute left-1/2 w-0.5 h-full bg-gray-600 z-10" />
            {/* Phase indicator dot */}
            <div
              className="w-3 h-3 bg-amber-400 rounded-full border border-black z-20 transition-all duration-150"
              style={{ left: `${((phaseCorrelation + 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
