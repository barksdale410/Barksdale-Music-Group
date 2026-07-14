// Chord encyclopedia - core set of the most important chords for production
// Full dataset covers all types × 12 roots

type ChordEntry = {
  symbol: string;
  name: string;
  root: string;
  type: string;
  formula: string;
  pcSet: number[];
  emotionalColor: string;
  fingering: { rh: string; lh: string };
  inversions: string[];
  genreUse: string[];
  orchestralColor: string;
  producerUse: string[];
  dawInstrument: Record<string, string>;
};

const roots = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

const chordTypes: { type: string; symbol: string; formula: string; pcSetPattern: number[]; emotionalColor: string; genreUse: string[]; orchestralColor: string }[] = [
  { type: "Major", symbol: "maj", formula: "1 - 3 - 5", pcSetPattern: [0, 4, 7], emotionalColor: "Bright, stable, confident. Foundation of Western harmony.", genreUse: ["Pop", "Gospel", "Jazz", "R&B", "Country"], orchestralColor: "Full strings, brass section for power", },
  { type: "Minor", symbol: "m", formula: "1 - b3 - 5", pcSetPattern: [0, 3, 7], emotionalColor: "Sad, introspective, emotional depth. The most expressive chord.", genreUse: ["Hip Hop", "R&B", "Blues", "Jazz", "Soul"], orchestralColor: "Solo strings for sadness, full strings for drama", },
  { type: "Major 7", symbol: "maj7", formula: "1 - 3 - 5 - 7", pcSetPattern: [0, 4, 7, 11], emotionalColor: "Dreamy, sophisticated, floating. Neo-soul and jazz essential.", genreUse: ["Neo-Soul", "Jazz", "R&B", "Gospel", "Lo-Fi"], orchestralColor: "Strings with flute, intimate chamber feel", },
  { type: "Minor 7", symbol: "m7", formula: "1 - b3 - 5 - b7", pcSetPattern: [0, 3, 7, 10], emotionalColor: "Dark, brooding, introspective. Essential hip-hop harmony.", genreUse: ["Hip Hop", "R&B", "Neo-Soul", "Jazz", "Gospel"], orchestralColor: "Strings for weight, Rhodes for soul", },
  { type: "Dominant 7", symbol: "7", formula: "1 - 3 - 5 - b7", pcSetPattern: [0, 4, 7, 10], emotionalColor: "Tension, anticipation, blues. Creates movement and resolution.", genreUse: ["Blues", "Jazz", "Gospel", "Funk", "Soul"], orchestralColor: "Brass for tension, full orchestra for drama", },
  { type: "Major 9", symbol: "maj9", formula: "1 - 3 - 5 - 7 - 9", pcSetPattern: [0, 4, 7, 11, 14], emotionalColor: "Lush, expansive, sophisticated. Full neo-soul warmth.", genreUse: ["Neo-Soul", "Jazz", "R&B", "Gospel"], orchestralColor: "Full strings with woodwinds, lush and expansive", },
  { type: "Minor 9", symbol: "m9", formula: "1 - b3 - 5 - b7 - 9", pcSetPattern: [0, 3, 7, 10, 14], emotionalColor: "Rich, soulful darkness. Hip-hop's most expressive chord.", genreUse: ["Hip Hop", "R&B", "Neo-Soul", "Jazz"], orchestralColor: "Strings with choir, soulful depth", },
  { type: "Minor 11", symbol: "m11", formula: "1 - b3 - 5 - b7 - 9 - 11", pcSetPattern: [0, 3, 7, 10, 14, 17], emotionalColor: "Dense, cosmic, otherworldly. Maximum harmonic richness.", genreUse: ["Neo-Soul", "Jazz", "Gospel", "R&B"], orchestralColor: "Full orchestra, maximum harmonic richness", },
  { type: "Sus2", symbol: "sus2", formula: "1 - 2 - 5", pcSetPattern: [0, 2, 7], emotionalColor: "Open, spacious, ambiguous. Creates harmonic breathing room.", genreUse: ["Pop", "R&B", "Electronic", "Film"], orchestralColor: "Strings, spacious and open", },
  { type: "Sus4", symbol: "sus4", formula: "1 - 4 - 5", pcSetPattern: [0, 5, 7], emotionalColor: "Suspended tension, yearning. Unresolved longing.", genreUse: ["Gospel", "Pop", "Film", "Electronic"], orchestralColor: "Strings with brass, tension wanting resolution", },
  { type: "Diminished 7", symbol: "dim7", formula: "1 - b3 - b5 - bb7", pcSetPattern: [0, 3, 6, 9], emotionalColor: "Maximum tension, horror, instability. Used for dramatic effect.", genreUse: ["Jazz", "Gospel", "Film", "Classical"], orchestralColor: "Full orchestra dramatic, horror strings", },
  { type: "Half Diminished", symbol: "m7b5", formula: "1 - b3 - b5 - b7", pcSetPattern: [0, 3, 6, 10], emotionalColor: "Eerie, unsettled, sophisticated. Jazz minor harmony staple.", genreUse: ["Jazz", "Film Noir", "Neo-Soul", "Gospel"], orchestralColor: "Low strings, cellos and violas", },
  { type: "Augmented", symbol: "aug", formula: "1 - 3 - #5", pcSetPattern: [0, 4, 8], emotionalColor: "Dreamy uncertainty, transitional. Creates a floating sensation.", genreUse: ["Gospel", "Jazz", "Film", "Classical"], orchestralColor: "Strings with woodwinds, dreamy and floating", },
  { type: "Add 9", symbol: "add9", formula: "1 - 3 - 5 - 9", pcSetPattern: [0, 4, 7, 14], emotionalColor: "Bright with sparkle. Open, fresh major color.", genreUse: ["Pop", "R&B", "Gospel", "Neo-Soul"], orchestralColor: "Strings with piano, bright and open", },
  { type: "6/9", symbol: "6/9", formula: "1 - 3 - 5 - 6 - 9", pcSetPattern: [0, 4, 7, 9, 14], emotionalColor: "Lush, warm, timeless. Jazz standard sound.", genreUse: ["Jazz", "Neo-Soul", "Bossa Nova", "R&B"], orchestralColor: "Jazz ensemble, warm and sophisticated", },
];

function getNoteName(root: string, semitones: number): string {
  const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const useFlats = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"].includes(root);
  const rootIdx = sharpNotes.indexOf(root) !== -1 ? sharpNotes.indexOf(root) : flatNotes.indexOf(root);
  const noteIdx = (rootIdx + semitones) % 12;
  return useFlats ? flatNotes[noteIdx] : sharpNotes[noteIdx];
}

const defaultDawInstrument = (chord: string): Record<string, string> => ({
  garageband_ios: "Classic Electric Piano",
  garageband_mac: "Vintage Electric Piano",
  fl_studio: "FLEX — Electric Piano",
  fl_studio_mobile: "Electric Piano",
  logic_pro: "Vintage Electric Piano",
  ableton: "Electric Piano (Sampler)",
  bandlab: "E. Piano",
  pro_tools: "Structure Free — Rhodes",
  reason: "NN-XT — Mark I",
  cubase: "HALion — Rhodes"
});

const producersByChordType: Record<string, string[]> = {
  "Minor 7": ["Conductor Williams", "Daringer", "The Alchemist"],
  "Major 7": ["Robert Glasper", "Kaytranada", "D'Mile"],
  "Minor 9": ["Madlib", "Pete Rock", "9th Wonder"],
  "Major 9": ["Babyface", "Jimmy Jam & Terry Lewis", "Pharrell"],
  "Dominant 7": ["DJ Premier", "Pete Rock", "Ahmad Jamal"],
  "Sus4": ["Just Blaze", "Kanye West", "Gospel producers"],
  "Minor 11": ["Robert Glasper", "Kamasi Washington", "Terrace Martin"],
  "Major": ["Max Martin", "Pharrell", "Just Blaze"],
  "Minor": ["Metro Boomin", "Dr. Dre", "Timbaland"],
  "Diminished 7": ["Ahmad Jamal", "Gospel producers", "Film composers"],
};

export const chords: ChordEntry[] = [];

for (const root of roots) {
  for (const ct of chordTypes) {
    const pcSet = ct.pcSetPattern.map(s => (s % 12));
    const symbol = root + ct.symbol;
    chords.push({
      symbol,
      name: `${root} ${ct.type}`,
      root,
      type: ct.type,
      formula: ct.formula,
      pcSet,
      emotionalColor: ct.emotionalColor,
      fingering: { rh: "1-2-3-5", lh: "5-4-2-1" },
      inversions: [symbol, `${symbol}/b3`, `${symbol}/5`],
      genreUse: ct.genreUse,
      orchestralColor: ct.orchestralColor,
      producerUse: producersByChordType[ct.type] || ["Various producers"],
      dawInstrument: defaultDawInstrument(symbol),
    });
  }
}

