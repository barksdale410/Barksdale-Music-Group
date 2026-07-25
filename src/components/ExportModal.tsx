import React, { useState } from 'react';
import { Download, Check, Sparkles, Sliders, Music, Film, FileText, X, Disc, Tag, Volume2, Shield } from 'lucide-react';

export const ExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<'wav' | 'mp3' | 'stems' | 'mp4' | 'xml'>('wav');
  const [sampleRate, setSampleRate] = useState<number>(48000);
  const [bitDepth, setBitDepth] = useState<number>(24);
  const [lufsTarget, setLufsTarget] = useState<string>('-14 LUFS (Spotify / YouTube Standard)');
  
  // Metadata tags
  const [songTitle, setSongTitle] = useState('Vintage Crime Scene Theme');
  const [artistName, setArtistName] = useState('Lyria 3 Studio Orchestra');
  const [genre, setGenre] = useState('70s Cinematic Soul');

  // Stems selection
  const [stems, setStems] = useState({
    drums: true,
    bass: true,
    lead: true,
    vocals: true,
    fx: true
  });

  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setIsDone(false);

    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setIsDone(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const toggleStem = (key: keyof typeof stems) => {
    setStems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12131a] border border-amber-500/40 rounded-2xl w-full max-w-2xl p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl text-white relative max-h-[90vh] flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-gray-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Download className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-white">
              UNIVERSAL MULTI-FORMAT MASTER EXPORTER
            </h3>
            <p className="text-xs text-gray-400">
              Export studio audio masters, individual STEM tracks, Cosmo 3 videos, or DAW project session files.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {/* FORMAT SELECTION CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'wav', name: 'Master WAV 24-bit', desc: 'Lossless Studio Audio', icon: Music },
              { id: 'stems', name: 'STEMS Zip Package', desc: 'Separated Track Audio', icon: Disc },
              { id: 'mp4', name: 'Cosmo 3 4K MP4', desc: 'High-Res Video Master', icon: Film },
              { id: 'mp3', name: 'MP3 320kbps', desc: 'Streaming Audio Master', icon: Music },
              { id: 'xml', name: 'Final Cut / Ableton', desc: 'DAW Session Export', icon: FileText }
            ].map(fmt => {
              const IconComponent = fmt.icon;
              const isSelected = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4 text-amber-400" />
                  <div className="text-xs font-bold text-white leading-tight">{fmt.name}</div>
                  <div className="text-[9px] font-mono text-gray-400">{fmt.desc}</div>
                </button>
              );
            })}
          </div>

          {/* STEMS SELECTION IF STEMS SELECTED */}
          {selectedFormat === 'stems' && (
            <div className="bg-black/50 p-3 rounded-xl border border-gray-800 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                SELECT STEM CHANNELS TO INCLUDE:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {Object.entries(stems).map(([key, enabled]) => (
                  <button
                    key={key}
                    onClick={() => toggleStem(key as any)}
                    className={`px-3 py-1.5 rounded-lg border uppercase transition-all ${
                      enabled
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-black/60 border-gray-800 text-gray-500'
                    }`}
                  >
                    {key} {enabled ? '✓' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AUDIO SETTINGS SPECS & LUFS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/50 p-3 rounded-xl border border-gray-800 text-xs font-mono">
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">SAMPLE RATE</label>
              <select
                value={sampleRate}
                onChange={e => setSampleRate(Number(e.target.value))}
                className="w-full bg-black border border-gray-800 rounded p-1.5 text-amber-300 outline-none"
              >
                <option value={44100}>44.1 kHz (CD Standard)</option>
                <option value={48000}>48.0 kHz (Film & TV)</option>
                <option value={96000}>96.0 kHz (High-Res Master)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 block mb-1">BIT DEPTH</label>
              <select
                value={bitDepth}
                onChange={e => setBitDepth(Number(e.target.value))}
                className="w-full bg-black border border-gray-800 rounded p-1.5 text-amber-300 outline-none"
              >
                <option value={16}>16-bit Integer</option>
                <option value={24}>24-bit PCM Master</option>
                <option value={32}>32-bit Float Processing</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 block mb-1">LOUDNESS TARGET (LUFS)</label>
              <select
                value={lufsTarget}
                onChange={e => setLufsTarget(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded p-1.5 text-amber-300 outline-none"
              >
                <option value="-14 LUFS">-14 LUFS (Spotify / YouTube)</option>
                <option value="-16 LUFS">-16 LUFS (Apple Music Standard)</option>
                <option value="-9 LUFS">-9 LUFS (Club & Festival Master)</option>
              </select>
            </div>
          </div>

          {/* METADATA TAGS */}
          <div className="bg-black/50 p-3 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
              <Tag className="w-3.5 h-3.5" /> ID3 & METADATA EMBEDDER
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
                placeholder="Track Title"
                className="bg-black border border-gray-800 rounded p-1.5 text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={artistName}
                onChange={e => setArtistName(e.target.value)}
                placeholder="Artist Name"
                className="bg-black border border-gray-800 rounded p-1.5 text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                placeholder="Genre"
                className="bg-black border border-gray-800 rounded p-1.5 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* RENDERING PROGRESS BAR */}
        {isRendering && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono text-amber-400">
              <span>RENDERING HIGH-RES MASTER ({selectedFormat.toUpperCase()})...</span>
              <span>{renderProgress}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
              <div
                className="bg-amber-500 h-full transition-all duration-150"
                style={{ width: `${renderProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* EXPORT / DOWNLOAD ACTION */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
          {isDone ? (
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                alert(`Downloaded ${selectedFormat.toUpperCase()} master package for "${songTitle}" successfully!`);
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-500 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Check className="w-4 h-4" /> DOWNLOAD MASTER PACKAGE NOW
            </a>
          ) : (
            <button
              onClick={handleStartExport}
              disabled={isRendering}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {isRendering ? 'PROCESSING...' : 'START HIGH-RES EXPORT'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
