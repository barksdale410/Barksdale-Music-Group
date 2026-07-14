import { Header } from "@/components/Header";
import { useGetUserBeats, useGetCircleOfFifths, useGetChords } from "@workspace/api-client-react";
import { Play, Trash2, Music, Hash } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Library() {
  const { data: beats, isLoading: loadingBeats } = useGetUserBeats();
  const { data: circle } = useGetCircleOfFifths();
  const { data: chords } = useGetChords();
  const { playPreview } = useAudio();
  const [activeTab, setActiveTab] = useState<'beats' | 'reference'>('beats');

  return (
    <div className="flex flex-col h-full">
      <Header title="LIBRARY" subtitle="Your beats and reference material." />
      
      <div className="flex border-b border-border bg-card/30">
        <button 
          onClick={() => setActiveTab('beats')}
          className={cn(
            "flex-1 py-3 text-sm font-bold border-b-2 transition-colors min-h-[44px]",
            activeTab === 'beats' ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          )}
        >
          My Beats
        </button>
        <button 
          onClick={() => setActiveTab('reference')}
          className={cn(
            "flex-1 py-3 text-sm font-bold border-b-2 transition-colors min-h-[44px]",
            activeTab === 'reference' ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          )}
        >
          Quick Reference
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'beats' ? (
          <div className="space-y-3">
            {loadingBeats ? (
               [1,2,3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />)
            ) : beats?.length ? (
              beats.map(beat => (
                <div key={beat.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                  <button 
                    onClick={() => playPreview(beat.name, 'beat')}
                    className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 min-h-[44px]"
                  >
                    <Play size={20} fill="currentColor" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{beat.name}</h4>
                    <div className="text-[10px] text-muted-foreground flex gap-2 mt-1">
                      <span>{beat.key}</span>
                      <span>{beat.bpm} BPM</span>
                    </div>
                    <div className="text-[10px] font-mono text-primary truncate mt-1">
                      {beat.chordProgression}
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Music className="mx-auto text-muted-foreground mb-2" size={24} />
                <p className="text-muted-foreground text-sm">No beats saved yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Circle of Fifths Mock UI */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">Circle of Fifths</h3>
              <div className="aspect-square rounded-full border-4 border-secondary relative flex items-center justify-center bg-background">
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">C</div>
                  <div className="text-xs text-muted-foreground">Am</div>
                </div>
                {/* Normally we'd map circle data here to position elements around a circle */}
                <div className="absolute top-2 text-sm font-bold text-foreground">G</div>
                <div className="absolute bottom-2 text-sm font-bold text-foreground">Gb</div>
                <div className="absolute left-2 text-sm font-bold text-foreground">F</div>
                <div className="absolute right-2 text-sm font-bold text-foreground">D</div>
              </div>
            </div>

            {/* Chord Encyclopedia */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">Chord Encyclopedia</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {chords?.slice(0, 10).map((chord, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary p-2 rounded-lg">
                    <div>
                      <span className="font-bold text-primary">{chord.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">{chord.name}</span>
                    </div>
                    <button 
                      onClick={() => playPreview(chord.symbol, 'chord')}
                      className="text-foreground p-2 bg-background rounded"
                    >
                      <Play size={12} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
