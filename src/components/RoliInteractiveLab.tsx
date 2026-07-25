import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Award, Zap, Shield, Volume2, Music, Eye, Radio, HelpCircle, Flame, Star, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { barksdaleSynth } from '../utils/audioUtils';
import { MPEState, SynthPreset, ExpressionQuest } from '../types';

export const RoliInteractiveLab: React.FC = () => {
  // MPE Dimensions State
  const [mpeState, setMpeState] = useState<MPEState>({
    strike: 70,
    press: 45,
    glide: 0,
    slide: 60,
    lift: 30
  });

  // Equator 2 Synthesizer Tracks
  const [synths, setSynths] = useState<SynthPreset[]>([
    { id: 'lead', name: '70s Chunky Funk Lead', volume: 85, solo: false, mute: false, type: 'lead' },
    { id: 'bass', name: 'Underground Tube Sub-Bass', volume: 90, solo: false, mute: false, type: 'bass' },
    { id: 'pad', name: 'Cosmic Amber Luminous Pad', volume: 70, solo: false, mute: false, type: 'pad' }
  ]);

  // Expression Quests
  const [quests, setQuests] = useState<ExpressionQuest[]>([
    {
      id: 'quest-1',
      title: 'MPE Strike Attunement',
      difficulty: 'Beginner',
      description: 'Strike a Keywave with high velocity (>85) to trigger snappy envelope attack.',
      requiredGesture: 'strike',
      targetValue: 85,
      badgeName: 'VELOCITY WHIP',
      completed: false
    },
    {
      id: 'quest-2',
      title: 'Pressure Wobble Hold',
      difficulty: 'Intermediate',
      description: 'Hold continuous pressure (>90) to engage sub-harmonic vintage vibrato.',
      requiredGesture: 'press',
      targetValue: 90,
      badgeName: 'AFTERTOUCH SQUEEZE',
      completed: false
    },
    {
      id: 'quest-3',
      title: 'Slide Timbre Sweep',
      difficulty: 'Specialist',
      description: 'Slide up on the Y-axis (>95) to open the analog resonant filter cutoff.',
      requiredGesture: 'slide',
      targetValue: 95,
      badgeName: 'FILTER MASTER',
      completed: false
    }
  ]);

  const [activeQuestIdx, setActiveQuestIdx] = useState<number>(0);
  const [xp, setXp] = useState<number>(150);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [ledHeights, setLedHeights] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10]);

  // Particles for 5D Seaboard touch
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const particleIdRef = useRef(0);
  const seaboardRef = useRef<HTMLDivElement>(null);

  // Simulate LED stereo visualizer
  useEffect(() => {
    const timer = setInterval(() => {
      setLedHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 80) + 10)
      );
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Update MIDI Sync and trigger synth note on interaction
  const handleSeaboardInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seaboardRef.current) return;
    const rect = seaboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map X to pitch glide (-50 to +50) and Y to slide timbre (0 to 100)
    const glide = Math.round(((x / rect.width) * 100) - 50);
    const slide = Math.round((1 - (y / rect.height)) * 100);
    const strike = Math.round(Math.random() * 30) + 70; // Simulate high strike
    const press = Math.round(Math.random() * 40) + 40;

    const newMpe = { ...mpeState, glide, slide, strike, press };
    setMpeState(newMpe);

    // Create custom particle
    const color = slide > 75 ? '#ca9a5a' : '#f59e0b';
    const newParticle = { id: particleIdRef.current++, x, y, color };
    setParticles(prev => [...prev.slice(-15), newParticle]);

    // Play synthesized sound depending on MPE parameters
    const baseFreq = 130.81 * (1 + (slide / 100)) * (1 + (glide / 150)); // C3 modulated
    barksdaleSynth.playRhodesNote(baseFreq, 0.4);

    // Check active quest
    const currentQuest = quests[activeQuestIdx];
    if (currentQuest && !currentQuest.completed) {
      const currentVal = newMpe[currentQuest.requiredGesture];
      if (currentVal >= currentQuest.targetValue) {
        // Quest Completed!
        const updatedQuests = [...quests];
        updatedQuests[activeQuestIdx].completed = true;
        setQuests(updatedQuests);
        setXp(prev => prev + 100);
        if (!unlockedBadges.includes(currentQuest.badgeName)) {
          setUnlockedBadges(prev => [...prev, currentQuest.badgeName]);
        }
      }
    }
  };

  const handleUpdateVolume = (id: string, vol: number) => {
    setSynths(prev => prev.map(s => s.id === id ? { ...s, volume: vol } : s));
  };

  const handleToggleMute = (id: string) => {
    setSynths(prev => prev.map(s => s.id === id ? { ...s, mute: !s.mute } : s));
  };

  const handleToggleSolo = (id: string) => {
    setSynths(prev => prev.map(s => s.id === id ? { ...s, solo: !s.solo } : s));
  };

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="comix-panel p-5 bg-[#121318] text-white relative">
        <div className="absolute top-2 right-2 bg-black px-2 py-1 border border-gray-800 rounded text-[10px] font-mono text-amber-500 font-bold">
          5D SYNTHESIZER LAB v2.0
        </div>
        <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2 tracking-tight">
          <Radio className="w-6 h-6 stroke-[2px]" />
          AIGENIO MPE & SEABOARD ENGINE
        </h2>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
          Unlock multidimensional polyphonic expression. Strike, press, glide, slide, and lift to modulate rich, analog synthesizer filters and sub-harmonic oscillators in real time.
        </p>

        {/* EXPRESSION ENGINE CAPABILITIES */}
        <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-dashed border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">5D TOUCH SURFACES:</span>
            <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold text-xs border border-amber-500/30">STRIKE • PRESS • GLIDE • SLIDE • LIFT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">POLYPHONIC PROTOCOL:</span>
            <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold text-xs border border-amber-500/30">MPE / WebMIDI v2</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 5D SEABOARD */}
        <div className="lg:col-span-8 space-y-6">
          <div className="comix-panel p-5 bg-[#121318]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 stroke-[2px] text-amber-500" />
                5D AIGENIO SEABOARD STAGE
              </h3>
              <div className="flex gap-3 text-[10px] font-mono">
                <span className="text-gray-400">Glide: <strong className="text-amber-500">{mpeState.glide}</strong></span>
                <span className="text-gray-400">Slide: <strong className="text-amber-500">{mpeState.slide}%</strong></span>
              </div>
            </div>

            {/* SEABOARD GRID INTERFACE */}
            <div 
              ref={seaboardRef}
              onMouseMove={handleSeaboardInteraction}
              className="relative h-48 w-full bg-[#09090e] border border-gray-850 rounded-xl overflow-hidden cursor-crosshair shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex items-end justify-between"
            >
              {/* Soft touchwaves simulation */}
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                   key={i} 
                  className="h-full flex-1 border-r border-black/40 bg-gradient-to-t from-[#151522] via-[#0b0b10] to-[#12121e] relative group"
                >
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-black/50 group-hover:bg-[#ca9a5a]/30 rounded-full transition-colors" />
                </div>
              ))}

              {/* Dynamic Touch Ripples */}
              {particles.map(p => (
                <div 
                  key={p.id}
                  className="absolute pointer-events-none rounded-full blur-[2px] border border-white"
                  style={{
                    left: p.x - 24,
                    top: p.y - 24,
                    width: '48px',
                    height: '48px',
                    backgroundColor: p.color,
                    opacity: 0.45,
                    transform: 'scale(1.2)',
                  }}
                />
              ))}

              {/* Holographic grid stats */}
              <div className="absolute top-2 left-3 text-[9px] font-mono text-gray-500 pointer-events-none uppercase">
                Interactive Multi-touch Matrix • Live Synthesis Output
              </div>
            </div>

            {/* MPE 5-DIMENSIONS METRIC MONITOR */}
            <div className="grid grid-cols-5 gap-3 mt-4">
              {[
                { name: 'STRIKE', value: mpeState.strike, desc: 'Attack trigger speed' },
                { name: 'PRESS', value: mpeState.press, desc: 'Continuous touch pressure' },
                { name: 'GLIDE', value: mpeState.glide + 50, desc: 'Horizontal pitch bend' },
                { name: 'SLIDE', value: mpeState.slide, desc: 'Vertical Y-axis filter' },
                { name: 'LIFT', value: mpeState.lift, desc: 'Release keyoff speed' }
              ].map(dim => (
                <div key={dim.name} className="bg-black/35 border border-gray-850 p-2.5 rounded-lg text-center font-mono relative overflow-hidden">
                  <div className="text-[10px] text-gray-400 font-bold tracking-tight mb-1">{dim.name}</div>
                  <div className="text-lg font-bold text-amber-500">{dim.value}</div>
                  <div className="w-full bg-gray-900 h-1 mt-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-150" style={{ width: `${dim.value}%` }} />
                  </div>
                  <div className="text-[8px] text-gray-600 mt-1 uppercase leading-none">{dim.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EQUATOR 2 ENGINE TRACKS SIM */}
          <div className="comix-panel p-5 bg-[#121318]">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 tracking-wide">
              <Zap className="w-4 h-4 text-amber-500" />
              EQUATOR 2 SYNTHESIZER MULTI-TRACK PLAYER
            </h3>

            <div className="space-y-3">
              {synths.map(track => (
                <div key={track.id} className="bg-black/40 border border-gray-800 p-3 rounded-lg flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${track.mute ? 'bg-gray-600' : 'bg-amber-500 animate-pulse'}`} />
                      <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">{track.name}</h4>
                    </div>
                    <div className="text-[9px] font-mono text-gray-500 mt-0.5 uppercase">
                      Preset ID: {track.id.toUpperCase()} • Type: {track.type}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 w-32 md:w-44">
                    <Volume2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={track.volume} 
                      onChange={(e) => handleUpdateVolume(track.id, parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-gray-400 w-6 text-right font-bold">{track.volume}%</span>
                  </div>

                  {/* Solo & Mute */}
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleToggleMute(track.id)}
                      className={`px-2 py-1 rounded text-[9px] font-black uppercase border border-black ${
                        track.mute ? 'bg-red-950/40 text-red-500 border-red-900' : 'bg-gray-900 text-gray-400 hover:text-white'
                      }`}
                    >
                      Mute
                    </button>
                    <button 
                      onClick={() => handleToggleSolo(track.id)}
                      className={`px-2 py-1 rounded text-[9px] font-black uppercase border border-black ${
                        track.solo ? 'bg-amber-500 text-black font-black' : 'bg-gray-900 text-gray-400 hover:text-white'
                      }`}
                    >
                      Solo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TUTORIALS & STEREO LED */}
        <div className="lg:col-span-4 space-y-6">
          {/* LED STEREO VISUALIZER */}
          <div className="comix-panel p-5 bg-[#0e0e13]">
            <h3 className="text-xs font-black text-gray-400 mb-3 tracking-wider uppercase font-mono">
              ★ LIVE LED STEREO SPECTRUM
            </h3>
            <div className="bg-black border border-gray-900 p-4 rounded-lg flex items-end justify-between h-28 gap-1.5">
              {ledHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full">
                  {Array.from({ length: 8 }).map((_, segmentIdx) => {
                    const threshold = (segmentIdx + 1) * 12;
                    const isActive = h >= threshold;
                    let color = 'bg-[#1e1e1e]';
                    if (isActive) {
                      if (segmentIdx >= 6) color = 'bg-red-500'; // Peak
                      else if (segmentIdx >= 4) color = 'bg-amber-500'; // Mid-high
                      else color = 'bg-[#ca9a5a]'; // Low
                    }
                    return (
                      <div key={segmentIdx} className={`h-2 rounded-sm ${color} w-full transition-all duration-75`} />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="text-[8.5px] font-mono text-gray-500 mt-2 text-center uppercase tracking-widest">
              Equator 2 Multi-Bus Dynamic Mixer Analyzer
            </div>
          </div>

          {/* ROLI EXPRESSION PRACTICE DRILLS */}
          <div className="comix-panel p-5 bg-[#15151e] border-l-4 border-l-amber-500">
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-white uppercase">
                Expression Practice Drills
              </h3>
            </div>

            <p className="text-[11px] text-gray-400 mb-4 leading-normal">
              Master polyphonic modulation through targeted interactive gestures. Touch, drag and slide to match target values.
            </p>

            <div className="space-y-4">
              {quests.map((quest, idx) => (
                <div 
                  key={quest.id} 
                  onClick={() => setActiveQuestIdx(idx)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    idx === activeQuestIdx 
                      ? 'bg-black/50 border-amber-500 shadow-[4px_4px_0px_#000]' 
                      : 'bg-black/25 border-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest">
                      {quest.difficulty} QUEST
                    </span>
                    {quest.completed ? (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide uppercase">
                        COMPLETED
                      </span>
                    ) : (
                      <span className="bg-amber-950/40 text-amber-500 border border-amber-900 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{quest.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal mb-2">{quest.description}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-900 text-[10px] font-mono">
                    <span className="text-gray-500">Target gesture:</span>
                    <span className="text-white font-bold">{quest.requiredGesture.toUpperCase()} &gt; {quest.targetValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
