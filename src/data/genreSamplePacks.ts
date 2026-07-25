export interface AudioSampleItem {
  id: string;
  name: string;
  genre: string;
  category: 'Drums' | 'Bass' | 'Synths' | 'Brass & Horns' | 'Vocal Chops' | 'FX & Vinyl' | 'Guitars' | 'Orchestral';
  bpm: number;
  key: string;
  duration: string;
  fileSize: string;
  type: 'Loop' | 'One-Shot' | 'Stem Kit';
  freq: number; // Synth preview frequency in Hz
  description: string;
}

export const EXPANDED_GENRE_SAMPLES: AudioSampleItem[] = [
  // A - Z ENCYCLOPEDIA AUDIO SAMPLE COLLECTION
  // A
  {
    id: 's_a1',
    name: 'Acoustic_Fingerstyle_Folk_Guitar.wav',
    genre: 'Folk & Acoustic',
    category: 'Guitars',
    bpm: 95,
    key: 'G Major',
    duration: '00:08',
    fileSize: '2.2 MB',
    type: 'Loop',
    freq: 330,
    description: 'Warm steel-string acoustic guitar fingerpicking recorded on ribbon mic.'
  },
  {
    id: 's_a2',
    name: 'Afrobeat_Lagos_Polyrhythm_Drums.wav',
    genre: 'Afrobeat & Highlife',
    category: 'Drums',
    bpm: 118,
    key: 'N/A',
    duration: '00:08',
    fileSize: '3.1 MB',
    type: 'Loop',
    freq: 180,
    description: 'Energetic West African conga, shekere, and talking drum polyrhythm loop.'
  },
  {
    id: 's_a3',
    name: 'Ambient_Nebula_Pad_Rise.wav',
    genre: 'Lofi & Ambient',
    category: 'Synths',
    bpm: 70,
    key: 'C Major',
    duration: '00:12',
    fileSize: '4.0 MB',
    type: 'Loop',
    freq: 261,
    description: 'Lush, evolving analog ambient pad swell with deep reverb decay.'
  },

  // B
  {
    id: 's_b1',
    name: 'Baroque_Harpsichord_Arpeggio.wav',
    genre: 'Orchestral Cinematic',
    category: 'Orchestral',
    bpm: 120,
    key: 'D Minor',
    duration: '00:06',
    fileSize: '1.9 MB',
    type: 'Loop',
    freq: 587,
    description: 'Authentic 18th century Viennese harpsichord rapid arpeggios.'
  },
  {
    id: 's_b2',
    name: 'Bass_808_Glitch_Glide.wav',
    genre: 'Hip Hop / Trap',
    category: 'Bass',
    bpm: 140,
    key: 'F Minor',
    duration: '00:04',
    fileSize: '1.2 MB',
    type: 'One-Shot',
    freq: 55,
    description: 'Saturated sub-808 pitch-bent bass drop with heavy low-end power.'
  },
  {
    id: 's_b3',
    name: 'Brass_Section_Chase_Swell.wav',
    genre: '1970s Crime Soul',
    category: 'Brass & Horns',
    bpm: 120,
    key: 'F Minor',
    duration: '00:06',
    fileSize: '1.8 MB',
    type: 'Loop',
    freq: 440,
    description: 'Pulsing horn section with trumpet stabs and trombone warmth for cinematic chase scenes.'
  },

  // C
  {
    id: 's_c1',
    name: 'Cello_Legato_Sub_Riser.wav',
    genre: 'Orchestral Cinematic',
    category: 'Orchestral',
    bpm: 90,
    key: 'A Minor',
    duration: '00:08',
    fileSize: '2.7 MB',
    type: 'Stem Kit',
    freq: 110,
    description: 'Deep orchestral cello section playing expressive legato swell.'
  },
  {
    id: 's_c2',
    name: 'Cyberpunk_Industrial_Kick.wav',
    genre: 'Synthwave / 80s',
    category: 'Drums',
    bpm: 128,
    key: 'N/A',
    duration: '00:02',
    fileSize: '450 KB',
    type: 'One-Shot',
    freq: 60,
    description: 'Gated sub kick with metallic industrial transient snap.'
  },

  // D
  {
    id: 's_d1',
    name: 'Disco_Octave_Funk_Bassline.wav',
    genre: 'Motown & Soul',
    category: 'Bass',
    bpm: 122,
    key: 'E Minor',
    duration: '00:08',
    fileSize: '2.5 MB',
    type: 'Loop',
    freq: 82,
    description: 'Bouncy 1970s disco octave slap bassline recorded through analog preamp.'
  },
  {
    id: 's_d2',
    name: 'Distorted_Tube_Guitar_Riff.wav',
    genre: 'Rock & Metal',
    category: 'Guitars',
    bpm: 132,
    key: 'D Minor',
    duration: '00:06',
    fileSize: '2.1 MB',
    type: 'Loop',
    freq: 293,
    description: 'High-gain double-tracked electric guitar crunch riff with Marshall tube bite.'
  },

  // E
  {
    id: 's_e1',
    name: 'Electric_Rhodes_Velvet_Chords.wav',
    genre: 'Motown & Soul',
    category: 'Synths',
    bpm: 88,
    key: 'Eb Major',
    duration: '00:08',
    fileSize: '2.4 MB',
    type: 'Loop',
    freq: 311,
    description: 'Silky 1973 Fender Rhodes electric piano with warm stereo tremolo.'
  },
  {
    id: 's_e2',
    name: 'EDM_Mainstage_Super_Lead.wav',
    genre: 'Synthwave / 80s',
    category: 'Synths',
    bpm: 128,
    key: 'G Minor',
    duration: '00:08',
    fileSize: '2.9 MB',
    type: 'Loop',
    freq: 784,
    description: 'Detuned supersaw synth lead for festival mainstage EDM drops.'
  },

  // F
  {
    id: 's_f1',
    name: 'Flute_Bamboo_Ethno_Melody.wav',
    genre: 'Lofi & Ambient',
    category: 'Orchestral',
    bpm: 80,
    key: 'D Minor',
    duration: '00:08',
    fileSize: '1.9 MB',
    type: 'Loop',
    freq: 523,
    description: 'Breathy ethno bamboo flute melody with natural tape delay.'
  },
  {
    id: 's_f2',
    name: 'Funk_Wah_Electric_Rhythm.wav',
    genre: '1970s Crime Soul',
    category: 'Guitars',
    bpm: 112,
    key: 'C Minor',
    duration: '00:08',
    fileSize: '2.4 MB',
    type: 'Loop',
    freq: 320,
    description: 'Raw funk wah-wah electric rhythm guitar recorded on vintage console.'
  },

  // G
  {
    id: 's_g1',
    name: 'Gated_80s_Snare_Fill.wav',
    genre: 'Synthwave / 80s',
    category: 'Drums',
    bpm: 120,
    key: 'N/A',
    duration: '00:04',
    fileSize: '890 KB',
    type: 'One-Shot',
    freq: 220,
    description: 'Iconic 1980s Phil Collins style gated reverb snare drum fill.'
  },
  {
    id: 's_g2',
    name: 'Gospel_Organ_Hammond_B3_Swell.wav',
    genre: 'Motown & Soul',
    category: 'Synths',
    bpm: 75,
    key: 'C Major',
    duration: '00:08',
    fileSize: '2.8 MB',
    type: 'Loop',
    freq: 261,
    description: 'Authentic Hammond B3 organ with Leslie rotating speaker cabinet swell.'
  },

  // H
  {
    id: 's_h1',
    name: 'Heavy_Metal_Double_Bass_Drums.wav',
    genre: 'Rock & Metal',
    category: 'Drums',
    bpm: 180,
    key: 'N/A',
    duration: '00:08',
    fileSize: '3.4 MB',
    type: 'Loop',
    freq: 100,
    description: 'Relentless 180 BPM double-kick pedal metal drum pattern.'
  },
  {
    id: 's_h2',
    name: 'Hip_Hop_Boom_Bap_Crack_Snare.wav',
    genre: 'Hip Hop / Trap',
    category: 'Drums',
    bpm: 90,
    key: 'N/A',
    duration: '00:08',
    fileSize: '2.1 MB',
    type: 'Loop',
    freq: 200,
    description: 'Sampling drum machine 12-bit SP1200 style crunchy vinyl drum break.'
  },

  // I
  {
    id: 's_i1',
    name: 'Industrial_Machine_Clang_Impact.wav',
    genre: 'Rock & Metal',
    category: 'FX & Vinyl',
    bpm: 130,
    key: 'N/A',
    duration: '00:03',
    fileSize: '950 KB',
    type: 'One-Shot',
    freq: 150,
    description: 'Heavy metallic industrial hydraulic impact for cinematic trailers.'
  },

  // J
  {
    id: 's_j1',
    name: 'Jazz_Saxophone_Noir_Licks.wav',
    genre: 'Motown & Soul',
    category: 'Brass & Horns',
    bpm: 85,
    key: 'Ab Minor',
    duration: '00:08',
    fileSize: '2.3 MB',
    type: 'Loop',
    freq: 466,
    description: 'Smoky midnight tenor saxophone solo played in vintage jazz club atmosphere.'
  },

  // K
  {
    id: 's_k1',
    name: 'Kalimba_African_Thumb_Piano.wav',
    genre: 'Afrobeat & Reggae',
    category: 'Synths',
    bpm: 110,
    key: 'G Major',
    duration: '00:08',
    fileSize: '1.7 MB',
    type: 'Loop',
    freq: 659,
    description: 'Acoustic African kalimba thumb piano hypnotic rhythmic pattern.'
  },
  {
    id: 's_k2',
    name: 'KPop_Bubblegum_Synth_Hook.wav',
    genre: 'Synthwave / 80s',
    category: 'Synths',
    bpm: 125,
    key: 'C Major',
    duration: '00:08',
    fileSize: '2.6 MB',
    type: 'Loop',
    freq: 880,
    description: 'Bright electronic pop synth chord hook with playful pitch bends.'
  },

  // L
  {
    id: 's_l1',
    name: 'Lofi_Vinyl_Crackle_Chords.wav',
    genre: 'Lofi & Ambient',
    category: 'FX & Vinyl',
    bpm: 78,
    key: 'F# Minor',
    duration: '00:08',
    fileSize: '2.1 MB',
    type: 'Loop',
    freq: 370,
    description: 'Dusty vinyl turntable crackle layered with mellow jazz piano chords.'
  },

  // M
  {
    id: 's_m1',
    name: 'Motown_Analog_Tube_Bass.wav',
    genre: 'Motown & Soul',
    category: 'Bass',
    bpm: 115,
    key: 'A Minor',
    duration: '00:08',
    fileSize: '2.1 MB',
    type: 'Loop',
    freq: 110,
    description: 'Deep, warm analog precision bass with flatwound strings.'
  },

  // N
  {
    id: 's_n1',
    name: 'Neon_Grid_Analogue_Pluck.wav',
    genre: 'Synthwave / 80s',
    category: 'Synths',
    bpm: 124,
    key: 'D Minor',
    duration: '00:08',
    fileSize: '2.8 MB',
    type: 'Loop',
    freq: 587,
    description: 'Jupiter-8 analogue chorus synth pluck melody with retro delay.'
  },

  // O
  {
    id: 's_o1',
    name: 'Orchestral_Symphonic_Swell.wav',
    genre: 'Orchestral Cinematic',
    category: 'Orchestral',
    bpm: 72,
    key: 'D Major',
    duration: '00:10',
    fileSize: '3.8 MB',
    type: 'Stem Kit',
    freq: 293,
    description: 'Full 80-piece Hollywood symphony orchestra rising chord crescendo.'
  },

  // P
  {
    id: 's_p1',
    name: 'Piano_Concert_Grand_Glissando.wav',
    genre: 'Orchestral Cinematic',
    category: 'Orchestral',
    bpm: 100,
    key: 'C Major',
    duration: '00:04',
    fileSize: '1.5 MB',
    type: 'One-Shot',
    freq: 523,
    description: 'Steinway concert grand piano rapid sweep across all 88 keys.'
  },

  // Q
  {
    id: 's_q1',
    name: 'Quarter_Note_Trap_Hat_Roll.wav',
    genre: 'Hip Hop / Trap',
    category: 'Drums',
    bpm: 140,
    key: 'N/A',
    duration: '00:04',
    fileSize: '820 KB',
    type: 'Loop',
    freq: 3000,
    description: 'Rapid 1/32nd triplet hi-hat roll pattern with pitch drops.'
  },

  // R
  {
    id: 's_r1',
    name: 'Reggae_Dub_Sub_Bass_Drop.wav',
    genre: 'Afrobeat & Reggae',
    category: 'Bass',
    bpm: 75,
    key: 'G Minor',
    duration: '00:08',
    fileSize: '2.2 MB',
    type: 'Loop',
    freq: 48,
    description: 'Deep Kingston dub sub-bass rumble with space tape delay feedback.'
  },

  // S
  {
    id: 's_s1',
    name: 'Soul_Vocal_Chop_Harmony.wav',
    genre: 'Motown & Soul',
    category: 'Vocal Chops',
    bpm: 92,
    key: 'Bb Major',
    duration: '00:08',
    fileSize: '2.0 MB',
    type: 'Loop',
    freq: 440,
    description: 'Pitch-shifted soul gospel choir vocal hook chops.'
  },

  // T
  {
    id: 's_t1',
    name: 'Techno_909_Acid_Bass_Pulse.wav',
    genre: 'Synthwave / 80s',
    category: 'Bass',
    bpm: 132,
    key: 'C Minor',
    duration: '00:08',
    fileSize: '2.7 MB',
    type: 'Loop',
    freq: 130,
    description: 'Roland TB-303 resonance-swept acid techno bass line.'
  },

  // U
  {
    id: 's_u1',
    name: 'Urban_RnB_Melodic_Run.wav',
    genre: 'Hip Hop / Trap',
    category: 'Vocal Chops',
    bpm: 85,
    key: 'F Major',
    duration: '00:06',
    fileSize: '1.8 MB',
    type: 'One-Shot',
    freq: 349,
    description: 'Smooth urban R&B vocal harmony run with studio autotune air.'
  },

  // V
  {
    id: 's_v1',
    name: 'Vintage_Vinyl_Tape_Hiss_Crackle.wav',
    genre: 'Lofi & Ambient',
    category: 'FX & Vinyl',
    bpm: 80,
    key: 'N/A',
    duration: '00:15',
    fileSize: '4.5 MB',
    type: 'Loop',
    freq: 8000,
    description: '100% authentic 1970s vinyl turntable needle hiss and static noise.'
  },

  // W
  {
    id: 's_w1',
    name: 'World_Didgeridoo_Drone_Sub.wav',
    genre: 'Lofi & Ambient',
    category: 'Bass',
    bpm: 65,
    key: 'D Minor',
    duration: '00:10',
    fileSize: '3.1 MB',
    type: 'Loop',
    freq: 73,
    description: 'Organic Australian aboriginal didgeridoo circular breathing sub drone.'
  },

  // X
  {
    id: 's_x1',
    name: 'Xylophone_Marimba_Tropical.wav',
    genre: 'Afrobeat & Reggae',
    category: 'Orchestral',
    bpm: 105,
    key: 'C Major',
    duration: '00:08',
    fileSize: '1.9 MB',
    type: 'Loop',
    freq: 784,
    description: 'Wooden percussive marimba melodic bounce with natural room acoustic.'
  },

  // Y
  {
    id: 's_y1',
    name: 'Yamaha_DX7_FM_Piano_Chords.wav',
    genre: 'Synthwave / 80s',
    category: 'Synths',
    bpm: 110,
    key: 'G Major',
    duration: '00:08',
    fileSize: '2.3 MB',
    type: 'Loop',
    freq: 392,
    description: 'Crisp 1983 Yamaha DX7 FM digital electric piano chord progression.'
  },

  // Z
  {
    id: 's_z1',
    name: 'Zero_G_Cyber_Sub_Impact.wav',
    genre: 'Synthwave / 80s',
    category: 'FX & Vinyl',
    bpm: 120,
    key: 'N/A',
    duration: '00:05',
    fileSize: '1.6 MB',
    type: 'One-Shot',
    freq: 40,
    description: 'Deep space zero-G sub impact boom with spatial pitch envelope.'
  },
  {
    id: 's_soul_01',
    name: 'Soul_Chop_Vocal_Hook_Phrase.wav',
    genre: 'Hip Hop / Trap',
    category: 'Vocal Chops',
    bpm: 90,
    key: 'E Minor',
    duration: '00:06',
    fileSize: '1.9 MB',
    type: 'Loop',
    freq: 523,
    description: 'Vintage vinyl pitched soul vocal chop phrase with tape vinyl crackle.'
  },

  // CINEMATIC & ORCHESTRAL
  {
    id: 'cin_01',
    name: 'Imperial_Celli_Legato_Riser.wav',
    genre: 'Orchestral Cinematic',
    category: 'Orchestral',
    bpm: 80,
    key: 'D Minor',
    duration: '00:12',
    fileSize: '4.2 MB',
    type: 'Stem Kit',
    freq: 220,
    description: 'Symphonic cello section playing suspenseful legato rise in IMAX acoustics.'
  },
  {
    id: 'cin_02',
    name: 'Deep_Braam_Cinematic_Impact.wav',
    genre: 'Orchestral Cinematic',
    category: 'FX & Vinyl',
    bpm: 90,
    key: 'C Minor',
    duration: '00:05',
    fileSize: '1.6 MB',
    type: 'One-Shot',
    freq: 73,
    description: 'Massive trailer horn braam impact with sub-bass rumble.'
  },

  // LOFI & AMBIENT
  {
    id: 'lofi_01',
    name: 'Lofi_Rhodes_Chords_Vinyl_Dust.wav',
    genre: 'Lofi & Ambient',
    category: 'Synths',
    bpm: 75,
    key: 'B Minor',
    duration: '00:12',
    fileSize: '3.5 MB',
    type: 'Loop',
    freq: 330,
    description: 'Mellow Fender Rhodes electric piano chords with vinyl noise floor.'
  },

  // HEAVY METAL & ROCK
  {
    id: 'mtl_01',
    name: 'Distorted_Tube_Riff_Overdrive.wav',
    genre: 'Rock & Metal',
    category: 'Guitars',
    bpm: 135,
    key: 'E Minor',
    duration: '00:08',
    fileSize: '2.9 MB',
    type: 'Loop',
    freq: 261,
    description: 'Double-tracked high-gain electric guitar rhythm riff with Marshall tube punch.'
  },

  // LATIN & AFROBEAT
  {
    id: 'lat_01',
    name: 'Afrobeat_Conga_Polyrhythm_Perc.wav',
    genre: 'Afrobeat & Reggae',
    category: 'Drums',
    bpm: 110,
    key: 'N/A',
    duration: '00:08',
    fileSize: '2.0 MB',
    type: 'Loop',
    freq: 180,
    description: 'Organic live conga, shaker, and djembe syncopated percussion loop.'
  }
];
