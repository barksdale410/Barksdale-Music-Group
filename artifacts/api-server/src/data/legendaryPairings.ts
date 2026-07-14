export const legendaryPairings = [
  {
    id: "jazzy-jeff-alchemist",
    producer1: "Jazzy Jeff",
    producer2: "The Alchemist",
    role1: "Drums × Pocket",
    role2: "Sample King",
    signatureStyle: "West Philly pocket meets New York boom bap. Jazz samples chopped with surgical precision, drums that breathe.",
    description: "The premier drum architect meets the greatest sample manipulator. Their combined energy produces beats that feel like short films — every bar tells a story.",
    templateIds: ["conductor-williams-01", "alchemist-01"]
  },
  {
    id: "madlib-dilla",
    producer1: "Madlib",
    producer2: "J Dilla",
    role1: "Loop Architect",
    role2: "Swing Engineer",
    signatureStyle: "Dusty crates, drunk drums, cosmic harmony. Genre-defying sample collages with human quantization.",
    description: "Two minds who rejected perfection in favor of feeling. The result is music that sounds like it came from another dimension — hazy, warm, and alive.",
    templateIds: ["madlib-01", "dilla-01"]
  },
  {
    id: "timbaland-danja",
    producer1: "Timbaland",
    producer2: "Danja",
    role1: "Syncopation Master",
    role2: "Pop Alchemist",
    signatureStyle: "African percussion patterns, futuristic synths, radio-ready construction. Rhythm as the lead instrument.",
    description: "The combination that defined mid-2000s pop and R&B. Unusual time signatures made infectious, global percussion vocabulary translated for mainstream consumption.",
    templateIds: ["timbaland-01"]
  },
  {
    id: "dre-scott-storch",
    producer1: "Dr. Dre",
    producer2: "Scott Storch",
    role1: "G-Funk Architect",
    role2: "Keys Maestro",
    signatureStyle: "West Coast bounce, live instrument feel, melodic keyboard hooks anchoring hard drums.",
    description: "The synthesizer of West Coast gangsta rap meets the piano prodigy. Together they created the template for modern hip-hop's melodic sensibility.",
    templateIds: ["dr-dre-01"]
  },
  {
    id: "conductor-daringer",
    producer1: "Conductor Williams",
    producer2: "Daringer",
    role1: "Gospel × Cinema",
    role2: "Grimy Boom Bap",
    signatureStyle: "Dark orchestral gospel chords over raw, minimal drum programming. Ecclesiastical meets the streets.",
    description: "The architect of cinematic gospel hip-hop meets New York's grimiest minimalist. The contrast creates music of profound spiritual weight.",
    templateIds: ["conductor-williams-01", "daringer-01"]
  },
  {
    id: "babyface-dmile",
    producer1: "Babyface",
    producer2: "D'Mile",
    role1: "Classic R&B",
    role2: "Neo-Soul Evolution",
    signatureStyle: "Sophisticated chord voicings, intimate production, emotional vulnerability expressed through harmonic tension.",
    description: "Three decades of R&B excellence bridging to the next generation. Timeless songwriting craft meets contemporary sonic innovation.",
    templateIds: ["babyface-01"]
  },
  {
    id: "jimmy-jam-terry-lewis",
    producer1: "Jimmy Jam",
    producer2: "Terry Lewis",
    role1: "Synth Commander",
    role2: "Rhythm Architect",
    signatureStyle: "Minneapolis Sound — tight synth bass, punchy drums, lush keyboard pads, sophisticated arrangements.",
    description: "The most successful producing duo in R&B history. Their combination of technology mastery and musical sophistication created the blueprint for contemporary R&B.",
    templateIds: ["jimmy-jam-terry-lewis-01"]
  },
  {
    id: "organized-noize-gipp",
    producer1: "Organized Noize",
    producer2: "Big Gipp",
    role1: "Southern Soul",
    role2: "ATL Grit",
    signatureStyle: "Soulful Atlanta sound, organic instrumentation, street poetry over jazzy productions. The true origin of trap's emotional core.",
    description: "The architects of the Dungeon Family sound that gave birth to everything from OutKast to modern trap. Raw Southern energy meets sophisticated musicality.",
    templateIds: ["organized-noize-01"]
  }
];

export type LegendaryPairing = typeof legendaryPairings[number];
