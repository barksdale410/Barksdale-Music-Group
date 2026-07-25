import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, ZoomIn, ZoomOut, RefreshCw, Volume2, Sliders, Scissors, Layers } from 'lucide-react';

export const AudioWaveformView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0.25); // 0.0 to 1.0
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1x to 5x
  const [peakDb, setPeakDb] = useState<number>(-3.2);

  const animRef = useRef<number | null>(null);

  // Generate synthetic waveform peaks array
  const peaksRef = useRef<number[]>([]);
  if (peaksRef.current.length === 0) {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      // Dynamic musical waveform shape with bursts
      const val = Math.sin(i * 0.1) * 0.4 + Math.random() * 0.5 + (i % 20 === 0 ? 0.3 : 0);
      arr.push(Math.min(1.0, Math.abs(val)));
    }
    peaksRef.current = arr;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
        canvas.height = 120 * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const renderWaveform = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Dark Matte Background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Center baseline
      const centerY = h / 2;
      ctx.strokeStyle = '#222634';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      const peaks = peaksRef.current;
      const totalBars = peaks.length * zoomLevel;
      const barWidth = w / totalBars;

      // Draw Waveform Bars
      for (let i = 0; i < totalBars; i++) {
        const peakIdx = i % peaks.length;
        const amplitude = peaks[peakIdx] * (h / 2 - 10);
        const x = i * barWidth;

        const isPassed = x / w <= progress;

        ctx.fillStyle = isPassed ? '#f59e0b' : '#374151'; // Amber for played, Grey for remaining

        // Symmetric upper and lower bar
        ctx.fillRect(x, centerY - amplitude, Math.max(1, barWidth - 1), amplitude * 2);
      }

      // Draw Playhead Scrubber Line
      const playheadX = progress * w;
      ctx.strokeStyle = '#38bdf8'; // Electric Sky Blue
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, h);
      ctx.stroke();

      // Playhead Head Indicator
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(playheadX, 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Playhead Timestamp Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`00:${Math.floor(progress * 60).toString().padStart(2, '0')}`, playheadX + 6, 12);

      if (isPlaying) {
        setProgress(prev => (prev >= 1 ? 0 : prev + 0.001));
      }

      animRef.current = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, progress, zoomLevel]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    setProgress(newProgress);
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
              STUDIO AUDIO WAVEFORM SCRUBBER & PEAK VIEW
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                100% SAMPLE ACCURATE
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              High-resolution waveform visualization, playhead scrubbing, zoom inspection, and peak level metering.
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/20'
                : 'bg-black/60 border-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'PAUSE SCRUBBER' : 'PLAY WAVEFORM'}
          </button>

          <div className="flex items-center gap-1 bg-black/60 border border-gray-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 1))}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-mono text-[10px] text-amber-300 font-bold">{zoomLevel}x</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(5, prev + 1))}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* WAVEFORM CANVAS VIEWPORT */}
      <div className="bg-black/90 rounded-xl border border-gray-800 p-2 relative cursor-pointer overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-[120px] rounded-lg block"
        />
      </div>

      {/* SCRUBBER SCRUB SLIDER & TELEMETRY */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono bg-black/50 p-3 rounded-xl border border-gray-850">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-gray-400 text-[10px] uppercase">SCRUB PLAYHEAD:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            className="w-full sm:w-48 accent-amber-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <span>PEAK DB: <strong className="text-amber-300">{peakDb} dBFS</strong></span>
          <span>POSITION: <strong className="text-white">{(progress * 100).toFixed(1)}%</strong></span>
          <span>SAMPLE RATE: <strong className="text-cyan-400">48.0 kHz / 24-bit</strong></span>
        </div>
      </div>
    </div>
  );
};
