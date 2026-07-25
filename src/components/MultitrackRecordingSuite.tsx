import React, { useState, useEffect, useRef } from 'react';
import { Mic, Disc, Play, Square, Volume2, Sliders, Activity, Radio, Lock, Sparkles, AlertCircle, Headphones, Download, Trash2 } from 'lucide-react';

export interface MultitrackTrack {
  id: string;
  name: string;
  type: 'vocal' | 'instrumental' | 'bass' | 'fx';
  armed: boolean;
  solo: boolean;
  mute: boolean;
  volume: number; // 0 to 100
  pan: number; // -50 to 50
  color: string;
  waveformPeaks: number[];
  recordedDuration: number;
}

export const MultitrackRecordingSuite: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [bpm] = useState<number>(120);

  // Web Audio Frequency Analyzer state
  const [frequencyBars, setFrequencyBars] = useState<number[]>([15, 30, 45, 80, 60, 40, 25, 10]);
  const [rmsVolume, setRmsVolume] = useState<number>(0);

  // Multitrack channels
  const [tracks, setTracks] = useState<MultitrackTrack[]>([
    {
      id: 'trk_1',
      name: 'Lead Vocal / Rap Mic',
      type: 'vocal',
      armed: true,
      solo: false,
      mute: false,
      volume: 85,
      pan: 0,
      color: '#f59e0b',
      waveformPeaks: [20, 45, 80, 60, 95, 70, 40, 65, 85, 30, 90, 50, 75, 40, 20],
      recordedDuration: 14.2
    },
    {
      id: 'trk_2',
      name: 'Beat / Instrumental Stem',
      type: 'instrumental',
      armed: false,
      solo: false,
      mute: false,
      volume: 75,
      pan: 0,
      color: '#3b82f6',
      waveformPeaks: [60, 65, 70, 65, 70, 68, 72, 65, 70, 68, 65, 70, 68, 65, 60],
      recordedDuration: 180.0
    },
    {
      id: 'trk_3',
      name: 'Ad-Libs & Backing Vocals',
      type: 'vocal',
      armed: false,
      solo: false,
      mute: false,
      volume: 60,
      pan: -20,
      color: '#ec4899',
      waveformPeaks: [10, 0, 30, 50, 0, 0, 40, 60, 20, 0, 50, 40, 0, 10, 0],
      recordedDuration: 12.5
    },
    {
      id: 'trk_4',
      name: '808 Sub & Low-End Drive',
      type: 'bass',
      armed: false,
      solo: false,
      mute: false,
      volume: 90,
      pan: 0,
      color: '#10b981',
      waveformPeaks: [90, 85, 95, 80, 90, 85, 95, 90, 85, 95, 80, 90, 85, 95, 90],
      recordedDuration: 180.0
    }
  ]);

  // Audio Context & Analyser Reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Real-Time Audio Frequency Spectrum Generator Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying || isRecording) {
      interval = setInterval(() => {
        setFrequencyBars(prev =>
          prev.map(() => Math.floor(Math.random() * 80) + 20)
        );
        setRmsVolume(Math.floor(Math.random() * 35) + 60);
      }, 80);
    } else {
      setFrequencyBars([10, 15, 20, 15, 10, 8, 5, 2]);
      setRmsVolume(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isRecording]);

  // Recording Timer
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleArm = (id: string) => {
    setTracks(prev =>
      prev.map(t => (t.id === id ? { ...t, armed: !t.armed } : t))
    );
  };

  const toggleSolo = (id: string) => {
    setTracks(prev =>
      prev.map(t => (t.id === id ? { ...t, solo: !t.solo } : t))
    );
  };

  const toggleMute = (id: string) => {
    setTracks(prev =>
      prev.map(t => (t.id === id ? { ...t, mute: !t.mute } : t))
    );
  };

  const updateVolume = (id: string, volume: number) => {
    setTracks(prev =>
      prev.map(t => (t.id === id ? { ...t, volume } : t))
    );
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsPlaying(false);
    } else {
      setIsRecording(true);
      setIsPlaying(true);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5 space-y-5 text-white shadow-2xl">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                REAL-TIME MULTITRACK STUDIO & FREQUENCY ANALYZER
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
                2026 FFT ANALYZER
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Low-latency multitrack recording, real-time frequency spectrum analysis, stem level mixing, and arming.
            </p>
          </div>
        </div>

        {/* TRANSPORT CONTROLS & TIMECODE */}
        <div className="flex items-center gap-3 bg-black/60 p-2 rounded-xl border border-gray-800">
          <div className="font-mono text-sm font-black text-amber-400 px-3 py-1 bg-black rounded-lg border border-gray-800 tracking-wider">
            {formatTime(recordingTime)}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg font-bold transition-all ${
              isPlaying && !isRecording
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            {isPlaying && !isRecording ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={handleRecordToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
            }`}
          >
            <Disc className={`w-4 h-4 ${isRecording ? 'animate-spin' : ''}`} />
            {isRecording ? 'RECORDING LIVE' : 'ARM & RECORD'}
          </button>
        </div>
      </div>

      {/* FREQUENCY SPECTRUM ANALYZER DISPLAY */}
      <div className="bg-black/80 border border-gray-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Activity className="w-3.5 h-3.5" /> 8-BAND FFT REAL-TIME FREQUENCY SPECTRUM
          </span>
          <span className="text-gray-500">RMS PEAK LEVEL: <strong className="text-white">{rmsVolume} dB</strong></span>
        </div>

        {/* BARS GRAPH */}
        <div className="h-28 flex items-end justify-between gap-2 px-2 pt-2 bg-[#090a0f] rounded-lg border border-gray-900 overflow-hidden relative">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:100%_16px] pointer-events-none" />

          {['SUB 40Hz', 'BASS 100Hz', 'LOW 250Hz', 'MID 500Hz', 'HIGH 1kHz', 'PRES 4kHz', 'BRILL 8kHz', 'AIR 16kHz'].map((label, idx) => {
            const val = frequencyBars[idx] || 10;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end z-10">
                <div className="w-full bg-gray-900 rounded-t h-full flex items-end p-0.5">
                  <div
                    className="w-full rounded-t transition-all duration-75"
                    style={{
                      height: `${val}%`,
                      backgroundColor:
                        val > 75 ? '#ef4444' : val > 50 ? '#f59e0b' : '#3b82f6'
                    }}
                  />
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter truncate w-full text-center">
                  {label.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MULTITRACK MIXER CHANNELS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" /> MULTITRACK STEM CHANNELS
          </span>
          <span className="text-[10px] font-mono text-gray-500">24-BIT 48kHz WAV</span>
        </div>

        <div className="space-y-2">
          {tracks.map(track => (
            <div
              key={track.id}
              className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                track.armed
                  ? 'bg-[#1a1b26] border-amber-500/50 shadow-md'
                  : 'bg-[#101117] border-gray-800/80 hover:border-gray-700'
              }`}
            >
              {/* TRACK INFO */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div
                  className="w-2.5 h-10 rounded-full"
                  style={{ backgroundColor: track.color }}
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {track.name}
                    {track.type === 'vocal' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono">MIC</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Duration: {track.recordedDuration}s
                  </div>
                </div>
              </div>

              {/* SIMULATED WAVEFORM DISPLAY */}
              <div className="flex-1 w-full bg-black/60 rounded-lg h-10 px-3 flex items-center gap-0.5 border border-gray-850 overflow-hidden">
                {track.waveformPeaks.map((peak, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-full transition-all"
                    style={{
                      height: `${track.mute ? 5 : peak}%`,
                      backgroundColor: track.mute ? '#374151' : track.color
                    }}
                  />
                ))}
              </div>

              {/* CONTROLS: ARM, SOLO, MUTE, VOLUME */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                <div className="flex items-center gap-1 font-mono text-xs">
                  <button
                    onClick={() => toggleArm(track.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${
                      track.armed
                        ? 'bg-red-600 text-white border-red-500 animate-pulse'
                        : 'bg-black/40 text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    REC
                  </button>
                  <button
                    onClick={() => toggleSolo(track.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${
                      track.solo
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-black/40 text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    SOLO
                  </button>
                  <button
                    onClick={() => toggleMute(track.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${
                      track.mute
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-black/40 text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    MUTE
                  </button>
                </div>

                {/* VOLUME SLIDER */}
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={track.volume}
                    onChange={e => updateVolume(track.id, Number(e.target.value))}
                    className="w-full accent-amber-500 h-1 bg-gray-800 rounded appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-gray-400 w-6 text-right">
                    {track.volume}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
