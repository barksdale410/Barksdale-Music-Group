import React, { useState, useEffect } from 'react';
import { Play, Pause, Scissors, ChevronRight, Volume2, Move, Download, Plus, Trash2, Eye, Sliders, RefreshCw } from 'lucide-react';

interface TimelineClip {
  id: string;
  name: string;
  track: 'video' | 'audio' | 'sfx';
  start: number; // in seconds
  duration: number; // in seconds
  color: string;
  volume: number; // 0-100
  panning: number; // -50 to 50
  speed: number; // 0.5 to 2.0
}

const SFX_LIBRARY = [
  { id: 'loop_rain', name: 'Rain Ambience', duration: 15, category: 'Atmosphere', color: 'bg-teal-500/20 border-teal-500/30 text-teal-400' },
  { id: 'loop_siren', name: 'Siren Loop', duration: 8, category: 'Foley', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
  { id: 'loop_jazz', name: 'Midnight Jazz Sax', duration: 12, category: 'Music', color: 'bg-yellow-500/20 border-yellow-500/30 text-[var(--bmg-warning)]' },
  { id: 'loop_drone', name: 'Tension Bass Drone', duration: 10, category: 'Atmosphere', color: 'bg-purple-500/20 border-purple-500/30 text-purple-400' },
  { id: 'loop_fist', name: 'Fist Impact Thud', duration: 3, category: 'Impact', color: 'bg-[var(--bmg-accent-primary)]/20 border-[var(--bmg-accent-primary)]/30 text-orange-400' }
];

export const EditingSuite: React.FC<{
  generatedAudioUrl?: string | null;
  generatedTitle?: string | null;
}> = ({ generatedAudioUrl, generatedTitle }) => {
  const [clips, setClips] = useState<TimelineClip[]>([
    { id: 'clip_vid_1', name: 'Scene 1: Noir Alley (Raw)', track: 'video', start: 0, duration: 12, color: 'bg-[var(--bmg-accent-primary)]/10 border-blue-500/20 text-[var(--bmg-accent-primary)]', volume: 100, panning: 0, speed: 1.0 },
    { id: 'clip_vid_2', name: 'Scene 2: Dock Confrontation', track: 'video', start: 12, duration: 18, color: 'bg-[var(--bmg-accent-primary)]/10 border-blue-500/20 text-[var(--bmg-accent-primary)]', volume: 100, panning: 0, speed: 1.0 },
    { id: 'clip_aud_bg', name: generatedTitle ? `${generatedTitle} (Lyria Master)` : 'Midnight Heist Theme', track: 'audio', start: 0, duration: 25, color: 'bg-[var(--bmg-accent-primary)]/10 border-[var(--bmg-accent-primary)]/20 text-[var(--bmg-accent-primary)]', volume: 85, panning: -10, speed: 1.0 },
    { id: 'clip_sfx_rain', name: 'Rain Ambience Loop', track: 'sfx', start: 2, duration: 15, color: 'bg-teal-500/10 border-teal-500/20 text-teal-400', volume: 40, panning: 20, speed: 1.0 }
  ]);

  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip_aud_bg');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0.0); // playhead in seconds
  const [zoom, setZoom] = useState(15); // pixels per second
  const [masterVolume, setMasterVolume] = useState(80);
  const [activeFader, setActiveFader] = useState<'volume' | 'panning' | 'speed'>('volume');

  // Animation Frame loop for playhead
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 0;
          }
          return Number((prev + 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const selectedClip = clips.find(c => c.id === selectedClipId);

  const updateSelectedClip = (updates: Partial<TimelineClip>) => {
    if (!selectedClipId) return;
    setClips(prev => prev.map(c => c.id === selectedClipId ? { ...c, ...updates } : c));
  };

  const handleInsertSFX = (sfx: typeof SFX_LIBRARY[0]) => {
    const newId = `clip_sfx_${Math.random().toString(36).substring(7)}`;
    const newClip: TimelineClip = {
      id: newId,
      name: sfx.name,
      track: 'sfx',
      start: currentTime,
      duration: sfx.duration,
      color: sfx.color,
      volume: 70,
      panning: 0,
      speed: 1.0
    };
    setClips(prev => [...prev, newClip]);
    setSelectedClipId(newId);
  };

  const handleDeleteClip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClips(prev => prev.filter(c => c.id !== id));
    if (selectedClipId === id) setSelectedClipId(null);
  };

  const handleSplitClip = () => {
    if (!selectedClip) return;
    const splitPoint = currentTime - selectedClip.start;
    if (splitPoint <= 1 || splitPoint >= selectedClip.duration - 1) {
      return;
    }

    const firstHalf: TimelineClip = {
      ...selectedClip,
      id: `${selectedClip.id}_pt1`,
      name: `${selectedClip.name} (Part 1)`,
      duration: Number(splitPoint.toFixed(1))
    };

    const secondHalf: TimelineClip = {
      ...selectedClip,
      id: `${selectedClip.id}_pt2`,
      name: `${selectedClip.name} (Part 2)`,
      start: Number(currentTime.toFixed(1)),
      duration: Number((selectedClip.duration - splitPoint).toFixed(1))
    };

    setClips(prev => {
      const filtered = prev.filter(c => c.id !== selectedClip.id);
      return [...filtered, firstHalf, secondHalf];
    });

    setSelectedClipId(firstHalf.id);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Top Header Controls Bar */}
      <div className="bmg-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-[var(--bmg-accent-primary)]/10 border border-[var(--bmg-accent-primary)]/30 rounded">
            <span className="font-bold text-[10px] tracking-wider uppercase font-mono text-[var(--bmg-accent-primary)]">SOUNDTRACK EDIT WORKBENCH</span>
          </div>
          <p className="text-[11px] text-[var(--bmg-text-secondary)] italic">
            Linear multitrack arranger with automated panning, timeline clipping, and synchronous master level meters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {generatedAudioUrl && (
            <div className="px-2.5 py-1 bg-[var(--bmg-success)]/10 text-[var(--bmg-success)] border border-[var(--bmg-success)]/30 rounded text-xs font-bold flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--bmg-success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--bmg-success)]"></span>
              </span>
              <span>Syncing Generated Soundtrack</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multitrack Studio & Timelines */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bmg-card bg-[var(--bmg-bg-secondary)] p-5 overflow-x-auto">
            {/* Timeline Headings / Playback controls */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--bmg-border)]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center ${
                    isPlaying 
                      ? 'bg-[var(--bmg-success)] text-[#0e0e10]' 
                      : 'bg-[var(--bmg-accent-primary)] text-[#0e0e10]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="font-mono text-base font-bold bg-[#050506] text-[var(--bmg-success)] px-3 py-1 rounded border border-[var(--bmg-border)]">
                  00:{currentTime.toFixed(2).padStart(5, '0')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSplitClip}
                  disabled={!selectedClip}
                  className="px-3 py-1.5 border border-[var(--bmg-border-light)] rounded bg-[var(--bmg-bg-tertiary)] font-bold text-xs hover:bg-[var(--bmg-bg-hover)] text-[var(--bmg-text-primary)] disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Split Block
                </button>
                <div className="text-[10px] font-bold flex items-center gap-2 border-l border-[var(--bmg-border)] pl-3">
                  <span className="text-[var(--bmg-text-muted)] uppercase">Timeline Zoom</span>
                  <input 
                    type="range" min="10" max="30" 
                    value={zoom} 
                    onChange={e => setZoom(Number(e.target.value))}
                    className="w-20 h-1 bg-black rounded outline-none appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Tracks Grid */}
            <div className="relative min-h-[220px] select-none border border-[var(--bmg-border)] rounded bg-[#111114] overflow-hidden">
              {/* Playhead line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-40 shadow-lg pointer-events-none"
                style={{ left: `${(currentTime * zoom) + 120}px` }}
              >
                <div className="absolute top-0 -left-1 w-2.5 h-2.5 bg-red-500 rotate-45 border border-red-400"></div>
              </div>

              {/* Time tick labels */}
              <div className="flex border-b border-[var(--bmg-border)] bg-[var(--bmg-bg-secondary)] text-[8px] font-mono text-[var(--bmg-text-muted)] font-bold h-6 items-center">
                <div className="w-[120px] shrink-0 text-center border-r border-[var(--bmg-border)] uppercase tracking-wider">Track ID</div>
                <div className="flex-1 relative h-full">
                  {[0, 5, 10, 15, 20, 25, 30].map(sec => (
                    <div 
                      key={sec} 
                      className="absolute border-l border-[var(--bmg-border)] pl-1 h-full flex items-center"
                      style={{ left: `${sec * zoom}px` }}
                    >
                      {sec}s
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Row */}
              <div className="flex border-b border-[var(--bmg-border)] items-center h-12">
                <div className="w-[120px] shrink-0 px-3 font-bold text-[10px] uppercase bg-[var(--bmg-bg-secondary)] border-r border-[var(--bmg-border)] h-full flex items-center gap-1.5 text-[var(--bmg-text-secondary)]">
                  <Eye className="w-3.5 h-3.5 text-[var(--bmg-accent-primary)]" />
                  <span>Video Track</span>
                </div>
                <div className="flex-1 relative h-full bg-[var(--bmg-bg-primary)]">
                  {clips.filter(c => c.track === 'video').map(clip => {
                    const isSelected = clip.id === selectedClipId;
                    return (
                      <div 
                        key={clip.id}
                        onClick={() => setSelectedClipId(clip.id)}
                        className={`absolute top-1 bottom-1 px-2.5 py-1.5 rounded border font-semibold text-[9px] flex items-center justify-between cursor-pointer truncate shadow-sm transition-all ${clip.color} ${
                          isSelected ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-hover)]' : ''
                        }`}
                        style={{ left: `${clip.start * zoom}px`, width: `${clip.duration * zoom}px` }}
                      >
                        <span className="truncate">{clip.name}</span>
                        <button onClick={(e) => handleDeleteClip(clip.id, e)} className="p-0.5 hover:bg-black/20 rounded ml-1.5 text-[var(--bmg-text-secondary)] hover:text-white">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Audio Soundtrack Row */}
              <div className="flex border-b border-[var(--bmg-border)] items-center h-12">
                <div className="w-[120px] shrink-0 px-3 font-bold text-[10px] uppercase bg-[var(--bmg-bg-secondary)] border-r border-[var(--bmg-border)] h-full flex items-center gap-1.5 text-[var(--bmg-text-secondary)]">
                  <Volume2 className="w-3.5 h-3.5 text-[var(--bmg-accent-primary)]" />
                  <span>Soundtrack</span>
                </div>
                <div className="flex-1 relative h-full bg-[var(--bmg-bg-primary)]">
                  {clips.filter(c => c.track === 'audio').map(clip => {
                    const isSelected = clip.id === selectedClipId;
                    return (
                      <div 
                        key={clip.id}
                        onClick={() => setSelectedClipId(clip.id)}
                        className={`absolute top-1 bottom-1 px-2.5 py-1.5 rounded border font-semibold text-[9px] flex items-center justify-between cursor-pointer truncate ${clip.color} ${
                          isSelected ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-hover)]' : ''
                        }`}
                        style={{ left: `${clip.start * zoom}px`, width: `${clip.duration * zoom}px` }}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{clip.name}</span>
                          <div className="flex gap-0.5 h-3 items-center shrink-0">
                            {[10, 30, 20, 45, 12, 35, 25, 40, 15, 30].map((h, i) => (
                              <div key={i} className="w-[1.5px] bg-[var(--bmg-accent-primary)]" style={{ height: `${h}%` }}></div>
                            ))}
                          </div>
                        </div>
                        <button onClick={(e) => handleDeleteClip(clip.id, e)} className="p-0.5 hover:bg-black/20 rounded ml-1.5 text-[var(--bmg-text-secondary)] hover:text-white">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SFX Row */}
              <div className="flex items-center h-12">
                <div className="w-[120px] shrink-0 px-3 font-bold text-[10px] uppercase bg-[var(--bmg-bg-secondary)] border-r border-[var(--bmg-border)] h-full flex items-center gap-1.5 text-[var(--bmg-text-secondary)]">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" />
                  <span>SFX / Loops</span>
                </div>
                <div className="flex-1 relative h-full bg-[var(--bmg-bg-primary)]">
                  {clips.filter(c => c.track === 'sfx').map(clip => {
                    const isSelected = clip.id === selectedClipId;
                    return (
                      <div 
                        key={clip.id}
                        onClick={() => setSelectedClipId(clip.id)}
                        className={`absolute top-1 bottom-1 px-2.5 py-1.5 rounded border font-semibold text-[9px] flex items-center justify-between cursor-pointer truncate ${clip.color} ${
                          isSelected ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-hover)]' : ''
                        }`}
                        style={{ left: `${clip.start * zoom}px`, width: `${clip.duration * zoom}px` }}
                      >
                        <span className="truncate">{clip.name}</span>
                        <button onClick={(e) => handleDeleteClip(clip.id, e)} className="p-0.5 hover:bg-black/20 rounded ml-1.5 text-[var(--bmg-text-secondary)] hover:text-white">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Master Bus processing module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bmg-card p-4 bg-[#0a0a0c] border border-[var(--bmg-border)] text-[var(--bmg-success)] font-mono text-xs flex justify-between items-center">
              <div className="space-y-1.5">
                <div className="flex justify-between w-48 font-bold">
                  <span className="text-[10px] tracking-wider text-[var(--bmg-text-muted)]">MASTER OUTPUT LEVEL</span>
                  <span className="text-[var(--bmg-success)]">{isPlaying ? '-1.8 dB' : '---'}</span>
                </div>
                <div className="flex gap-0.5 h-2.5 bg-gray-900 w-48 rounded overflow-hidden border border-gray-850">
                  {[12, 18, 25, 40, 50, 60, 75, 90, 80, 50].map((val, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 transition-all ${isPlaying ? (i > 7 ? 'bg-[var(--bmg-error)]' : 'bg-[var(--bmg-success)]') : 'bg-gray-800'}`} 
                      style={{ height: `${isPlaying ? val : 0}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-[var(--bmg-text-muted)] uppercase">Resolution</div>
                <div className="font-bold text-[var(--bmg-text-primary)] text-[11px] font-mono">48.0 kHz / 24-Bit</div>
              </div>
            </div>

            <div className="bmg-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[var(--bmg-accent-primary)]" />
                <div>
                  <span className="block text-[9px] font-bold text-[var(--bmg-text-muted)] uppercase">Master Fader</span>
                  <span className="font-bold text-xs text-[var(--bmg-text-primary)] font-mono">{masterVolume}%</span>
                </div>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={masterVolume} 
                onChange={e => setMasterVolume(Number(e.target.value))}
                className="w-32 h-1 bg-black rounded outline-none appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Clip Property Inspector / SFX Library */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Clip Inspector */}
          <div className="bmg-card p-4">
            <h4 className="text-xs font-black text-[var(--bmg-accent-primary)] mb-3 tracking-widest flex items-center gap-1.5 uppercase">
              <Sliders className="w-3.5 h-3.5" />
              Clip Automations
            </h4>

            {selectedClip ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-[var(--bmg-text-muted)] font-mono font-bold uppercase block">Focused Fragment</span>
                  <div className="font-bold text-xs text-[var(--bmg-text-primary)]">{selectedClip.name}</div>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] text-[var(--bmg-accent-primary)] text-[8px] font-mono font-bold uppercase rounded">
                    Type: {selectedClip.track}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {(['volume', 'panning', 'speed'] as const).map(fader => (
                    <button 
                      key={fader}
                      onClick={() => setActiveFader(fader)}
                      className={`flex-1 py-1 px-2 border text-[9px] font-bold uppercase rounded transition-all ${
                        activeFader === fader 
                          ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-tertiary)] text-[var(--bmg-text-primary)]' 
                          : 'border-[var(--bmg-border-light)] bg-[var(--bmg-bg-secondary)] text-[var(--bmg-text-secondary)] hover:bg-[var(--bmg-bg-hover)]'
                      }`}
                    >
                      {fader}
                    </button>
                  ))}
                </div>

                {/* Automation Parameter Slider */}
                <div className="p-3 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded-md space-y-2">
                  {activeFader === 'volume' && (
                    <>
                      <div className="flex justify-between text-[9px] font-bold font-mono text-[var(--bmg-text-secondary)]">
                        <span>Fader Gain Level</span>
                        <span>{selectedClip.volume}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={selectedClip.volume}
                        onChange={e => updateSelectedClip({ volume: Number(e.target.value) })}
                        className="w-full h-1 bg-black rounded outline-none appearance-none"
                      />
                    </>
                  )}

                  {activeFader === 'panning' && (
                    <>
                      <div className="flex justify-between text-[9px] font-bold font-mono text-[var(--bmg-text-secondary)]">
                        <span>Acoustic Pan Vector</span>
                        <span>{selectedClip.panning === 0 ? 'C' : selectedClip.panning < 0 ? `L ${Math.abs(selectedClip.panning)}` : `R ${selectedClip.panning}`}</span>
                      </div>
                      <input 
                        type="range" min="-50" max="50" 
                        value={selectedClip.panning}
                        onChange={e => updateSelectedClip({ panning: Number(e.target.value) })}
                        className="w-full h-1 bg-black rounded outline-none appearance-none"
                      />
                    </>
                  )}

                  {activeFader === 'speed' && (
                    <>
                      <div className="flex justify-between text-[9px] font-bold font-mono text-[var(--bmg-text-secondary)]">
                        <span>Decelerate / Pitch Shift</span>
                        <span>{selectedClip.speed}x</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="2.0" step="0.25"
                        value={selectedClip.speed}
                        onChange={e => updateSelectedClip({ speed: Number(e.target.value) })}
                        className="w-full h-1 bg-black rounded outline-none appearance-none"
                      />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-[var(--bmg-text-muted)]">
                  <div><strong>Cue In:</strong> {selectedClip.start}s</div>
                  <div><strong>Cue Duration:</strong> {selectedClip.duration}s</div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[var(--bmg-text-muted)] italic">
                Select an audio or video fragment to configure parametric gain envelopes and pitch ratios.
              </p>
            )}
          </div>

          {/* Sound FX Loop Library */}
          <div className="bmg-card p-4">
            <h4 className="text-xs font-black text-[var(--bmg-success)] mb-2 tracking-widest flex items-center gap-1.5 uppercase">
              <Plus className="w-3.5 h-3.5" />
              Media FX Pool
            </h4>
            <p className="text-[10px] text-[var(--bmg-text-muted)] mb-3 italic">Inject ambient soundscapes and foley triggers directly into the arrangement workspace.</p>
            
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {SFX_LIBRARY.map(sfx => (
                <div 
                  key={sfx.id}
                  className="p-2 border border-[var(--bmg-border)] rounded bg-[var(--bmg-bg-tertiary)] hover:bg-[var(--bmg-bg-hover)] flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--bmg-success)]"></div>
                    <div>
                      <div className="font-bold text-[var(--bmg-text-primary)] text-[11px]">{sfx.name}</div>
                      <div className="text-[9px] text-[var(--bmg-text-muted)] font-mono">{sfx.category} • {sfx.duration}s</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleInsertSFX(sfx)}
                    className="p-1 px-2.5 bg-[var(--bmg-success)] text-[#0e0e10] text-[9px] font-black uppercase rounded flex items-center gap-1"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    Drop
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
