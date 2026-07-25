import React, { useState, useEffect } from 'react';
import { Play, Pause, Save, FolderOpen, Heart, RefreshCw, Circle, Book, Music, FileText } from 'lucide-react';
import { CIRCLE_OF_FIFTHS, PRODUCER_LIBRARIES, EMOTION_TO_CHORDS } from '../data/musicData';
import { barksdaleSynth } from '../utils/audioUtils';

export const LibraryTab: React.FC = () => {
  const [savedBeats, setSavedBeats] = useState<any[]>([]);
  const [selectedCircleKey, setSelectedCircleKey] = useState<any>(CIRCLE_OF_FIFTHS[0]); // C major
  const [activeTabRef, setActiveTabRef] = useState<'circle' | 'producers'>('circle');

  // Load saved beats from localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('bmg_saved_beats');
    if (loaded) {
      try {
        setSavedBeats(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse saved beats:", e);
      }
    } else {
      // Seed initial dummy saved beats to make it feel rich on load!
      const initialBeats = [
        { id: "1", title: "Queensbridge Solitude", producer: "The Alchemist", scale: "G Minor", bpm: 82, chords: "Gm7 - Cm7 - Ebmaj7 - D7alt", timestamp: "2026-07-15" },
        { id: "2", title: "Late Night Donut Run", producer: "J Dilla", scale: "Eb Major", bpm: 88, chords: "Ebmaj7 - Abmaj9 - Fm9 - Bb13", timestamp: "2026-07-19" }
      ];
      setSavedBeats(initialBeats);
      localStorage.setItem('bmg_saved_beats', JSON.stringify(initialBeats));
    }
  }, []);

  const handlePlayCircleChord = (chord: string) => {
    barksdaleSynth.playChord(chord, 0.8);
  };

  const handlePlaySavedBeat = (beat: any) => {
    barksdaleSynth.stopBeatSequencer();
    const chordArr = beat.chords.split(/\s*-\s*/);
    const fakeDrums = {
      kick:  [true,  false, false, false, true,  false, false, false],
      snare: [false, false, true,  false, false, false, true,  false],
      hat:   [true,  true,  true,  true,  true,  true,  true,  true],
      clap:  [false, false, false, false, false, false, false, false]
    };
    barksdaleSynth.startBeatSequencer(beat.bpm, fakeDrums, chordArr, () => {});
  };

  const handleDeleteSavedBeat = (id: string) => {
    const updated = savedBeats.filter(b => b.id !== id);
    setSavedBeats(updated);
    localStorage.setItem('bmg_saved_beats', JSON.stringify(updated));
  };

  return (
    <div className="p-4" id="library-tab-view">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white mb-1 uppercase tracking-wide">Producer Library</h2>
        <p className="text-xs text-[#999999]">Manage your generated creations and access production reference maps.</p>
      </div>

      {/* Toggle between References and Saved Beats */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-[#111111] p-1.5 rounded-xl border border-[#222222]">
        <button
          onClick={() => setActiveTabRef('circle')}
          className={`py-2 text-xs font-bold uppercase rounded-lg transition-all ${
            activeTabRef === 'circle' 
              ? "bg-[#ca9a5a] text-white" 
              : "text-[#999999] hover:text-white"
          }`}
        >
          Circle & Reference Maps
        </button>
        <button
          onClick={() => setActiveTabRef('producers')}
          className={`py-2 text-xs font-bold uppercase rounded-lg transition-all ${
            activeTabRef === 'producers' 
              ? "bg-[#ca9a5a] text-white" 
              : "text-[#999999] hover:text-white"
          }`}
        >
          My Saved Creations
        </button>
      </div>

      {activeTabRef === 'circle' ? (
        <div id="circle-references-panel" className="space-y-4">
          {/* Interactive Circle of Fifths */}
          <div className="bmg-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
              <Circle className="w-4 h-4 text-[#ca9a5a]" /> Interactive Circle of Fifths
            </h3>
            <p className="text-[11px] text-[#888888] mb-3">
              Tap any key to inspect accidentals, relative minor key, and play stock diatonic chord voicings.
            </p>

            {/* Circular key pads */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {CIRCLE_OF_FIFTHS.map(k => (
                <button
                  key={k.name}
                  onClick={() => setSelectedCircleKey(k)}
                  className={`py-2 rounded-lg text-xs font-black border transition-all ${
                    selectedCircleKey.name === k.name 
                      ? "border-[#ca9a5a] bg-[#ca9a5a]/5 text-white" 
                      : "border-[#222222] bg-[#161616] text-[#999999] hover:border-[#333333]"
                  }`}
                >
                  {k.name} Major
                </button>
              ))}
            </div>

            {/* Key Information details panel */}
            {selectedCircleKey && (
              <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222222] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#666666] font-bold">Key Accidentals:</span>
                  <span className="font-mono text-[#ca9a5a] font-bold">{selectedCircleKey.accidentals}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#666666] font-bold">Relative Minor:</span>
                  <span className="font-bold text-white">{selectedCircleKey.relativeMinor} Minor</span>
                </div>

                {/* Major Diatonic Chord pads */}
                <div className="pt-2 border-t border-[#222222]">
                  <h4 className="text-[9px] font-bold text-[#555555] uppercase mb-1.5">Diatonic Major Chords (Tap to play)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCircleKey.majorChords.map((chord: string) => (
                      <button
                        key={chord}
                        onClick={() => handlePlayCircleChord(chord)}
                        className="bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] px-2.5 py-1 rounded text-[10px] font-bold text-[#ca9a5a]"
                      >
                        {chord}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minor Diatonic Chord pads */}
                <div className="pt-2 border-t border-[#222222]">
                  <h4 className="text-[9px] font-bold text-[#555555] uppercase mb-1.5">Diatonic Minor Chords (Tap to play)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCircleKey.relativeMinorChords.map((chord: string) => (
                      <button
                        key={chord}
                        onClick={() => handlePlayCircleChord(chord)}
                        className="bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] px-2.5 py-1 rounded text-[10px] font-bold text-white"
                      >
                        {chord}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ALL PRODUCER CHORD LIBRARIES */}
          <div className="bmg-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
              <Book className="w-4 h-4 text-[#ca9a5a]" /> Producer Chord Progression Deck
            </h3>
            <p className="text-[11px] text-[#888888] mb-3">
              Explore signatures and learn exactly what structures these legendary creators build upon.
            </p>

            <div className="space-y-3">
              {PRODUCER_LIBRARIES.map(p => (
                <div key={p.id} className="bg-[#141414] p-2.5 rounded-lg border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">{p.name} Signature deck</span>
                    <span className="text-[9px] text-[#555555] uppercase font-mono">{p.signatureScale}</span>
                  </div>

                  <div className="space-y-1.5">
                    {p.signatureProgressions.map((prog, pi) => (
                      <div key={pi} className="bg-[#0c0c0c] p-2 rounded border border-[#1e1e1e]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-[#ca9a5a]">{prog.name}</span>
                          <span className="text-[9px] text-[#555555]">{prog.description}</span>
                        </div>
                        <div className="flex gap-1.5">
                          {prog.progression.map((chord, ci) => (
                            <button
                              key={ci}
                              onClick={() => handlePlayCircleChord(chord)}
                              className="bg-[#1c1c1c] hover:bg-[#252525] text-[10px] px-2.5 py-1 rounded font-bold text-white border border-[#2a2a2a]"
                            >
                              {chord}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* MY SAVED CREATIONS PANEL */
        <div id="saved-creations-panel" className="space-y-4">
          <div className="bmg-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-[#ca9a5a]" /> My Saved Productions
            </h3>

            <div className="space-y-3" id="saved-beats-list">
              {savedBeats.map(beat => (
                <div key={beat.id} className="bg-[#141414] p-3 rounded-xl border border-[#222222] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{beat.title}</h4>
                      <p className="text-[10px] text-[#666666] font-mono">
                        BPM: {beat.bpm} | Scale: {beat.scale} | Date: {beat.timestamp}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSavedBeat(beat.id)}
                      className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-2.5 bg-[#0a0a0a] p-2 rounded border border-[#222222] text-xs font-mono font-bold text-[#ca9a5a]">
                    {beat.chords}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePlaySavedBeat(beat)}
                      className="flex-1 bmg-button-secondary py-2 min-h-[36px] text-xs font-bold gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Preview
                    </button>
                  </div>
                </div>
              ))}

              {savedBeats.length === 0 && (
                <div className="text-center py-8 text-[#555555] text-xs">
                  You haven't saved any creations yet. Create one in the **Studio** tab and tap Save!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
