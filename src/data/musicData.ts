// Barksdale Music Group - Unified Production Database

export interface ChordDefinition {
  name: string;
  notes: string[]; // MIDI notes relative to root (e.g., [0, 4, 7] for Major)
  description: string;
}

export const CHORD_TYPES: Record<string, { intervals: number[]; desc: string }> = {
  "Major": { intervals: [0, 4, 7], desc: "Bright, stable, and happy" },
  "Minor": { intervals: [0, 3, 7], desc: "Dark, melancholic, and emotional" },
  "Dominant 7th": { intervals: [0, 4, 7, 10], desc: "Bluesy, tense, wants to resolve" },
  "Major 7th": { intervals: [0, 4, 7, 11], desc: "Dreamy, warm, jazz-tinged" },
  "Minor 7th": { intervals: [0, 3, 7, 10], desc: "Mellow, sophisticated, soulful" },
  "Diminished": { intervals: [0, 3, 6], desc: "Highly tense, mysterious, unstable" },
  "Augmented": { intervals: [0, 4, 8], desc: "Suspended in air, dreamlike, cinematic" },
  "Sus4": { intervals: [0, 5, 7], desc: "Suspended tension, open, neutral" },
  "Sus2": { intervals: [0, 2, 7], desc: "Spacious, modern, gentle tension" },
  "Diminished 7th": { intervals: [0, 3, 6, 9], desc: "Spooky, high drama, classic cinematic" },
  "Half-Diminished 7th": { intervals: [0, 3, 6, 10], desc: "Emotional tension, poignant" },
  "Major 9th": { intervals: [0, 4, 7, 11, 14], desc: "Ultra-luxurious, expansive, rich" },
  "Minor 9th": { intervals: [0, 3, 7, 10, 14], desc: "Deeply late-night, jazzy, intellectual" }
};

export const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// 1. Chords Encyclopedia (Generates all chords x 12 root notes dynamically + static adjustments)
export interface ChordInfo {
  root: string;
  type: string;
  notes: number[]; // absolute MIDI notes starting at a base octave (e.g. Octave 4, C4 = 60)
  noteNames: string[];
  formula: string;
  description: string;
}

export const getChordNotes = (root: string, type: string, baseOctave = 4): { midi: number[]; names: string[] } => {
  const rootIndex = ROOT_NOTES.indexOf(root);
  const baseMidi = 48 + rootIndex; // starting pitch
  const intervals = CHORD_TYPES[type]?.intervals || [0, 4, 7];
  
  const midi = intervals.map(interval => baseMidi + interval);
  const names = midi.map(m => {
    const noteName = ROOT_NOTES[m % 12];
    const octave = Math.floor(m / 12) - 1;
    return `${noteName}${octave}`;
  });
  
  return { midi, names };
};

// Generate entire database of chords (12 roots * 13 chord types = 156 chords)
export const CHORD_ENCYCLOPEDIA: ChordInfo[] = [];
ROOT_NOTES.forEach(root => {
  Object.keys(CHORD_TYPES).forEach(type => {
    const { midi, names } = getChordNotes(root, type);
    CHORD_ENCYCLOPEDIA.push({
      root,
      type,
      notes: midi,
      noteNames: names,
      formula: CHORD_TYPES[type].intervals.join("-"),
      description: `${root} ${type}: ${CHORD_TYPES[type].desc}.`
    });
  });
});

// 2. Emotion to Chords (20+ Emotions mapped to concrete chord sequences and scale details)
export interface EmotionProgression {
  emotion: string;
  scale: string;
  bpm: number;
  description: string;
  progression: string[]; // chord names like "Cmaj7", "Am7"
  intervals: string[]; // roman numerals
  signatureLicks?: string[];
}

export const EMOTION_TO_CHORDS: EmotionProgression[] = [
  { emotion: "Triumphant", scale: "C Major", bpm: 125, description: "Victorious, powerful, heroic lift", progression: ["C", "G", "Am", "F"], intervals: ["I", "V", "vi", "IV"] },
  { emotion: "Melancholic", scale: "A Minor", bpm: 85, description: "Dusty record player, deep introverted sad vibes", progression: ["Am", "Dm", "F", "E7"], intervals: ["i", "iv", "VI", "V7"] },
  { emotion: "Nostalgic", scale: "G Major", bpm: 92, description: "Warm evening, longing, vintage memory tape", progression: ["G", "D/F#", "Em7", "Cadd9"], intervals: ["I", "V6", "vi7", "IVadd9"] },
  { emotion: "Fearful", scale: "D Minor", bpm: 75, description: "Suspenseful, haunting shadow, high tension", progression: ["Dm", "Bb", "Gm", "A7#5"], intervals: ["i", "VI", "iv", "V7alt"] },
  { emotion: "Energetic", scale: "E Minor", bpm: 135, description: "Pulsing neon drive, highly motivated fast motion", progression: ["Em", "C", "G", "D"], intervals: ["i", "VI", "III", "VII"] },
  { emotion: "Suspenseful", scale: "F# Minor", bpm: 80, description: "Tense heartbeat, unresolved crime investigation", progression: ["F#m", "Dmaj7", "G#dim", "C#7"], intervals: ["i", "VI7", "iio", "V7"] },
  { emotion: "Euphoric", scale: "F Major", bpm: 128, description: "Sun-drenched festival field, pure soaring hope", progression: ["F", "Bb", "Dm", "C"], intervals: ["I", "IV", "vi", "V"] },
  { emotion: "Dark", scale: "C# Minor", bpm: 140, description: "Late-night urban crawl, industrial, menacing", progression: ["C#m", "A", "F#m", "G#"], intervals: ["i", "VI", "iv", "V"] },
  { emotion: "Hopeful", scale: "D Major", bpm: 105, description: "Morning sun rising over mountains, quiet clarity", progression: ["D", "A/C#", "Bm7", "G"], intervals: ["I", "V6", "vi7", "IV"] },
  { emotion: "Romantic", scale: "A Major", bpm: 90, description: "Warm candlelight, velvety soul fusion", progression: ["Amaj7", "F#m7", "Bm7", "E9"], intervals: ["Imaj7", "vi7", "ii7", "V9"] },
  { emotion: "Mystical", scale: "E Phrygian", bpm: 96, description: "Egyptian sands, ancient portal opening", progression: ["Em", "F", "G", "F"], intervals: ["i", "bII", "bIII", "bII"] },
  { emotion: "Aggressive", scale: "B Minor", bpm: 145, description: "Heavy metal overdrive, combat ready, highly volatile", progression: ["Bm", "G", "F#7", "Em"], intervals: ["i", "VI", "V7", "iv"] },
  { emotion: "Deep Soulful", scale: "Eb Major", bpm: 82, description: "Classic Motown luxury, warm brass and Rhodes", progression: ["Ebmaj7", "Cm7", "Fm9", "Bb13"], intervals: ["Imaj7", "vi7", "ii9", "V13"] },
  { emotion: "Ethereal Dream", scale: "A Major", bpm: 70, description: "Floating among stars, weightless drift pads", progression: ["Amaj7", "C#m7", "Dmaj7", "Dm7"], intervals: ["Imaj7", "iii7", "IVmaj7", "iv7"] },
  { emotion: "Smooth Groove", scale: "D Minor", bpm: 110, description: "Late night coastal highway cruise", progression: ["Dm9", "G13", "Cmaj9", "Am7"], intervals: ["ii9", "V13", "Imaj9", "vi7"] },
  { emotion: "Haunted Vinyl", scale: "G Minor", bpm: 88, description: "Spooky jazz box sample, crackling surface noise", progression: ["Gm", "Cm7", "D7alt", "Ebmaj7"], intervals: ["i", "iv7", "V7alt", "VImaj7"] },
  { emotion: "Cinematic Sunset", scale: "C Major", bpm: 72, description: "Epic drone landscape, slow orchestral swell", progression: ["C", "F/C", "Am/C", "G/C"], intervals: ["I", "IV/I", "vi/I", "V/I"] },
  { emotion: "Cozy Fireside", scale: "F# Major", bpm: 84, description: "Warm fireplace jazz, dusty Rhodes key strokes", progression: ["F#maj7", "E#m7b5", "A#7", "D#m7"], intervals: ["Imaj7", "viiø7", "III7", "vi7"] },
  { emotion: "Hustler Grit", scale: "C Minor", bpm: 90, description: "Underground boom bap brick wall sound", progression: ["Cm7", "Fm7", "Ab7", "G7alt"], intervals: ["i7", "iv7", "bVI7", "V7alt"] },
  { emotion: "Summer Bliss", scale: "E Major", bpm: 120, description: "Bouncy poolside disco lounge groove", progression: ["Emaj7", "Amaj7", "F#m7", "B7"], intervals: ["Imaj7", "IVmaj7", "ii7", "V7"] }
];

// 3. Circle of Fifths (All 12 keys with sharps/flats, relative, and chords mapping)
export interface CircleKey {
  name: string; // key name
  fifths: number; // position from C (0)
  accidentals: string; // "3 Sharps", "2 Flats", "None"
  relativeMinor: string;
  relativeMinorChords: string[];
  majorChords: string[];
  frequency: number; // Base frequency for synthesizer trigger
}

export const CIRCLE_OF_FIFTHS: CircleKey[] = [
  { name: "C", fifths: 0, accidentals: "None", relativeMinor: "A", majorChords: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"], relativeMinorChords: ["Am", "Bdim", "C", "Dm", "Em", "F", "G"], frequency: 261.63 },
  { name: "G", fifths: 1, accidentals: "1 Sharp (F#)", relativeMinor: "E", majorChords: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"], relativeMinorChords: ["Em", "F#dim", "G", "Am", "Bm", "C", "D"], frequency: 392.00 },
  { name: "D", fifths: 2, accidentals: "2 Sharps (F#, C#)", relativeMinor: "B", majorChords: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"], relativeMinorChords: ["Bm", "C#dim", "D", "Em", "F#m", "G", "A"], frequency: 293.66 },
  { name: "A", fifths: 3, accidentals: "3 Sharps (F#, C#, G#)", relativeMinor: "F#", majorChords: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"], relativeMinorChords: ["F#m", "G#dim", "A", "Bm", "C#m", "D", "E"], frequency: 440.00 },
  { name: "E", fifths: 4, accidentals: "4 Sharps (F#, C#, G#, D#)", relativeMinor: "C#", majorChords: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"], relativeMinorChords: ["C#m", "D#dim", "E", "F#m", "G#m", "A", "B"], frequency: 329.63 },
  { name: "B", fifths: 5, accidentals: "5 Sharps (F#, C#, G#, D#, A#)", relativeMinor: "G#", majorChords: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"], relativeMinorChords: ["G#m", "A#dim", "B", "C#m", "D#m", "E", "F#"], frequency: 493.88 },
  { name: "F#", fifths: 6, accidentals: "6 Sharps (F#, C#, G#, D#, A#, E#)", relativeMinor: "D#", majorChords: ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"], relativeMinorChords: ["D#m", "E#dim", "F#", "G#m", "A#m", "B", "C#"], frequency: 369.99 },
  { name: "C#", fifths: 7, accidentals: "7 Sharps (all)", relativeMinor: "A#", majorChords: ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"], relativeMinorChords: ["A#m", "B#dim", "C#", "D#m", "E#m", "F#", "G#"], frequency: 277.18 },
  { name: "Ab", fifths: -4, accidentals: "4 Flats (Bb, Eb, Ab, Db)", relativeMinor: "F", majorChords: ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"], relativeMinorChords: ["Fm", "Gdim", "Ab", "Bbm", "Cm", "Db", "Eb"], frequency: 415.30 },
  { name: "Eb", fifths: -3, accidentals: "3 Flats (Bb, Eb, Ab)", relativeMinor: "C", majorChords: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"], relativeMinorChords: ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"], frequency: 311.13 },
  { name: "Bb", fifths: -2, accidentals: "2 Flats (Bb, Eb)", relativeMinor: "G", majorChords: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"], relativeMinorChords: ["Gm", "Adim", "Bb", "Cm", "Dm", "Eb", "F"], frequency: 466.16 },
  { name: "F", fifths: -1, accidentals: "1 Flat (Bb)", relativeMinor: "D", majorChords: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"], relativeMinorChords: ["Dm", "Edim", "F", "Gm", "Am", "Bb", "C"], frequency: 349.23 }
];

// 4. 8 AI Score Engines (Each engine has custom emotion selection, progressions, and structures)
export interface EngineData {
  id: string;
  name: string;
  tagline: string;
  defaultBpm: number;
  emotions: {
    name: string;
    description: string;
    progression: string[];
    beats: string[]; // Kick (K), Snare (S), Hat (H), Clap (C) for 8 steps e.g. "K.H.S.H.K.H.S.H"
    vocalChainPreset: string;
  }[];
}

export const AI_SCORE_ENGINES: EngineData[] = [
  {
    id: "engine_mafia",
    name: "MafiaScore",
    tagline: "Ominous, cinematic crime family heat with heavy 808s and slow strings",
    defaultBpm: 84,
    emotions: [
      { name: "Vengeful", description: "Hard-hitting cinematic tension, major-minor shift", progression: ["Am", "F", "Bdim", "E7"], beats: ["K", "H", "S", "H", "K", "K", "S", "H"], vocalChainPreset: "Gritty Brickwall Limiter" },
      { name: "Betrayal", description: "Soft, heartbreaking piano drift with synth bass sub", progression: ["Dm7", "Gm7", "Bbmaj7", "A7"], beats: ["K", ".", "S", ".", "K", ".", "S", "."], vocalChainPreset: "Smoky Vintage Hall" },
      { name: "The Godfather", description: "Classical minor march with high brass staccatos", progression: ["Cm", "G7", "Cm", "Fm"], beats: ["K", "H", "S", "H", "K", "H", "S", "C"], vocalChainPreset: "Tape Overdrive Satin" },
      { name: "Safehouse Escape", description: "Rapid pulse synth, heavy clock ticking sound", progression: ["Em", "Cmaj7", "F#dim", "B7#9"], beats: ["K", "H", "K", "H", "K", "H", "S", "H"], vocalChainPreset: "Ducking Compressor Echo" }
    ]
  },
  {
    id: "engine_gospel",
    name: "Gospel Score Engine",
    tagline: "Soul-stirring church organs, lush passing chords, and rhythmic handclaps",
    defaultBpm: 95,
    emotions: [
      { name: "Praise", description: "Uplifting, high-energy, heavy gospel tambourine", progression: ["F", "C/E", "Dm7", "Bbmaj9"], beats: ["K", "H", "C", "H", "K", "K", "C", "H"], vocalChainPreset: "Cathedral Choir Width" },
      { name: "Worship", description: "Lush piano organ pads, deeply emotional passing tones", progression: ["Abmaj7", "Dbmaj9", "Bbm9", "Eb13"], beats: ["K", ".", "C", ".", "K", ".", "C", "."], vocalChainPreset: "Silky Smooth Reverb" },
      { name: "Testimony", description: "Fast-driving shout rhythm with baseline walks", progression: ["C7", "F7", "C7", "G7alt"], beats: ["K", "C", "K", "C", "K", "C", "K", "C"], vocalChainPreset: "Presence Up Tube Pre" }
    ]
  },
  {
    id: "engine_jazz",
    name: "Jazz Infusion Engine",
    tagline: "Extended 9th and 11th chords, smoky lounge brass, and swing brushes",
    defaultBpm: 100,
    emotions: [
      { name: "Blue Lounge", description: "Dusty brass, classic ii-V-I progression, swing tempo", progression: ["Dm9", "G13", "Cmaj9", "Am9"], beats: ["K", "H", "S", "H", "K", "H", "S", "H"], vocalChainPreset: "Warm Ribbon Mic Pre" },
      { name: "Autumn Breeze", description: "Warm upright bass walk, soft major 7ths", progression: ["Fmaj9", "Bb13", "Em9", "A7alt"], beats: ["K", ".", "H", "S", "K", ".", "H", "S"], vocalChainPreset: "Cozy Tape Warmth" },
      { name: "Bebop Jump", description: "Fast walking patterns, tight trumpet stabs", progression: ["Cmaj7", "Am7", "Dm7", "G7"], beats: ["K", "H", "S", "K", "K", "H", "S", "H"], vocalChainPreset: "Bright Room Reflection" }
    ]
  },
  {
    id: "engine_lofi",
    name: "Lo-Fi Nostalgia Engine",
    tagline: "Dusty vinyl crackle, detuned Rhodes, tape-saturated guitar loops",
    defaultBpm: 78,
    emotions: [
      { name: "Rainy Day", description: "Distant water droplets, mellow filtered keys", progression: ["Am9", "D9", "Gmaj7", "Cmaj7"], beats: ["K", "H", "S", "H", ".", "K", "S", "."], vocalChainPreset: "Dusty Telephone Filter" },
      { name: "Midnight Coffee", description: "Warm analog hum, deep sub-bass padding", progression: ["Cmaj7", "Bm7", "Am7", "Em7"], beats: ["K", ".", "S", "H", "K", ".", "S", "."], vocalChainPreset: "12-Bit Vintage Bitcrusher" },
      { name: "Cozy Blanket", description: "Soft acoustic acoustic sample, lazy snare backbeat", progression: ["Fmaj7", "Fm7", "Cmaj7", "A7#5"], beats: ["K", "H", "S", ".", "K", "H", "S", "H"], vocalChainPreset: "Cassette Wow & Flutter" }
    ]
  },
  {
    id: "engine_trap",
    name: "Trap Platinum Engine",
    tagline: "Screaming 808 glides, lightning fast hi-hat rolls, and metallic plucks",
    defaultBpm: 140,
    emotions: [
      { name: "Savage Mode", description: "Menacing minor melody, wall-rattling 808 sub", progression: ["F#m", "G", "F#m", "Em"], beats: ["K", "H", "S", "H", "K", "K", "S", "H"], vocalChainPreset: "AutoTune Pitch Master" },
      { name: "Murda Run", description: "Dark brass, fast triplet hat rolls, gunshot effects", progression: ["Cm", "Ab", "Fm", "G7"], beats: ["K", "H", "S", "H", "K", "H", "S", "H"], vocalChainPreset: "Aggressive Distort Limit" },
      { name: "Platinum Ice", description: "Clean glockenspiel pluck, massive space pads", progression: ["D#m", "Bmaj7", "G#m", "A#7"], beats: ["K", ".", "S", "H", "K", "K", "S", "."], vocalChainPreset: "Crisp High-End Exciter" }
    ]
  },
  {
    id: "engine_orchestral",
    name: "Orchestral Color Guide",
    tagline: "Rich brass textures, soaring violin leads, and cinematic impact timpani",
    defaultBpm: 72,
    emotions: [
      { name: "Epic Hope", description: "Majestic string build-up, bright brass fanfares", progression: ["C", "F", "G", "Am"], beats: ["K", ".", ".", ".", "K", ".", ".", "."], vocalChainPreset: "Concert Hall Symphony Space" },
      { name: "Tragic Descent", description: "Sorrowful cello solos, muted French horns", progression: ["Dminor", "Bb", "F", "C"], beats: ["K", ".", ".", ".", "K", ".", "S", "."], vocalChainPreset: "Deep Melancholic Chamber" },
      { name: "Tense Suspense", description: "Rapid violin pizzicato, sharp brass swells", progression: ["G#minor", "E", "C#dim", "D#7"], beats: ["K", "H", "K", "H", "K", "H", "K", "H"], vocalChainPreset: "Surround Delay Panner" }
    ]
  },
  {
    id: "engine_rb",
    name: "R&B Late-Night Engine",
    tagline: "Velvety neo-soul Rhodes, smooth bass slides, and crisp modern snaps",
    defaultBpm: 90,
    emotions: [
      { name: "Velvet Sheets", description: "Sensual 9th chords, soft guitar plucks, crisp snaps", progression: ["Ebmaj9", "Abmaj9", "Fm9", "Bb13"], beats: ["K", "H", "C", "H", "K", ".", "C", "."], vocalChainPreset: "Silky R&B Vocal Plate" },
      { name: "Neo-Soul Rain", description: "Complex passing chords, warm live bassline feel", progression: ["Dm11", "G7alt", "Cmaj9", "A7#9"], beats: ["K", ".", "C", "H", "K", "K", "C", "."], vocalChainPreset: "Warm Tube Double" },
      { name: "Sunset Cruise", description: "Bouncy baseline, light synth lead, summery groove", progression: ["Gmaj9", "Em9", "Am9", "D13"], beats: ["K", "H", "C", "H", "K", "H", "C", "H"], vocalChainPreset: "Airy Vocal Harmonizer" }
    ]
  },
  {
    id: "engine_boombap",
    name: "Boom Bap Cinema",
    tagline: "Dusty horn loops, gritty drum breaks, and legendary NY street vibe",
    defaultBpm: 90,
    emotions: [
      { name: "Queensbridge Grit", description: "Heavy vinyl dust, minor horn loop stabs, fat neck-snapping snare", progression: ["Cm7", "Dm7", "Ebmaj7", "Dm7"], beats: ["K", "H", "S", "H", "K", "K", "S", "H"], vocalChainPreset: "Gritty Brickwall Preamp" },
      { name: "Bronx '93", description: "Dusty funk bass, bright acoustic drum rolls", progression: ["Gm", "C7", "Gm", "C7"], beats: ["K", "H", "S", "K", "K", "H", "S", "H"], vocalChainPreset: "Raw Shure SM58 Drive" },
      { name: "Detroit Dilla", progression: ["Abmaj7", "G7alt", "Cm9", "F9"], description: "Drunken unquantized beat swing, warm Rhodes keys", beats: ["K", ".", "S", "H", "K", "K", "S", "."], vocalChainPreset: "Analog Tape Saturation" }
    ]
  }
];

// 5. DAW Stock Instrument Mappings
// Maps each instrument globally to its actual stock preset name inside specific DAWs.
// Controlled by user's selected DAW in profile.
export interface DAWInstrumentMap {
  daw: string;
  instruments: Record<string, string>;
}

export const DAW_INSTRUMENT_MAPPINGS: DAWInstrumentMap[] = [
  {
    daw: "GarageBand iOS",
    instruments: {
      "Acoustic Piano": "Grand Piano",
      "Electric Piano": "Rhodes Keyboard",
      "Rhodes": "Classic Active",
      "Hammond Organ": "Classic Organ",
      "String Section": "Chamber Strings",
      "Brass Section": "Pop Horns",
      "Acoustic Bass": "Upright Bass",
      "Synth Bass": "Deep House Bass",
      "Sub Bass": "808 Bass",
      "Nylon Guitar": "Classic Acoustic",
      "Steel Guitar": "Roots Rock Steel",
      "Heavy Guitar": "Hard Rock Distorted",
      "Lead Synth": "Neon Lead",
      "Pad Synth": "Deep Space Pad",
      "Pluck Synth": "GlockenPluck",
      "808 Bass": "808 Flex",
      "Acoustic Drums": "SoCal Drummer",
      "Trap Drums": "Sunset Beats",
      "Lo-Fi Drums": "Vintage Vinyl kit",
      "Cinematic Percussion": "Orchestral Kit"
    }
  },
  {
    daw: "FL Studio Mobile",
    instruments: {
      "Acoustic Piano": "Grand Piano HD",
      "Electric Piano": "E-Piano 1",
      "Rhodes": "Rhodes Mark II",
      "Hammond Organ": "Drawbar Organ",
      "String Section": "Orchestral Strings",
      "Brass Section": "Session Horns",
      "Acoustic Bass": "Acoustic Bass",
      "Synth Bass": "DirectWave Acid",
      "Sub Bass": "MiniSynth Sub",
      "Nylon Guitar": "Nylon String",
      "Steel Guitar": "Steel Guitar HD",
      "Heavy Guitar": "Distorted Lead Solo",
      "Lead Synth": "Saw Lead GMS",
      "Pad Synth": "Celestial Pad",
      "Pluck Synth": "Bell Pluck GMS",
      "808 Bass": "808 Kick 12",
      "Acoustic Drums": "Real Drums Kit",
      "Trap Drums": "808 State Kit",
      "Lo-Fi Drums": "Dusty Hip Hop Kit",
      "Cinematic Percussion": "Timpani Orchestra"
    }
  },
  {
    daw: "FL Studio",
    instruments: {
      "Acoustic Piano": "FLEX - Essential Pianos",
      "Electric Piano": "Harmless - EP preset",
      "Rhodes": "Sytrus - Rhodes Mark I",
      "Hammond Organ": "Sytrus - Hammond Organ",
      "String Section": "FLEX - Orchestral Strings",
      "Brass Section": "FLEX - Orchestral Brass",
      "Acoustic Bass": "DirectWave - Acoustic Bass",
      "Synth Bass": "FLEX - Synthesizer Bass",
      "Sub Bass": "3xOSC - Sub Sine",
      "Nylon Guitar": "FLEX - Acoustic Guitar",
      "Steel Guitar": "FLEX - Steel Guitar",
      "Heavy Guitar": "FLEX - Distorted Metal",
      "Lead Synth": "Poizone - EDM Lead",
      "Pad Synth": "FLEX - Celestial Pads",
      "Pluck Synth": "Sytrus - Pluck Bell",
      "808 Bass": "Fruity Sampler - 808 C5",
      "Acoustic Drums": "FPC - Acoustic Kit",
      "Trap Drums": "FPC - Trap Premium Kit",
      "Lo-Fi Drums": "FPC - LoFi Beatmaker",
      "Cinematic Percussion": "DirectWave - Orchestral Hit"
    }
  },
  {
    daw: "Logic Pro",
    instruments: {
      "Acoustic Piano": "Steinway Grand Piano",
      "Electric Piano": "Vintage Electric Piano",
      "Rhodes": "Suited Rhodes Suitcase",
      "Hammond Organ": "Vintage B3 Organ",
      "String Section": "Studio Strings Standard",
      "Brass Section": "Studio Horns Pop",
      "Acoustic Bass": "Upright Bass Acoustic",
      "Synth Bass": "Retro Synth - Acid Bass",
      "Sub Bass": "ES2 - Sine Sub",
      "Nylon Guitar": "Acoustic Nylon Guitar",
      "Steel Guitar": "Acoustic Steel Guitar",
      "Heavy Guitar": "Amp Designer Heavy Metal",
      "Lead Synth": "ES2 - Jupiter Lead",
      "Pad Synth": "Alchemy - Warm Pad",
      "Pluck Synth": "Retro Synth - Pluck",
      "808 Bass": "Drum Machine Designer - 808 Flex",
      "Acoustic Drums": "Drummer - SoCal Classic",
      "Trap Drums": "Electronic Kit - Atlanta Trap",
      "Lo-Fi Drums": "Electronic Kit - Dusty Vinyl",
      "Cinematic Percussion": "Orchestral Timpani Kit"
    }
  },
  {
    daw: "Ableton Live",
    instruments: {
      "Acoustic Piano": "Grand Piano Instrument Rack",
      "Electric Piano": "Electric - EP Mark I",
      "Rhodes": "Rhodes Suitcase Warm",
      "Hammond Organ": "Tension - Drawbar Organ",
      "String Section": "Orchestral Strings Rack",
      "Brass Section": "Orchestral Brass Rack",
      "Acoustic Bass": "Upright Bass instrument",
      "Synth Bass": "Analog - Acid Sub Bass",
      "Sub Bass": "Operator - Sub Sine wave",
      "Nylon Guitar": "Acoustic Nylon",
      "Steel Guitar": "Acoustic Steel",
      "Heavy Guitar": "Amp - Heavy Overdrive Guitar",
      "Lead Synth": "Wavetable - Pulse Lead",
      "Pad Synth": "Wavetable - Warm Pad",
      "Pluck Synth": "Operator - Bell Pluck",
      "808 Bass": "Drum Rack - 808 Sub Kick",
      "Acoustic Drums": "Drum Rack - Kit-Session Dry",
      "Trap Drums": "Drum Rack - Kit-808 Classic",
      "Lo-Fi Drums": "Drum Rack - Vinyl Dust Kit",
      "Cinematic Percussion": "Orchestral Timpani"
    }
  },
  {
    daw: "BandLab",
    instruments: {
      "Acoustic Piano": "Studio Grand Piano",
      "Electric Piano": "Classic E-Piano",
      "Rhodes": "Suitcase Rhodes Preset",
      "Hammond Organ": "Hammond B3 Organ",
      "String Section": "Violin Orchestra",
      "Brass Section": "Pop Brass Horns",
      "Acoustic Bass": "Classic Upright",
      "Synth Bass": "Moog Style Acid",
      "Sub Bass": "808 Sub-Bass Slider",
      "Nylon Guitar": "Classical Nylon Acoustic",
      "Steel Guitar": "Steel Folk Guitar",
      "Heavy Guitar": "Screamer Distorted Rock",
      "Lead Synth": "EDM Saw Lead",
      "Pad Synth": "Warm Celestial Pad",
      "Pluck Synth": "Bouncing Pluck Synthesizer",
      "808 Bass": "Sub-Bass 808 Trap",
      "Acoustic Drums": "Acoustic Studio Kit",
      "Trap Drums": "Atlanta Trap 808",
      "Lo-Fi Drums": "Lo-Fi Lounge Drums",
      "Cinematic Percussion": "Cinematic Timpani"
    }
  }
];

import { EXTENDED_PRODUCERS } from './extendedProducers';

// 6. Producer Libraries (Details of famous producers and their preset libraries)
export interface ProducerTemplate {
  id: string;
  name: string;
  avatarUrl: string;
  category: string;
  signatureBpm: number;
  signatureScale: string;
  bio: string;
  signatureProgressions: {
    name: string;
    progression: string[];
    description: string;
  }[];
  producerLibrary: {
    drums: string;
    bass: string;
    melodic: string;
  };
}

export const PRODUCER_LIBRARIES: ProducerTemplate[] = [
  ...EXTENDED_PRODUCERS
];

// 7. Legendary Pairings (For the Collaboration tab)
export interface LegendaryPairing {
  id: string;
  names: string;
  signatureStyle: string;
  signatureBpm: number;
  bio: string;
  progression: string[];
}

export const LEGENDARY_PAIRINGS: LegendaryPairing[] = [
  {
    id: "pair_jazzy_alchemist",
    names: "Jazzy Jeff x The Alchemist",
    signatureStyle: "Organic Scratch Meets Cinematic Grit",
    signatureBpm: 86,
    bio: "Classic turntablism meets deep vintage movie crate digging. Beautiful Rhodes progressions underlying energetic record scratch breaks.",
    progression: ["Gm9", "C13", "Fmaj9", "Bb13"]
  },
  {
    id: "pair_madlib_dilla",
    names: "Madlib x J Dilla",
    signatureStyle: "Jaylib - Unquantized Experimental Soul",
    signatureBpm: 92,
    bio: "The ultimate meeting of Detroit and California sample masters. Heavy off-grid drum swings, dusty jazz-fusion chords, and extreme tape warmth.",
    progression: ["Abmaj9", "Dbmaj9", "Cm7", "F7#9"]
  },
  {
    id: "pair_dre_storch",
    names: "Dr. Dre x Scott Storch",
    signatureStyle: "Aftermath Precision West Coast Keys",
    signatureBpm: 95,
    bio: "Pristine, mathematical piano runs combined with heavy, clinical MPC drum snaps. Legendary for early 2000s club anthems and clean synth strings.",
    progression: ["Am", "Dm", "G", "C"]
  },
  {
    id: "pair_timbaland_danja",
    names: "Timbaland x Danja",
    signatureStyle: "Futuristic Electronic Synth R&B",
    signatureBpm: 115,
    bio: "Beatboxing patterns combined with soaring, syncopated modular synthesizer lines. Defined the high-energy club pop sound of the late 2000s.",
    progression: ["Ebm", "Abm", "Db", "Bbm"]
  }
];
