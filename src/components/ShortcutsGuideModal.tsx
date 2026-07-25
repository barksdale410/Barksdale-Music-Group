import React, { useState } from 'react';
import { Keyboard, X, Search, Sparkles, Play, Disc, Film, Sliders, Music } from 'lucide-react';

interface ShortcutItem {
  category: string;
  keys: string[];
  description: string;
}

export const ShortcutsGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    // PLAYBACK & TRANSPORT
    { category: 'Transport', keys: ['Space'], description: 'Play / Pause DAW Master Transport' },
    { category: 'Transport', keys: ['R'], description: 'Toggle Master Multitrack Recording Mode' },
    { category: 'Transport', keys: ['Enter'], description: 'Return Transport Head to 00:00:00' },
    { category: 'Transport', keys: ['L'], description: 'Toggle Timeline Seamless Loop Region' },

    // EDITING & UNDO/REDO
    { category: 'Editing', keys: ['Ctrl', 'Z'], description: 'Undo Last Action / Audio Edit' },
    { category: 'Editing', keys: ['Ctrl', 'Y'], description: 'Redo Last Undone Action' },
    { category: 'Editing', keys: ['Ctrl', 'Shift', 'Z'], description: 'Alternative Redo Command' },
    { category: 'Editing', keys: ['Delete'], description: 'Remove Selected Stem Track / Clip' },
    { category: 'Editing', keys: ['Ctrl', 'A'], description: 'Select All Active Audio Stems' },

    // STUDIO & WORKFLOW
    { category: 'Studio', keys: ['M'], description: 'Mute Selected Audio Channel' },
    { category: 'Studio', keys: ['S'], description: 'Solo Selected Audio Channel' },
    { category: 'Studio', keys: ['G'], description: 'Open Genre Soundscape Selector' },
    { category: 'Studio', keys: ['E'], description: 'Open High-Res Universal Master Exporter' },
    { category: 'Studio', keys: ['F'], description: 'Toggle Studio FX Effect Rack Panel' },
    { category: 'Studio', keys: ['C'], description: 'Open Live Collaboration Desk' },

    // VIDEO STUDIO & COSMO 3
    { category: 'Video Studio', keys: ['Shift', 'P'], description: 'Trigger Cosmo 3 Video Generation' },
    { category: 'Video Studio', keys: ['Shift', 'S'], description: 'Open Google Earth Location Scout' },
    { category: 'Video Studio', keys: ['Shift', 'A'], description: 'Open Character Consistency Actor Studio' },
    { category: 'Video Studio', keys: ['Shift', 'M'], description: 'Switch Aspect Ratio (16:9 / 9:16 Vertical)' }
  ];

  const categories = ['All', 'Transport', 'Editing', 'Studio', 'Video Studio'];

  const filteredShortcuts = shortcuts.filter(s => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keys.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12131c] border border-amber-500/40 rounded-2xl w-full max-w-2xl p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl text-white relative max-h-[85vh] flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-gray-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              DAW & VIDEO STUDIO KEYBOARD SHORTCUTS GUIDE
            </h3>
            <p className="text-xs text-gray-400">
              Master speed shortcuts for rapid composition, arrangement, audio editing, and film production.
            </p>
          </div>
        </div>

        {/* CONTROLS: SEARCH & CATEGORY TABS */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="w-full bg-black border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-black/40 border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SHORTCUTS LIST */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-10 text-xs font-mono text-gray-500">
              No shortcuts found matching "{searchQuery}"
            </div>
          ) : (
            filteredShortcuts.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-gray-850 hover:border-amber-500/30 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
                    {s.category}
                  </span>
                  <span className="text-gray-200 font-medium">{s.description}</span>
                </div>

                <div className="flex items-center gap-1">
                  {s.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-1 bg-gray-900 border border-gray-700 text-amber-300 rounded font-mono text-[10px] shadow-sm font-bold min-w-[24px] text-center"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-900 text-amber-300 rounded">Esc</kbd> or click X to close</span>
          <span className="text-amber-400 font-bold">20+ Production Hotkeys Active</span>
        </div>
      </div>
    </div>
  );
};
