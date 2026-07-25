import React, { useState } from 'react';
import { FileText, Sparkles, Play, Monitor, Check, Plus, RefreshCw, Wand2, Volume2, Save, Download } from 'lucide-react';

export const InfiniteScriptDesk: React.FC = () => {
  const [scriptContent, setScriptContent] = useState<string>(`SCENE 1: INT. HIGH-RISE STUDIO - NIGHT
Rain glistens against the floor-to-ceiling glass panel. SLATE stands near the mixing desk, listening to the reversed tape delay.

SLATE
(Whispering)
The master stems aren't missing. They were encoded into the vinyl pressings.

ELENA enters from the observation booth, folding an encrypted tablet.

ELENA
Then we have less than six hours before the press launch. Can you unlock the sub-bass frequency?

SLATE
I already did. The frequency key is 432 Hertz.`);

  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [teleprompterMode, setTeleprompterMode] = useState<boolean>(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState<number>(2);
  const [activeBeatTab, setActiveBeatTab] = useState<'script' | 'beats' | 'teleprompter'>('script');

  const [beats] = useState([
    { scene: 'SCENE 1', title: 'The Reversed Tape Discovery', emotionalBeat: 'Intrigue / Discovery', keyProp: 'Master Vinyl Pressing' },
    { scene: 'SCENE 2', title: 'The Waterfront Exchange', emotionalBeat: 'High Tension / Suspense', keyProp: 'Encrypted Flash Drive' },
    { scene: 'SCENE 3', title: 'Skyline Extraction', emotionalBeat: 'Climactic Action', keyProp: 'Roli Seaboard Controller' }
  ]);

  const handleAiExpandScene = () => {
    setIsExpanding(true);
    setTimeout(() => {
      const extension = `\n\nSCENE 2: EXT. WATERFRONT DOCK 14 - DAWN
The harbor crane groans in the damp morning breeze. Marcus steps out from behind the shipping containers holding a metallic brief case.

MARCUS
Elena, Slate was right. The frequency key opens the mainframe door. Get inside!`;
      setScriptContent(prev => prev + extension);
      setIsExpanding(false);
    }, 1000);
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5 space-y-5 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <FileText className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                INFINITE AI SCRIPT DESK & BEAT BOARD
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
                HOLLYWOOD FORMAT
              </span>
            </div>
            <p className="text-xs text-gray-400">
              AI screenplay desk with scene beat board, dialogue generator, and teleprompter mode.
            </p>
          </div>
        </div>

        {/* TABS & ACTIONS */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/60 p-1 border border-gray-800 rounded-xl">
            <button
              onClick={() => setActiveBeatTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeBeatTab === 'script' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              SCREENPLAY
            </button>
            <button
              onClick={() => setActiveBeatTab('beats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeBeatTab === 'beats' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              BEAT BOARD
            </button>
            <button
              onClick={() => setActiveBeatTab('teleprompter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeBeatTab === 'teleprompter' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              TELEPROMPTER
            </button>
          </div>
        </div>
      </div>

      {/* SCRIPT EDITOR MODE */}
      {activeBeatTab === 'script' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>HOLLYWOOD COURIER FINAL DRAFT FORMAT</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAiExpandScene}
                disabled={isExpanding}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isExpanding ? 'animate-spin' : ''}`} />
                {isExpanding ? 'EXPANDING SCENE...' : 'AI EXTEND NEXT SCENE'}
              </button>
            </div>
          </div>

          <textarea
            value={scriptContent}
            onChange={e => setScriptContent(e.target.value)}
            rows={12}
            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-amber-200/90 leading-relaxed focus:border-amber-500 outline-none resize-none shadow-inner custom-scrollbar"
          />
        </div>
      )}

      {/* BEAT BOARD MODE */}
      {activeBeatTab === 'beats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {beats.map((beat, i) => (
            <div key={i} className="bg-[#161722] border border-gray-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">{beat.scene}</span>
              <h4 className="text-sm font-bold text-white">{beat.title}</h4>
              <p className="text-xs text-gray-400"><strong className="text-gray-300">Emotional Arc:</strong> {beat.emotionalBeat}</p>
              <div className="text-[10px] font-mono text-amber-400/80 bg-black/40 p-1.5 rounded border border-gray-850">
                Key Prop: {beat.keyProp}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TELEPROMPTER MODE */}
      {activeBeatTab === 'teleprompter' && (
        <div className="bg-black border border-amber-500/40 rounded-xl p-6 text-center space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-amber-400">
            <span>TELEPROMPTER PREVIEW</span>
            <span>SPEED: {teleprompterSpeed}x</span>
          </div>

          <div className="h-48 overflow-y-auto font-mono text-xl sm:text-2xl font-bold text-amber-300 leading-loose p-4 custom-scrollbar">
            {scriptContent}
          </div>
        </div>
      )}
    </div>
  );
};
