import { Header } from "@/components/Header";
import { useGetEngines } from "@workspace/api-client-react";
import { useState } from "react";
import { Zap, Activity, Filter, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// Mapping icons to engines visually
const ENGINE_ICONS: Record<string, string> = {
  "MafiaScore": "🎯",
  "Gospel": "🙏",
  "Jazz": "🎷",
  "Lo-Fi": "☁️",
  "Trap": "🔊",
  "Orchestral": "🎻",
  "R&B": "🎵",
  "Boom Bap Cinema": "🎬"
};

export default function Engines() {
  const { data: engines, isLoading } = useGetEngines();
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <Header title="ENGINES" subtitle="Dedicated generative score models." />
      
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[120px] bg-card rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {engines?.map(engine => {
              const isExpanded = expandedEngine === engine.id;
              
              if (isExpanded) {
                return (
                  <div key={engine.id} className="col-span-2 bg-card border border-primary rounded-xl overflow-hidden shadow-[0_0_15px_rgba(240,136,62,0.1)]">
                    <div className="p-4 border-b border-border bg-gradient-to-r from-card to-primary/10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ENGINE_ICONS[engine.name] || "⚡"}</span>
                          <h3 className="font-bold text-lg text-foreground">{engine.name}</h3>
                        </div>
                        <button 
                          onClick={() => setExpandedEngine(null)}
                          className="text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 bg-background rounded"
                        >
                          CLOSE
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{engine.description}</p>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Emotion Target</label>
                          <select className="w-full bg-background border border-border rounded p-2 text-sm">
                            {engine.emotions.map(e => <option key={e} value={e}>{e}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Root Key</label>
                          <input type="text" defaultValue={engine.defaultKey || "C Min"} className="w-full bg-background border border-border rounded p-2 text-sm" />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground">
                          <Layers size={14} /> EXPECTED LAYERS
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Drums", "Sub Bass", "Main Chords", "Counter Melody", "Texture"].map(l => (
                            <span key={l} className="text-[10px] bg-background px-2 py-1 rounded border border-border">{l}</span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all min-h-[44px]">
                        <Zap size={16} fill="currentColor" /> Generate with {engine.name}
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={engine.id}
                  onClick={() => setExpandedEngine(engine.id)}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-accent hover:border-primary/50 transition-all min-h-[120px]"
                >
                  <span className="text-3xl">{ENGINE_ICONS[engine.name] || "⚡"}</span>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{engine.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{engine.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
