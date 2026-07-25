import React, { useState, useRef } from 'react';
import { Disc, Search, Play, Pause, Download, Plus, X, Sparkles, Music, Filter, Check } from 'lucide-react';
import { EXPANDED_GENRE_SAMPLES, AudioSampleItem } from '../data/genreSamplePacks';

export const SampleBrowserModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [insertedIds, setInsertedIds] = useState<{ [id: string]: boolean }>({});

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  if (!isOpen) return null;

  const genres = ['All', '1970s Crime Soul', 'Motown & Soul', 'Synthwave / 80s', 'Hip Hop / Trap', 'Orchestral Cinematic', 'Lofi & Ambient', 'Rock & Metal', 'Afrobeat & Reggae'];
  const categories = ['All', 'Drums', 'Bass', 'Synths', 'Brass & Horns', 'Vocal Chops', 'FX & Vinyl', 'Guitars', 'Orchestral'];

  const filteredSamples = EXPANDED_GENRE_SAMPLES.filter(sample => {
    const matchesGenre = selectedGenre === 'All' || sample.genre === selectedGenre;
    const matchesCategory = selectedCategory === 'All' || sample.category === selectedCategory;
    const matchesSearch =
      sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesCategory && matchesSearch;
  });

  const handleTogglePlay = (sample: AudioSampleItem) => {
    if (playingId === sample.id) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    // Stop existing
    if (oscRef.current) {
      oscRef.current.stop();
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sample.category === 'Bass' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(sample.freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);

      oscRef.current = osc;
      setPlayingId(sample.id);

      setTimeout(() => {
        setPlayingId(null);
      }, 1500);
    } catch (e) {
      setPlayingId(null);
    }
  };

  const handleInsertToDAW = (sample: AudioSampleItem) => {
    setInsertedIds(prev => ({ ...prev, [sample.id]: true }));
    window.dispatchEvent(new CustomEvent('bmg_insert_sample', { detail: { sample } }));
    setTimeout(() => {
      setInsertedIds(prev => ({ ...prev, [sample.id]: false }));
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12131c] border border-amber-500/40 rounded-2xl w-full max-w-4xl p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl text-white relative max-h-[90vh] flex flex-col">
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
            <Disc className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              EXPANDED MULTI-GENRE STUDIO SAMPLE BROWSER
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                {EXPANDED_GENRE_SAMPLES.length} SAMPLES LOADED
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Audition, filter, download, and drag/insert 100% royalty-free multi-genre audio samples & 1970s stem kits directly into your DAW tracks.
            </p>
          </div>
        </div>

        {/* CONTROLS: SEARCH & FILTERS */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search samples by name or description..."
                className="w-full bg-black border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-500"
              />
            </div>

            {/* CATEGORY TABS */}
            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-black/40 border border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GENRE TAGS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs font-mono">
            <span className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" /> GENRES:
            </span>
            {genres.map(gn => (
              <button
                key={gn}
                onClick={() => setSelectedGenre(gn)}
                className={`px-2 py-0.5 rounded text-[9px] uppercase transition-all whitespace-nowrap ${
                  selectedGenre === gn
                    ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                    : 'bg-gray-900/60 text-gray-400 border border-gray-850 hover:text-white'
                }`}
              >
                {gn}
              </button>
            ))}
          </div>
        </div>

        {/* SAMPLE LIST TABLE */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredSamples.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-gray-500">
              No audio samples found matching filters.
            </div>
          ) : (
            filteredSamples.map(sample => {
              const isPlaying = playingId === sample.id;
              const isInserted = insertedIds[sample.id];

              return (
                <div
                  key={sample.id}
                  className="p-3 bg-black/50 border border-gray-850 hover:border-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all text-xs"
                >
                  {/* PLAY & NAME INFO */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTogglePlay(sample)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isPlaying
                          ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-gray-900 border-gray-800 text-amber-400 hover:text-white hover:border-amber-500/50'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        {sample.name}
                        <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                          {sample.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {sample.genre} • {sample.category} • {sample.bpm} BPM • Key: {sample.key} • {sample.fileSize}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS: INSERT TO DAW & DOWNLOAD */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleInsertToDAW(sample)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                        isInserted
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow'
                          : 'bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black border-amber-500/30'
                      }`}
                    >
                      {isInserted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      {isInserted ? 'INSERTED TO TRACK' : '+ INSERT TO DAW'}
                    </button>

                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        alert(`Downloading ${sample.name} sample file (${sample.fileSize})...`);
                      }}
                      className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg border border-gray-800 transition-all"
                      title="Download WAV Sample"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
