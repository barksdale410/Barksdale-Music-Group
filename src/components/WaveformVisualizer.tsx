import React, { useEffect, useRef } from 'react';
import { barksdaleSynth } from '../utils/audioUtils';
import { Activity } from 'lucide-react';

export const WaveformVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas responsive
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
        canvas.height = 70 * (window.devicePixelRatio || 1); // 70px height
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get real analyser node from synth
    const analyser = barksdaleSynth.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear with dark logic background
      ctx.fillStyle = '#17171a';
      ctx.fillRect(0, 0, width, height);

      // Draw horizontal center grid line
      ctx.strokeStyle = '#2a2a32';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (analyser) {
        // Read real active frequency data
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.4;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          // Scale height
          const percent = val / 255;
          const barHeight = percent * (height - 10);

          // Render gradient bars
          const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
          gradient.addColorStop(0, '#00e1ff'); // Logic Electric Cyan
          gradient.addColorStop(0.5, '#9b763e'); // Deep Neon Blue
          gradient.addColorStop(1, '#00e1ff');

          ctx.fillStyle = gradient;
          
          // Center the bars vertically
          const yPos = height / 2 - barHeight / 2;
          
          // Draw rounded bars
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, yPos, barWidth - 1.5, barHeight, 1) : ctx.rect(x, yPos, barWidth - 1.5, barHeight);
          ctx.fill();

          x += barWidth;
        }
      } else {
        // Mock subtle pulsing wave when idle
        const time = Date.now() * 0.004;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.4)';
        ctx.beginPath();

        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.05 + time) * 3 * Math.cos(i * 0.01 + time * 0.5);
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#17171a] border border-[#2a2a32] rounded-lg p-2 flex flex-col gap-1 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] font-mono font-black tracking-widest text-[#ca9a5a] flex items-center gap-1">
          <Activity className="w-3 h-3 animate-pulse" />
          REALTIME OSCILLOSCOPE SPECTROMETER
        </span>
        <span className="text-[8px] font-mono text-[#636366]">64 FFT WINDOW</span>
      </div>
      <div className="relative w-full h-[70px] bg-[#17171a] rounded overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>
    </div>
  );
};
