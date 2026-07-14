import { useAppState } from "@/hooks/use-app-state";
import { Header } from "@/components/Header";
import { useGetProducers, useGenerateAdvanced } from "@workspace/api-client-react";
import { Zap, Settings, Play, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/hooks/use-audio";
import { useMemo } from "react";

// Stable drum grid — random seeded once, never during render
const DRUM_PATTERNS: Record<string, number[]> = {
  Kick:   [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
  Snare:  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  "Hi-Hat":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  Perc:   [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0],
};

export default function Studio() {
  const { 
    studioMode, setStudioMode, 
    tempo, setTempo,
    musicalKey, setKey,
    swing, setSwing,
    selectedProducer, setSelectedProducer,
    genre, setGenre,
    emotion, setEmotion,
    chordProgression, setChordProgression,
    daw
  } = useAppState();

  const { data: producers, isLoading } = useGetProducers();
  const generate = useGenerateAdvanced();
  const { playPreview } = useAudio();

  const handleGenerate = () => {
    if (!selectedProducer) return;
    generate.mutate({
      data: {
        producer: selectedProducer,
        genre,
        emotion,
        key: musicalKey,
        bpm: tempo,
        chords: chordProgression || undefined,
        mode: studioMode,
        daw,
        swing
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="BARKSDALE MUSIC GROUP" subtitle="Every creator is a label." />
      
      <div className="p-4 space-y-6">
        {/* Mode Toggle */}
        <div className="flex bg-secondary p-1 rounded-lg">
          <button 
            onClick={() => setStudioMode('ai')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              studioMode === 'ai' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap size={16} /> AI-Assisted
          </button>
          <button 
            onClick={() => setStudioMode('expert')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              studioMode === 'expert' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings size={16} /> Expert Manual
          </button>
        </div>

        {/* Quick Controls */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Tempo</div>
            <input 
              type="number" 
              value={tempo} 
              onChange={e => setTempo(Number(e.target.value))}
              className="bg-transparent w-full text-center text-lg font-bold text-foreground focus:outline-none"
            />
          </div>
          <div className="bg-card border border-border rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Key</div>
            <input 
              type="text" 
              value={musicalKey} 
              onChange={e => setKey(e.target.value)}
              className="bg-transparent w-full text-center text-lg font-bold text-foreground focus:outline-none"
            />
          </div>
          <div className="bg-card border border-border rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Swing %</div>
            <input 
              type="number" 
              value={swing} 
              onChange={e => setSwing(Number(e.target.value))}
              className="bg-transparent w-full text-center text-lg font-bold text-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Producer Selection */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-foreground">Producer Signature</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-[80px] bg-card rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {producers?.slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProducer(p.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left flex flex-col transition-all min-h-[44px]",
                    selectedProducer === p.id 
                      ? "border-primary glow-active bg-primary/5" 
                      : "border-border bg-card hover:bg-accent"
                  )}
                >
                  <span className="font-bold text-sm truncate w-full">{p.name}</span>
                  <span className="text-xs text-muted-foreground mt-1 truncate w-full">{p.style}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Genre & Emotion */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Genre</label>
            <div className="relative">
              <select 
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-card border border-border rounded-lg p-3 text-sm appearance-none min-h-[44px]"
              >
                <option value="Trap">Trap</option>
                <option value="Boom Bap">Boom Bap</option>
                <option value="R&B">R&B</option>
                <option value="Lo-Fi">Lo-Fi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} pointerEvents="none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Emotion</label>
            <div className="relative">
              <select 
                value={emotion}
                onChange={e => setEmotion(e.target.value)}
                className="w-full bg-card border border-border rounded-lg p-3 text-sm appearance-none min-h-[44px]"
              >
                <option value="Dark">Dark & Menacing</option>
                <option value="Soulful">Warm & Soulful</option>
                <option value="Melancholy">Melancholy</option>
                <option value="Triumphant">Triumphant</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} pointerEvents="none" />
            </div>
          </div>
        </div>

        {/* Chords */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">Chord Progression</label>
            <button className="text-[10px] font-bold text-primary uppercase tracking-wider">Load from Library</button>
          </div>
          <input
            type="text"
            value={chordProgression}
            onChange={e => setChordProgression(e.target.value)}
            placeholder="e.g. Cm7, Fm7, Bb7, Ebmaj7"
            disabled={studioMode === 'ai'}
            className="w-full bg-card border border-border rounded-lg p-3 text-sm font-mono min-h-[44px] disabled:opacity-50"
          />
          {studioMode === 'ai' && <p className="text-[10px] text-muted-foreground mt-1 text-right">Auto-generated in AI Mode</p>}
        </div>

        {/* Advanced Panel */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-secondary/50 p-3 border-b border-border flex justify-between items-center">
            <span className="font-bold text-sm tracking-wide">ADVANCED PANEL</span>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Drum Grid */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-bold">16-Step Sequencer</div>
              <div className="space-y-2">
                {Object.entries(DRUM_PATTERNS).map(([drum, pattern]) => (
                  <div key={drum} className="flex items-center gap-2">
                    <span className="w-12 text-[10px] text-muted-foreground">{drum}</span>
                    <div className="flex-1 grid grid-cols-16 gap-[2px]">
                      {pattern.map((active, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-6 rounded-[2px] transition-colors cursor-pointer",
                            active ? "bg-primary glow-active" : "bg-secondary hover:bg-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer Stack */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-bold">Layer Stack</div>
              <div className="space-y-2">
                {[
                  { name: "Soul Choir Stab", gain: -4 },
                  { name: "Rhodes EP", gain: -8 },
                  { name: "String Pad", gain: -12 },
                  { name: "Sub Bass", gain: -2 }
                ].map(layer => (
                  <div key={layer.name} className="flex items-center gap-3 bg-secondary p-2 rounded-lg">
                    <button 
                      onClick={() => playPreview(layer.name)}
                      className="w-8 h-8 rounded bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{layer.name}</div>
                      <div className="text-[10px] text-muted-foreground">Gain: {layer.gain}dB</div>
                    </div>
                    <div className="w-20">
                      <input type="range" className="w-full accent-primary" disabled={studioMode === 'ai'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-warning text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> Turn Auto-Normalize OFF before export
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button 
          onClick={handleGenerate}
          disabled={generate.isPending || !selectedProducer}
          className="w-full bg-primary text-primary-foreground font-bold text-lg p-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 min-h-[56px] mt-4 mb-8 flex justify-center items-center gap-2"
        >
          {generate.isPending ? "GENERATING..." : "GENERATE BEAT"}
          {!generate.isPending && <Zap size={20} fill="currentColor" />}
        </button>

        {generate.isSuccess && generate.data && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-xl mt-4">
            <h3 className="text-success font-bold mb-2">Generation Complete!</h3>
            <p className="text-sm text-foreground mb-4">Progression: {generate.data.chordProgression}</p>
            <button className="w-full bg-card border border-border p-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
              Export for {daw}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
