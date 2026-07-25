import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { GENRE_THEMES, applyGenreTheme, getCurrentGenreThemeId, GenreTheme } from '../utils/themeUtils';

interface GenreThemeSelectorProps {
  compact?: boolean;
  onGenreSelect?: (themeId: string) => void;
}

export const GenreThemeSelector: React.FC<GenreThemeSelectorProps> = ({ compact = false, onGenreSelect }) => {
  const [activeThemeId, setActiveThemeId] = useState<string>('hiphop');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const currentId = getCurrentGenreThemeId();
    setActiveThemeId(currentId);
    applyGenreTheme(currentId);

    const handleThemeEvent = (e: any) => {
      if (e.detail?.theme?.id) {
        setActiveThemeId(e.detail.theme.id);
      }
    };

    window.addEventListener('bmg_genre_theme_changed', handleThemeEvent);
    return () => window.removeEventListener('bmg_genre_theme_changed', handleThemeEvent);
  }, []);

  const handleSelect = (id: string) => {
    setActiveThemeId(id);
    const theme = applyGenreTheme(id);
    if (onGenreSelect) {
      onGenreSelect(id);
    }
    setIsOpen(false);
  };

  const activeTheme = GENRE_THEMES[activeThemeId] || GENRE_THEMES.hiphop;

  if (compact) {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#171821] hover:bg-[#222432] border border-gray-800 hover:border-amber-500/50 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-md"
          title="Change Workstation Genre Theme"
        >
          <span className="text-sm">{activeTheme.icon}</span>
          <span className="font-bold text-amber-400 hidden sm:inline">{activeTheme.name}</span>
          <Palette className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-[#12131a] border border-amber-500/30 rounded-xl shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-500 uppercase font-black tracking-wider flex items-center gap-1.5">
                <Palette className="w-3 h-3" /> Select Genre Theme
              </span>
              <span className="text-[9px] text-gray-500 font-mono">2026 Engine</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {Object.values(GENRE_THEMES).map((theme: GenreTheme) => {
                const isSelected = theme.id === activeThemeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelect(theme.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/50 text-white font-bold'
                        : 'hover:bg-white/5 text-gray-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{theme.icon}</span>
                      <div>
                        <div className="font-bold leading-tight">{theme.name}</div>
                        <div className="text-[9px] text-gray-400 font-mono">{theme.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.accentPrimary }}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            2026 WORKSTATION GENRE THEME ENGINE
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-black">
          ACTIVE: {activeTheme.name.toUpperCase()}
        </span>
      </div>

      <p className="text-xs text-gray-400">
        Choose your preferred genre atmosphere. The workstation visual palette, control glows, and ambient accents will transform instantly.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {Object.values(GENRE_THEMES).map((theme: GenreTheme) => {
          const isSelected = theme.id === activeThemeId;
          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500 shadow-lg scale-[1.02]'
                  : 'bg-black/40 border-gray-800 hover:border-gray-700 hover:bg-black/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xl">{theme.icon}</span>
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.accentPrimary }}
                />
              </div>

              <div>
                <div className="text-xs font-bold text-white leading-tight">{theme.name}</div>
                <div className="text-[9px] text-gray-400 font-mono mt-0.5">{theme.category}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
