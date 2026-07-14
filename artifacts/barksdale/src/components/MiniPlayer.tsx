import { Play, Pause, Square, Repeat } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const { isPlaying, currentTrack, loop, toggleLoop, pause, playPreview, stop } = useAudio();

  if (!currentTrack && !isPlaying) return null;

  return (
    <div className="fixed bottom-[60px] left-0 right-0 h-[50px] bg-secondary border-t border-border z-40 flex items-center justify-between px-4 max-w-[480px] mx-auto glass-panel">
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        {/* Animated Waveform */}
        <div className="flex items-end h-4 gap-[2px]">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-1 bg-primary rounded-t-sm",
                isPlaying ? "animate-pulse" : ""
              )}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '20%',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
        <div className="truncate text-sm font-medium text-foreground">
          {currentTrack || "Playing..."}
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button 
          onClick={toggleLoop}
          className={cn("p-2 transition-colors", loop ? "text-primary" : "text-muted-foreground")}
        >
          <Repeat size={16} />
        </button>
        <button 
          onClick={isPlaying ? pause : () => currentTrack && playPreview(currentTrack)}
          className="p-2 text-foreground"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </button>
        <button 
          onClick={stop}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Square size={16} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
