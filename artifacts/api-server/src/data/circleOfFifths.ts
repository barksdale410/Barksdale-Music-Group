export const circleOfFifths = {
  keys: [
    {
      root: "C",
      mode: "Major",
      relativeMinor: "A Minor",
      chords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"],
      notes: ["C", "D", "E", "F", "G", "A", "B"],
      sharpsFlats: 0
    },
    {
      root: "G",
      mode: "Major",
      relativeMinor: "E Minor",
      chords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#m7b5"],
      notes: ["G", "A", "B", "C", "D", "E", "F#"],
      sharpsFlats: 1
    },
    {
      root: "D",
      mode: "Major",
      relativeMinor: "B Minor",
      chords: ["Dmaj7", "Em7", "F#m7", "Gmaj7", "A7", "Bm7", "C#m7b5"],
      notes: ["D", "E", "F#", "G", "A", "B", "C#"],
      sharpsFlats: 2
    },
    {
      root: "A",
      mode: "Major",
      relativeMinor: "F# Minor",
      chords: ["Amaj7", "Bm7", "C#m7", "Dmaj7", "E7", "F#m7", "G#m7b5"],
      notes: ["A", "B", "C#", "D", "E", "F#", "G#"],
      sharpsFlats: 3
    },
    {
      root: "E",
      mode: "Major",
      relativeMinor: "C# Minor",
      chords: ["Emaj7", "F#m7", "G#m7", "Amaj7", "B7", "C#m7", "D#m7b5"],
      notes: ["E", "F#", "G#", "A", "B", "C#", "D#"],
      sharpsFlats: 4
    },
    {
      root: "B",
      mode: "Major",
      relativeMinor: "G# Minor",
      chords: ["Bmaj7", "C#m7", "D#m7", "Emaj7", "F#7", "G#m7", "A#m7b5"],
      notes: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
      sharpsFlats: 5
    },
    {
      root: "F#",
      mode: "Major",
      relativeMinor: "D# Minor",
      chords: ["F#maj7", "G#m7", "A#m7", "Bmaj7", "C#7", "D#m7", "E#m7b5"],
      notes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
      sharpsFlats: 6
    },
    {
      root: "Db",
      mode: "Major",
      relativeMinor: "Bb Minor",
      chords: ["Dbmaj7", "Ebm7", "Fm7", "Gbmaj7", "Ab7", "Bbm7", "Cm7b5"],
      notes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
      sharpsFlats: -5
    },
    {
      root: "Ab",
      mode: "Major",
      relativeMinor: "F Minor",
      chords: ["Abmaj7", "Bbm7", "Cm7", "Dbmaj7", "Eb7", "Fm7", "Gm7b5"],
      notes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
      sharpsFlats: -4
    },
    {
      root: "Eb",
      mode: "Major",
      relativeMinor: "C Minor",
      chords: ["Ebmaj7", "Fm7", "Gm7", "Abmaj7", "Bb7", "Cm7", "Dm7b5"],
      notes: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
      sharpsFlats: -3
    },
    {
      root: "Bb",
      mode: "Major",
      relativeMinor: "G Minor",
      chords: ["Bbmaj7", "Cm7", "Dm7", "Ebmaj7", "F7", "Gm7", "Am7b5"],
      notes: ["Bb", "C", "D", "Eb", "F", "G", "A"],
      sharpsFlats: -2
    },
    {
      root: "F",
      mode: "Major",
      relativeMinor: "D Minor",
      chords: ["Fmaj7", "Gm7", "Am7", "Bbmaj7", "C7", "Dm7", "Em7b5"],
      notes: ["F", "G", "A", "Bb", "C", "D", "E"],
      sharpsFlats: -1
    },
    // Minor keys
    {
      root: "A",
      mode: "Minor",
      relativeMinor: "C Major",
      chords: ["Am7", "Bm7b5", "Cmaj7", "Dm7", "Em7", "Fmaj7", "G7"],
      notes: ["A", "B", "C", "D", "E", "F", "G"],
      sharpsFlats: 0
    },
    {
      root: "E",
      mode: "Minor",
      relativeMinor: "G Major",
      chords: ["Em7", "F#m7b5", "Gmaj7", "Am7", "Bm7", "Cmaj7", "D7"],
      notes: ["E", "F#", "G", "A", "B", "C", "D"],
      sharpsFlats: 1
    },
    {
      root: "D",
      mode: "Minor",
      relativeMinor: "F Major",
      chords: ["Dm7", "Em7b5", "Fmaj7", "Gm7", "Am7", "Bbmaj7", "C7"],
      notes: ["D", "E", "F", "G", "A", "Bb", "C"],
      sharpsFlats: -1
    },
    {
      root: "G",
      mode: "Minor",
      relativeMinor: "Bb Major",
      chords: ["Gm7", "Am7b5", "Bbmaj7", "Cm7", "Dm7", "Ebmaj7", "F7"],
      notes: ["G", "A", "Bb", "C", "D", "Eb", "F"],
      sharpsFlats: -2
    },
    {
      root: "C",
      mode: "Minor",
      relativeMinor: "Eb Major",
      chords: ["Cm7", "Dm7b5", "Ebmaj7", "Fm7", "Gm7", "Abmaj7", "Bb7"],
      notes: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
      sharpsFlats: -3
    },
    {
      root: "F",
      mode: "Minor",
      relativeMinor: "Ab Major",
      chords: ["Fm7", "Gm7b5", "Abmaj7", "Bbm7", "Cm7", "Dbmaj7", "Eb7"],
      notes: ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
      sharpsFlats: -4
    },
    {
      root: "Bb",
      mode: "Minor",
      relativeMinor: "Db Major",
      chords: ["Bbm7", "Cm7b5", "Dbmaj7", "Ebm7", "Fm7", "Gbmaj7", "Ab7"],
      notes: ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab"],
      sharpsFlats: -5
    },
    {
      root: "F#",
      mode: "Minor",
      relativeMinor: "A Major",
      chords: ["F#m7", "G#m7b5", "Amaj7", "Bm7", "C#m7", "Dmaj7", "E7"],
      notes: ["F#", "G#", "A", "B", "C#", "D", "E"],
      sharpsFlats: 3
    },
    {
      root: "B",
      mode: "Minor",
      relativeMinor: "D Major",
      chords: ["Bm7", "C#m7b5", "Dmaj7", "Em7", "F#m7", "Gmaj7", "A7"],
      notes: ["B", "C#", "D", "E", "F#", "G", "A"],
      sharpsFlats: 2
    },
    {
      root: "C#",
      mode: "Minor",
      relativeMinor: "E Major",
      chords: ["C#m7", "D#m7b5", "Emaj7", "F#m7", "G#m7", "Amaj7", "B7"],
      notes: ["C#", "D#", "E", "F#", "G#", "A", "B"],
      sharpsFlats: 4
    }
  ]
};

export type CircleOfFifths = typeof circleOfFifths;
