import React, { useState } from 'react';
import { FileText, Sparkles, TrendingUp, DollarSign, Camera, Check, AlertTriangle, Play, HelpCircle, Save } from 'lucide-react';

export interface ScriptScene {
  id: string;
  title: string;
  wordCount: number;
  content: string;
  characters: string[];
  emotion: string;
  pacing: 'Fast' | 'Medium' | 'Slow';
  lighting: string;
  cameraAngle: string;
  blocking: string;
  sketchUrl?: string;
}

const PRESET_SCRIPTS = [
  {
    name: "The Waterfront Syndicate: Dark Waters",
    genre: "Crime / Film Noir",
    text: `SCENE 1: INT. COLD WAREHOUSE OFFICE - NIGHT
The cold wind rattles the steel window frames. SLATE rests his boots on the metal desk, slowly exhaling a cloud of cigar smoke.
SLATE
Listen, sister. This syndicate doesn't play nice. If you want those blueprints back, you pay the toll.

SCENE 2: EXT. INDUSTRIAL WATERFRONT - DAWN
The harbor fog is as thick as oil. ELENA waits near the crane, pulling her coat tight against the damp morning air. Marcus emerges from the mist.
ELENA
Did you secure the decryption key?
MARCUS
(Low, gravelly tone)
No, but I brought a warning. Walk away, Elena. This run is burned.

SCENE 3: INT. ENCRYPTED DATA HUB - NIGHT
Pulsing cyan servers illuminate the clean laboratory. JAX frantically punches code into an active workstation console. Slate keeps watch at the steel fire door.
JAX
We're in. The core mainframe is bypassing. Slate, seal that door!
SLATE
Make it quick, Jax! Security forces are coming up the elevator shafts!`
  },
  {
    name: "Chroma Horizon: Kinetic Escape",
    genre: "Sci-Fi / Action",
    text: `SCENE 1: INT. CHROMA BAR - MIDNIGHT
Pulsing synth bass rattles the synthetic glass counter. Electric blue neon arches over the bar. PENNY sits at the corner stool, checking her tactical wrist unit.
PENNY
The defense drones have a systematic reset interval at the side ventilation.
JAX
Perfect. Slate, you disable the laser sweep while Marcus intercepts the escort cruiser.

SCENE 2: EXT. SKYLINE ROOFTOP - NIGHT
Torrential rain drenches the high skyline. Slate dashes across the metal scaffolding clutching the encrypted data drive. Sirens sound below.
SLATE
Whoa! Marcus, I need an extraction route now!
MARCUS
Jump, Slate! The flight deck is in position!`
  }
];

export const ScriptRoom: React.FC<{
  assignedActors?: string[];
}> = ({ assignedActors = [] }) => {
  const [scriptText, setScriptText] = useState(PRESET_SCRIPTS[0].text);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  // Analysis results
  const [detectedCharacters, setDetectedCharacters] = useState<string[]>(['SLATE', 'ELENA', 'MARCUS', 'JAX']);
  const [scenes, setScenes] = useState<ScriptScene[]>([
    {
      id: 'sc_1',
      title: 'SCENE 1: INT. COLD WAREHOUSE OFFICE - NIGHT',
      wordCount: 44,
      content: 'The cold wind rattles the steel window frames. SLATE rests his boots on the metal desk, slowly exhaling a cloud of cigar smoke.\nSLATE\nListen, sister. This syndicate doesn\'t play nice. If you want those blueprints back, you pay the toll.',
      characters: ['SLATE'],
      emotion: 'Tense / Brooding',
      pacing: 'Slow',
      lighting: 'Chiaroscuro, high-contrast single key light with cyan highlights.',
      cameraAngle: 'Low-angle medium close-up tracking Slate\'s smoke plume.',
      blocking: 'Slate leans back in metal chair, feet crossed on desk. Leans forward on dialogue.',
      sketchUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sc_2',
      title: 'SCENE 2: EXT. INDUSTRIAL WATERFRONT - DAWN',
      wordCount: 46,
      content: 'The harbor fog is as thick as oil. ELENA waits near the crane, pulling her coat tight against the damp morning air. Marcus emerges from the mist.\nELENA\nDid you secure the decryption key?\nMARCUS\nNo, but I brought a warning. Walk away, Elena. This run is burned.',
      characters: ['ELENA', 'MARCUS'],
      emotion: 'Cold / Melancholic',
      pacing: 'Medium',
      lighting: 'Cold overcast morning, high ambient diffusion.',
      cameraAngle: 'Symmetrical extreme wide shot, characters framed as silhouettes in fog.',
      blocking: 'Elena paces nervously. Marcus materializes slowly from stage right, hands in pockets.',
      sketchUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sc_3',
      title: 'SCENE 3: INT. ENCRYPTED DATA HUB - NIGHT',
      wordCount: 48,
      content: 'Pulsing cyan servers illuminate the clean laboratory. JAX frantically punches code into an active workstation console. Slate keeps watch at the steel fire door.\nJAX\nWe\'re in. The core mainframe is bypassing. Slate, seal that door!\nSLATE\nMake it quick, Jax! Security forces are coming up the elevator shafts!',
      characters: ['JAX', 'SLATE'],
      emotion: 'Kinetic / Urgency',
      pacing: 'Fast',
      lighting: 'Saturated neon-blue backlight with flickering server rack status LEDs.',
      cameraAngle: 'Dynamic low Dutch angle panning rapidly from terminal to door.',
      blocking: 'Jax types frantically with both hands. Slate crouches by fire door with sidearm drawn.',
      sketchUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const [plotContinuity, setPlotContinuity] = useState(96);
  const [budgetEstimate, setBudgetEstimate] = useState(145000);
  const [genreCompliance, setGenreCompliance] = useState('98% Cinematic Standard');

  const handleLoadPreset = (idx: number) => {
    setSelectedPreset(idx);
    setScriptText(PRESET_SCRIPTS[idx].text);
    setAnalyzed(false);
  };

  const runAnalysisSupervisor = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const regex = /(SCENE\s+\d+:?[\s\S]*?)(?=(?:SCENE\s+\d+:?)|$)/gi;
      const matches = scriptText.match(regex) || [scriptText];
      
      const parsedScenes: ScriptScene[] = matches.map((matchText, i) => {
        const lines = matchText.trim().split('\n');
        const titleLine = lines[0] || `SCENE ${i + 1}`;
        const wordCount = matchText.trim().split(/\s+/).length;
        
        const sceneChars: string[] = [];
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !trimmed.startsWith('SCENE') && !trimmed.startsWith('INT.') && !trimmed.startsWith('EXT.')) {
            sceneChars.push(trimmed);
          }
        });

        const pacingOptions: ('Fast' | 'Medium' | 'Slow')[] = ['Slow', 'Medium', 'Fast'];
        const emotions = ['Suspenseful', 'Dramatic', 'Comedic', 'Explosive', 'Quiet', 'Climactic'];

        return {
          id: `sc_custom_${i}`,
          title: titleLine.substring(0, 50) + (titleLine.length > 50 ? '...' : ''),
          wordCount,
          content: matchText,
          characters: Array.from(new Set(sceneChars)),
          emotion: emotions[i % emotions.length],
          pacing: pacingOptions[i % pacingOptions.length],
          lighting: i % 2 === 0 ? 'High-contrast shadow design, cold keylight' : 'Diffuse overcast daylight, industrial amber tone',
          cameraAngle: i % 2 === 0 ? 'Tracking medium-wide shot, steadycam' : 'Tight over-the-shoulder conversation',
          blocking: 'Actors take deliberate marks to maintain crisp, high-fidelity lighting shadows.',
          sketchUrl: `https://images.unsplash.com/photo-${[
            '1485846234645-a62644f84728',
            '1536440136628-849c177e76a1',
            '1507679799987-c73779587ccf'
          ][i % 3]}?auto=format&fit=crop&w=300&q=80`
        };
      });

      const allChars: string[] = [];
      scriptText.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !trimmed.startsWith('SCENE') && !trimmed.startsWith('INT.') && !trimmed.startsWith('EXT.')) {
          allChars.push(trimmed);
        }
      });

      setDetectedCharacters(Array.from(new Set(allChars)));
      setScenes(parsedScenes);
      setPlotContinuity(Math.floor(Math.random() * 10) + 88);
      setBudgetEstimate(parsedScenes.length * 48000 + (allChars.length * 22000));
      setGenreCompliance('95% Noir Cinematic Compliance');
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-4">
      {/* Editor & Presets */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        <div className="bmg-card p-4">
          <h3 className="text-xs font-bold tracking-wider text-[var(--bmg-accent-primary)] uppercase mb-3 flex items-center gap-2">
            <span>🎬 SCREENPLAY CONSOLE</span>
          </h3>
          <p className="text-[11px] text-[var(--bmg-text-secondary)] mb-4 italic leading-relaxed">
            Draft scripts using industrial screenplay standards. The analyzer will monitor real-time character dynamics, scene word boundaries, and staging metrics.
          </p>

          <div className="flex flex-col gap-2 mb-4">
            <span className="text-[9px] font-bold text-[var(--bmg-text-muted)] uppercase tracking-wider">Select Baseline Script</span>
            <div className="flex flex-col gap-1.5">
              {PRESET_SCRIPTS.map((script, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleLoadPreset(idx)}
                  className={`text-left p-2.5 border rounded text-xs transition-all flex justify-between items-center ${
                    selectedPreset === idx 
                      ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-tertiary)] text-[var(--bmg-text-primary)] font-semibold' 
                      : 'border-[var(--bmg-border)] bg-[var(--bmg-bg-secondary)] text-[var(--bmg-text-secondary)] hover:bg-[var(--bmg-bg-hover)]'
                  }`}
                >
                  <span>{script.name}</span>
                  <span className="text-[9px] bg-[var(--bmg-bg-hover)] text-[var(--bmg-accent-primary)] px-2 py-0.5 rounded border border-[var(--bmg-border)]">{script.genre}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--bmg-text-muted)]">Edit Script Area (Standard Courier Layout)</label>
            <textarea 
              value={scriptText}
              onChange={e => { setScriptText(e.target.value); setAnalyzed(false); }}
              placeholder="Draft screenplay..."
              className="w-full min-h-[340px] bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded-md p-3 text-xs font-mono leading-relaxed text-[var(--bmg-text-primary)] outline-none focus:border-[var(--bmg-accent-primary)]"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            />
          </div>

          <button 
            onClick={runAnalysisSupervisor}
            disabled={isAnalyzing}
            className="mt-4 w-full py-3 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Processing Screenplay Diagnostics...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Screenplay Elements
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis & Visual Storyboard */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        {analyzed ? (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            {/* AI Supervisor Report Card */}
            <div className="bmg-card p-5 border-[var(--bmg-accent-primary)]">
              <h4 className="text-xs font-black tracking-wider text-[var(--bmg-accent-primary)] mb-4 uppercase flex items-center gap-1.5">
                <span>🤖 AI SCREENPLAY AUDIT</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border)] rounded">
                  <span className="block text-[9px] text-[var(--bmg-text-secondary)] font-bold uppercase">Plot Continuity</span>
                  <span className="text-lg font-black text-[var(--bmg-success)] mt-1 block">{plotContinuity}%</span>
                  <span className="block text-[8px] text-[var(--bmg-text-muted)] mt-0.5">High Narrative Lock</span>
                </div>
                <div className="p-3 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border)] rounded">
                  <span className="block text-[9px] text-[var(--bmg-text-secondary)] font-bold uppercase">Est. Shoot Cost</span>
                  <span className="text-lg font-black text-[var(--bmg-accent-primary)] mt-1 block">${budgetEstimate.toLocaleString()}</span>
                  <span className="block text-[8px] text-[var(--bmg-text-muted)] mt-0.5">Vocal & Talent fees</span>
                </div>
                <div className="p-3 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border)] rounded">
                  <span className="block text-[9px] text-[var(--bmg-text-secondary)] font-bold uppercase">Pacing Register</span>
                  <span className="text-lg font-black text-purple-400 mt-1 block">Kinetic</span>
                  <span className="block text-[8px] text-[var(--bmg-text-muted)] mt-0.5">Optimized beats</span>
                </div>
                <div className="p-3 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border)] rounded">
                  <span className="block text-[9px] text-[var(--bmg-text-secondary)] font-bold uppercase">Noir Adherence</span>
                  <span className="text-[10px] font-bold text-[var(--bmg-warning)] mt-1 block leading-tight">{genreCompliance}</span>
                  <span className="block text-[8px] text-[var(--bmg-text-muted)] mt-0.5">Atmospheric Match</span>
                </div>
              </div>

              {/* Character assignment info */}
              <div className="mt-4 p-3 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border)] rounded flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--bmg-text-secondary)] uppercase tracking-wider mr-2">Casting Characters Extracted:</span>
                {detectedCharacters.map(char => (
                  <span key={char} className="px-2.5 py-0.5 bg-[var(--bmg-bg-secondary)] text-[var(--bmg-accent-primary)] text-[9px] font-mono rounded border border-[var(--bmg-border-light)] uppercase font-bold tracking-wider">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Scene-by-scene Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-wider text-[var(--bmg-text-primary)] uppercase px-1">
                🎬 VISUAL DIRECTIVES & SCENE BOARDS
              </h4>

              <div className="flex flex-col gap-4">
                {scenes.map((scene, index) => {
                  const limitBreaker = scene.wordCount > 66;

                  return (
                    <div key={scene.id} className="bmg-card p-4 bg-[var(--bmg-bg-secondary)] flex flex-col md:flex-row gap-5">
                      {/* Storyboard Panel Illustration */}
                      <div className="md:w-52 shrink-0 flex flex-col gap-2">
                        <div className="relative border border-[var(--bmg-border-light)] rounded overflow-hidden aspect-[1.6] bg-[var(--bmg-bg-tertiary)]">
                          <img src={scene.sketchUrl} alt="Storyboard scene" className="w-full h-full object-cover filter grayscale brightness-75 contrast-125" />
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#0e0e10] text-[var(--bmg-accent-primary)] text-[8px] font-bold uppercase rounded border border-[var(--bmg-border-light)]">
                            Board {index + 1}
                          </div>
                        </div>
                        <div className="bg-[var(--bmg-bg-tertiary)] p-2 border border-[var(--bmg-border-light)] rounded text-[9px] font-mono leading-relaxed space-y-1 text-[var(--bmg-text-secondary)]">
                          <div><strong className="text-[var(--bmg-text-primary)]">Camera:</strong> {scene.cameraAngle}</div>
                          <div><strong className="text-[var(--bmg-text-primary)]">Lighting:</strong> {scene.lighting}</div>
                          <div><strong className="text-[var(--bmg-text-primary)]">Staging:</strong> {scene.blocking}</div>
                        </div>
                      </div>

                      {/* Scene Text & Analysis */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-xs text-[var(--bmg-accent-primary)] tracking-wide">{scene.title}</h5>
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${
                              limitBreaker ? 'bg-red-500/10 text-[var(--bmg-error)] border-red-500/30' : 'bg-green-500/10 text-[var(--bmg-success)] border-green-500/30'
                            }`}>
                              {scene.wordCount} words
                            </span>
                          </div>
                          
                          <p className="text-[11px] font-mono text-[var(--bmg-text-secondary)] bg-[var(--bmg-bg-tertiary)] p-2.5 rounded border border-dashed border-[var(--bmg-border-light)] leading-relaxed whitespace-pre-wrap max-h-[105px] overflow-y-auto" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                            {scene.content}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[var(--bmg-border-light)] flex justify-between items-center flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-[var(--bmg-text-muted)] uppercase">Atmosphere:</span>
                            <span className="text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                              {scene.emotion}
                            </span>
                            <span className="text-[9px] font-bold bg-[var(--bmg-accent-primary)]/10 text-[var(--bmg-warning)] border border-amber-500/20 px-2 py-0.5 rounded">
                              {scene.pacing}
                            </span>
                          </div>

                          {limitBreaker ? (
                            <div className="flex items-center gap-1 text-[var(--bmg-error)] font-bold text-[9px] uppercase tracking-wide">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Scene limit hit (&gt;66 words)
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[var(--bmg-success)] font-bold text-[9px] uppercase tracking-wide">
                              <Check className="w-3.5 h-3.5" />
                              Staging size locked
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bmg-card p-12 bg-[var(--bmg-bg-secondary)] flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3 text-[var(--bmg-accent-primary)]">🤖</span>
            <h3 className="font-bold text-sm text-[var(--bmg-text-primary)] uppercase tracking-wider mb-1">Trigger screenplay analyzer</h3>
            <p className="text-[11px] text-[var(--bmg-text-muted)] max-w-sm">
              The built-in analysis script supervisor checks cinematic compliance, plot pacing markers, character line balances, and production estimates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
