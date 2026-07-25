import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, BookOpen, UserCheck, Play, Pause, Trash2, ArrowRight, RefreshCw, Volume2, HelpCircle, Sliders, Layers, Music, Cpu, FileText, Compass, Download, Edit2, Maximize, Activity, ToggleLeft, ToggleRight, Scale, ChevronRight } from 'lucide-react';
import { PRODUCER_LIBRARIES, ROOT_NOTES } from '../data/musicData';
import { barksdaleSynth } from '../utils/audioUtils';

interface TemplatesTabProps {
  onLoadProducerTemplate: (producer: any) => void;
}

interface TimelineChord {
  id: string;
  name: string;
  roman: string;
  duration: number; // in measures (e.g., 0.5, 1, 2)
  voicing: string;  // "Root Position" | "1st Inversion" | "2nd Inversion" | "Open Voicing" | "Closed Voicing"
  octave: number;   // 3 | 4 | 5
}

// Polar/Trig helpers for Circle of Fifths
const getDonutWedge = (cx: number, cy: number, rIn: number, rOut: number, startAngle: number, endAngle: number) => {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  const x1_out = cx + rOut * Math.cos(startRad);
  const y1_out = cy + rOut * Math.sin(startRad);
  const x2_out = cx + rOut * Math.cos(endRad);
  const y2_out = cy + rOut * Math.sin(endRad);
  const x1_in = cx + rIn * Math.cos(startRad);
  const y1_in = cy + rIn * Math.sin(startRad);
  const x2_in = cx + rIn * Math.cos(endRad);
  const y2_in = cy + rIn * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${x1_in} ${y1_in} L ${x1_out} ${y1_out} A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in} Z`;
};

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onLoadProducerTemplate }) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'presets' | 'builder'>('builder');

  // Presets Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingProducerId, setPlayingProducerId] = useState<string | null>(null);

  // Builder Theory State
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedScale, setSelectedScale] = useState('Major');
  const [isSeventhMode, setIsSeventhMode] = useState(false);
  const [bpm, setBpm] = useState(120);

  // Drag and Drop & Timeline Chords
  const [timelineChords, setTimelineChords] = useState<(TimelineChord | null)[]>(() => [
    { id: '1', name: 'Am', roman: 'vi', duration: 1, voicing: 'Root Position', octave: 4 },
    { id: '2', name: 'F', roman: 'IV', duration: 1, voicing: 'Root Position', octave: 4 },
    { id: '3', name: 'C', roman: 'I', duration: 1, voicing: 'Root Position', octave: 4 },
    { id: '4', name: 'G', roman: 'V', duration: 1, voicing: 'Root Position', octave: 4 },
    null, null, null, null
  ]);

  const [activeTimelineSlot, setActiveTimelineSlot] = useState<number | null>(null);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<number | null>(null);

  // Playback & Motions Engine
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [playbackMotion, setPlaybackMotion] = useState('Sustained Chords');
  const [isLooping, setIsLooping] = useState(true);

  // Real-time Key Detector States
  const [detectedNotes, setDetectedNotes] = useState<string[]>([]);
  const [detectorActiveKeys, setDetectorActiveKeys] = useState<Record<number, boolean>>({});

  // Active Architecture tab
  const [archTab, setArchTab] = useState('dsp');

  const playbackTimeoutRef = useRef<any>(null);
  const isPlayingRef = useRef(false);

  // Sync ref to avoid closure issues in loops
  useEffect(() => {
    isPlayingRef.current = isPlayingTimeline;
  }, [isPlayingTimeline]);

  // Clean up playback on unmount
  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    };
  }, []);

  // DIATONIC SCALE GENERATOR (12 roots * 7 modes)
  const getDiatonicChords = (key: string, scaleType: string, isSeventh: boolean): { name: string; roman: string }[] => {
    const rootIdx = ROOT_NOTES.indexOf(key);
    if (rootIdx === -1) return [];

    interface ModeTemplate {
      intervals: number[];
      romanNumerals: string[];
      triadQualities: string[];
      seventhQualities: string[];
    }

    const templates: Record<string, ModeTemplate> = {
      "Major": {
        intervals: [0, 2, 4, 5, 7, 9, 11],
        romanNumerals: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
        triadQualities: ["", "m", "m", "", "", "m", "dim"],
        seventhQualities: ["maj7", "m7", "m7", "maj7", "7", "m7", "dim"]
      },
      "Minor": {
        intervals: [0, 2, 3, 5, 7, 8, 10],
        romanNumerals: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
        triadQualities: ["m", "dim", "", "m", "m", "", ""],
        seventhQualities: ["m7", "dim", "maj7", "m7", "m7", "maj7", "7"]
      },
      "Dorian": {
        intervals: [0, 2, 3, 5, 7, 9, 10],
        romanNumerals: ["i", "ii", "III", "IV", "v", "vi°", "VII"],
        triadQualities: ["m", "m", "", "", "m", "dim", ""],
        seventhQualities: ["m7", "m7", "maj7", "7", "m7", "dim", "maj7"]
      },
      "Phrygian": {
        intervals: [0, 1, 3, 5, 7, 8, 10],
        romanNumerals: ["i", "II", "III", "iv", "v°", "VI", "vii"],
        triadQualities: ["m", "", "", "m", "dim", "", "m"],
        seventhQualities: ["m7", "maj7", "7", "m7", "dim", "maj7", "m7"]
      },
      "Lydian": {
        intervals: [0, 2, 4, 6, 7, 9, 11],
        romanNumerals: ["I", "II", "iii", "iv°", "V", "vi", "vii"],
        triadQualities: ["", "", "m", "dim", "", "m", "m"],
        seventhQualities: ["maj7", "7", "m7", "dim", "maj7", "m7", "m7"]
      },
      "Mixolydian": {
        intervals: [0, 2, 4, 5, 7, 9, 10],
        romanNumerals: ["I", "ii", "iii°", "IV", "v", "vi", "VII"],
        triadQualities: ["", "m", "dim", "", "m", "m", ""],
        seventhQualities: ["7", "m7", "dim", "maj7", "m7", "m7", "maj7"]
      },
      "Locrian": {
        intervals: [0, 1, 3, 5, 6, 8, 10],
        romanNumerals: ["i°", "II", "iii", "iv", "V", "VI", "vii"],
        triadQualities: ["dim", "", "m", "m", "", "", "m"],
        seventhQualities: ["dim", "maj7", "m7", "m7", "maj7", "7", "m7"]
      }
    };

    const template = templates[scaleType] || templates["Major"];
    return template.intervals.map((interval, i) => {
      const noteName = ROOT_NOTES[(rootIdx + interval) % 12];
      const quality = isSeventh ? template.seventhQualities[i] : template.triadQualities[i];
      return {
        name: `${noteName}${quality}`,
        roman: template.romanNumerals[i]
      };
    });
  };

  const diatonicChordsList = getDiatonicChords(selectedKey, selectedScale, isSeventhMode);

  // Play a single note frequency
  const playSampleNote = (freq: number, dur = 0.4) => {
    barksdaleSynth.playRhodesNote(freq, dur);
  };

  // Convert chord string with inversion & octave to specific frequencies
  const getVoicingFrequencies = (chordName: string, voicing: string, octave: number): number[] => {
    // Standard parse using project's parser (default is octave 4)
    // We parse a couple of octaves lower/higher if requested
    const roots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let root = chordName.substring(0, 1).toUpperCase();
    let rest = chordName.substring(1);
    if (rest.startsWith("#") || rest.startsWith("b")) {
      root += rest.substring(0, 1);
      rest = rest.substring(1);
    }
    if (root === "Db") root = "C#";
    if (root === "Eb") root = "D#";
    if (root === "Gb") root = "F#";
    if (root === "Ab") root = "G#";
    if (root === "Bb") root = "A#";

    const rootIndex = roots.indexOf(root);
    if (rootIndex === -1) return [261.63];

    // standard intervals mapping
    let intervals = [0, 4, 7];
    if (rest.startsWith("m9")) intervals = [0, 3, 7, 10, 14];
    else if (rest.startsWith("maj9") || rest.startsWith("m11")) intervals = [0, 4, 7, 11, 14];
    else if (rest.startsWith("maj7") || rest.startsWith("M7")) intervals = [0, 4, 7, 11];
    else if (rest.startsWith("m7") || rest.startsWith("min7")) intervals = [0, 3, 7, 10];
    else if (rest.startsWith("7")) intervals = [0, 4, 7, 10];
    else if (rest.startsWith("m") || rest.startsWith("min")) intervals = [0, 3, 7];
    else if (rest.startsWith("dim")) intervals = [0, 3, 6];
    else if (rest.startsWith("aug")) intervals = [0, 4, 8];
    else if (rest.startsWith("sus4")) intervals = [0, 5, 7];
    else if (rest.startsWith("sus2")) intervals = [0, 2, 7];

    const baseMidi = 12 * (octave + 1) + rootIndex;
    const notesMidi = intervals.map(interval => baseMidi + interval);

    // Apply inversions / voicing
    let processedMidi = [...notesMidi];
    if (voicing === "1st Inversion" && processedMidi.length >= 2) {
      processedMidi[0] += 12;
      processedMidi.sort((a, b) => a - b);
    } else if (voicing === "2nd Inversion" && processedMidi.length >= 3) {
      processedMidi[0] += 12;
      processedMidi[1] += 12;
      processedMidi.sort((a, b) => a - b);
    } else if (voicing === "Open Voicing" && processedMidi.length >= 3) {
      processedMidi = processedMidi.map((midi, i) => (i % 2 === 1 ? midi + 12 : midi));
    } else if (voicing === "Closed Voicing" && processedMidi.length >= 4) {
      processedMidi[processedMidi.length - 1] -= 12;
      processedMidi.sort((a, b) => a - b);
    }

    return processedMidi.map(midi => 440 * Math.pow(2, (midi - 69) / 12));
  };

  const playVoicedChord = (chordName: string, voicing = 'Root Position', octave = 4, dur = 0.8) => {
    const freqs = getVoicingFrequencies(chordName, voicing, octave);
    freqs.forEach(f => playSampleNote(f, dur));
  };

  // Live Sequencer playback for timeline
  const triggerChordWithMotion = (chordName: string, voicing: string, octave: number, motion: string) => {
    const freqs = getVoicingFrequencies(chordName, voicing, octave);
    const beatSec = 60 / bpm;

    if (motion === "Sustained Chords") {
      freqs.forEach(freq => playSampleNote(freq, beatSec * 3.5));
    } else if (motion === "Arpeggiated Up") {
      const step = beatSec / 4; // 16th notes
      freqs.forEach((freq, i) => {
        setTimeout(() => {
          if (isPlayingRef.current) playSampleNote(freq, step * 1.8);
        }, i * step * 1000);
      });
      // Double trigger repeat for measure fullness
      if (freqs.length > 0) {
        freqs.forEach((freq, i) => {
          setTimeout(() => {
            if (isPlayingRef.current) playSampleNote(freq, step * 1.8);
          }, (freqs.length + i) * step * 1000);
        });
      }
    } else if (motion === "Arpeggiated Down") {
      const step = beatSec / 4;
      const reversed = [...freqs].reverse();
      reversed.forEach((freq, i) => {
        setTimeout(() => {
          if (isPlayingRef.current) playSampleNote(freq, step * 1.8);
        }, i * step * 1000);
      });
      if (reversed.length > 0) {
        reversed.forEach((freq, i) => {
          setTimeout(() => {
            if (isPlayingRef.current) playSampleNote(freq, step * 1.8);
          }, (reversed.length + i) * step * 1000);
        });
      }
    } else if (motion === "Pulsing Bassline") {
      const pulse = beatSec / 2; // 8th note bass loops
      const bassFreq = freqs[0] / 4; // Sub-octave 2 octaves down
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          if (isPlayingRef.current) playSampleNote(bassFreq, pulse * 0.8);
        }, i * pulse * 1000);
      }
    } else if (motion === "Neo-Soul Motif") {
      // Swell on first beat, rhythmic plucks on 16th syncopations
      freqs.forEach(f => playSampleNote(f, beatSec * 1.2));
      setTimeout(() => {
        if (isPlayingRef.current && freqs[2]) playSampleNote(freqs[2] * 2, beatSec / 2);
      }, beatSec * 600);
      setTimeout(() => {
        if (isPlayingRef.current && freqs[0]) playSampleNote(freqs[0] / 2, beatSec / 2);
      }, beatSec * 1200);
      setTimeout(() => {
        if (isPlayingRef.current && freqs[1]) playSampleNote(freqs[1] * 2, beatSec / 2);
      }, beatSec * 1800);
    }
  };

  const playTimelineStep = (slotIdx: number) => {
    if (!isPlayingRef.current) return;
    if (slotIdx >= timelineChords.length) {
      if (isLooping) {
        slotIdx = 0;
      } else {
        setIsPlayingTimeline(false);
        setActiveTimelineSlot(null);
        return;
      }
    }

    setActiveTimelineSlot(slotIdx);
    const chord = timelineChords[slotIdx];
    
    const measureDurationMs = 4 * (60 / bpm) * 1000;
    const currentDurationMs = (chord ? chord.duration : 1) * measureDurationMs;

    if (chord) {
      triggerChordWithMotion(chord.name, chord.voicing, chord.octave, playbackMotion);
    }

    playbackTimeoutRef.current = setTimeout(() => {
      playTimelineStep(slotIdx + 1);
    }, currentDurationMs);
  };

  const toggleTimelinePlayback = () => {
    if (isPlayingTimeline) {
      setIsPlayingTimeline(false);
      setActiveTimelineSlot(null);
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    } else {
      setIsPlayingTimeline(true);
      // Ensure audio context is running
      barksdaleSynth.setVolume(0.3);
      // Wait tiny bit, trigger sequence
      setTimeout(() => {
        isPlayingRef.current = true;
        playTimelineStep(0);
      }, 50);
    }
  };

  // Chord Substitutions Engine
  const getSubstitutions = (chordName: string): { name: string; type: string; desc: string }[] => {
    if (!chordName) return [];
    
    let root = chordName.substring(0, 1).toUpperCase();
    let suffix = chordName.substring(1);
    if (suffix.startsWith("#") || suffix.startsWith("b")) {
      root += suffix.substring(0, 1);
      suffix = suffix.substring(1);
    }
    const isMinor = suffix.includes("m") || suffix.includes("min") || suffix.includes("dim");

    const rootIdx = ROOT_NOTES.indexOf(root);
    if (rootIdx === -1) return [];

    const relativeRoot = ROOT_NOTES[(rootIdx + (isMinor ? 3 : 9)) % 12];
    const tritoneRoot = ROOT_NOTES[(rootIdx + 6) % 12];
    const secondaryDomRoot = ROOT_NOTES[(rootIdx + 7) % 12]; // dominant 5th of this root

    return [
      { 
        name: `${relativeRoot}${isMinor ? "" : "m"}`, 
        type: "Relative substitution", 
        desc: `Shared notes from standard ${isMinor ? "relative Major" : "relative minor"}` 
      },
      { 
        name: `${chordName}maj7`, 
        type: "Jazz Extension", 
        desc: "Adds a dreamy, velvet seventh interval" 
      },
      { 
        name: `${tritoneRoot}7`, 
        type: "Tritone substitution", 
        desc: "Replaces dominants with modern tension, resolving down by a half-step" 
      },
      { 
        name: `${secondaryDomRoot}7`, 
        type: "Secondary Dominant", 
        desc: "Resolves with classical strength into your selected root note" 
      },
      { 
        name: `${root}m`, 
        type: "Parallel Borrowing", 
        desc: "Swaps tonic key quality for an emotional modal interchange sweep" 
      }
    ].filter(s => s.name !== chordName);
  };

  const activeSubstituteList = selectedSlotForEdit !== null && timelineChords[selectedSlotForEdit]
    ? getSubstitutions(timelineChords[selectedSlotForEdit]!.name)
    : [];

  // Drag-and-Drop Handler Functions
  const handleDragStartPalette = (e: React.DragEvent, chordName: string, roman: string) => {
    e.dataTransfer.setData("chordName", chordName);
    e.dataTransfer.setData("roman", roman);
    e.dataTransfer.setData("dragSource", "palette");
  };

  const handleDragStartTimeline = (e: React.DragEvent, slotIdx: number) => {
    e.dataTransfer.setData("sourceSlotIdx", String(slotIdx));
    e.dataTransfer.setData("dragSource", "timeline");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, targetSlotIdx: number) => {
    e.preventDefault();
    const dragSource = e.dataTransfer.getData("dragSource");

    if (dragSource === "palette") {
      const chordName = e.dataTransfer.getData("chordName");
      const roman = e.dataTransfer.getData("roman");
      
      const updated = [...timelineChords];
      updated[targetSlotIdx] = {
        id: String(Date.now() + targetSlotIdx),
        name: chordName,
        roman: roman,
        duration: 1,
        voicing: 'Root Position',
        octave: 4
      };
      setTimelineChords(updated);
    } else if (dragSource === "timeline") {
      const sourceSlotIdx = parseInt(e.dataTransfer.getData("sourceSlotIdx"));
      if (!isNaN(sourceSlotIdx) && sourceSlotIdx !== targetSlotIdx) {
        const updated = [...timelineChords];
        const temp = updated[targetSlotIdx];
        updated[targetSlotIdx] = updated[sourceSlotIdx];
        updated[sourceSlotIdx] = temp;
        setTimelineChords(updated);
      }
    }
  };

  const addChordToTimeline = (chordName: string, roman: string) => {
    const emptyIndex = timelineChords.findIndex(c => c === null);
    if (emptyIndex !== -1) {
      const updated = [...timelineChords];
      updated[emptyIndex] = {
        id: String(Date.now()),
        name: chordName,
        roman: roman,
        duration: 1,
        voicing: 'Root Position',
        octave: 4
      };
      setTimelineChords(updated);
    }
  };

  const clearTimelineSlot = (slotIdx: number) => {
    const updated = [...timelineChords];
    updated[slotIdx] = null;
    setTimelineChords(updated);
    if (selectedSlotForEdit === slotIdx) setSelectedSlotForEdit(null);
  };

  const clearWholeTimeline = () => {
    setTimelineChords([null, null, null, null, null, null, null, null]);
    setSelectedSlotForEdit(null);
  };

  const updateTimelineSlotValue = (slotIdx: number, fields: Partial<TimelineChord>) => {
    const updated = [...timelineChords];
    const original = updated[slotIdx];
    if (original) {
      updated[slotIdx] = { ...original, ...fields };
      setTimelineChords(updated);
    }
  };

  // Real-time Key Detector Virtual Piano & Algorithm
  const handleDetectorPianoClick = (midi: number, noteName: string) => {
    const activeState = { ...detectorActiveKeys };
    activeState[midi] = !activeState[midi];
    setDetectorActiveKeys(activeState);

    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    playSampleNote(freq, 0.45);

    const updatedNotes = Object.keys(activeState)
      .filter(k => activeState[parseInt(k)])
      .map(k => {
        const m = parseInt(k);
        const chromaticIdx = m % 12;
        return ROOT_NOTES[chromaticIdx];
      });

    setDetectedNotes(updatedNotes);
  };

  const detectKeyFromPiano = (): { scale: string; matchPct: number }[] => {
    if (detectedNotes.length === 0) return [];
    
    const uniqueNotes = Array.from(new Set(detectedNotes)) as string[];
    const scaleMatches: { scale: string; matchPct: number }[] = [];

    const modes = [
      { name: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
      { name: "Minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
      { name: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
      { name: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
      { name: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10] },
      { name: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] }
    ];

    ROOT_NOTES.forEach(root => {
      const rootIdx = ROOT_NOTES.indexOf(root);
      modes.forEach(mode => {
        let matchedCount = 0;
        uniqueNotes.forEach(note => {
          const noteIdx = ROOT_NOTES.indexOf(note);
          const interval = (noteIdx - rootIdx + 12) % 12;
          if (mode.intervals.includes(interval)) {
            matchedCount++;
          }
        });

        const pct = Math.round((matchedCount / uniqueNotes.length) * 100);
        if (pct >= 50) {
          scaleMatches.push({
            scale: `${root} ${mode.name}`,
            matchPct: pct
          });
        }
      });
    });

    return scaleMatches.sort((a, b) => b.matchPct - a.matchPct).slice(0, 3);
  };

  const detectionResults = detectKeyFromPiano();

  const handleApplyDetectedScale = (detectedScaleStr: string) => {
    const parts = detectedScaleStr.split(" ");
    if (parts.length >= 2) {
      setSelectedKey(parts[0]);
      setSelectedScale(parts[1]);
      setDetectedNotes([]);
      setDetectorActiveKeys({});
    }
  };

  const handlePlaySignatureBeat = (producer: any) => {
    if (playingProducerId === producer.id) {
      barksdaleSynth.stopBeatSequencer();
      setPlayingProducerId(null);
    } else {
      barksdaleSynth.stopBeatSequencer();
      setPlayingProducerId(producer.id);
      
      const sigChords = producer.signatureProgressions[0].progression;
      const fakeDrums = {
        kick:  [true,  false, false, false, true,  false, false, false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  false, true,  false, true,  false, true,  true],
        clap:  [false, false, false, false, false, false, false, false]
      };
      
      barksdaleSynth.startBeatSequencer(producer.signatureBpm, fakeDrums, sigChords, () => {});
    }
  };

  // Circle of fifths clock angles mapping
  const clockKeys = [
    { name: "C", minor: "Am", start: -15, end: 15 },
    { name: "G", minor: "Em", start: 15, end: 45 },
    { name: "D", minor: "Bm", start: 45, end: 75 },
    { name: "A", minor: "F#m", start: 75, end: 105 },
    { name: "E", minor: "C#m", start: 105, end: 135 },
    { name: "B", minor: "G#m", start: 135, end: 165 },
    { name: "F#", minor: "D#m", start: 165, end: 195 },
    { name: "C#", minor: "A#m", start: 195, end: 225 },
    { name: "Ab", minor: "Fm", start: 225, end: 255 },
    { name: "Eb", minor: "Cm", start: 255, end: 285 },
    { name: "Bb", minor: "Gm", start: 285, end: 315 },
    { name: "F", minor: "Dm", start: 315, end: 345 }
  ];

  // Visual Piano Keys structure
  const detectorPianoLayout = [
    { name: "C", isBlack: false, midi: 60 },
    { name: "C#", isBlack: true, midi: 61 },
    { name: "D", isBlack: false, midi: 62 },
    { name: "D#", isBlack: true, midi: 63 },
    { name: "E", isBlack: false, midi: 64 },
    { name: "F", isBlack: false, midi: 65 },
    { name: "F#", isBlack: true, midi: 66 },
    { name: "G", isBlack: false, midi: 67 },
    { name: "G#", isBlack: true, midi: 68 },
    { name: "A", isBlack: false, midi: 69 },
    { name: "A#", isBlack: true, midi: 70 },
    { name: "B", isBlack: false, midi: 71 },
    { name: "C5", isBlack: false, midi: 72 }
  ];

  return (
    <div className="p-4 space-y-6" id="templates-tab-view">
      {/* Unified Tab Controller Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#2a2a32] pb-4">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#dfc7aa]" /> Theory & Signature Templates Workspace
          </h2>
          <p className="text-[11px] text-[#8e8e93] mt-1">Deploy curated producer palettes or construct bespoke, auto-harmonized MIDI arrangements.</p>
        </div>

        <div className="bg-[#141416] p-1 rounded-lg border border-[#25252b] flex">
          <button
            onClick={() => {
              barksdaleSynth.stopBeatSequencer();
              setPlayingProducerId(null);
              setActiveTab('builder');
            }}
            className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wide transition-all ${
              activeTab === 'builder'
                ? "bg-[#ca9a5a] text-black font-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Scaler 3 Workspace
          </button>
          <button
            onClick={() => {
              if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
              setIsPlayingTimeline(false);
              setActiveTimelineSlot(null);
              setActiveTab('presets');
            }}
            className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wide transition-all ${
              activeTab === 'presets'
                ? "bg-[#ca9a5a] text-black font-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Producer Presets
          </button>
        </div>
      </div>

      {/* CORE ACTIVE TAB RENDER */}
      {activeTab === 'presets' ? (
        <div className="space-y-4">
          <div className="mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Custom Producer Signature Libraries</h3>
            <p className="text-[10px] text-[#888]">Import signature stems, MIDI profiles, and tempos custom curated by lead artists.</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="template-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search producers, sound libraries, profiles..."
                className="bmg-input pl-10 text-xs py-2 bg-[#121214] border-[#222] text-white w-full rounded"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {['All', 'Hip Hop', 'Trap', 'Cinematic', 'Underground', 'Soulful'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase shrink-0 transition-all ${
                    selectedCategory === cat 
                      ? "bg-[#ca9a5a] text-black" 
                      : "bg-[#111111] text-[#999999] border border-[#222222] hover:bg-[#181818]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Producers List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCER_LIBRARIES.filter(p => {
              const mSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.bio.toLowerCase().includes(searchQuery.toLowerCase());
              const mCat = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
              return mSearch && mCat;
            }).map(p => (
              <div key={p.id} className="bmg-card relative overflow-hidden bg-[#121214] border-[#25252e] p-4 flex flex-col justify-between">
                <div className="flex gap-3">
                  <img src={p.avatarUrl} alt={p.name} className="w-11 h-11 rounded-lg object-cover border border-[#333] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white truncate">{p.name}</h4>
                      <span className="text-[8px] bg-[#ca9a5a]/10 text-[#ca9a5a] border border-[#ca9a5a]/30 px-1.5 py-0.5 rounded uppercase font-mono">{p.category}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#888] block mt-0.5">Tempo: {p.signatureBpm} BPM | Scale: {p.signatureScale}</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#a1a1a6] mt-3 bg-[#0a0a0c] p-2.5 rounded border border-[#1f1f25] leading-relaxed">
                  {p.bio}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2 bg-[#17171a] p-2 rounded text-[8px] font-mono text-gray-400">
                  <div>
                    <span className="text-gray-600 font-bold block">DRUMS</span>
                    <span className="truncate block mt-0.5" title={p.producerLibrary.drums}>{p.producerLibrary.drums}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold block">BASS</span>
                    <span className="truncate block mt-0.5" title={p.producerLibrary.bass}>{p.producerLibrary.bass}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold block">MELODY</span>
                    <span className="truncate block mt-0.5" title={p.producerLibrary.melodic}>{p.producerLibrary.melodic}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handlePlaySignatureBeat(p)}
                    className={`flex-1 text-[10px] uppercase font-bold py-2 px-3 rounded border transition-all flex items-center justify-center gap-1.5 ${
                      playingProducerId === p.id 
                        ? "bg-red-500/10 text-red-400 border-red-500/40" 
                        : "bg-[#1f1f24] text-white border-[#2c2c34] hover:bg-[#28282e]"
                    }`}
                  >
                    {playingProducerId === p.id ? <>STOP BEAT</> : <><Play className="w-3 h-3 fill-current" /> PLAY LOOP</>}
                  </button>
                  
                  <button
                    onClick={() => {
                      barksdaleSynth.stopBeatSequencer();
                      setPlayingProducerId(null);
                      onLoadProducerTemplate(p);
                    }}
                    className="bg-gradient-to-r from-[#ca9a5a] to-[#9b763e] text-black font-extrabold text-[10px] uppercase py-2 px-3 rounded flex items-center justify-center gap-1.5 hover:opacity-90"
                  >
                    <UserCheck className="w-3 h-3" /> LOAD WORKSPACE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SCALER 3 ADVANCED INTERACTIVE WORKSPACE */
        <div className="space-y-6" id="scaler-3-engine-panel">
          
          {/* SCALE GENERATOR PALETTE GRID */}
          <div className="bmg-card bg-[#121214] border-[#25252e] p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#202026] pb-4 mb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#ca9a5a]" /> 1. Select Key, Scale, and Chord Extension
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Diatonic chords generate in real-time. Drag chords onto the timeline slots below.</p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {/* Key Select */}
                <div className="flex items-center bg-[#17171a] border border-[#2b2b36] rounded px-2 py-1">
                  <span className="text-[9px] text-gray-500 font-mono font-bold uppercase mr-1.5">Key:</span>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="bg-transparent text-xs font-black text-white outline-none cursor-pointer"
                  >
                    {ROOT_NOTES.map(k => <option key={k} value={k} className="bg-[#17171a]">{k}</option>)}
                  </select>
                </div>

                {/* Scale Select */}
                <div className="flex items-center bg-[#17171a] border border-[#2b2b36] rounded px-2 py-1">
                  <span className="text-[9px] text-gray-500 font-mono font-bold uppercase mr-1.5">Scale:</span>
                  <select
                    value={selectedScale}
                    onChange={(e) => setSelectedScale(e.target.value)}
                    className="bg-transparent text-xs font-black text-white outline-none cursor-pointer"
                  >
                    {['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'].map(s => (
                      <option key={s} value={s} className="bg-[#17171a]">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Extension mode toggle */}
                <button
                  onClick={() => setIsSeventhMode(!isSeventhMode)}
                  className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${
                    isSeventhMode
                      ? "bg-[#ca9a5a]/20 text-[#ca9a5a] border border-[#ca9a5a]/40"
                      : "bg-[#1c1c1f] text-gray-400 border border-[#2c2c35]"
                  }`}
                >
                  {isSeventhMode ? "7TH CHORDS" : "TRIADS"}
                </button>
              </div>
            </div>

            {/* Generated Diatonic Chord Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {diatonicChordsList.map((chord, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStartPalette(e, chord.name, chord.roman)}
                  className="group relative bg-[#17171a] hover:bg-[#202028] border border-[#2a2a34] hover:border-[#ca9a5a] p-3 rounded-xl transition-all cursor-grab active:cursor-grabbing text-center flex flex-col justify-between h-24 shadow-[inset_0_1px_3px_rgba(255,255,255,0.03)]"
                  title="Drag and drop onto Timeline, or click to preview"
                >
                  <span className="text-[9px] font-mono text-gray-500 font-bold block">{chord.roman}</span>
                  <button
                    onClick={() => playVoicedChord(chord.name, 'Root Position', 4, 0.65)}
                    className="text-sm font-black text-[#dfc7aa] my-1 group-hover:scale-105 transition-transform"
                  >
                    {chord.name}
                  </button>
                  
                  {/* Action row */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] text-gray-600 font-mono">DRAG</span>
                    <button
                      onClick={() => addChordToTimeline(chord.name, chord.roman)}
                      className="text-[9px] text-[#ca9a5a] font-black bg-[#ca9a5a]/10 hover:bg-[#ca9a5a]/20 px-1.5 py-0.5 rounded"
                      title="Add to next empty timeline slot"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL TIMELINE PROGRESSION GRID */}
          <div className="bmg-card bg-[#0e0e11] border-[#22222a] p-4">
            <div className="flex items-center justify-between border-b border-[#1f1f26] pb-3 mb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#ca9a5a]" /> 2. Chord Progression Timeline (Drag/Drop and Arrange)
                </h3>
                <p className="text-[10px] text-[#8e8e93]">Reorder chords by dragging, or click to edit voicing, durations, and octaves.</p>
              </div>

              <button
                onClick={clearWholeTimeline}
                className="text-[9px] font-bold text-red-400 hover:text-red-500 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20"
              >
                CLEAR TIMELINE
              </button>
            </div>

            {/* 8-Slot Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {timelineChords.map((chord, slotIdx) => (
                <div
                  key={slotIdx}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                  className={`relative min-h-[110px] rounded-xl border flex flex-col justify-between p-3 transition-all ${
                    chord 
                      ? selectedSlotForEdit === slotIdx 
                        ? "bg-[#201d17] border-[#ca9a5a] shadow-[0_0_12px_rgba(255,140,0,0.15)]"
                        : activeTimelineSlot === slotIdx
                          ? "bg-[#1a2c1f] border-[#32d74b] scale-105"
                          : "bg-[#151518] border-[#2c2c36] hover:border-gray-500"
                      : "border-dashed border-gray-700 bg-transparent hover:bg-white/[0.01]"
                  }`}
                >
                  {chord ? (
                    <>
                      {/* Drag handle */}
                      <div
                        draggable
                        onDragStart={(e) => handleDragStartTimeline(e, slotIdx)}
                        className="flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-white/5 pb-1.5"
                      >
                        <span className="text-[8px] font-mono text-gray-500 uppercase font-black">Slot {slotIdx + 1}</span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                        </div>
                      </div>

                      {/* Info & Audition trigger */}
                      <button
                        onClick={() => {
                          playVoicedChord(chord.name, chord.voicing, chord.octave, 0.8);
                          setSelectedSlotForEdit(slotIdx);
                        }}
                        className="my-1.5 text-left flex flex-col justify-center"
                      >
                        <span className="text-sm font-black text-white">{chord.name}</span>
                        <span className="text-[9px] font-mono text-[#ca9a5a] mt-0.5">{chord.roman || "Custom"} ({chord.duration} Bar)</span>
                      </button>

                      {/* Small visual properties labels */}
                      <div className="flex flex-col gap-0.5 border-t border-white/5 pt-1.5 text-[8px] font-mono text-gray-500">
                        <span className="truncate">V: {chord.voicing}</span>
                        <span>Octave: {chord.octave}</span>
                      </div>

                      {/* Delete Trigger Button */}
                      <button
                        onClick={() => clearTimelineSlot(slotIdx)}
                        className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity p-1 rounded bg-[#202024] text-red-400 hover:text-red-500"
                        title="Remove chord"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-2">
                      <Layers className="w-5 h-5 text-gray-700 mb-1" />
                      <span className="text-[8px] font-mono text-gray-600 font-bold uppercase">EMPTY SLOT {slotIdx + 1}</span>
                      <span className="text-[8px] text-gray-700 mt-0.5">Drag/Drop or click chord</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SPLIT ROW: PLAYBACK TRANSPORT AND ACTIVE SLOT CONTROLLERS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PLAYBACK TRANS&MOTIONS ENGINE PANEL (7 Columns) */}
            <div className="lg:col-span-7 bmg-card bg-[#121214] border-[#25252e] p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5 mb-1">
                  <Activity className="w-4 h-4 text-[#ca9a5a]" /> 3. Generative Playback & Formant Motions
                </h4>
                <p className="text-[10px] text-gray-500">Auto-transform static chord voicings into flowing melodies and pulsing baselines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                {/* Motion Type selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">Motions Pattern:</span>
                  <select
                    value={playbackMotion}
                    onChange={(e) => setPlaybackMotion(e.target.value)}
                    className="bg-[#1a1a20] text-white border border-[#2b2b36] p-2 rounded text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="Sustained Chords">Sustained Chords (Held)</option>
                    <option value="Arpeggiated Up">Arpeggiated Up (16th notes)</option>
                    <option value="Arpeggiated Down">Arpeggiated Down (16th notes)</option>
                    <option value="Pulsing Bassline">Pulsing Bassline (8th pulse)</option>
                    <option value="Neo-Soul Motif">Neo-Soul Synco-Motif</option>
                  </select>
                </div>

                {/* Tempo BPM Select */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">DAW Sync Tempo:</span>
                  <div className="flex items-center bg-[#1a1a20] border border-[#2b2b36] rounded px-2">
                    <input
                      type="number"
                      min="60"
                      max="200"
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
                      className="bg-transparent text-xs text-white font-bold py-2 w-full outline-none"
                    />
                    <span className="text-[10px] text-gray-600 font-bold ml-1 font-mono">BPM</span>
                  </div>
                </div>

                {/* Looping Controls */}
                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-2 rounded text-xs font-bold border transition-all uppercase flex items-center justify-center gap-1.5 ${
                      isLooping 
                        ? "bg-[#ca9a5a]/10 text-[#ca9a5a] border-[#ca9a5a]/40" 
                        : "bg-[#1a1a20] text-gray-400 border-[#2b2b36]"
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> {isLooping ? "Loop Timeline On" : "One-Shot Play"}
                  </button>
                </div>
              </div>

              {/* Main Timeline Transport Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={toggleTimelinePlayback}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isPlayingTimeline
                      ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                      : "bg-gradient-to-r from-[#ca9a5a] to-[#dfc7aa] text-black shadow-[0_4px_12px_rgba(255,140,0,0.3)] hover:brightness-105"
                  }`}
                >
                  {isPlayingTimeline ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> STOP SCALE PREVIEW
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> PLAY CHORD TIMELINE
                    </>
                  )}
                </button>

                {/* Quick export of MIDI */}
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timelineChords, null, 2));
                    const dl = document.createElement('a');
                    dl.setAttribute("href", dataStr);
                    dl.setAttribute("download", `scaler_chord_progression.json`);
                    dl.click();
                  }}
                  className="bg-[#1c1c1f] hover:bg-[#25252c] border border-gray-700 text-white text-xs font-bold px-4 rounded-xl flex items-center justify-center"
                  title="Export timeline progression manifest"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SLOT EDITOR & SUBSTITUTIONS DRAWER (5 Columns) */}
            <div className="lg:col-span-5 bmg-card bg-[#121214] border-[#25252e] p-4 flex flex-col justify-between min-h-[220px]">
              {selectedSlotForEdit !== null && timelineChords[selectedSlotForEdit] ? (
                <div className="space-y-4 h-full flex flex-col justify-between">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-xs font-black uppercase text-[#ca9a5a] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" /> Edit Timeline Slot {selectedSlotForEdit + 1} ({timelineChords[selectedSlotForEdit]!.name})
                    </h4>
                    <p className="text-[9px] text-gray-500">Configure voicing inversion, octaves, and harmonic substitutions.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Voicing dropdown */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-gray-500 font-mono font-bold uppercase">Voicing / Inversion:</span>
                      <select
                        value={timelineChords[selectedSlotForEdit]!.voicing}
                        onChange={(e) => updateTimelineSlotValue(selectedSlotForEdit, { voicing: e.target.value })}
                        className="bg-[#1c1c22] text-xs font-bold p-1.5 rounded text-white border border-white/5"
                      >
                        <option value="Root Position">Root Position</option>
                        <option value="1st Inversion">1st Inversion</option>
                        <option value="2nd Inversion">2nd Inversion</option>
                        <option value="Open Voicing">Open Voicing</option>
                        <option value="Closed Voicing">Closed Voicing</option>
                      </select>
                    </div>

                    {/* Octave selection */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-gray-500 font-mono font-bold uppercase">Octave Base:</span>
                      <div className="flex gap-1">
                        {[3, 4, 5].map(oct => (
                          <button
                            key={oct}
                            onClick={() => updateTimelineSlotValue(selectedSlotForEdit, { octave: oct })}
                            className={`flex-1 text-[9px] font-bold p-1 rounded transition-all ${
                              timelineChords[selectedSlotForEdit]!.octave === oct
                                ? "bg-[#ca9a5a] text-black"
                                : "bg-[#1c1c22] text-gray-400"
                            }`}
                          >
                            C{oct}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration Select */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-gray-500 font-mono font-bold uppercase">Duration (bars):</span>
                      <div className="flex gap-1">
                        {[0.5, 1, 2].map(dur => (
                          <button
                            key={dur}
                            onClick={() => updateTimelineSlotValue(selectedSlotForEdit, { duration: dur })}
                            className={`flex-1 text-[9px] font-bold p-1 rounded transition-all ${
                              timelineChords[selectedSlotForEdit]!.duration === dur
                                ? "bg-[#ca9a5a] text-black animate-pulse"
                                : "bg-[#1c1c22] text-gray-400"
                            }`}
                          >
                            {dur === 0.5 ? "1/2" : dur} Bar
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Play/Listen */}
                    <div className="flex flex-col justify-end">
                      <button
                        onClick={() => playVoicedChord(timelineChords[selectedSlotForEdit]!.name, timelineChords[selectedSlotForEdit]!.voicing, timelineChords[selectedSlotForEdit]!.octave, 1.0)}
                        className="bg-[#1f1f24] hover:bg-[#282830] text-white border border-[#2b2b36] p-1.5 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#ca9a5a]" /> Audition
                      </button>
                    </div>
                  </div>

                  {/* Chord Substitution Panel */}
                  <div className="bg-[#17171a] p-2.5 rounded-xl border border-[#23232c]">
                    <span className="text-[8px] font-mono text-gray-500 font-bold uppercase block mb-1">Acoustic Substitution options (Scaler AI)</span>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {activeSubstituteList.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#1f1f24] p-1 rounded text-[10px] border border-white/5">
                          <div>
                            <span className="font-black text-[#dfc7aa]">{sub.name}</span>
                            <span className="text-[8px] text-gray-500 block">{sub.type}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => playVoicedChord(sub.name, 'Root Position', 4, 0.75)}
                              className="text-[8px] text-white hover:bg-white/5 px-1.5 py-0.5 rounded border border-white/10"
                            >
                              HEAR
                            </button>
                            <button
                              onClick={() => {
                                updateTimelineSlotValue(selectedSlotForEdit, { name: sub.name });
                                playVoicedChord(sub.name, 'Root Position', 4, 0.8);
                              }}
                              className="text-[8px] text-black font-extrabold bg-[#ca9a5a] px-1.5 py-0.5 rounded"
                            >
                              SWAP
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
                  <Sliders className="w-7 h-7 text-gray-700 mb-2" />
                  <span className="text-[10px] font-mono text-gray-600 font-black uppercase">SLOT INSPECTOR OFFLINE</span>
                  <span className="text-[10px] text-gray-700 mt-1 leading-normal max-w-[200px]">Click a loaded chord in the timeline above to edit inversions, durations, and load theory substitutions.</span>
                </div>
              )}
            </div>
          </div>

          {/* DUAL COLUMN BOTTOM: CIRCLE OF FIFTHS DONUT MAP & KEY DETECTOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* CIRCLE OF FIFTHS DONUT MODULE (5 Columns) */}
            <div className="lg:col-span-5 bmg-card bg-[#111114] border-[#25252e] p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#ca9a5a]" /> Circle of Fifths Donut Map
                </h4>
                <p className="text-[10px] text-gray-500 mt-1">Donut rings represent related harmonic distances. Select sectors to immediately transpose the scale workspace.</p>
              </div>

              {/* High-fidelity Vector SVG Donut */}
              <div className="flex items-center justify-center my-4">
                <svg width="240" height="240" viewBox="0 0 240 240" className="select-none filter drop-shadow-md">
                  <circle cx="120" cy="120" r="115" fill="#08080a" stroke="#222" strokeWidth="2" />
                  
                  {clockKeys.map((key, i) => {
                    const angle = 30 * i;
                    const start = angle - 15;
                    const end = angle + 15;
                    
                    const isKeyActive = selectedKey === key.name;
                    const isMinorActive = selectedKey === key.minor;
                    
                    // Outer Major ring path
                    const pathMajor = getDonutWedge(120, 120, 75, 110, start, end);
                    // Inner minor ring path
                    const pathMinor = getDonutWedge(120, 120, 45, 75, start, end);

                    // Text labels positions
                    const rad = (angle - 90) * Math.PI / 180;
                    const labelMajorX = 120 + 92 * Math.cos(rad);
                    const labelMajorY = 123 + 92 * Math.sin(rad);

                    const labelMinorX = 120 + 60 * Math.cos(rad);
                    const labelMinorY = 123 + 60 * Math.sin(rad);

                    return (
                      <g key={i}>
                        {/* Outer major sector */}
                        <path
                          d={pathMajor}
                          fill={isKeyActive ? "#ca9a5a" : "#121215"}
                          stroke="#222"
                          strokeWidth="1"
                          className="cursor-pointer hover:opacity-80 transition-all"
                          onClick={() => {
                            setSelectedKey(key.name);
                            setSelectedScale("Major");
                            playVoicedChord(key.name);
                          }}
                        />
                        {/* Inner minor sector */}
                        <path
                          d={pathMinor}
                          fill={isMinorActive ? "#ff5a00" : "#1b1b22"}
                          stroke="#222"
                          strokeWidth="1"
                          className="cursor-pointer hover:opacity-80 transition-all"
                          onClick={() => {
                            setSelectedKey(key.minor);
                            setSelectedScale("Minor");
                            playVoicedChord(`${key.minor}m`);
                          }}
                        />
                        {/* Major label */}
                        <text
                          x={labelMajorX}
                          y={labelMajorY}
                          fill={isKeyActive ? "#000" : "#fff"}
                          fontSize="9"
                          fontWeight="900"
                          textAnchor="middle"
                          pointerEvents="none"
                          className="font-mono uppercase"
                        >
                          {key.name}
                        </text>
                        {/* Minor label */}
                        <text
                          x={labelMinorX}
                          y={labelMinorY}
                          fill={isMinorActive ? "#000" : "#a1a1a6"}
                          fontSize="8"
                          textAnchor="middle"
                          pointerEvents="none"
                          className="font-mono"
                        >
                          {key.minor}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="120" cy="120" r="44" fill="#08080a" stroke="#222" strokeWidth="2" />
                  <text x="120" y="118" fill="#555" fontSize="7" textAnchor="middle" fontWeight="bold">SCALER</text>
                  <text x="120" y="128" fill="#ca9a5a" fontSize="8" textAnchor="middle" fontWeight="black" className="font-mono">FIFTHS</text>
                </svg>
              </div>

              <div className="text-[9px] text-[#8e8e93] bg-[#0c0c0e] p-2.5 rounded border border-[#1f1f25] leading-relaxed font-mono">
                Adjacent wedges represent perfect 4th & 5th scale steps. Select outer wedge for <strong className="text-white">Major</strong> and inner wedge for <strong className="text-[#ca9a5a]">Minor</strong>.
              </div>
            </div>

            {/* REAL-TIME KEY DETECTOR MODULE (7 Columns) */}
            <div className="lg:col-span-7 bmg-card bg-[#111114] border-[#25252e] p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#ca9a5a]" /> Real-time MIDI & Key Detector
                </h4>
                <p className="text-[10px] text-gray-500 mt-1">Click the visual piano keys to play notes. Real-time algorithms immediately calculate matching scales.</p>
              </div>

              {/* Responsive Visual Piano */}
              <div className="relative w-full h-32 bg-[#08080a] p-3 rounded-xl border border-[#1d1d24] flex justify-center items-stretch mt-4 mb-4 select-none">
                <div className="relative w-full max-w-md h-full flex">
                  {detectorPianoLayout.map((key, i) => {
                    const isWhite = !key.isBlack;
                    const isActive = detectorActiveKeys[key.midi] === true;

                    // Compute left positions for black keys relative to white keys
                    let styleObj: React.CSSProperties = {};
                    if (!isWhite) {
                      // Manual positioning of black keys over white slots
                      let leftOffset = 0;
                      if (key.name === "C#") leftOffset = 7.5;
                      else if (key.name === "D#") leftOffset = 19.5;
                      else if (key.name === "F#") leftOffset = 43.5;
                      else if (key.name === "G#") leftOffset = 55.5;
                      else if (key.name === "A#") leftOffset = 67.5;
                      styleObj = {
                        position: 'absolute',
                        left: `${leftOffset}%`,
                        width: '7%',
                        zIndex: 10,
                        height: '60%'
                      };
                    } else {
                      styleObj = {
                        flex: '1 1 0%',
                        height: '100%'
                      };
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleDetectorPianoClick(key.midi, key.name)}
                        style={styleObj}
                        className={`transition-all rounded-b border ${
                          isWhite
                            ? isActive 
                              ? "bg-gradient-to-t from-[#ca9a5a] to-[#dfc7aa] border-white text-black font-black"
                              : "bg-[#fafafa] hover:bg-gray-200 border-[#222] text-[#444] text-[8px] font-mono flex items-end justify-center pb-1.5"
                            : isActive
                              ? "bg-gradient-to-t from-[#ff5a00] to-[#ca9a5a] border-white"
                              : "bg-[#111115] hover:bg-[#18181f] border-black"
                        }`}
                        title={`Click to register note: ${key.name}`}
                      >
                        {isWhite && key.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detection results overlay */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#09090b] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-gray-500 font-bold uppercase block mb-1">Active registered Note Pool</span>
                    <div className="flex flex-wrap gap-1 min-h-[30px] items-center">
                      {detectedNotes.length > 0 ? (
                        detectedNotes.map((n, i) => (
                          <span key={i} className="text-[10px] font-mono font-black bg-[#ca9a5a]/20 text-[#ca9a5a] border border-[#ca9a5a]/30 px-2 py-0.5 rounded animate-bounce">
                            {n}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-gray-600 font-mono italic">Buffer empty. Play piano notes...</span>
                      )}
                    </div>
                  </div>

                  {detectedNotes.length > 0 && (
                    <button
                      onClick={() => {
                        setDetectedNotes([]);
                        setDetectorActiveKeys({});
                      }}
                      className="text-[9px] font-bold text-gray-400 hover:text-white mt-2 border border-[#2c2c36] py-1 rounded bg-[#111115]"
                    >
                      CLEAR REGISTERED NOTES
                    </button>
                  )}
                </div>

                <div className="bg-[#09090b] p-3 rounded-xl border border-white/5">
                  <span className="text-[8px] font-mono text-gray-500 font-bold uppercase block mb-1">Detected Scales matching</span>
                  <div className="space-y-1.5">
                    {detectionResults.length > 0 ? (
                      detectionResults.map((res, i) => (
                        <div key={i} className="flex items-center justify-between text-[10px] bg-[#141416] p-1 rounded border border-white/5">
                          <span className="font-bold text-white uppercase">{res.scale}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-[9px] text-[#32d74b] font-bold">{res.matchPct}% MATCH</span>
                            <button
                              onClick={() => handleApplyDetectedScale(res.scale)}
                              className="text-[8px] text-black font-extrabold bg-[#ca9a5a] px-1.5 py-0.5 rounded"
                            >
                              LOAD
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[9px] text-gray-600 font-mono italic py-4 text-center">
                        Play 2+ notes to guess scale signatures
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME DAW INTEGRATION BLUEPRINT ROADMAP */}
          <div className="bmg-card bg-[#141418] border-[#2c2c35] p-5 relative overflow-hidden">
            <div className="border-b border-[#25252c] pb-3 mb-4">
              <h4 className="text-xs font-black uppercase text-[#ca9a5a] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Scaler 3 DAW Core DSP Integration Blueprint
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Authoritative C++ and multi-threaded audio architecture roadmap to bind the Scaler engine directly into a host DAW's processing callback pipeline.</p>
            </div>

            {/* Architecture Tabs */}
            <div className="flex border-b border-[#25252c] gap-2 mb-4 overflow-x-auto">
              {[
                { id: 'dsp', label: '1. Thread-Safe DSP Queue' },
                { id: 'sync', label: '2. PPQ Timeline Sync' },
                { id: 'state', label: '3. Harmonic Track State' },
                { id: 'plugins', label: '4. Plugin Hosting Sandbox' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setArchTab(tab.id)}
                  className={`text-[9px] uppercase font-bold pb-2 px-1 shrink-0 border-b-2 transition-all ${
                    archTab === tab.id
                      ? "border-[#ca9a5a] text-[#dfc7aa] font-black"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-[#0b0b0e] border border-white/5 p-4 rounded-xl font-mono text-[10px] leading-relaxed text-gray-300">
              {archTab === 'dsp' && (
                <div className="space-y-3">
                  <p className="text-gray-400"><strong>Real-Time Audio Thread safety rules:</strong> The generative engine runs directly inside the hardware audio thread callback and must NEVER call malloc, free, mutex locking, or I/O. Use a Lock-Free Ring Buffer (Single Producer Single Consumer FIFO) to exchange parameters between the UI thread and the Real-time audio callback.</p>
                  <pre className="bg-[#060608] p-3 rounded border border-white/5 text-[#32d74b] overflow-x-auto text-[9px]">
{`// C++ Real-Time Parameter Queue Implementation
template <typename T, size_t Size>
class LockFreeQueue {
public:
    bool push(const T& val) {
        size_t writeIdx = writePos.load(std::memory_order_relaxed);
        size_t readIdx = readPos.load(std::memory_order_acquire);
        if ((writeIdx + 1) % Size == readIdx) return false; // Buffer Full
        buffer[writeIdx] = val;
        writePos.store((writeIdx + 1) % Size, std::memory_order_release);
        return true;
    }
    bool pop(T& val) {
        size_t readIdx = readPos.load(std::memory_order_relaxed);
        size_t writeIdx = writePos.load(std::memory_order_acquire);
        if (readIdx == writeIdx) return false; // Buffer Empty
        val = buffer[readIdx];
        readPos.store((readIdx + 1) % Size, std::memory_order_release);
        return true;
    }
private:
    std::array<T, Size> buffer;
    std::atomic<size_t> writePos{0};
    std::atomic<size_t> readPos{0};
};`}
                  </pre>
                </div>
              )}

              {archTab === 'sync' && (
                <div className="space-y-3">
                  <p className="text-gray-400"><strong>DAW Transport & PPQ synchronization algorithm:</strong> The generative engine operates synchronized tightly on standard Pulses Per Quarter Note (PPQ). Calculate step intervals inside the MIDI buffer depending on current host tempo and track time signatures.</p>
                  <pre className="bg-[#060608] p-3 rounded border border-white/5 text-[#32d74b] overflow-x-auto text-[9px]">
{`// Syncing midi generation to DAW callback thread
void processBlock(AudioBuffer<float>& buffer, MidiBuffer& midiMessages, PlayHeadInfo playHead) 
{
    double currentPPQ = playHead.ppqPosition;
    double samplesPerBeat = (sampleRate * 60.0) / playHead.bpm;
    double samplesPerPPQ = samplesPerBeat / playHead.ppqResolution; // usually 960 PPQ

    for (int sample = 0; sample < buffer.getNumSamples(); ++sample) {
        double precisePPQ = currentPPQ + (sample / samplesPerBeat);
        // Compare PPQ steps to timeline chord bounds
        if (precisePPQ >= targetNextStepPPQ) {
            int midiOffsetSamples = sample;
            midiMessages.addEvent(MidiMessage::noteOn(1, activeNoteNumber, 100), midiOffsetSamples);
            targetNextStepPPQ += ticksPerStep;
        }
    }
}`}
                  </pre>
                </div>
              )}

              {archTab === 'state' && (
                <div className="space-y-3">
                  <p className="text-gray-400"><strong>Data Architecture & Multi-Track Harmonic States:</strong> Map chord automation structures to maintain local timelines and relative progressions across separate DAW routing lanes.</p>
                  <pre className="bg-[#060608] p-3 rounded border border-white/5 text-[#32d74b] overflow-x-auto text-[9px]">
{`struct ChordEvent {
    double startPPQ;
    double durationPPQ;
    std::string chordName;
    int rootMidiPitch;
    std::vector<int> inversionIntervals; // [0, 4, 7] etc
};

class HarmonicTrack {
public:
    std::string keySignature;   // "C"
    std::string scaleMode;      // "Major"
    std::vector<ChordEvent> chordTimeline;
    bool syncToGlobalMasterKey;
    
    // Auto voice-leading calculations
    void optimizeTransitions() {
        for(size_t i = 1; i < chordTimeline.size(); ++i) {
            applySmoothInversions(chordTimeline[i-1], chordTimeline[i]);
        }
    }
};`}
                  </pre>
                </div>
              )}

              {archTab === 'plugins' && (
                <div className="space-y-3">
                  <p className="text-gray-400"><strong>Plugin Hosting Insert Sandbox Strategy:</strong> Scaler sits in the DAW's MIDI channel strip as a "MIDI FX processor" preceding instrument inserts in the audio/MIDI graph, intercepting and transforming raw keyboard input.</p>
                  <pre className="bg-[#060608] p-3 rounded border border-white/5 text-[#32d74b] overflow-x-auto text-[9px]">
{`// Signal chain visualization
[ Incoming MIDI Device ] 
        │
        ▼
[ Slot 1: Scaler Engine (MIDI Transform Insert) ] 
        │  Generates arpeggios, chords, voice leadings
        ▼
[ Slot 2: Third-Party VST3 / AU Plugin Instrument ]
        │  Synthesizes audio stream
        ▼
[ Slot 3: FX Rack (Dynamic Parametric EQ) ]
        │  Spectral modeling outputs
        ▼
[ Master Stereo Output Buffer ]`}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-lg text-[9px] text-[#dfc7aa]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span><strong>Architect Pro Tip:</strong> Always employ dynamic thread-priority boosting (using thread-scheduling attributes like SCHED_FIFO or JUCE_REALTIME) in the DAW engine loop to guarantee sub-5ms processing latencies during complex polyphonic arpeggiation spikes.</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
