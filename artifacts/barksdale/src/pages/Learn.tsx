import { Header } from "@/components/Header";
import { useGetDailyDrill, useGetHallOfFameTip } from "@workspace/api-client-react";
import { Play, CheckCircle2, ChevronDown, Clock, Lightbulb } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/hooks/use-app-state";

export default function Learn() {
  const { data: drill } = useGetDailyDrill();
  const { data: tip } = useGetHallOfFameTip();
  const [openDaw, setOpenDaw] = useState<string | null>(null);

  const DAWS = ["FL Studio Mobile", "GarageBand iOS", "Ableton Live", "Logic Pro"];

  return (
    <div className="flex flex-col h-full">
      <Header title="LEARN" subtitle="Sharpen your skills." />
      
      <div className="p-4 space-y-6">
        {/* Daily Drill */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="text-primary" size={18} />
            <h2 className="font-bold text-foreground tracking-wide">15-Minute Daily Drill</h2>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-bold text-sm">{drill?.title || "Harmonic Dictation"}</h3>
              <p className="text-xs text-muted-foreground mt-1">Consistency builds intuition.</p>
            </div>
            <div className="divide-y divide-border">
              {drill?.exercises?.map((ex, i) => (
                <div key={i} className="p-3 flex items-start gap-3 hover:bg-accent transition-colors">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">{ex.title}</span>
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                        {ex.duration}m
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{ex.instruction}</p>
                  </div>
                </div>
              ))}
              {(!drill?.exercises || drill.exercises.length === 0) && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Loading drills...
                </div>
              )}
            </div>
            <button className="w-full bg-primary text-primary-foreground font-bold py-3 text-sm min-h-[44px]">
              Start Drill
            </button>
          </div>
        </section>

        {/* Hall of Fame Tip */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-warning" size={18} />
            <h2 className="font-bold text-foreground tracking-wide">Hall of Fame Tip</h2>
          </div>
          <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-[100px] text-primary/5 font-serif select-none">"</div>
            <div className="relative z-10">
              <p className="text-sm italic text-foreground leading-relaxed">
                "{tip?.quote || "The space between the notes is as important as the notes themselves. Don't crowd the frequency spectrum."}"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-primary">— {tip?.producer || "Q-Tip"}</span>
                {tip?.audioExample && (
                  <button className="flex items-center gap-1 text-[10px] bg-background px-2 py-1 rounded-full border border-border">
                    <Play size={10} /> Example
                  </button>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-border/50">
                <h4 className="text-xs font-bold mb-1">How to apply this:</h4>
                <p className="text-[11px] text-muted-foreground">
                  {tip?.tutorial || "Try muting one layer in your densest section. If the groove hits harder, leave it out."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DAW Guides */}
        <section>
          <h2 className="font-bold text-foreground tracking-wide mb-3">DAW Import Guides</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {DAWS.map(daw => (
              <div key={daw}>
                <button 
                  onClick={() => setOpenDaw(openDaw === daw ? null : daw)}
                  className="w-full p-4 flex items-center justify-between bg-transparent hover:bg-accent transition-colors min-h-[44px]"
                >
                  <span className="text-sm font-medium">{daw}</span>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "text-muted-foreground transition-transform duration-200",
                      openDaw === daw ? "rotate-180" : ""
                    )}
                  />
                </button>
                {openDaw === daw && (
                  <div className="p-4 pt-0 text-xs text-muted-foreground bg-accent/20">
                    <ol className="list-decimal pl-4 space-y-2 mt-2">
                      <li>Export MIDI from Barksdale Studio</li>
                      <li>Open {daw} and create new instrument tracks</li>
                      <li>Drag the MIDI files onto the timeline</li>
                      <li>Ensure tempo is set to match the original ({useAppState.getState().tempo} BPM)</li>
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
