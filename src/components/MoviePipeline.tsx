import React, { useState } from 'react';
import { Play, Film, User, Code2, Layers, Music, Sliders, CheckCircle2, ChevronRight, HelpCircle, Flame, Eye, Download, RefreshCw } from 'lucide-react';

interface ActorSelection {
  character: string;
  actorName: string;
  actorId: string;
}

export const MoviePipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [casting, setCasting] = useState<ActorSelection[]>([
    { character: 'SLATE', actorName: 'Christian Sterling', actorId: 'act_christian' },
    { character: 'ELENA', actorName: 'Elena Rostova', actorId: 'act_elena' },
    { character: 'MARCUS', actorName: 'Marcus Vance', actorId: 'act_marcus' }
  ]);

  const [synthesizing, setSynthesizing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Anamorphic Noir LUT');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRunSync = () => {
    setSynthesizing(true);
    setLogs([]);
    const messages = [
      "Analyzing dialogue phonetic coordinates...",
      "Matching visual mouth poses with vocal registers...",
      "Cloning target voice actors' frequency spectrums...",
      "Injecting ambient room tone and foley sound clusters...",
      "Merging master instrumental soundtrack stems...",
      "Vocal and score synchronization consolidated!"
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        if (idx === messages.length - 1) {
          setSynthesizing(false);
          setSynced(true);
        }
      }, (idx + 1) * 600);
    });
  };

  const handleRunExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 3000);
  };

  const steps = [
    { label: "1. Analysis", icon: Film },
    { label: "2. Casting", icon: User },
    { label: "3. Scene Gen", icon: Code2 },
    { label: "4. Lighting", icon: Layers },
    { label: "5. Vocal Sync", icon: Music },
    { label: "6. LUT Grading", icon: Sliders },
    { label: "7. Export Master", icon: CheckCircle2 }
  ];

  return (
    <div className="bmg-card p-6 bg-[var(--bmg-bg-secondary)] flex flex-col gap-6">
      {/* Progress Tracker Banner */}
      <div className="bg-[#111114] border-t border-b border-[var(--bmg-border)] py-3.5 flex justify-between px-4 overflow-x-auto select-none gap-2 rounded">
        {steps.map((st, idx) => {
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;
          return (
            <div 
              key={idx} 
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 shrink-0 px-3 py-1.5 rounded cursor-pointer border text-xs transition-all ${
                isActive 
                  ? 'bg-[var(--bmg-accent-primary)] text-[#0e0e10] border-[var(--bmg-accent-primary)] font-bold shadow-md shadow-[var(--bmg-accent-glow)]' 
                  : isPassed 
                    ? 'text-[var(--bmg-success)] border-[var(--bmg-success)]/30 bg-[var(--bmg-success)]/5 font-semibold' 
                    : 'text-[var(--bmg-text-muted)] border-[var(--bmg-border)] hover:border-[var(--bmg-text-secondary)] hover:text-[var(--bmg-text-primary)]'
              }`}
            >
              <st.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-mono tracking-wider">{st.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step Panel Contents */}
      <div className="min-h-[380px] bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded-lg p-5 relative">
        
        {/* Step 1: Script Analysis */}
        {activeStep === 0 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 1: NARRATIVE STRUCTURAL ANALYSIS</h3>
                <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">AI reads movie transcripts, separates scene structures, and isolates active speaking registers.</p>
              </div>
              <span className="text-[9px] bg-[var(--bmg-success)]/10 text-[var(--bmg-success)] font-bold px-2 py-0.5 rounded border border-[var(--bmg-success)]/20 uppercase">COMPLETED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded">
                <strong className="block text-[9px] text-[var(--bmg-text-muted)] uppercase tracking-wider">Detected Speakers</strong>
                <div className="mt-2.5 space-y-1.5">
                  {['Christian Sterling (24 lines)', 'Elena Rostova (15 lines)', 'Marcus Vance (8 lines)'].map(char => (
                    <div key={char} className="text-xs text-[var(--bmg-text-primary)]">• {char}</div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded">
                <strong className="block text-[9px] text-[var(--bmg-text-muted)] uppercase tracking-wider">Genre Parameters</strong>
                <div className="mt-2.5 text-xs font-mono text-[var(--bmg-warning)]">
                  <div>Crime/Film Noir Blueprint</div>
                  <div className="mt-1.5 text-[10px] text-[var(--bmg-text-secondary)] leading-relaxed">Emotional spikes detected during Waterfront Scene 2 standoff.</div>
                </div>
              </div>
              <div className="p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded">
                <strong className="block text-[9px] text-[var(--bmg-text-muted)] uppercase tracking-wider">Constraint Diagnosis</strong>
                <div className="mt-2.5 text-xs text-[var(--bmg-success)] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--bmg-success)]" />
                  <span>Script spacing conforms to standard boundaries.</span>
                </div>
              </div>
            </div>

            <button onClick={() => setActiveStep(1)} className="mt-6 py-2 px-4 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5 ml-auto">
              Proceed to Casting
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Actor Casting */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 2: BIOMETRIC DNA CASTING LOCK</h3>
              <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">Bind screen characters to specific virtual actors. Physical traits and registers persist automatically.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {casting.map(c => (
                <div key={c.character} className="p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded relative">
                  <span className="absolute top-3 right-3 text-[10px] font-mono text-[var(--bmg-accent-primary)] font-bold uppercase">Locked</span>
                  <span className="text-[9px] font-mono text-[var(--bmg-text-muted)] font-bold uppercase">Role: {c.character}</span>
                  <div className="font-bold text-sm text-[var(--bmg-text-primary)] mt-1.5">{c.actorName}</div>
                  <div className="mt-3.5 text-[10px] text-[var(--bmg-text-secondary)] space-y-1">
                    <div>• Vocal Vector: Baritone/Raspy</div>
                    <div>• Motion Blueprint: Steady focus</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-[11px] text-[var(--bmg-text-muted)]">All biometric talent codes are saved in the project manifest.</span>
              <button onClick={() => setActiveStep(2)} className="py-2 px-4 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5">
                Proceed to Scene Gen
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Scene Gen */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 3: MULTI-SCENE STORYBOARD GENERATION</h3>
              <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">Renders architectural layout sketches representing the narrative camera directions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {['Panel 1: Office Desk Ambush', 'Panel 2: Standoff at the Water Edge', 'Panel 3: Mainframe Decryption Run'].map((lbl, idx) => (
                <div key={idx} className="p-2.5 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded">
                  <div className="aspect-[1.5] border border-[var(--bmg-border-light)] bg-[#111114] rounded overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-${[
                      '1485846234645-a62644f84728',
                      '1536440136628-849c177e76a1',
                      '1507679799987-c73779587ccf'
                    ][idx]}?auto=format&fit=crop&w=300&q=80`} alt="Scene Sketch" className="w-full h-full object-cover filter grayscale contrast-125 brightness-75" />
                  </div>
                  <div className="mt-2.5 font-bold text-xs text-[var(--bmg-text-primary)] leading-tight">{lbl}</div>
                  <span className="block text-[9px] text-[var(--bmg-text-muted)] mt-1 font-mono">Panel frame {idx + 1} locked</span>
                </div>
              ))}
            </div>

            <button onClick={() => setActiveStep(3)} className="mt-6 py-2 px-4 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5 ml-auto">
              Proceed to Lighting
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 4: Staging & Lighting */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 4: SHADOW COMPOSITION & CAMERA DIRECTIVES</h3>
              <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">Adjust high-contrast lighting values, lens focal ranges, and stage blocking directives.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded space-y-3">
                <h4 className="font-bold text-[10px] text-[var(--bmg-text-secondary)] uppercase tracking-wider">Staging Lighting Presets</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border border-[var(--bmg-accent-primary)]/40 bg-[var(--bmg-accent-primary)]/5 rounded font-bold text-center text-[var(--bmg-accent-primary)]">Chiaroscuro (Noir Contrast)</div>
                  <div className="p-2 border border-[var(--bmg-border)] rounded text-center text-[var(--bmg-text-muted)]">Electric Cyber Saturated</div>
                  <div className="p-2 border border-[var(--bmg-border)] rounded text-center text-[var(--bmg-text-muted)]">1975 Rough Monochrome</div>
                  <div className="p-2 border border-[var(--bmg-border)] rounded text-center text-[var(--bmg-text-muted)]">Muted Vintage Sepia</div>
                </div>
              </div>

              <div className="p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded space-y-2">
                <h4 className="font-bold text-[10px] text-[var(--bmg-text-secondary)] uppercase tracking-wider">Scene Staging Directives</h4>
                <p className="text-xs text-[var(--bmg-text-secondary)] leading-relaxed font-mono">
                  "Slate moves slowly from stage left, exhaling smoke. Camera is locked on a 28mm wide angle frame, highlighting the sharp shadows cast on the metallic blinds."
                </p>
              </div>
            </div>

            <button onClick={() => setActiveStep(4)} className="mt-6 py-2 px-4 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5 ml-auto">
              Proceed to Vocal Sync
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 5: Sound & Voice Sync */}
        {activeStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 5: VOCAL CLONING & AUDIO MULTIPLEXING</h3>
              <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">Translates script cues into high-fidelity voice cloned dialogue and matches wave dynamics with phoneme tracking.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              <div className="md:col-span-5 p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded space-y-3">
                <button 
                  onClick={handleRunSync} 
                  disabled={synthesizing}
                  className="w-full py-2.5 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center justify-center gap-1.5"
                >
                  {synthesizing ? "Synthesizing Vocal Blocks..." : "Run Audio-to-Phoneme Sync"}
                </button>
                <div className="p-3 bg-[var(--bmg-bg-tertiary)] rounded border border-dashed border-[var(--bmg-border-light)] text-[10px] text-[var(--bmg-text-muted)] leading-relaxed">
                  Consolidates script dialog data with active character acoustic blueprints and foley ambience loop blocks.
                </div>
              </div>

              <div className="md:col-span-7 bg-[#0a0a0c] text-[var(--bmg-success)] p-4 rounded border border-[var(--bmg-border)] min-h-[140px] font-mono text-[10px] space-y-1.5 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-[var(--bmg-text-muted)] italic">[Processing console offline. Trigger sync above to start...]</div>
                ) : (
                  logs.map((log, idx) => <div key={idx}>{log}</div>)
                )}
              </div>
            </div>

            {synced && (
              <button onClick={() => setActiveStep(5)} className="mt-6 py-2 px-4 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5 ml-auto animate-pulse">
                Proceed to Grading
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Step 6: Grading & FX */}
        {activeStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 6: CINEMATIC LUT & COLOR DESIGN</h3>
              <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">Apply a specialized color lookup table to replicate standard high-contrast theatrical styles.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {['Anamorphic Noir LUT', 'Cobalt Saturated LUT', 'East Coast Silver Bleach', 'Muted Copper Sepia'].map(filter => {
                const isSel = filter === activeFilter;
                return (
                  <div 
                    key={filter} 
                    onClick={() => setActiveFilter(filter)}
                    className={`p-4 border rounded cursor-pointer text-center font-bold text-xs transition-all ${
                      isSel 
                        ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-hover)] text-[var(--bmg-text-primary)] shadow-md shadow-[var(--bmg-accent-glow)] scale-[1.03]' 
                        : 'border-[var(--bmg-border)] bg-[var(--bmg-bg-secondary)] text-[var(--bmg-text-secondary)] hover:bg-[var(--bmg-bg-hover)]'
                    }`}
                  >
                    <span className="block text-base mb-1.5">🎨</span>
                    <div>{filter}</div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setActiveStep(6)} className="mt-6 py-2 px-4 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5 ml-auto">
              Proceed to Export
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 7: Export Master */}
        {activeStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[var(--bmg-accent-primary)] uppercase tracking-wider">STEP 7: COMPILE & BAKE CINEMATIC PACK</h3>
              <p className="text-[11px] text-[var(--bmg-text-secondary)] italic mt-1">Consolidate all timelines, audio automations, and grading LUTs into a master cinema file.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              <div className="md:col-span-5 p-4 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] rounded space-y-3">
                <button 
                  onClick={handleRunExport}
                  disabled={isExporting || exportComplete}
                  className="w-full py-2.5 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isExporting ? 'Encoding master frames...' : exportComplete ? 'Render Finished!' : 'Start Master Video Compile'}
                </button>
                {isExporting && (
                  <div className="h-1.5 w-full bg-black rounded overflow-hidden">
                    <div className="h-full bg-[var(--bmg-accent-primary)] animate-pulse w-[45%]"></div>
                  </div>
                )}
                {exportComplete && (
                  <button 
                    onClick={() => alert("Successfully downloaded Waterfront_Syndicate_Master.mp4! Cinema quality asset compiled.")}
                    className="w-full bg-[var(--bmg-success)] text-[#0e0e10] text-xs font-black py-2.5 px-4 rounded flex items-center justify-center gap-1.5 uppercase hover:opacity-90"
                  >
                    <Download className="w-4 h-4" />
                    Download MP4 (4K H.264)
                  </button>
                )}
              </div>

              <div className="md:col-span-7 flex items-center justify-center">
                <div className="w-full max-w-sm border border-[var(--bmg-border-light)] rounded-lg bg-[#0e0e10] aspect-[1.7] relative overflow-hidden">
                  {exportComplete ? (
                    <>
                      <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover filter contrast-125 brightness-75 grayscale" alt="Rendering" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-[var(--bmg-accent-primary)] p-2.5 rounded-full cursor-pointer hover:scale-105 transition-transform text-[#0e0e10]">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--bmg-text-muted)] text-xs italic p-4 text-center">
                      {isExporting ? (
                        <>
                          <RefreshCw className="w-6 h-6 text-[var(--bmg-accent-primary)] animate-spin mb-2" />
                          <span>Baking master frames and audio stems...</span>
                        </>
                      ) : (
                        <span>Ready to build master timeline frames into highly synchronized theatrical MP4.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
