export const engines = [
  {
    id: "mafiascore",
    name: "MafiaScore",
    description: "Dark, cinematic boom bap. Hard drums, minor jazz chords, soul samples. The sound of loyalty and consequences.",
    emotions: ["Loyalty", "Revenge", "Power", "Betrayal", "Hustle", "Legacy", "War", "Silence", "Grief", "Triumph"],
    defaultKey: "C Minor",
    defaultBpm: 78,
    color: "#8B0000"
  },
  {
    id: "gospel",
    name: "Gospel",
    description: "Spirit-filled progressions rooted in the African American church tradition. Major 7ths, 9ths, choir swells.",
    emotions: ["Joy", "Praise", "Surrender", "Grace", "Hope", "Redemption", "Worship", "Peace", "Faith", "Gratitude"],
    defaultKey: "Bb Major",
    defaultBpm: 72,
    color: "#DAA520"
  },
  {
    id: "jazz",
    name: "Jazz",
    description: "Complex harmony, voice leading, and extended chords. From bebop to neo-soul, all feels explored.",
    emotions: ["Contemplation", "Longing", "Freedom", "Sophistication", "Nostalgia", "Tension", "Resolution", "Introspection"],
    defaultKey: "F Major",
    defaultBpm: 88,
    color: "#4169E1"
  },
  {
    id: "lofi",
    name: "Lo-Fi",
    description: "Warm, dusty, imperfect. Vinyl crackle, tape saturation, lazy jazz chords. The study session soundtrack.",
    emotions: ["Calm", "Nostalgia", "Focus", "Melancholy", "Comfort", "Daydream", "Rain", "Late Night"],
    defaultKey: "D Minor",
    defaultBpm: 75,
    color: "#9370DB"
  },
  {
    id: "trap",
    name: "Trap",
    description: "Hard 808s, triplet hi-hats, minor pentatonic melodies. Atlanta's gift to the world.",
    emotions: ["Rage", "Flex", "Grind", "Pain", "Paranoia", "Triumph", "Street", "Ambition"],
    defaultKey: "F# Minor",
    defaultBpm: 140,
    color: "#FF4500"
  },
  {
    id: "orchestral",
    name: "Orchestral",
    description: "Full orchestral writing with strings, brass, woodwinds, and choir. Cinematic scope and emotional depth.",
    emotions: ["Epic", "Sorrow", "Victory", "Mystery", "Tension", "Romance", "Heroism", "Darkness", "Wonder", "Loss"],
    defaultKey: "D Minor",
    defaultBpm: 90,
    color: "#2E8B57"
  },
  {
    id: "rb",
    name: "R&B",
    description: "Smooth, sensual, emotionally complex. Neo-soul chord extensions, intimate arrangements.",
    emotions: ["Love", "Heartbreak", "Desire", "Vulnerability", "Confidence", "Longing", "Passion", "Acceptance"],
    defaultKey: "Ab Major",
    defaultBpm: 80,
    color: "#FF69B4"
  },
  {
    id: "boom-bap-cinema",
    name: "Boom Bap Cinema",
    description: "Where hip-hop meets film scores. Jazz samples, orchestral hits, boom bap drums. Conductor Williams energy.",
    emotions: ["Cinematic", "Street Poetry", "Loss", "Elevation", "Memory", "Legacy", "Struggle", "Glory"],
    defaultKey: "C Minor",
    defaultBpm: 85,
    color: "#CD853F"
  }
];

export type Engine = typeof engines[number];
