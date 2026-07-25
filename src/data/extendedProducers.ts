export interface ExtendedProducer {
  id: string;
  name: string;
  avatarUrl: string;
  category: string;
  genre: string;
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
  artistProfile: {
    vocalTone: string;
    lyricalThemes: string;
    cadence: string;
    signatureAdlibs: string;
    productionPairing: string;
  };
  abcProgression: string; // ABC chord string (e.g., "Cm, Ab, Fm, G")
  garageBandPatches: string;
  fxChain: string;
  arrangement: string;
  vocalChain: string;
  mixChecklist: string[];
  masteringProtocol: string;
  references: string[];
  mixSummary: {
    kickDb: number;
    subDb: number;
    keysDb: number;
    vocalDb: number;
    masterLufs: number;
  };
}

export const EXTENDED_PRODUCERS: ExtendedProducer[] = [
  // ==================== HIP HOP ====================
  {
    id: "ep_preme",
    name: "DJ Premier",
    avatarUrl: "https://picsum.photos/seed/preme/120/120",
    category: "90s East Coast Boom Bap",
    genre: "Hip Hop",
    signatureBpm: 92,
    signatureScale: "C Minor",
    bio: "The cornerstone of boom-bap. Known for gritty SP-1200 snare cracks, vocal turntablism choruses, and jazz piano chops.",
    signatureProgressions: [
      { name: "Classic Bap", progression: ["Cm7", "Fm7", "Ab7", "G7"], description: "Aggressive street jazz groove" }
    ],
    producerLibrary: {
      drums: "Vinyl crackle, heavily filtered 12-bit kicks, snappy rim-snare",
      bass: "Slightly distorted upright acoustic bass",
      melodic: "Chipped jazz horns, dry rhodes chord stabs"
    },
    artistProfile: {
      vocalTone: "Aggressive, gritty, mid-range delivery with street gravitas",
      lyricalThemes: "Street poetry, lyrical dominance, socio-economic struggle",
      cadence: "Steady sixteenth-note pocket, on-the-beat precision",
      signatureAdlibs: "Record scratch noises, 'Yo!', 'Yeah!'",
      productionPairing: "DJ Premier, Havoc"
    },
    abcProgression: "Cm7, Fm7, Ab7, G7",
    garageBandPatches: "Drum Kit: 'Retro Active', Bass: 'Muted Bass', Keys: 'Classic Rhodes'",
    fxChain: "Low-pass filter sweep on samples, tape saturation across the drum group.",
    arrangement: "Intro (4) -> Verse (16) -> Scratch Hook (8) -> Verse 2 (16) -> Outro (4)",
    vocalChain: "Gate -> aggressive vintage compressor -> low-mid boost -> plate reverb (1.2s)",
    mixChecklist: [
      "Kick/Snare hit at exactly -14dB for punch",
      "Cut all frequencies below 40Hz on non-bass tracks",
      "Vinyl scratch effect panned 30% wide left"
    ],
    masteringProtocol: "Target -9 LUFS, true peak at -1.0dB, subtle 2dB saturation clip to glue tracks.",
    references: ["Mass Appeal (Gang Starr)", "Boom (Royce Da 5'9\")", "Nas Is Like (Nas)"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -18, vocalDb: -12, masterLufs: -9 }
  },
  {
    id: "ep_havoc",
    name: "Havoc",
    avatarUrl: "https://picsum.photos/seed/havoc/120/120",
    category: "Queensbridge Queens Grit",
    genre: "Hip Hop",
    signatureBpm: 88,
    signatureScale: "F Minor",
    bio: "The architect of dark Queensbridge survivalism. Ominous piano chords, heavy filtered bass, and street-hardened percussion.",
    signatureProgressions: [
      { name: "Survival Instinct", progression: ["Fm", "Db", "Bbm", "C7"], description: "Cold winter block anxiety" }
    ],
    producerLibrary: {
      drums: "Raw acoustic snare crack, vintage MPC60 high-hats, hard kicks",
      bass: "Heavy sub-harmonic sine wave bass",
      melodic: "Minor-key cinematic piano chords, eerie detuned strings"
    },
    artistProfile: {
      vocalTone: "Cold, menacing whisper-delivery to aggressive street baritone",
      lyricalThemes: "Survival, cold winters, block politics, paranoia",
      cadence: "Laid-back, slightly behind-the-beat, steady rhythmic flow",
      signatureAdlibs: "Ominous silence, 'Word up!', 'Yeah!'",
      productionPairing: "Havoc, DJ Premier"
    },
    abcProgression: "Fm, Db, Bbm, C7",
    garageBandPatches: "Drum Kit: 'Hard Boom Bap', Bass: 'Sub-Bass', Keys: 'Grand Piano Dark'",
    fxChain: "12-bit sampler crunch emulator, minor string resonance filter.",
    arrangement: "Intro (8) -> Verse (16) -> Hook (8) -> Verse 2 (16) -> Outro (8)",
    vocalChain: "De-esser -> dual stage compressor -> presence boost at 3kHz -> dry room reverb",
    mixChecklist: [
      "Keep vocal close to the center with zero delay",
      "Carve 350Hz on piano to leave pocket for vocals",
      "808/sub tuned perfectly to F"
    ],
    masteringProtocol: "Target -9.5 LUFS, -1.0dB TP, 24-bit WAV, Auto-Normalize OFF.",
    references: ["Shook Ones Pt. II (Mobb Deep)", "Survival of the Fittest", "Quiet Storm"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -18, vocalDb: -12, masterLufs: -9.5 }
  },
  {
    id: "ep_kanye",
    name: "Kanye West",
    avatarUrl: "https://picsum.photos/seed/kanye/120/120",
    category: "Chop Soul / Anthemic Hip Hop",
    genre: "Hip Hop",
    signatureBpm: 94,
    signatureScale: "Ab Major",
    bio: "Master of sped-up soul vocal samples, marching-band brass layers, and anthemic pop structures.",
    signatureProgressions: [
      { name: "Glory Soul", progression: ["Ab", "Db", "Fm", "Eb"], description: "Triumphant choral progression" }
    ],
    producerLibrary: {
      drums: "Acoustic snare layered with handclaps, marching kicks, wide shaker",
      bass: "Synthesized Moog Taurus bass pedal",
      melodic: "Sped-up soul vocal hooks, stadium brass section, bright strings"
    },
    artistProfile: {
      vocalTone: "Arrogant yet vulnerable, high energy, mid-range delivery",
      lyricalThemes: "Self-expression, luxury, faith, personal triumph, ego",
      cadence: "Syncopated, bouncing between triplet bursts and straight rhythm",
      signatureAdlibs: "High pitched 'Huh!', vocoder harmonies",
      productionPairing: "Kanye West, Raphael Saadiq"
    },
    abcProgression: "Ab, Db, Fm, Eb",
    garageBandPatches: "Drum Kit: 'Vintage Arena', Bass: 'Moog Bass', Strings: 'Chamber Orchestra'",
    fxChain: "Pitch-shifter on vocal sample (+12 semitones), sidechained orchestra.",
    arrangement: "Intro (8) -> Verse (16) -> Hook (8) -> Bridge (8) -> Chorus (8) -> Outro (12)",
    vocalChain: "Gate -> fast opto compressor -> exciter at 8kHz -> stereo widener -> long hall",
    mixChecklist: [
      "Sped-up sample is central - sits right behind lead vocal",
      "Group handclaps panned 40% left and right",
      "Keep sub-bass tightly controlled with limiter"
    ],
    masteringProtocol: "Target -8.5 LUFS, punchy transient preservation, 24-bit WAV.",
    references: ["Through the Wire (Kanye West)", "Touch the Sky", "Power"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -18, vocalDb: -11, masterLufs: -8.5 }
  },
  {
    id: "ep_rza",
    name: "RZA",
    avatarUrl: "https://picsum.photos/seed/rza/120/120",
    category: "Shaolin Cinematic Hip Hop",
    genre: "Hip Hop",
    signatureBpm: 86,
    signatureScale: "A Minor",
    bio: "The Abbot of the Wu-Tang Clan. Raw, off-kilter piano loops, martial arts sound effects, and highly distorted drum breaks.",
    signatureProgressions: [
      { name: "Shaolin Chamber", progression: ["Am", "F", "Bdim", "E7"], description: "Eerie martial-arts tension" }
    ],
    producerLibrary: {
      drums: "Heavy, distorted drum loops, dark hats, metal rim cracks",
      bass: "Deep sub hum with filter sweep",
      melodic: "Dissonant kung-fu movie piano chops, dusty vinyl horns"
    },
    artistProfile: {
      vocalTone: "Aggressive, high-impact, street philosopher style",
      lyricalThemes: "Martial arts philosophy, chess, five-percenter knowledge, crime",
      cadence: "Polyrhythmic, highly unpredictable, rapid-fire syllable bursts",
      signatureAdlibs: "Swords clashing FX, 'Bong bong!', 'Suuuu!'",
      productionPairing: "RZA, DJ Premier"
    },
    abcProgression: "Am, F, Bdim, E7",
    garageBandPatches: "Drum Kit: 'Dirty Hip Hop', Bass: 'Classic Upright', Strings: 'Dark Cello'",
    fxChain: "Resonant ring modulation on piano, bitcrusher on snare track.",
    arrangement: "Intro (12) -> Verse (16) -> Verse 2 (16) -> Outro (8)",
    vocalChain: "Gate -> 1176 style fast compressor -> low shelf cut -> vintage delay (1/4 note)",
    mixChecklist: [
      "Bass should have a low-mid bump at 100Hz",
      "Panned sword swing sounds 80% left to right",
      "Lofi drum loop must feel slightly out of time for grit"
    ],
    masteringProtocol: "Target -10 LUFS (deliberately dynamic and gritty), -1.0dB TP.",
    references: ["C.R.E.A.M. (Wu-Tang Clan)", "Wu-Tang Clan Ain't Nuthing Ta F' Wit", "Ice Cream (Raekwon)"],
    mixSummary: { kickDb: -13, subDb: -12, keysDb: -19, vocalDb: -12, masterLufs: -10 }
  },

  // ==================== R&B / SOUL ====================
  {
    id: "ep_babyface",
    name: "Babyface",
    avatarUrl: "https://picsum.photos/seed/babyface/120/120",
    category: "90s Contemporary R&B Ballad",
    genre: "R&B/Soul",
    signatureBpm: 72,
    signatureScale: "C Major",
    bio: "The architect of smooth 90s love ballads. Warm Fender Rhodes, acoustic guitar strums, and pristine vocal harmonies.",
    signatureProgressions: [
      { name: "Smooth Romance", progression: ["Cmaj7", "Am7", "Fmaj7", "G11"], description: "Sweet classic R&B progression" }
    ],
    producerLibrary: {
      drums: "Soft, polished rimshots, pristine programmed R&B shaker, snap layers",
      bass: "Smooth, warm fretless electric bass",
      melodic: "Silky Fender Rhodes, warm nylon acoustic string strumming"
    },
    artistProfile: {
      vocalTone: "Velvety smooth, highly melodic tenor with flawless vibrato",
      lyricalThemes: "Love, heartbreak, devotion, late-night romance",
      cadence: "Legato, floating gracefully over the pocket, perfect vocal runs",
      signatureAdlibs: "Stacked octave humming, 'Ooh-yeah', 'Oh-baby'",
      productionPairing: "Babyface, Raphael Saadiq"
    },
    abcProgression: "Cmaj7, Am7, Fmaj7, G11",
    garageBandPatches: "Drum Kit: 'Smooth R&B', Bass: 'Fretless Electric', Keys: 'Suitcase Rhodes'",
    fxChain: "Stereo chorus on Rhodes, smooth opto-compressor on full instrument bus.",
    arrangement: "Intro (4) -> Verse (8) -> Chorus (8) -> Verse 2 (8) -> Chorus (8) -> Bridge (8) -> Chorus (12)",
    vocalChain: "Opto compressor (LA-2A style) -> vocal thickener -> high-frequency shelf lift -> plate reverb (2.2s)",
    mixChecklist: [
      "Vocal stack should have 3 layers (Left, Center, Right)",
      " Rhodes keys panned 30% left and right to clear vocal center",
      "Kick sits at a soft -16dB to let bass melody through"
    ],
    masteringProtocol: "Target -9 LUFS, smooth dynamic compression, transparent limiter.",
    references: ["Exhale (Whitney Houston)", "I'll Make Love to You (Boyz II Men)", "Whip Appeal"],
    mixSummary: { kickDb: -16, subDb: -14, keysDb: -17, vocalDb: -11, masterLufs: -9 }
  },
  {
    id: "ep_dangelo",
    name: "D'Angelo",
    avatarUrl: "https://picsum.photos/seed/dangelo/120/120",
    category: "Neo-Soul / Funk Groove",
    genre: "R&B/Soul",
    signatureBpm: 82,
    signatureScale: "Eb Major",
    bio: "Leader of the Soulquarians. Drunken, unquantized live-feel rhythm, vintage Wurlitzer chords, and intimate stacked background whispers.",
    signatureProgressions: [
      { name: "Voodoo Pocket", progression: ["Ebmaj7", "Cm7", "Fm9", "Bb13"], description: "Deep soulful lazy swing feel" }
    ],
    producerLibrary: {
      drums: "Loose acoustic rims, muted snare, extremely late high-hat pocket",
      bass: "Heavy P-Bass played with thumb, warm tone",
      melodic: "Slightly out-of-tune Wurlitzer, warm horn sections, stacked whispers"
    },
    artistProfile: {
      vocalTone: "Incredibly intimate, smoky, raspy falsetto to warm tenor",
      lyricalThemes: "Sensuality, spirituality, personal transformation, black heritage",
      cadence: "Highly syncopated, behind-the-beat phrasing, spoken-sung delivery",
      signatureAdlibs: "Guttural hums, stacked choir falsetto cries",
      productionPairing: "D'Angelo, J Dilla"
    },
    abcProgression: "Ebmaj7, Cm7, Fm9, Bb13",
    garageBandPatches: "Drum Kit: 'Vintage Session', Bass: 'Fingerstyle Bass', Keys: 'Wurlitzer'",
    fxChain: "Tape flutter emulation on keys, dynamic sidechain on vocals to clear keyboard mids.",
    arrangement: "Intro (8) -> Groove (16) -> Verse (8) -> Chorus (8) -> Outro Jam (16)",
    vocalChain: "Fast de-esser -> warm tube preamp drive -> opto compressor -> short room reverb",
    mixChecklist: [
      "Drums must sit way back in the pocket - hats delayed by 15ms",
      "Moog/Bass has absolute control over low-end",
      "Vocal ad-libs layered tightly and filtered"
    ],
    masteringProtocol: "Target -10 LUFS, high-mid analog warmth, deep tape-glue compressor.",
    references: ["Untitled (How Does It Feel)", "Brown Sugar", "Lady"],
    mixSummary: { kickDb: -15, subDb: -11, keysDb: -18, vocalDb: -13, masterLufs: -10 }
  },
  {
    id: "ep_saadiq",
    name: "Raphael Saadiq",
    avatarUrl: "https://picsum.photos/seed/saadiq/120/120",
    category: "Motown Revival / Neo-Soul",
    genre: "R&B/Soul",
    signatureBpm: 98,
    signatureScale: "G Major",
    bio: "Bridges classic Motown soul with modern R&B. Bouncy melodic basslines, rhythmic tambourines, and tight brass.",
    signatureProgressions: [
      { name: "Tony Toni Groove", progression: ["G", "C", "Em", "D"], description: "Upbeat retro-soul groove" }
    ],
    producerLibrary: {
      drums: "Bright tambourine, driving live acoustic snare, crisp hi-hats",
      bass: "Bouncy, highly melodic Rickenbacker bass",
      melodic: "Upbeat brass section, bright clean telecaster strums"
    },
    artistProfile: {
      vocalTone: "Bright, energetic, classic soul falsetto and clean tenor",
      lyricalThemes: "Joyful love, nostalgia, perseverance, dancing",
      cadence: "On-the-beat, rhythmic, highly danceable phrasing",
      signatureAdlibs: "Clap tracks, 'Woo!', 'Alright now!'",
      productionPairing: "Raphael Saadiq, Babyface"
    },
    abcProgression: "G, C, Em, D",
    garageBandPatches: "Drum Kit: 'Studio Live', Bass: 'Melodic Electric', Keys: 'Vintage Clavinet'",
    fxChain: "Spring reverb on guitar stabs, tape warmth saturation across mastering bus.",
    arrangement: "Intro (8) -> Verse (8) -> Chorus (8) -> Verse 2 (8) -> Chorus (8) -> Solo (8) -> Chorus (12)",
    vocalChain: "Gate -> fast compressor -> mid presence boost -> analog tape delay (1/8 note)",
    mixChecklist: [
      "Tambourine sits exactly at -20dB in the right ear",
      "Bass must play a highly active counter-melody",
      "Horns panned left/right 50% for stereo widening"
    ],
    masteringProtocol: "Target -9 LUFS, vintage mid-range analog bump (+1.5dB at 1kHz).",
    references: ["Be Here (Raphael Saadiq)", "Anniversary (Tony! Toni! Toné!)", "Still Ray"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -17, vocalDb: -12, masterLufs: -9 }
  },

  // ==================== POP ====================
  {
    id: "ep_finneas",
    name: "Finneas O'Connell",
    avatarUrl: "https://picsum.photos/seed/finneas/120/120",
    category: "Minimalist Dark Pop",
    genre: "Pop",
    signatureBpm: 90,
    signatureScale: "G Minor",
    bio: "Architect of Billie Eilish's signature sound. Low-fi foley percussion, dry close-mic vocals, and massive sub drops.",
    signatureProgressions: [
      { name: "Whisper Dark", progression: ["Gm", "Eb", "Bb", "F"], description: "Minimal melancholic pop chord cycle" }
    ],
    producerLibrary: {
      drums: "Dry finger snaps, heavy synth bass kicks, foley matchbox strikes",
      bass: "Ethereal massive sub-sine glide",
      melodic: "Soft felt acoustic piano, dry minimal synths, ambient noise sweeps"
    },
    artistProfile: {
      vocalTone: "Whisper-quiet, breathy, near-vocal fry, incredibly intimate",
      lyricalThemes: "Mental health, dark dreams, obsession, heartbreak, isolation",
      cadence: "Syncopated, conversational, matching vocal proximity to the mic",
      signatureAdlibs: "Recorded breath intakes, creepy giggles, layered hushes",
      productionPairing: "Finneas O'Connell, Jack Antonoff"
    },
    abcProgression: "Gm, Eb, Bb, F",
    garageBandPatches: "Drum Kit: 'Dry Foley Percussion', Bass: 'Sub Sine Drop', Keys: 'Felt Upright Piano'",
    fxChain: "Tight gate on vocals, high-pass sweep on background static.",
    arrangement: "Verse (8) -> Chorus (8, minimal) -> Verse 2 (8) -> Chorus (8, massive sub) -> Outro (4)",
    vocalChain: "Extreme compressor (to bring out breath details) -> de-esser (heavy) -> ultra-short delay",
    mixChecklist: [
      "Vocals must be extremely dry - zero reverb",
      "Sub drop must not clip master but trigger physical impact",
      "Snaps panned dead center"
    ],
    masteringProtocol: "Target -10 LUFS (retains massive transient gaps), -1.0dB TP, 24-bit WAV.",
    references: ["Bad Guy (Billie Eilish)", "Ocean Eyes", "Let's Fall in Love for the Night"],
    mixSummary: { kickDb: -12, subDb: -10, keysDb: -19, vocalDb: -11, masterLufs: -10 }
  },
  {
    id: "ep_antonoff",
    name: "Jack Antonoff",
    avatarUrl: "https://picsum.photos/seed/antonoff/120/120",
    category: "Indie Synth Pop",
    genre: "Pop",
    signatureBpm: 104,
    signatureScale: "C Major",
    bio: "The powerhouse behind Taylor Swift and Bleachers. Big vintage synths (Juno), acoustic-electric hybrids, and massive anthemic climbs.",
    signatureProgressions: [
      { name: "Out of the Woods", progression: ["C", "G", "Am", "F"], description: "Soaring nostalgic pop engine" }
    ],
    producerLibrary: {
      drums: "Processed linndrum kicks, explosive room snare, acoustic tom rolls",
      bass: "Arpeggiated analog synth bass (Juno-style)",
      melodic: "Juno-106 analog string pads, warm acoustic guitar picking"
    },
    artistProfile: {
      vocalTone: "Conversational, passionate, slightly nasal, highly energetic",
      lyricalThemes: "Nostalgia, youth, longing, heartbreak, stadium anthems",
      cadence: "Straightforward, rapid storytelling build-up, rhythmic chant",
      signatureAdlibs: "Sighs, studio chatter, echoed words at phrase endings",
      productionPairing: "Jack Antonoff, Max Martin"
    },
    abcProgression: "C, G, Am, F",
    garageBandPatches: "Drum Kit: 'Vintage Linn', Bass: 'Juno Arp Bass', Keys: '80s Synth Pad'",
    fxChain: "Stereo chorus on bass tracks, tape saturation across drum overheads.",
    arrangement: "Intro (4) -> Verse (8) -> Pre-Chorus (4) -> Chorus (8) -> Verse 2 (8) -> Bridge (8) -> Outro (8)",
    vocalChain: "Gate -> fast compressor -> mid-presence bump (+2dB at 2kHz) -> deep space tape delay",
    mixChecklist: [
      "Juno string pads must sit wide (80% left and right)",
      "Acoustic guitar tucked right beneath the synth lead",
      "Gated snare reverb must cut off before next kick hit"
    ],
    masteringProtocol: "Target -9 LUFS, bright vocal air, wide stereo compression.",
    references: ["Cruel Summer (Taylor Swift)", "Green Light (Lorde)", "Don't Take the Money"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -16, vocalDb: -11, masterLufs: -9 }
  },
  {
    id: "ep_max_martin",
    name: "Max Martin",
    avatarUrl: "https://picsum.photos/seed/max/120/120",
    category: "Symmetrical Melodic Math Pop",
    genre: "Pop",
    signatureBpm: 122,
    signatureScale: "A Minor",
    bio: "The king of pop melody. Symmetrical songwriting structures, bright synth leads, and explosive pre-chorus vocal lifts.",
    signatureProgressions: [
      { name: "Melodic Math", progression: ["Am", "F", "C", "G"], description: "Perfect pop cycle with maximum hook potential" }
    ],
    producerLibrary: {
      drums: "Explosive synthetic kicks, crisp digital snaps, pop shaker loop",
      bass: "Saturated synth FM growl bass",
      melodic: "Hyper-bright digital brass, sparkling electric lead, wide chord pads"
    },
    artistProfile: {
      vocalTone: "Searing, bright, powerful belting pop voice with flawless pitch",
      lyricalThemes: "Desire, youth, betrayal, euphoric dancefloor escapes",
      cadence: "Highly rhythmic, short symmetrical phrases, rapid-fire hooks",
      signatureAdlibs: "Triple stacked harmony stacks on choruses, 'Yeah!', 'Baby!'",
      productionPairing: "Max Martin, Ryan Tedder"
    },
    abcProgression: "Am, F, C, G",
    garageBandPatches: "Drum Kit: 'Modern Pop', Bass: 'Saturated Synth Bass', Keys: 'Neon Pluck'",
    fxChain: "Sidechain-style volume automation on string pads under kick, stereo widening on chorus vocals.",
    arrangement: "Verse (8) -> Pre-Chorus (4) -> Chorus (8) -> Verse 2 (8) -> Pre (4) -> Chorus (8) -> Bridge (8) -> Chorus (12)",
    vocalChain: "De-esser -> dual-stage fast compressor -> bright EQ boost at 8kHz -> short plate reverb (1.0s)",
    mixChecklist: [
      "Vocal is absolutely center and louder than any pop element by 2.5dB",
      "Melody chords duck by 2dB whenever lead vocal sings",
      "Keep sub-bass tightly controlled"
    ],
    masteringProtocol: "Target -8 LUFS (highly compressed and energetic for radio), -1.0dB TP, 24-bit WAV.",
    references: ["Blinding Lights (The Weeknd)", "Since U Been Gone", "Baby One More Time"],
    mixSummary: { kickDb: -13, subDb: -11, keysDb: -18, vocalDb: -10, masterLufs: -8 }
  },

  // ==================== ROCK ====================
  {
    id: "ep_vig",
    name: "Butch Vig",
    avatarUrl: "https://picsum.photos/seed/vig/120/120",
    category: "Grunge / Alternative Rock",
    genre: "Rock",
    signatureBpm: 112,
    signatureScale: "F Major",
    bio: "The engineer behind Nirvana's Nevermind and Garbage. Explosive distorted guitars, dry intimate verses, and massive choruses.",
    signatureProgressions: [
      { name: "Loud-Quiet-Loud", progression: ["F", "Bb", "C", "Dm"], description: "Heavy alternative dynamic swing" }
    ],
    producerLibrary: {
      drums: "Massive acoustic room drums, compressed metal snare, deep kick",
      bass: "Heavy distorted P-Bass",
      melodic: "Fuzz layered electric guitars, clean acoustic strums underneath"
    },
    artistProfile: {
      vocalTone: "Gritty, emotional, raw transition from soft mumble to full scream",
      lyricalThemes: "Angst, alienation, betrayal, inner conflict",
      cadence: "Dynamic, speech-like in verses, highly sustained and powerful in hooks",
      signatureAdlibs: "Guttural screams, breath gasps on mic",
      productionPairing: "Butch Vig, Trent Reznor"
    },
    abcProgression: "F, Bb, C, Dm",
    garageBandPatches: "Drum Kit: 'Heavy Rock', Bass: 'Distorted Bass Guitar', Keys: 'Raw Overdrive Guitar'",
    fxChain: "Stereo double guitar tracks, room-bleed emulator on drums.",
    arrangement: "Verse (8, quiet) -> Chorus (8, massive) -> Verse 2 (8) -> Chorus (8) -> Bridge (8) -> Chorus (16)",
    vocalChain: "Gate -> fast compressor -> presence EQ boost at 3.5kHz -> short room reverb",
    mixChecklist: [
      "Verse guitars are dry, chorus guitars explode and pan hard left/right",
      "Snare room mic track compressed heavily for tail",
      "Keep bass guitar focused in low-mids"
    ],
    masteringProtocol: "Target -9 LUFS, punchy transient preservation, subtle mid-range warmth.",
    references: ["Smells Like Teen Spirit (Nirvana)", "Stupid Girl (Garbage)", "Cherub Rock (Smashing Pumpkins)"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -16, vocalDb: -11, masterLufs: -9 }
  },
  {
    id: "ep_parker",
    name: "Kevin Parker",
    avatarUrl: "https://picsum.photos/seed/parker/120/120",
    category: "Psychedelic Rock / Synth Crossover",
    genre: "Rock",
    signatureBpm: 118,
    signatureScale: "D Major",
    bio: "The mind behind Tame Impala. Phased-out guitars, heavy retro-compressed live drums, and lush vintage synth textures.",
    signatureProgressions: [
      { name: "Psychedelic Drift", progression: ["Dmaj7", "Gmaj7", "F#m7", "Em7"], description: "Ethereal floating dream pop-rock" }
    ],
    producerLibrary: {
      drums: "Vintage Ludwig dry drums with heavy tape compression, crisp flanged hats",
      bass: "Highly melodic Hofner bass with round, vintage tape tone",
      melodic: "Phased electric guitars, lush analog synth sweeps (Roland Juno)"
    },
    artistProfile: {
      vocalTone: "Airy, high-register falsetto, dreamy, heavily chorused",
      lyricalThemes: "Loneliness, transformation, time passing, psychedelic experiences",
      cadence: "Fluid, melodic, gently floating over the rhythm",
      signatureAdlibs: "Ethereal vocal runs, echoed word repetitions",
      productionPairing: "Kevin Parker, Jack Antonoff"
    },
    abcProgression: "Dmaj7, Gmaj7, F#m7, Em7",
    garageBandPatches: "Drum Kit: 'Vintage Dry', Bass: 'Hofner Flatwound', Keys: 'Phased Analog Synth'",
    fxChain: "Phaser sweep across the master drum bus on transitions, heavy spring reverb on snare.",
    arrangement: "Intro (8) -> Verse (8) -> Chorus (8) -> Verse 2 (8) -> Jam/Solo (12) -> Outro (8)",
    vocalChain: "De-esser -> compressor -> tape-style delay -> long plate reverb",
    mixChecklist: [
      "Drum track must feel like a vintage loop - heavy compression",
      "Guitar chords pan wide and have a phaser effect",
      "Vocal sits embedded in the synths rather than floating above"
    ],
    masteringProtocol: "Target -9 LUFS, heavy analog tape saturation feel, wide stereo image.",
    references: ["The Less I Know the Better (Tame Impala)", "Borderline", "Let It Happen"],
    mixSummary: { kickDb: -14, subDb: -11, keysDb: -17, vocalDb: -12, masterLufs: -9 }
  },

  // ==================== COUNTRY ====================
  {
    id: "ep_cobb",
    name: "Dave Cobb",
    avatarUrl: "https://picsum.photos/seed/cobb/120/120",
    category: "Americana / Outlaw Country",
    genre: "Country",
    signatureBpm: 92,
    signatureScale: "G Major",
    bio: "The raw sound of modern roots country. Focuses on acoustic instruments, natural room dynamics, and soulful vocals.",
    signatureProgressions: [
      { name: "Outlaw Story", progression: ["G", "C", "D", "Em"], description: "Simple storytelling roots cycle" }
    ],
    producerLibrary: {
      drums: "Soft room-recorded acoustic kit, minimal tambourine, light brush hats",
      bass: "Upright warm acoustic bass",
      melodic: "Warm Gibson acoustic guitar, crying pedal steel, gentle fiddle"
    },
    artistProfile: {
      vocalTone: "Gritty, soulful baritone with a deep emotional drawl",
      lyricalThemes: "Hard living, small towns, redemption, love, loss",
      cadence: "Behind-the-beat storytelling pacing, highly conversational",
      signatureAdlibs: "Foot stomps, guitar-neck slides, spoken introductions",
      productionPairing: "Dave Cobb, T-Bone Burnett"
    },
    abcProgression: "G, C, D, Em",
    garageBandPatches: "Drum Kit: 'Acoustic Brush', Bass: 'Upright Acoustic', Keys: 'Classic Acoustic Guitar'",
    fxChain: "Minimal compression, natural room reverb simulation, spring guitar reverb.",
    arrangement: "Intro (4) -> Verse (8) -> Chorus (8) -> Verse 2 (8) -> Chorus (8) -> Instrumental Solo (8) -> Outro (4)",
    vocalChain: "Gate -> light optical compressor -> natural EQ -> warm room reverb",
    mixChecklist: [
      "Pedal steel fills the gaps in vocal phrases - never plays over them",
      "Acoustic guitar stays center-right",
      "Drum dynamics must remain highly human"
    ],
    masteringProtocol: "Target -10.5 LUFS (deliberately dynamic for acoustic depth), -1.0dB TP.",
    references: ["Tennessee Whiskey (Chris Stapleton)", "Metamodern Sounds (Sturgill Simpson)", "White Horse"],
    mixSummary: { kickDb: -16, subDb: -14, keysDb: -18, vocalDb: -11, masterLufs: -10.5 }
  },

  // ==================== EDM / HOUSE / TECHNO ====================
  {
    id: "ep_deadmau5",
    name: "Deadmau5",
    avatarUrl: "https://picsum.photos/seed/deadmau5/120/120",
    category: "Progressive Electro House",
    genre: "EDM/House/Techno",
    signatureBpm: 128,
    signatureScale: "A Minor",
    bio: "The master of progressive house. Long hypnotic builds, pristine analog synth design, and sidechained-everything chord plucks.",
    signatureProgressions: [
      { name: "Progressive Chords", progression: ["Am7", "Fmaj7", "Cmaj7", "G6"], description: "Classic progressive house chord journey" }
    ],
    producerLibrary: {
      drums: "Pristine digital four-on-the-floor kick, sharp clap, open hi-hat rolling loop",
      bass: "Saturated saw bass layer, warm sub",
      melodic: "Hypnotic arpeggiated pluck lead, analog chord sweep synths"
    },
    artistProfile: {
      vocalTone: "Smooth, airy pop-style soprano or tenor, highly polished",
      lyricalThemes: "Ethereal journeys, escape, neon lights, human connection",
      cadence: "Sustained notes, floating over the steady 4-on-the-floor kick",
      signatureAdlibs: "Vocal chop risers, pitch-shifted sweeps",
      productionPairing: "Deadmau5, Skrillex"
    },
    abcProgression: "Am7, Fmaj7, Cmaj7, G6",
    garageBandPatches: "Drum Kit: 'Progressive House', Bass: 'Saturated Reese', Keys: 'Hypnotic Pluck'",
    fxChain: "Extreme sidechain compression on synths keyed to kick, slow filter sweep on chords.",
    arrangement: "Intro (16) -> Build (16) -> Main Progression (32) -> Breakdown (16) -> Drop (32)",
    vocalChain: "Gate -> compressor -> presence EQ -> stadium-sized delay & reverb combo",
    mixChecklist: [
      "Sidechain must duck synth chords to near-silence on kick hits",
      "Kick must hit exactly at -6dB with absolute low-end control",
      "Clap panned dead center with stereo delay width"
    ],
    masteringProtocol: "Target -7 LUFS (high-energy festival standard), -1.0dB TP, 24-bit WAV.",
    references: ["Ghosts 'n' Stuff (Deadmau5)", "Strobe", "Raise Your Weapon"],
    mixSummary: { kickDb: -10, subDb: -12, keysDb: -15, vocalDb: -11, masterLufs: -7 }
  },

  // ==================== AFROBEATS ====================
  {
    id: "ep_donjazzy",
    name: "Don Jazzy",
    avatarUrl: "https://picsum.photos/seed/donjazzy/120/120",
    category: "Naija Pop Afrobeats",
    genre: "Afrobeats",
    signatureBpm: 108,
    signatureScale: "A Minor",
    bio: "The supreme architect of Nigerian pop. Rhythmic log drums, syncopated afro percussion, and addictive call-and-response vocal arrangements.",
    signatureProgressions: [
      { name: "Lagos Bounce", progression: ["Am", "F", "C", "G"], description: "Addictive syncopated pop progression" }
    ],
    producerLibrary: {
      drums: "Syncopated shaker layer, congas, rimshots, deep log drum bounce",
      bass: "Warm sub-bass layered with low log drum hits",
      melodic: "Bouncy digital guitars, high-life brass, bright synth plucks"
    },
    artistProfile: {
      vocalTone: "Smooth, melodic, highly rhythmic tenor with pidgin inflections",
      lyricalThemes: "Love, hustle, celebration, dancing, blessings",
      cadence: "Highly syncopated, playful call-and-response phrasing",
      signatureAdlibs: "Shouts, rhythmic chanting, 'It's Don Jazzy again!'",
      productionPairing: "Don Jazzy, Kel-P"
    },
    abcProgression: "Am, F, C, G",
    garageBandPatches: "Drum Kit: 'Lagos Percussion', Bass: 'Log Drum Sub', Keys: 'Highlife Guitar'",
    fxChain: "Rhythmic delay throws on ad-libs, warm bus saturation across the rhythm group.",
    arrangement: "Intro (8) -> Verse (16) -> Hook (8) -> Verse 2 (16) -> Hook (8) -> Outro (8)",
    vocalChain: "Gate -> fast opto-compressor -> presence EQ boost -> bright plate reverb",
    mixChecklist: [
      "Log drum and kick interlock precisely - never overlap on same hit",
      "Shaker loop stays panned 40% right for rolling movement",
      "Vocal sits right on top of the beat with bright presence"
    ],
    masteringProtocol: "Target -9 LUFS, -1.0dB TP, 24-bit WAV, Auto-Normalize OFF.",
    references: ["Soco (Starboy)", "Dorobucci (Mavin Records)", "Rush (Ayra Starr)"],
    mixSummary: { kickDb: -13, subDb: -12, keysDb: -17, vocalDb: -11, masterLufs: -9 }
  },

  // ==================== REGGAETON / LATIN ====================
  {
    id: "ep_tainy",
    name: "Tainy",
    avatarUrl: "https://picsum.photos/seed/tainy/120/120",
    category: "Futuristic Cyberpunk Reggaeton",
    genre: "Reggaeton/Latin",
    signatureBpm: 94,
    signatureScale: "F Minor",
    bio: "The genius behind Bad Bunny and J Balvin. Blends traditional Dembow riddim with futuristic cyberpunk synths and dark pop structures.",
    signatureProgressions: [
      { name: "Cyber Dembow", progression: ["Fm", "Db", "Ab", "Eb"], description: "Dark futuristic dembow progression" }
    ],
    producerLibrary: {
      drums: "Heavy, processed Dembow kick/snare pattern, futuristic electronic rim stabs",
      bass: "Distorted 808 sub-bass with filter sweeps",
      melodic: "Dark cyberpunk synth pads, pitch-shifted vocal chops, neon lead"
    },
    artistProfile: {
      vocalTone: "Laid-back, deep Spanish baritone with heavy melodic auto-tune",
      lyricalThemes: "Desire, heartbreak, late-night driving, street wealth",
      cadence: "Rhythmic reggaeton flow, jumping from triplet delivery to melodic hook",
      signatureAdlibs: "Pitched-down 'Tainy!', 'Ey!', 'Mami!'",
      productionPairing: "Tainy, Ovy on the Drums"
    },
    abcProgression: "Fm, Db, Ab, Eb",
    garageBandPatches: "Drum Kit: 'Cyber Dembow', Bass: 'Distorted 808 Glide', Keys: 'Neon Synth Lead'",
    fxChain: "Vocal chop stutter effects, high-cut filters on synths during verses, sidechain ducking.",
    arrangement: "Intro (4) -> Hook (8) -> Verse (16) -> Hook (8) -> Outro (8)",
    vocalChain: "Gate -> heavy autotune -> aggressive compressor -> slap delay (1/16 note) -> plate reverb",
    mixChecklist: [
      "Dembow kick/snare must sit at exactly -12dB for club playback",
      "Synth pads must sidechain heavily to kick",
      "Vocal ad-libs delayed and panned 60% wide"
    ],
    masteringProtocol: "Target -8 LUFS, punchy low-end preservation, wide stereo limiter.",
    references: ["Dakiti (Bad Bunny x Jhay Cortez)", "La Canción (Bad Bunny x J Balvin)", "Callaita"],
    mixSummary: { kickDb: -12, subDb: -11, keysDb: -18, vocalDb: -11, masterLufs: -8 }
  },

  // ==================== DRILL ====================
  {
    id: "ep_808melo",
    name: "808Melo",
    avatarUrl: "https://picsum.photos/seed/808melo/120/120",
    category: "UK / NY Sliding Drill",
    genre: "Drill",
    signatureBpm: 142,
    signatureScale: "E Minor",
    bio: "The developer of Pop Smoke's sound. Giant sliding 808 bass, syncopated triplet hi-hats, and dark cinematic minor string loops.",
    signatureProgressions: [
      { name: "Woo Slide", progression: ["Em", "C", "Am", "B7"], description: "Dark aggressive sliding drill loop" }
    ],
    producerLibrary: {
      drums: "Crisp syncopated snare on 8th step, triplet hi-hat rolls, heavy stomp kick",
      bass: "Screaming, sliding 808 bass with high slide transitions",
      melodic: "Ominous cinematic violin sections, detuned bells"
    },
    artistProfile: {
      vocalTone: "Deep, gravelly, menacing baritone with aggressive street delivery",
      lyricalThemes: "Street dominance, survival, luxury, block beef",
      cadence: "Rhythmic, syncopated, riding the triplet hi-hat rolls",
      signatureAdlibs: "Deep grunt 'Argh!', 'Woo!', 'Grrrr!'",
      productionPairing: "808Melo, Ghosty"
    },
    abcProgression: "Em, C, Am, B7",
    garageBandPatches: "Drum Kit: 'NY Drill Percussion', Bass: 'Screaming 808 Slide', Keys: 'Dark Violin Pad'",
    fxChain: "Aggressive distortion on 808 slide, high-pass sweep on drums during buildup.",
    arrangement: "Intro (8) -> Verse (16) -> Hook (8) -> Verse 2 (16) -> Outro (4)",
    vocalChain: "Gate -> aggressive vintage compressor -> presence boost at 4kHz -> slap delay",
    mixChecklist: [
      "808 slides must be perfectly tuned to progression root",
      "Syncopated snare must sit loud at -14dB",
      "Violin loops high-passed at 150Hz to make room for 808"
    ],
    masteringProtocol: "Target -8.5 LUFS, tight high-end limiting, hard bass saturation glue.",
    references: ["Welcome to the Party (Pop Smoke)", "Dior", "Mannequin"],
    mixSummary: { kickDb: -13, subDb: -10, keysDb: -19, vocalDb: -11, masterLufs: -8.5 }
  },

  // ==================== TRAP ====================
  {
    id: "ep_metro",
    name: "Metro Boomin",
    avatarUrl: "https://picsum.photos/seed/metro/120/120",
    category: "Dark Cinematic Trap",
    genre: "Trap",
    signatureBpm: 140,
    signatureScale: "C# Minor",
    bio: "The absolute icon of modern trap. Heavy 808 slides, spooky gothic bells, and grand orchestral loops.",
    signatureProgressions: [
      { name: "Savage Dark", progression: ["C#m", "A", "F#m", "G#7"], description: "Ominous street tension" }
    ],
    producerLibrary: {
      drums: "Ground-shaking sub-bass, lightning-fast hi-hats, crisp claps",
      bass: "Perfect, tuned 808 Subglide",
      melodic: "Spooky analog church bells, minor string pads"
    },
    artistProfile: {
      vocalTone: "Menacing, laid-back monotone delivery with autotuned hook-sense",
      lyricalThemes: "Street wealth, paranoia, luxury, dark nights, hustle",
      cadence: "Laid-back triplet flow riding the 808 pocket",
      signatureAdlibs: "Pitched-down 'Metro Boomin!', 'Yeah!', 'Skrrt!'",
      productionPairing: "Metro Boomin, Southside"
    },
    abcProgression: "C#m, A, F#m, G#7",
    garageBandPatches: "Drum Kit: 'Atlanta 808', Bass: 'Sub-Bass 808 Trap', Keys: 'Spooky Bells'",
    fxChain: "Ring modulator on bells, parallel saturation on 808.",
    arrangement: "Intro (8) -> Verse (16) -> Hook (8) -> Verse 2 (16) -> Outro (8)",
    vocalChain: "Gate -> fast pop compressor -> high presence EQ -> tape delay",
    mixChecklist: [
      "808 tuned perfectly to root note",
      "Clap hitting at exactly -14dB",
      "High pass all melody lines at 180Hz"
    ],
    masteringProtocol: "Target -8 LUFS, -1.0dB TP, 24-bit WAV, maximum bass power.",
    references: ["Mask Off (Future)", "Bad and Boujee (Migos)", "Heartless (The Weeknd)"],
    mixSummary: { kickDb: -12, subDb: -11, keysDb: -18, vocalDb: -11, masterLufs: -8 }
  },

  // ==================== JAZZ ====================
  {
    id: "ep_glasper",
    name: "Robert Glasper",
    avatarUrl: "https://picsum.photos/seed/glasper/120/120",
    category: "Jazz-Hip Hop Crossover",
    genre: "Jazz",
    signatureBpm: 84,
    signatureScale: "Eb Major",
    bio: "Bridges modern jazz piano improvisation with neo-soul and hip-hop drum loops.",
    signatureProgressions: [
      { name: "Black Radio Chords", progression: ["Ebmaj9", "Abmaj13", "Gm9", "Fm9"], description: "Sophisticated modern jazz-soul" }
    ],
    producerLibrary: {
      drums: "Crisp acoustic rim shots, vintage room overheads, brushed hats",
      bass: "Deep, woody upright double bass",
      melodic: "Lush grand piano extensions, Rhodes keys, muted trumpet"
    },
    artistProfile: {
      vocalTone: "Warm, conversational, jazzy spoken-sung or smooth tenor",
      lyricalThemes: "Identity, love, social consciousness, beauty",
      cadence: "Fluid, behind-the-beat, highly improvisational",
      signatureAdlibs: "Laughter, live performance hums, spoken-word interludes",
      productionPairing: "Robert Glasper, J Dilla"
    },
    abcProgression: "Ebmaj9, Abmaj13, Gm9, Fm9",
    garageBandPatches: "Drum Kit: 'Acoustic Studio', Bass: 'Upright Woody', Keys: 'Grand Piano Bright'",
    fxChain: "Lush stereo chorus on Rhodes, subtle vinyl crackle layer.",
    arrangement: "Intro (8) -> Verse (16) -> Solo (16) -> Verse 2 (16) -> Outro Jam (24)",
    vocalChain: "Gate -> gentle optical compressor -> warm tube EQ -> soft hall reverb",
    mixChecklist: [
      "Piano chords must sit wide in the stereo image",
      "Horns must have a warm room reverb (1.8s)",
      "Double bass must feel organic - EQ cut at 30Hz"
    ],
    masteringProtocol: "Target -10 LUFS, highly dynamic, high-fidelity resolution.",
    references: ["Black Radio (Robert Glasper)", "Afro Blue", "Ah Yeah"],
    mixSummary: { kickDb: -15, subDb: -13, keysDb: -16, vocalDb: -12, masterLufs: -10 }
  },

  // ==================== GOSPEL ====================
  {
    id: "ep_franklin",
    name: "Kirk Franklin",
    avatarUrl: "https://picsum.photos/seed/franklin/120/120",
    category: "Contemporary Urban Gospel",
    genre: "Gospel",
    signatureBpm: 102,
    signatureScale: "Db Major",
    bio: "The king of urban gospel. Blends massive, high-energy church choirs with hip-hop beats, R&B chord extensions, and horn stabs.",
    signatureProgressions: [
      { name: "Gospel Victory", progression: ["Db", "Gb", "Bbm", "Ab"], description: "Joyful high-energy church lift" }
    ],
    producerLibrary: {
      drums: "Acoustic-synthetic hybrid drums, driving tambourine, finger snaps",
      bass: "Active, running 5-string electric gospel bass",
      melodic: "Bright church grand piano, Hammond organ rotary, massive horn stacks"
    },
    artistProfile: {
      vocalTone: "Powerful, full-bodied choir vocals with energetic host shouting",
      lyricalThemes: "Faith, triumph over adversity, praise, joy, community",
      cadence: "Highly rhythmic, call-and-response, syncopated shouting and singing",
      signatureAdlibs: "Choir clapping, host chants: 'Let's go!', 'Do you hear me?!'",
      productionPairing: "Kirk Franklin, Babyface"
    },
    abcProgression: "Db, Gb, Bbm, Ab",
    garageBandPatches: "Drum Kit: 'Gospel Hybrid', Bass: 'Active electric bass', Keys: 'Hammond Organ'",
    fxChain: "Rotary speaker effect on organ, stereo widening on backing vocals.",
    arrangement: "Intro (8) -> Verse (8) -> Chorus (8) -> Verse 2 (8) -> Chorus (8) -> Choir Bridge (16) -> Outro (12)",
    vocalChain: "Gate -> fast compressor -> bright mid presence boost -> massive cathedral reverb (2.8s)",
    mixChecklist: [
      "Choir stacks panned 90% wide left and right",
      "Hammond organ sits in the mid-highs to support vocals",
      "Bass guitar runs panned dead center"
    ],
    masteringProtocol: "Target -8.5 LUFS, high-end energy, warm, transparent limiter.",
    references: ["I Smile (Kirk Franklin)", "Revolution", "Melodies From Heaven"],
    mixSummary: { kickDb: -14, subDb: -12, keysDb: -16, vocalDb: -11, masterLufs: -8.5 }
  },

  // ==================== METAL ====================
  {
    id: "ep_gordon",
    name: "Mick Gordon",
    avatarUrl: "https://picsum.photos/seed/gordon/120/120",
    category: "Cyberpunk Industrial Metal",
    genre: "Metal",
    signatureBpm: 130,
    signatureScale: "D Minor",
    bio: "The developer of the Doom soundtrack. Down-tuned distorted 8-string guitars, modular analog synth screams, and industrial drums.",
    signatureProgressions: [
      { name: "Doom Screamer", progression: ["Dm", "Bb", "Ab", "Gb"], description: "Dissonant down-tuned combat riffs" }
    ],
    producerLibrary: {
      drums: "Industrial compressed kick punch, metal clank snare, massive hats",
      bass: "Heavy distorted synth growl layered with down-tuned bass",
      melodic: "Aggressive 8-string electric guitar, screaming analog synths"
    },
    artistProfile: {
      vocalTone: "Guttural growls, screaming distortion, high-impact vocal threat",
      lyricalThemes: "Combat, destruction, industrial hellscapes, resistance",
      cadence: "Highly syncopated, mimicking the rapid-fire guitar chugs",
      signatureAdlibs: "Pitched-down metal screams, feedback shrieks",
      productionPairing: "Mick Gordon, Trent Reznor"
    },
    abcProgression: "Dm, Bb, Ab, Gb",
    garageBandPatches: "Drum Kit: 'Industrial Metal', Bass: 'Distorted Growl Synth', Keys: 'Screamer Guitar'",
    fxChain: "Aggressive multi-band distortion on bass and guitars, sidechain noise gating.",
    arrangement: "Intro (8) -> Main Combat (16) -> Breakdown (8) -> Main Combat (16) -> Outro (8)",
    vocalChain: "Gate (heavy) -> vocal distortion -> dual compressors -> short room reverb",
    mixChecklist: [
      "Guitars and bass must act as a single massive distorted wall",
      "Snare must have a heavy metal ring around 4kHz",
      "Cut all vocal frequencies below 100Hz"
    ],
    masteringProtocol: "Target -7 LUFS (maximum loudness and compression), -1.0dB TP, 24-bit WAV.",
    references: ["Rip & Tear (Mick Gordon)", "BFG Division", "The Only Thing They Fear Is You"],
    mixSummary: { kickDb: -11, subDb: -12, keysDb: -15, vocalDb: -11, masterLufs: -7 }
  },

  // ==================== INDIE / ALTERNATIVE ====================
  {
    id: "ep_godrich",
    name: "Nigel Godrich",
    avatarUrl: "https://picsum.photos/seed/godrich/120/120",
    category: "Art-Rock Atmospheric Indie",
    genre: "Indie/Alternative",
    signatureBpm: 92,
    signatureScale: "C Major",
    bio: "The legendary producer for Radiohead. Atmospheric tape delay, beautiful guitar swells, and close-mic vocals.",
    signatureProgressions: [
      { name: "In Rainbows", progression: ["Cmaj7", "Ebmaj7", "Abmaj7", "Dbmaj7"], description: "Dreamy non-diatonic exploration" }
    ],
    producerLibrary: {
      drums: "Dry organic tight drums, acoustic percussion, soft shaker",
      bass: "Pristine, clean electric bass with a round warmth",
      melodic: "Acoustic guitar swirls, warm vintage string synthesizers, tape-delayed guitar leads"
    },
    artistProfile: {
      vocalTone: "Fragile, airy, emotional tenor with close-mic intimacy",
      lyricalThemes: "Existentialism, technology, isolation, modern life, beauty",
      cadence: "Unconventional, syncopated, drifting between speech and melody",
      signatureAdlibs: "Sighs, wordless falsetto loops, reversed vocal echoes",
      productionPairing: "Nigel Godrich, Finneas O'Connell"
    },
    abcProgression: "Cmaj7, Ebmaj7, Abmaj7, Dbmaj7",
    garageBandPatches: "Drum Kit: 'Dry Session', Bass: 'Warm DI Bass', Keys: 'Analog Chamber Choir'",
    fxChain: "Tape delay on guitar leads, subtle pitch flutter across melody tracks.",
    arrangement: "Intro (8) -> Verse (8) -> Chorus (8) -> Verse 2 (8) -> Outro Build (16)",
    vocalChain: "Gate -> opto compressor -> warm EQ shelf -> delicate tape delay",
    mixChecklist: [
      "Vocal sits close and central - very subtle warm reverb",
      "Delay sweeps pan from 40% left to 40% right",
      "Bass guitar holds the song together - keep it warm and thick"
    ],
    masteringProtocol: "Target -10 LUFS, expansive dynamic range, pristine stereo balance.",
    references: ["Karma Police (Radiohead)", "How to Disappear Completely", "Lost Cause (Beck)"],
    mixSummary: { kickDb: -15, subDb: -13, keysDb: -17, vocalDb: -12, masterLufs: -10 }
  },

  // ==================== K-POP ====================
  {
    id: "ep_teddy",
    name: "Teddy Park",
    avatarUrl: "https://picsum.photos/seed/teddy/120/120",
    category: "YG Trap-Pop Hook K-Pop",
    genre: "K-Pop",
    signatureBpm: 126,
    signatureScale: "C Minor",
    bio: "The hitmaker for BLACKPINK and BIGBANG. Combines massive trap drops, catchy brass hooks, and high-energy pop verses.",
    signatureProgressions: [
      { name: "How You Like That", progression: ["Cm", "Ab", "Fm", "G7"], description: "Aggressive EDM-trap crossover cycle" }
    ],
    producerLibrary: {
      drums: "Aggressive trap kicks, EDM snares, rolling hi-hats, massive build-up risers",
      bass: "Saturated Reese synth bass, clean trap sub-bass",
      melodic: "Catchy digital brass lead, aggressive synth stabs, clean EDM plucks"
    },
    artistProfile: {
      vocalTone: "Vibrant, high-energy, rap-pop crossover with flawless pitch",
      lyricalThemes: "Confidence, victory, luxury, betrayal, dance floor power",
      cadence: "Highly syncopated, switching instantly between rapid-fire rap and soaring hooks",
      signatureAdlibs: "English/Korean code-switching shouts, 'BLACKPINK!', 'Hey!', 'Rum-pum-pum!'",
      productionPairing: "Teddy Park, Max Martin"
    },
    abcProgression: "Cm, Ab, Fm, G7",
    garageBandPatches: "Drum Kit: 'Cyber Trap Pop', Bass: 'Reese Saturated', Keys: 'Neon EDM Pluck'",
    fxChain: "Extreme vocal tuning as an effect, filter sweeps during build-up tracks.",
    arrangement: "Intro (4) -> Verse (8) -> Pre-Chorus (8) -> Drop Chorus (8) -> Verse 2 (8) -> Outro Dance (12)",
    vocalChain: "Gate -> autotune (tight) -> fast compressor -> exciter at 10kHz -> stereo delay",
    mixChecklist: [
      "Drop brass lead must sit loud at exactly -12dB",
      "Chorus vocal doubled and panned 50% left and right",
      "Keep sub-bass extremely tight and loud"
    ],
    masteringProtocol: "Target -7.5 LUFS (maximum impact for streaming), -1.0dB TP, 24-bit WAV.",
    references: ["DDU-DU DDU-DU (BLACKPINK)", "Bang Bang Bang (BIGBANG)", "How You Like That"],
    mixSummary: { kickDb: -11, subDb: -11, keysDb: -16, vocalDb: -10, masterLufs: -7.5 }
  }
];

export const TOTAL_NEEDED_TO_FULL_AZ_ROSTER_STATEMENT = "To scale this complete A-Z roster to a full database of 5 entries for every letter across all 15 genres, a total of 150 entries would be needed. This first batch of 5 high-fidelity templates per genre (75 total) forms the core foundation.";
