import React, { useState } from 'react';
import { BookOpen, GraduationCap, Trophy, HelpCircle, Check, Play, FileText, Smartphone } from 'lucide-react';
import { barksdaleSynth } from '../utils/audioUtils';
import { CIRCLE_OF_FIFTHS, EMOTION_TO_CHORDS } from '../data/musicData';

export const LearnTab: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<string>('GarageBand iOS');
  const [drillScore, setDrillScore] = useState<number>(0);
  const [drillStreak, setDrillStreak] = useState<number>(0);
  const [drillFeedback, setDrillFeedback] = useState<string | null>(null);
  const [drillState, setDrillState] = useState<{
    question: string;
    options: string[];
    correct: string;
    chordToPlay?: string;
  }>(generateNextDrillQuestion());

  function generateNextDrillQuestion() {
    const questions = [
      {
        question: "What is the Relative Minor key of C Major?",
        options: ["A Minor", "E Minor", "D Minor", "G Minor"],
        correct: "A Minor"
      },
      {
        question: "Which chord is the direct Relative Minor of G Major?",
        options: ["E Minor", "Bm", "C Major", "Am"],
        correct: "E Minor"
      },
      {
        question: "A 'Melancholic' chord progression begins with which chord?",
        options: ["Am", "C Major", "F Major", "G7"],
        correct: "Am",
        chordToPlay: "Am"
      },
      {
        question: "How many flats are in the key of Ab Major?",
        options: ["4 Flats", "1 Flat", "2 Flats", "No flats"],
        correct: "4 Flats"
      },
      {
        question: "Which interval formula represents a 'Minor 7th' chord?",
        options: ["0-3-7-10", "0-4-7-11", "0-4-7-10", "0-3-6-9"],
        correct: "0-3-7-10"
      },
      {
        question: "Identify the chord with notes: C, E, G, B (Major 7th formula)",
        options: ["Cmaj7", "C7", "Cm7", "Cdim7"],
        correct: "Cmaj7",
        chordToPlay: "Cmaj7"
      },
      {
        question: "What is the relative minor key of F Major?",
        options: ["D Minor", "G Minor", "A Minor", "C Minor"],
        correct: "D Minor"
      }
    ];
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  const handleDrillAnswer = (option: string) => {
    if (option === drillState.correct) {
      if (drillState.chordToPlay) {
        barksdaleSynth.playChord(drillState.chordToPlay, 0.8);
      } else {
        barksdaleSynth.playRhodesNote(440, 0.4);
      }
      setDrillScore(prev => prev + 10);
      setDrillStreak(prev => prev + 1);
      setDrillFeedback("CORRECT! +10 XP earned. Beautiful ear precision.");
    } else {
      barksdaleSynth.playRhodesNote(150, 0.5); // sour note
      setDrillStreak(0);
      setDrillFeedback(`INCORRECT. The correct answer was "${drillState.correct}". Keep practicing!`);
    }

    // Load next question in 2 seconds
    setTimeout(() => {
      setDrillFeedback(null);
      setDrillState(generateNextDrillQuestion());
    }, 2500);
  };

  const guides: Record<string, string[]> = {
    "GarageBand iOS": [
      "Step 1: Open GarageBand iOS and tap the '+' icon to create a new song.",
      "Step 2: Choose the 'Keyboard' instrument and switch to 'Chord Strips' mode.",
      "Step 3: Tap on the Settings icon in the top right, and choose 'Edit Chords'.",
      "Step 4: Manually configure custom chords corresponding to your generated BBM progression (e.g., Am9, Fmaj7).",
      "Step 5: Tap and record your performance. Use the auto-play slider setting to trigger complex arpeggiated patterns instantly!"
    ],
    "FL Studio Mobile": [
      "Step 1: Open FL Studio Mobile and load a new blank template.",
      "Step 2: Add a new channel, selecting the 'DirectWave' or 'Keyboard' sampler instrument.",
      "Step 3: Double tap the track to open the Piano Roll sequencer.",
      "Step 4: Tap and drop note blocks matching the Chord formula note names shown in our Studio tab (e.g. Dm7: D-F-A-C).",
      "Step 5: Copy-paste the blocks to create a 4-bar loop, then layer an 808 sub bass on root note pitches."
    ],
    "Logic Pro": [
      "Step 1: Create a Software Instrument track in Logic Pro, inserting the Vintage Electric Piano.",
      "Step 2: Command-click in the timeline to create a blank MIDI region, then double-click to open the Piano Roll.",
      "Step 3: Program notes using the MIDI brush tool according to our structural chord formula list.",
      "Step 4: Turn on Logic's 'Scale Quantize' feature in the inspector, setting it to matches your selected BMG scale (e.g., G Natural Minor).",
      "Step 5: Quantize MIDI note starts slightly off-grid to introduce natural human pocket swing."
    ],
    "Ableton Live": [
      "Step 1: Load a Grand Piano preset onto an empty MIDI Track in Ableton.",
      "Step 2: Double-click an empty clip slot to generate a 1-bar MIDI block.",
      "Step 3: Press 'Fold' in Ableton's Piano Roll to hide unused notes, then enter your chord layers.",
      "Step 4: Set the Velocity randomized amount to 15% to emulate human fingers triggering key sensors.",
      "Step 5: Group the track and add a subtle chorus + delay rack to emulate warm analog tape flutter."
    ]
  };

  return (
    <div className="p-4" id="learn-tab-view">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white mb-1 uppercase tracking-wide">Musician's Academy</h2>
        <p className="text-xs text-[#999999]">Master chord transitions, music theory drills, and stock DAW integrations.</p>
      </div>

      {/* 15-MINUTE DAILY DRILL (EAR TRAINING GAME) */}
      <div className="bmg-card border-[#ca9a5a]/20 bg-[#16120e]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#ca9a5a] flex items-center gap-1.5">
            <Trophy className="w-4 h-4" /> 15-Minute Daily Drill (Ear Training)
          </h3>
          <div className="flex gap-2 text-[10px] font-mono text-white">
            <span>Score: <strong className="text-[#ca9a5a]">{drillScore} XP</strong></span>
            <span>Streak: <strong className="text-[#4caf50]">{drillStreak} 🔥</strong></span>
          </div>
        </div>

        <div className="bg-[#0c0c0c] p-3.5 rounded-lg border border-[#222222] text-center mb-4 min-h-[140px] flex flex-col justify-center">
          {drillFeedback ? (
            <p className={`text-xs font-bold leading-relaxed ${
              drillFeedback.startsWith("CORRECT") ? "text-[#4caf50]" : "text-red-500"
            }`}>
              {drillFeedback}
            </p>
          ) : (
            <div>
              <p className="text-xs font-bold text-white mb-3">{drillState.question}</p>
              {drillState.chordToPlay && (
                <button
                  onClick={() => barksdaleSynth.playChord(drillState.chordToPlay!, 1.0)}
                  className="bg-[#1e1e1e] border border-[#2a2a2a] py-1 px-3 rounded-full text-[9px] font-bold text-[#ca9a5a] inline-flex items-center gap-1 mx-auto hover:bg-[#252525]"
                >
                  <Play className="w-3 h-3 fill-current" /> Play Clue Sound
                </button>
              )}
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-2" id="drill-options">
          {drillState.options.map(opt => (
            <button
              key={opt}
              disabled={drillFeedback !== null}
              onClick={() => handleDrillAnswer(opt)}
              className="bg-[#1e1e1e] hover:bg-[#282828] active:scale-95 border border-[#2a2a2a] text-left p-3 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* DAW IMPORT GUIDES */}
      <div className="bmg-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-[#ca9a5a]" /> Primary DAW Workstation Import Guides
        </h3>

        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {Object.keys(guides).map(guideName => (
            <button
              key={guideName}
              onClick={() => setSelectedGuide(guideName)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase shrink-0 transition-all ${
                selectedGuide === guideName 
                  ? "bg-[#ca9a5a] text-white" 
                  : "bg-[#111111] text-[#999999] border border-[#222222]"
              }`}
            >
              {guideName}
            </button>
          ))}
        </div>

        {/* Selected Guide Details */}
        <div className="bg-[#0a0a0a] p-3.5 rounded-lg border border-[#222222] mt-3 space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#ca9a5a]" /> Loading Chords into {selectedGuide}
          </h4>
          <ul className="space-y-2 text-xs text-[#999999] leading-relaxed">
            {guides[selectedGuide].map((step, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="text-[#ca9a5a] font-mono font-bold shrink-0">{idx + 1}.</span>
                <span>{step.substring(8)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
