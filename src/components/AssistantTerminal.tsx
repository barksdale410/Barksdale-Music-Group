import React, { useState } from 'react';
import { HelpCircle, Send, Sparkles, Book, Command, User, Film } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  category?: string;
}

const PRESET_QUESTIONS = [
  { text: "What does a Music Supervisor do?", category: "Music" },
  { text: "Who hires the Colorist on set?", category: "Casting" },
  { text: "Show me the workflow from beat creation to Netflix release.", category: "Business" },
  { text: "Suggest actors for a gritty thriller role.", category: "Casting" },
  { text: "How do I fix a muddy dialog audio track?", category: "Audio" }
];

const RESPONSES_DB: Record<string, string> = {
  "what does a music supervisor do?": `### 🎵 Barksdale Dossier: THE MUSIC SUPERVISOR

The **Music Supervisor** is the central nexus bridging creative direction, post-production audio pipelines, and rights holders.

**Primary Responsibilities:**
*   Sourcing, negotiating, and clearing licensing rights (Publishing + Master) for every song sync.
*   Curating soundtracks and scene playlist catalogs to match director moodboards.
*   Budgeting: structuring clearances to preserve production cash.

**Key Collaborations:**
*   *Director & Producers* (aligning emotional goals).
*   *Soundtrack Editors* (fitting waveforms with movie cue points).
*   *IP Counsel* (ensuring solid indemnification).`,

  "who hires the colorist on set?": `### 🎨 Barksdale Dossier: THE COLORIST PIPELINE

The **Colorist** is contracted during post-production by the **Producer** in close alignment with the **Director of Photography (DP)** and the **Post-Production Supervisor**.

**The Chain of Command:**
1.  **Director of Photography (DP):** Locks the lighting style, cameras, and contrast profiles on set.
2.  **Post-Production Supervisor:** Allocates the DI grading budget and schedules color sessions.
3.  **Colorist:** Controls the final look using color grading suites (such as DaVinci Resolve) to match shot profiles.`,

  "show me the workflow from beat creation to netflix release.": `### 🚀 PIPELINE ROADMAP: AUDIO MASTER TO RENDER RELEASE

Here is the exact technical progression of a master recording from production to final video release:

*   **PHASE 1: THE BEAT RENDER**
    Compile track stems and balance spatial dimensions within the Studio DAW.
*   **PHASE 2: SYNC Clearance**
    Submit high-resolution audio files to Music Supervisors for licensing and master clearances.
*   **PHASE 3: DIALOGUE INTEGRATION**
    Dialogue editors assemble set audio, while the Re-Recording Mixer nests the background theme beneath lines.
*   **PHASE 4: MASTER SOUND FIELD**
    Deliver 7.1.4 Dolby Atmos mix coordinates to guarantee cinematic surround depth.
*   **PHASE 5: TIMED METADATA**
    Bake final timed lyric tags and dynamic video streams into high-resolution ProRes master profiles.
*   **PHASE 6: PLATFORM INGRESS**
    Confirm audio levels meet strict compliance benchmarks (-27 LUFS) before platform release.`,

  "suggest actors for a gritty thriller role.": `### 🎭 BARKSDALE RECOMMENDED CASTING BOARD

For high-contrast dramatic thrillers, we recommend selecting from our master database:

1.  **Christian Sterling (Age 34)**
    *   *Persona:* Stoic protagonist / Suspenseful.
    *   *Vocal Blueprint:* Deep, raspy baritone.
    *   *Aesthetic Specialty:* High-contrast shadows, intense tracking close-ups.
2.  **Elena Rostova (Age 29)**
    *   *Persona:* Sharp, enigmatic detective.
    *   *Vocal Blueprint:* Direct, textured soprano.
    *   *Aesthetic Specialty:* Fast action choreography and long psychological focus.
3.  **Marcus Vance (Age 45)**
    *   *Persona:* Imposing enforcer / Broad presence.
    *   *Vocal Blueprint:* Low bass resonance.
    *   *Aesthetic Specialty:* Intense confrontation shots.`,

  "how do i fix a muddy dialog audio track?": `### 🎚️ RESTORATION DOSSIER: RESOLVING VOCAL MUD

To restore dialogue tracks containing low-end rumble and room resonances, follow this guide:

1.  **THE HIGH-PASS CUT (HPF)**
    Clean frequencies below **80Hz - 100Hz** using a high-slope filter. This instantly clears wind rumbles and hums.
2.  **PARAMETRIC ATTENUATE (300Hz - 450Hz)**
    This frequency region carries physical room mud. Attenuate by **2-4 dB** with a narrow Q-factor.
3.  **PRESENCE BOOST (2.5kHz - 4.5kHz)**
    Human word articulation lives here. Gently boost by **1.5-3 dB** to restore dialogue clarity.
4.  **DE-ESSER ENVELOPE**
    Use a dynamic de-esser focused at **6kHz** to balance harsh sibilant spikes (such as S and T consonants).`
};

export const AssistantTerminal: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      sender: 'assistant', 
      text: "Welcome back. I am Barksdale's Film and Music Production Supervisor. Ask me anything about licensing clearances, audio restoration, staging guidelines, or color grading pipelines." 
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const normalizedQuery = text.trim().toLowerCase();
      let responseText = `### 🤖 Barksdale Mainframe: Directive Logged

Query logged successfully. Query metadata has been verified against our production database.

For complete profiles of "${text}", consult our active **Production Encyclopedia** or casting directories.

*Production Tip:* Always verify that target soundtracks meet platform loudness thresholds (-27 LUFS) during the early stages of post-production.`;

      // Match preset answers
      if (RESPONSES_DB[normalizedQuery]) {
        responseText = RESPONSES_DB[normalizedQuery];
      } else {
        // Soft match search
        const keyMatch = Object.keys(RESPONSES_DB).find(key => normalizedQuery.includes(key) || key.includes(normalizedQuery));
        if (keyMatch) {
          responseText = RESPONSES_DB[keyMatch];
        }
      }

      const assistantMsg: ChatMessage = { sender: 'assistant', text: responseText };
      setMessages(prev => [...prev, assistantMsg]);
    }, 650);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
      {/* Question Presets Column */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bmg-card p-4">
          <h3 className="text-xs font-bold tracking-wider text-[var(--bmg-accent-primary)] uppercase mb-3 flex items-center gap-2">
            <span>💡 CONSULT SUPERVISOR</span>
          </h3>
          <p className="text-[11px] text-[var(--bmg-text-secondary)] mb-4 italic leading-relaxed">
            Select an operational category to retrieve technical guidelines and standard workflows from our engineering logs.
          </p>

          <div className="flex flex-col gap-2">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="text-left p-3 border border-[var(--bmg-border)] rounded bg-[var(--bmg-bg-secondary)] hover:bg-[var(--bmg-bg-hover)] text-xs text-[var(--bmg-text-secondary)] hover:text-[var(--bmg-text-primary)] transition-all font-semibold flex justify-between items-center gap-3"
              >
                <span>"{q.text}"</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-[var(--bmg-bg-tertiary)] text-[var(--bmg-accent-primary)] rounded border border-[var(--bmg-border-light)] font-mono uppercase font-bold shrink-0">{q.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Terminal Chat Box */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bmg-card p-5 flex flex-col justify-between h-[480px]">
          {/* Messages Log area */}
          <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4">
            {messages.map((m, i) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div key={i} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  {isAssistant ? (
                    <div className="max-w-[85%] flex items-start gap-3">
                      <div className="w-8 h-8 bg-[var(--bmg-accent-primary)]/10 text-[var(--bmg-accent-primary)] border border-[var(--bmg-accent-primary)]/30 rounded-full flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                        AI
                      </div>
                      <div className="text-xs text-[var(--bmg-text-primary)] leading-relaxed font-sans max-w-none">
                        <div className="space-y-3 whitespace-pre-wrap">
                          {m.text.split('\n').map((line, idx) => {
                            if (line.startsWith('###')) {
                              return <h4 key={idx} className="font-bold text-xs tracking-wider text-[var(--bmg-accent-primary)] border-b border-[var(--bmg-border-light)] pb-1.5 uppercase mt-3">{line.replace('###', '').trim()}</h4>;
                            }
                            if (line.startsWith('*')) {
                              return <div key={idx} className="pl-4 font-semibold text-[var(--bmg-text-secondary)]">{line.trim()}</div>;
                            }
                            return <p key={idx} className="text-[var(--bmg-text-secondary)] leading-relaxed">{line}</p>;
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[75%] px-3.5 py-2 border border-[var(--bmg-border-light)] rounded-lg bg-[var(--bmg-bg-tertiary)] text-xs font-semibold text-[var(--bmg-text-primary)] font-mono">
                      "{m.text}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form sender input */}
          <div className="flex gap-2 border-t border-[var(--bmg-border)] pt-4">
            <input 
              type="text" 
              placeholder="Query the Barksdale technical logs..."
              className="flex-1 px-3 py-2 text-xs border border-[var(--bmg-border-light)] rounded bg-[var(--bmg-bg-tertiary)] text-[var(--bmg-text-primary)] focus:border-[var(--bmg-accent-primary)] outline-none font-semibold"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(inputValue); }}
            />
            <button 
              onClick={() => handleSendMessage(inputValue)}
              className="p-2 px-3 bg-[var(--bmg-accent-primary)] text-[#0e0e10] hover:opacity-90 rounded flex items-center justify-center transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
