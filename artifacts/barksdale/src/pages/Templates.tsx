import { Header } from "@/components/Header";
import { useGetTemplates } from "@workspace/api-client-react";
import { Search, Play, Download } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";

export default function Templates() {
  const { data: templates, isLoading } = useGetTemplates();
  const { playPreview } = useAudio();

  return (
    <div className="flex flex-col h-full">
      <Header title="TEMPLATES" subtitle="Pre-configured starting points." />
      
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="search"
            placeholder="Search templates by genre, producer..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors min-h-[44px]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Trap", "R&B", "Boom Bap", "Lo-Fi", "Gospel"].map(genre => (
            <button key={genre} className="px-4 py-1.5 bg-secondary text-xs font-medium rounded-full whitespace-nowrap border border-border hover:bg-card transition-colors">
              {genre}
            </button>
          ))}
        </div>

        <div className="grid gap-4 mt-2">
          {isLoading ? (
            [1,2,3].map(i => <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />)
          ) : (
            templates?.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">by {t.producer}</p>
                  </div>
                  <span className="px-2 py-1 bg-secondary rounded text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {t.genre}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span>{t.bpm} BPM</span>
                  <span>•</span>
                  <span>{t.key}</span>
                  <span>•</span>
                  <span className="text-primary">{t.mood}</span>
                </div>
                
                <div className="text-sm font-mono text-foreground/80 bg-secondary/50 p-2 rounded truncate">
                  {t.chordProgression}
                </div>
                
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={() => playPreview(t.name, 'chord', t.chordProgression)}
                    className="flex-1 bg-secondary hover:bg-accent text-foreground font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 min-h-[44px] transition-colors"
                  >
                    <Play size={16} fill="currentColor" /> Preview
                  </button>
                  <button 
                    className="flex-1 bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 min-h-[44px] hover:brightness-110 transition-all"
                  >
                    <Download size={16} /> Load
                  </button>
                </div>
              </div>
            ))
          )}
          {templates?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No templates found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
