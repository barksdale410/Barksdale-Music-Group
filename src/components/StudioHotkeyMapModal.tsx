import React, { useState, useEffect } from 'react';
import { Keyboard, X, Sparkles, Check, Play, Disc, Music, Sliders, Volume2, Shield } from 'lucide-react';
import { toast } from '../lib/toast';

interface HotkeyMapProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction?: (actionId: string) => void;
}

export const StudioHotkeyMapModal: React.FC<HotkeyMapProps> = ({ isOpen, onClose, onTriggerAction }) => {
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      setActivePressedKey(key);

      setTimeout(() => setActivePressedKey(null), 400);

      if (e.code === 'Space') {
        e.preventDefault();
        toast.show('HOTKEY HIT: [SPACE] -> PLAY / PAUSE TRANSPORT TOGGLED', 'info');
        if (onTriggerAction) onTriggerAction('toggle_play');
      } else if (key === 'R') {
        toast.show('HOTKEY HIT: [R] -> MULTITRACK RECORDING ARMED', 'warning');
        if (onTriggerAction) onTriggerAction('arm_record');
      } else if (key === 'M') {
        toast.show('HOTKEY HIT: [M] -> BEAT SEEK METRONOME TOGGLED', 'info');
        if (onTriggerAction) onTriggerAction('toggle_metronome');
      } else if (key === 'C') {
        toast.show('HOTKEY HIT: [C] -> CHORD PROGRESSION EXPORTER OPENED', 'success');
        if (onTriggerAction) onTriggerAction('open_chords');
      } else if (key === 'E') {
        toast.show('HOTKEY HIT: [E] -> PARAMETRIC VISUAL EQ OPENED', 'success');
        if (onTriggerAction) onTriggerAction('open_eq');
      } else if (key === 'S') {
        toast.show('HOTKEY HIT: [S] -> MULTI-GENRE SAMPLE BROWSER OPENED', 'info');
        if (onTriggerAction) onTriggerAction('open_samples');
      } else if (key === 'T') {
        toast.show('HOTKEY HIT: [T] -> TAP TEMPO TRIGGERED', 'info');
        if (onTriggerAction) onTriggerAction('tap_tempo');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onTriggerAction]);

  if (!isOpen) return null;

  const keySections = [
    {
      category: 'TRANSPORT & RECORDING',
      keys: [
        { key: 'SPACE', desc: 'Play / Pause DAW Transport' },
        { key: 'R', desc: 'Arm / Disarm Multitrack Recording' },
        { key: 'M', desc: 'Toggle Beat Seek Metronome' },
        { key: 'T', desc: 'Tap Tempo (Calculate BPM)' }
      ]
    },
    {
      category: 'STUDIO TOOLS & EXPORTERS',
      keys: [
        { key: 'C', desc: 'Chord Progression Exporter & MIDI' },
        { key: 'E', desc: 'Parametric Visual EQ Meter' },
        { key: 'S', desc: 'Multi-Genre Sample Library' },
        { key: 'W', desc: 'Waveform View & Scrubber' }
      ]
    },
    {
      category: 'HUB & ENGINE NAVIGATION',
      keys: [
        { key: '1', desc: 'Aigenio DAW Studio' },
        { key: '2', desc: 'NVIDIA Cosmos 3 Physical AI' },
        { key: '3', desc: 'Google Earth 3D Scout' },
        { key: '4', desc: 'Character Consistency Studio' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-[#0e0f17] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 text-white shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-gray-900 border border-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Keyboard className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
              BARKSDALE STUDIO HOTKEY MAP & HIT KEY ENGINE
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                HIT KEY ACTIVE
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Press any physical key on your keyboard to test real-time hit key detection and trigger studio commands.
            </p>
          </div>
        </div>

        {/* HIT KEY LIVE TESTER BAR */}
        <div className="bg-black/90 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between font-mono text-xs">
          <span className="text-gray-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> PHYSICAL KEY TESTER:
          </span>
          <div className="flex items-center gap-2">
            {activePressedKey ? (
              <span className="px-3 py-1 bg-amber-500 text-black font-black text-sm rounded-lg animate-bounce shadow-lg shadow-amber-500/40">
                [{activePressedKey}] DETECTED
              </span>
            ) : (
              <span className="text-gray-500 italic">Press any physical key (e.g. Space, R, M, C, E)...</span>
            )}
          </div>
        </div>

        {/* HOTKEYS GRID */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {keySections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 border-b border-gray-850 pb-1">
                {sec.category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.keys.map((k, kIdx) => {
                  const isHit = activePressedKey === k.key || (k.key === 'SPACE' && activePressedKey === ' ');
                  return (
                    <div
                      key={kIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                        isHit
                          ? 'bg-amber-500 text-black border-amber-300 scale-105 font-bold shadow-md'
                          : 'bg-black/60 border-gray-850 text-gray-300'
                      }`}
                    >
                      <span className="text-xs">{k.desc}</span>
                      <kbd className={`px-2 py-1 rounded text-[11px] font-bold ${
                        isHit ? 'bg-black text-amber-300' : 'bg-gray-800 text-amber-400 border border-gray-700'
                      }`}>
                        {k.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl font-mono transition-all"
          >
            CLOSE HOTKEY MAP
          </button>
        </div>
      </div>
    </div>
  );
};
