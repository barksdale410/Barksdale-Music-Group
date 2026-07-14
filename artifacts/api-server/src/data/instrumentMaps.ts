export const instrumentMaps = {
  daws: [
    "garageband_ios",
    "garageband_mac",
    "fl_studio",
    "fl_studio_mobile",
    "logic_pro",
    "ableton",
    "bandlab",
    "pro_tools",
    "reason",
    "cubase"
  ],
  categories: [
    {
      name: "Pianos",
      instruments: [
        {
          id: "grand_piano",
          label: "Grand Piano",
          dawMappings: {
            garageband_ios: "Steinway Grand Piano",
            garageband_mac: "Steinway Grand Piano",
            fl_studio: "FLEX — Grand Piano",
            fl_studio_mobile: "Piano — Concert Grand",
            logic_pro: "Steinway Grand Piano",
            ableton: "Grand Piano (Sampler)",
            bandlab: "Grand Piano",
            pro_tools: "Structure Free — Grand Piano",
            reason: "ID8 — Piano",
            cubase: "The Grand 3 — Steinway"
          }
        },
        {
          id: "cinematic_piano",
          label: "Cinematic Piano",
          dawMappings: {
            garageband_ios: "Electric Piano — Cinematic",
            garageband_mac: "Felt Piano",
            fl_studio: "FLEX — Cinematic Piano",
            fl_studio_mobile: "Piano — Movie Score",
            logic_pro: "Felt Piano",
            ableton: "Cinematic Piano (Sampler)",
            bandlab: "Film Piano",
            pro_tools: "Hybrid — Cinematic Keys",
            reason: "NN-XT — Cinematic Piano",
            cubase: "Dark Piano (Sampler)"
          }
        },
        {
          id: "rhodes",
          label: "Rhodes",
          dawMappings: {
            garageband_ios: "Classic Electric Piano",
            garageband_mac: "Vintage Electric Piano — Rhodes",
            fl_studio: "Vintage Electric Piano",
            fl_studio_mobile: "Electric Piano — Rhodes",
            logic_pro: "Vintage Electric Piano",
            ableton: "Rhodes (Sampler)",
            bandlab: "E. Piano — Rhodes Mk1",
            pro_tools: "Structure Free — Rhodes",
            reason: "NN-XT — Mark I",
            cubase: "The Grand 3 — Rhodes Mk2"
          }
        },
        {
          id: "wurlitzer",
          label: "Wurlitzer",
          dawMappings: {
            garageband_ios: "Bright Electric Piano",
            garageband_mac: "Vintage Electric Piano — Wurly",
            fl_studio: "FLEX — Wurlitzer",
            fl_studio_mobile: "Electric Piano — Wurlitzer",
            logic_pro: "Vintage Electric Piano — Wurl",
            ableton: "Wurlitzer (Sampler)",
            bandlab: "E. Piano — Wurly",
            pro_tools: "Structure Free — Wurlitzer",
            reason: "NN-XT — Wurlitzer",
            cubase: "HALion — Wurlitzer"
          }
        },
        {
          id: "clavinet",
          label: "Clavinet",
          dawMappings: {
            garageband_ios: "Electric Clavinet",
            garageband_mac: "Vintage Electric Piano — Clav",
            fl_studio: "FLEX — Clavinet",
            fl_studio_mobile: "Keys — Clavinet",
            logic_pro: "Vintage Clav",
            ableton: "Clavinet (Sampler)",
            bandlab: "Clav",
            pro_tools: "Structure Free — Clavinet",
            reason: "ID8 — Clavinet",
            cubase: "HALion — Clavinet D6"
          }
        },
        {
          id: "toy_piano",
          label: "Toy Piano",
          dawMappings: {
            garageband_ios: "Toy Box — Piano",
            garageband_mac: "Toy Piano",
            fl_studio: "FLEX — Toy Piano",
            fl_studio_mobile: "Keys — Toy Piano",
            logic_pro: "Toy Piano",
            ableton: "Toy Piano (Sampler)",
            bandlab: "Toy Piano",
            pro_tools: "Structure Free — Toy Piano",
            reason: "NN-XT — Toy Piano",
            cubase: "HALion — Toy Piano"
          }
        }
      ]
    },
    {
      name: "Organs",
      instruments: [
        {
          id: "hammond_b3",
          label: "Hammond B3",
          dawMappings: {
            garageband_ios: "Classic Organ",
            garageband_mac: "Hammond B3",
            fl_studio: "FLEX — Hammond B3",
            fl_studio_mobile: "Organ — Hammond",
            logic_pro: "Vintage B3 Organ",
            ableton: "B3 Organ (Sampler)",
            bandlab: "Organ — Hammond",
            pro_tools: "Structure Free — Hammond",
            reason: "ID8 — Organ",
            cubase: "HALion — Hammond B3"
          }
        },
        {
          id: "jazz_organ",
          label: "Jazz Organ",
          dawMappings: {
            garageband_ios: "Jazz Organ",
            garageband_mac: "Cinema Organ",
            fl_studio: "FLEX — Jazz Organ",
            fl_studio_mobile: "Organ — Jazz",
            logic_pro: "Vintage B3 Organ — Jazz",
            ableton: "Jazz Organ (Sampler)",
            bandlab: "Jazz Organ",
            pro_tools: "Structure Free — Jazz Organ",
            reason: "ID8 — Jazz Organ",
            cubase: "HALion — Jazz Organ"
          }
        },
        {
          id: "church_organ",
          label: "Church Organ",
          dawMappings: {
            garageband_ios: "Cathedral Organ",
            garageband_mac: "Pipe Organ",
            fl_studio: "FLEX — Pipe Organ",
            fl_studio_mobile: "Organ — Church",
            logic_pro: "Pipe Organ",
            ableton: "Church Organ (Sampler)",
            bandlab: "Pipe Organ",
            pro_tools: "Structure Free — Church Organ",
            reason: "ID8 — Church Organ",
            cubase: "HALion — Church Organ"
          }
        }
      ]
    },
    {
      name: "Strings",
      instruments: [
        {
          id: "studio_strings",
          label: "Studio Strings",
          dawMappings: {
            garageband_ios: "Orchestral Strings",
            garageband_mac: "Studio Strings",
            fl_studio: "Orchestral — Strings Section",
            fl_studio_mobile: "Strings — Full Section",
            logic_pro: "Studio Strings",
            ableton: "Strings Section (Sampler)",
            bandlab: "Orchestral Strings",
            pro_tools: "Hybrid — String Ensemble",
            reason: "NN-XT — String Ensemble",
            cubase: "HALion — String Ensemble"
          }
        },
        {
          id: "chamber_strings",
          label: "Chamber Strings",
          dawMappings: {
            garageband_ios: "String Quartet",
            garageband_mac: "Chamber Strings",
            fl_studio: "Orchestral — Chamber Strings",
            fl_studio_mobile: "Strings — Chamber",
            logic_pro: "Session Strings",
            ableton: "Chamber Strings (Sampler)",
            bandlab: "String Quartet",
            pro_tools: "Structure Free — Chamber Strings",
            reason: "NN-XT — Chamber Strings",
            cubase: "HALion — Chamber Strings"
          }
        },
        {
          id: "solo_violin",
          label: "Solo Violin",
          dawMappings: {
            garageband_ios: "Violin",
            garageband_mac: "Violin",
            fl_studio: "Orchestral — Solo Violin",
            fl_studio_mobile: "Strings — Violin",
            logic_pro: "Violin Solo",
            ableton: "Violin (Sampler)",
            bandlab: "Violin",
            pro_tools: "Structure Free — Violin",
            reason: "NN-XT — Solo Violin",
            cubase: "HALion — Solo Violin"
          }
        },
        {
          id: "solo_cello",
          label: "Solo Cello",
          dawMappings: {
            garageband_ios: "Cello",
            garageband_mac: "Cello",
            fl_studio: "Orchestral — Solo Cello",
            fl_studio_mobile: "Strings — Cello",
            logic_pro: "Cello Solo",
            ableton: "Cello (Sampler)",
            bandlab: "Cello",
            pro_tools: "Structure Free — Cello",
            reason: "NN-XT — Solo Cello",
            cubase: "HALion — Solo Cello"
          }
        },
        {
          id: "full_orchestra",
          label: "Full Orchestra",
          dawMappings: {
            garageband_ios: "Full Orchestra",
            garageband_mac: "Full Orchestra",
            fl_studio: "Orchestral — Full Orchestra",
            fl_studio_mobile: "Strings — Orchestra",
            logic_pro: "Symphonic Orchestra",
            ableton: "Orchestra (Sampler)",
            bandlab: "Orchestral",
            pro_tools: "Hybrid — Full Orchestra",
            reason: "NN-XT — Orchestra",
            cubase: "HALion Sonic — Orchestra"
          }
        }
      ]
    },
    {
      name: "Brass",
      instruments: [
        {
          id: "orchestral_brass",
          label: "Orchestral Brass",
          dawMappings: {
            garageband_ios: "Brass Section",
            garageband_mac: "Brass Section",
            fl_studio: "Orchestral — Brass Section",
            fl_studio_mobile: "Brass — Section",
            logic_pro: "Concert Brass",
            ableton: "Brass Section (Sampler)",
            bandlab: "Brass Section",
            pro_tools: "Structure Free — Brass Section",
            reason: "NN-XT — Brass Section",
            cubase: "HALion — Brass Section"
          }
        },
        {
          id: "solo_trumpet",
          label: "Solo Trumpet",
          dawMappings: {
            garageband_ios: "Trumpet",
            garageband_mac: "Trumpet",
            fl_studio: "Orchestral — Trumpet",
            fl_studio_mobile: "Brass — Trumpet",
            logic_pro: "Trumpet",
            ableton: "Trumpet (Sampler)",
            bandlab: "Trumpet",
            pro_tools: "Structure Free — Trumpet",
            reason: "ID8 — Trumpet",
            cubase: "HALion — Trumpet"
          }
        },
        {
          id: "muted_trumpet",
          label: "Muted Trumpet",
          dawMappings: {
            garageband_ios: "Muted Trumpet",
            garageband_mac: "Jazz Trumpet",
            fl_studio: "Orchestral — Muted Trumpet",
            fl_studio_mobile: "Brass — Muted Trumpet",
            logic_pro: "Muted Trumpet",
            ableton: "Muted Trumpet (Sampler)",
            bandlab: "Jazz Trumpet",
            pro_tools: "Structure Free — Muted Trumpet",
            reason: "NN-XT — Muted Trumpet",
            cubase: "HALion — Muted Trumpet"
          }
        },
        {
          id: "french_horn",
          label: "French Horn",
          dawMappings: {
            garageband_ios: "French Horns",
            garageband_mac: "French Horn",
            fl_studio: "Orchestral — French Horn",
            fl_studio_mobile: "Brass — French Horn",
            logic_pro: "French Horn",
            ableton: "French Horn (Sampler)",
            bandlab: "French Horn",
            pro_tools: "Structure Free — French Horn",
            reason: "NN-XT — French Horn",
            cubase: "HALion — French Horn"
          }
        }
      ]
    },
    {
      name: "Woodwinds",
      instruments: [
        {
          id: "solo_flute",
          label: "Solo Flute",
          dawMappings: {
            garageband_ios: "Flute",
            garageband_mac: "Flute",
            fl_studio: "Orchestral — Flute",
            fl_studio_mobile: "Woodwinds — Flute",
            logic_pro: "Flute",
            ableton: "Flute (Sampler)",
            bandlab: "Flute",
            pro_tools: "Structure Free — Flute",
            reason: "ID8 — Flute",
            cubase: "HALion — Flute"
          }
        },
        {
          id: "saxophone",
          label: "Saxophone",
          dawMappings: {
            garageband_ios: "Alto Sax",
            garageband_mac: "Saxophone",
            fl_studio: "Orchestral — Saxophone",
            fl_studio_mobile: "Woodwinds — Saxophone",
            logic_pro: "Alto Saxophone",
            ableton: "Saxophone (Sampler)",
            bandlab: "Saxophone",
            pro_tools: "Structure Free — Saxophone",
            reason: "ID8 — Saxophone",
            cubase: "HALion — Saxophone"
          }
        }
      ]
    },
    {
      name: "Guitars",
      instruments: [
        {
          id: "acoustic_guitar",
          label: "Acoustic Guitar",
          dawMappings: {
            garageband_ios: "Acoustic Guitar",
            garageband_mac: "Studio Acoustic",
            fl_studio: "FLEX — Acoustic Guitar",
            fl_studio_mobile: "Guitar — Acoustic",
            logic_pro: "Studio Acoustic Guitar",
            ableton: "Acoustic Guitar (Sampler)",
            bandlab: "Acoustic Guitar",
            pro_tools: "Structure Free — Acoustic Guitar",
            reason: "ID8 — Acoustic Guitar",
            cubase: "HALion — Acoustic Guitar"
          }
        },
        {
          id: "electric_guitar_clean",
          label: "Electric Guitar (Clean)",
          dawMappings: {
            garageband_ios: "Clean Electric",
            garageband_mac: "Clean Guitar",
            fl_studio: "FLEX — Clean Guitar",
            fl_studio_mobile: "Guitar — Clean Electric",
            logic_pro: "Clean Guitar",
            ableton: "Electric Guitar Clean (Sampler)",
            bandlab: "Clean Guitar",
            pro_tools: "Structure Free — Clean Guitar",
            reason: "ID8 — Clean Guitar",
            cubase: "HALion — Clean Guitar"
          }
        },
        {
          id: "electric_guitar_funk",
          label: "Electric Guitar (Funk)",
          dawMappings: {
            garageband_ios: "Funk Guitar",
            garageband_mac: "Funk Guitar",
            fl_studio: "FLEX — Funk Guitar",
            fl_studio_mobile: "Guitar — Funk",
            logic_pro: "Funk Guitar",
            ableton: "Funk Guitar (Sampler)",
            bandlab: "Funk Guitar",
            pro_tools: "Structure Free — Funk Guitar",
            reason: "NN-XT — Funk Guitar",
            cubase: "HALion — Funk Guitar"
          }
        }
      ]
    },
    {
      name: "Bass",
      instruments: [
        {
          id: "hip_hop_bass",
          label: "Hip-Hop Bass",
          dawMappings: {
            garageband_ios: "Hip Hop Bass",
            garageband_mac: "Phat Analog Bass",
            fl_studio: "3xOsc — Sub Bass",
            fl_studio_mobile: "Synth Bass — Hip Hop",
            logic_pro: "Phat Analog Bass",
            ableton: "Hip Hop Bass (Analog)",
            bandlab: "Hip Hop Bass",
            pro_tools: "Hybrid — Hip Hop Bass",
            reason: "Subtractor — Hip Hop Bass",
            cubase: "HALion — Hip Hop Bass"
          }
        },
        {
          id: "sub_bass",
          label: "Sub Bass / 808",
          dawMappings: {
            garageband_ios: "Sub Bass",
            garageband_mac: "808 Sub",
            fl_studio: "3xOsc — 808 Bass",
            fl_studio_mobile: "Synth Bass — 808",
            logic_pro: "Deep Sub Bass",
            ableton: "808 Sub (Analog)",
            bandlab: "808 Bass",
            pro_tools: "Boom — 808 Sub",
            reason: "Subtractor — Sub Bass",
            cubase: "HALion — 808 Bass"
          }
        },
        {
          id: "upright_bass",
          label: "Upright Bass",
          dawMappings: {
            garageband_ios: "Upright Bass",
            garageband_mac: "Upright Studio Bass",
            fl_studio: "FLEX — Upright Bass",
            fl_studio_mobile: "Bass — Upright",
            logic_pro: "Upright Bass",
            ableton: "Upright Bass (Sampler)",
            bandlab: "Acoustic Bass",
            pro_tools: "Structure Free — Upright Bass",
            reason: "ID8 — Upright Bass",
            cubase: "HALion — Upright Bass"
          }
        },
        {
          id: "synth_bass",
          label: "Synth Bass",
          dawMappings: {
            garageband_ios: "Analog Mono",
            garageband_mac: "Minimoog",
            fl_studio: "Sytrus — Synth Bass",
            fl_studio_mobile: "Synth Bass — Lead",
            logic_pro: "Sub Bass",
            ableton: "Mono Bass (Analog)",
            bandlab: "Synth Bass",
            pro_tools: "Hybrid — Synth Bass",
            reason: "Subtractor — Synth Bass",
            cubase: "HALion — Synth Bass"
          }
        }
      ]
    },
    {
      name: "Choirs",
      instruments: [
        {
          id: "aah_choir",
          label: "Aah Choir",
          dawMappings: {
            garageband_ios: "Aah Voices",
            garageband_mac: "Choir",
            fl_studio: "FLEX — Aah Choir",
            fl_studio_mobile: "Choir — Aah",
            logic_pro: "Ethereal Choir",
            ableton: "Choir Ahs (Sampler)",
            bandlab: "Choir",
            pro_tools: "Structure Free — Choir Ahs",
            reason: "NN-XT — Choir Ahs",
            cubase: "HALion — Choir Ahs"
          }
        },
        {
          id: "gospel_choir",
          label: "Gospel Choir",
          dawMappings: {
            garageband_ios: "Soul Choir",
            garageband_mac: "Gospel Choir",
            fl_studio: "FLEX — Gospel Choir",
            fl_studio_mobile: "Choir — Gospel",
            logic_pro: "Gospel Choir",
            ableton: "Gospel Choir (Sampler)",
            bandlab: "Gospel Voices",
            pro_tools: "Structure Free — Gospel Choir",
            reason: "NN-XT — Gospel Choir",
            cubase: "HALion — Gospel Choir"
          }
        },
        {
          id: "mellotron_choir",
          label: "Mellotron Choir",
          dawMappings: {
            garageband_ios: "Mellotron Choir",
            garageband_mac: "Mellotron Voices",
            fl_studio: "FLEX — Mellotron Choir",
            fl_studio_mobile: "Keys — Mellotron Choir",
            logic_pro: "Mellotron — Choir",
            ableton: "Mellotron Choir (Sampler)",
            bandlab: "Mellotron Choir",
            pro_tools: "Structure Free — Mellotron",
            reason: "NN-XT — Mellotron Choir",
            cubase: "HALion — Mellotron Choir"
          }
        }
      ]
    },
    {
      name: "Synths",
      instruments: [
        {
          id: "dark_synth_pad",
          label: "Dark Synth Pad",
          dawMappings: {
            garageband_ios: "Dark Pad",
            garageband_mac: "Dark Synth Pad",
            fl_studio: "Sytrus — Dark Pad",
            fl_studio_mobile: "Synth — Dark Pad",
            logic_pro: "Alchemy — Dark Pad",
            ableton: "Dark Pad (Analog)",
            bandlab: "Dark Pad",
            pro_tools: "Hybrid — Dark Pad",
            reason: "Thor — Dark Pad",
            cubase: "Retrologue — Dark Pad"
          }
        },
        {
          id: "bright_synth_pad",
          label: "Bright Synth Pad",
          dawMappings: {
            garageband_ios: "Atmospheric Pad",
            garageband_mac: "Bright Synth Pad",
            fl_studio: "Harmor — Bright Pad",
            fl_studio_mobile: "Synth — Bright Pad",
            logic_pro: "Alchemy — Bright Pad",
            ableton: "Bright Pad (Analog)",
            bandlab: "Bright Pad",
            pro_tools: "Hybrid — Bright Pad",
            reason: "Thor — Bright Pad",
            cubase: "Retrologue — Bright Pad"
          }
        },
        {
          id: "saw_synth",
          label: "Saw Synth",
          dawMappings: {
            garageband_ios: "Retro Synth — Saw",
            garageband_mac: "Retro Synth Saw",
            fl_studio: "3xOsc — Sawtooth",
            fl_studio_mobile: "Synth — Sawtooth",
            logic_pro: "Retro Synth — Saw",
            ableton: "Sawtooth Lead (Analog)",
            bandlab: "Saw Lead",
            pro_tools: "Hybrid — Saw Lead",
            reason: "Subtractor — Sawtooth",
            cubase: "Retrologue — Sawtooth"
          }
        },
        {
          id: "synth_bells",
          label: "Synth Bells",
          dawMappings: {
            garageband_ios: "Bell Synth",
            garageband_mac: "Bell Synth",
            fl_studio: "FLEX — Bell Synth",
            fl_studio_mobile: "Synth — Bells",
            logic_pro: "Alchemy — Bell",
            ableton: "Bell Tones (Sampler)",
            bandlab: "Synth Bells",
            pro_tools: "Hybrid — Bell Synth",
            reason: "Thor — Bell Synth",
            cubase: "HALion — Bell Synth"
          }
        }
      ]
    },
    {
      name: "Drums",
      instruments: [
        {
          id: "hip_hop_kit",
          label: "Hip-Hop Kit",
          dawMappings: {
            garageband_ios: "Hip Hop Drums",
            garageband_mac: "Hip Hop Kit",
            fl_studio: "FPC — Hip Hop Kit",
            fl_studio_mobile: "Drums — Hip Hop",
            logic_pro: "Hip Hop Kit",
            ableton: "Hip Hop Kit (Drum Rack)",
            bandlab: "Hip Hop Drums",
            pro_tools: "Structure Free — Hip Hop Kit",
            reason: "Redrum — Hip Hop Kit",
            cubase: "HALion — Hip Hop Kit"
          }
        },
        {
          id: "808_kit",
          label: "808 Kit",
          dawMappings: {
            garageband_ios: "808 Kit",
            garageband_mac: "808 Kit",
            fl_studio: "FPC — 808 Kit",
            fl_studio_mobile: "Drums — 808",
            logic_pro: "Trap Kit",
            ableton: "808 Kit (Drum Rack)",
            bandlab: "808 Drums",
            pro_tools: "Boom — 808 Kit",
            reason: "Redrum — 808 Kit",
            cubase: "HALion — 808 Kit"
          }
        },
        {
          id: "trap_kit",
          label: "Trap Kit",
          dawMappings: {
            garageband_ios: "Trap Kit",
            garageband_mac: "Trap Drums",
            fl_studio: "FPC — Trap Kit",
            fl_studio_mobile: "Drums — Trap",
            logic_pro: "Trap Kit",
            ableton: "Trap Kit (Drum Rack)",
            bandlab: "Trap Drums",
            pro_tools: "Structure Free — Trap Kit",
            reason: "Redrum — Trap Kit",
            cubase: "HALion — Trap Kit"
          }
        },
        {
          id: "jazz_brushes",
          label: "Jazz Brushes",
          dawMappings: {
            garageband_ios: "Jazz Kit — Brushes",
            garageband_mac: "Jazz Brushes",
            fl_studio: "FPC — Jazz Brushes",
            fl_studio_mobile: "Drums — Jazz Brushes",
            logic_pro: "Brushes — Jazz",
            ableton: "Jazz Brushes (Drum Rack)",
            bandlab: "Jazz Kit",
            pro_tools: "Structure Free — Jazz Brushes",
            reason: "Redrum — Jazz Brushes",
            cubase: "HALion — Jazz Brushes"
          }
        }
      ]
    },
    {
      name: "Percussion",
      instruments: [
        {
          id: "tambourine",
          label: "Tambourine",
          dawMappings: {
            garageband_ios: "Tambourine",
            garageband_mac: "Tambourine",
            fl_studio: "FPC — Tambourine",
            fl_studio_mobile: "Perc — Tambourine",
            logic_pro: "Tambourine",
            ableton: "Tambourine (Sampler)",
            bandlab: "Tambourine",
            pro_tools: "Structure Free — Tambourine",
            reason: "Redrum — Tambourine",
            cubase: "HALion — Tambourine"
          }
        },
        {
          id: "congas",
          label: "Congas",
          dawMappings: {
            garageband_ios: "Congas",
            garageband_mac: "Latin Percussion — Congas",
            fl_studio: "FPC — Congas",
            fl_studio_mobile: "Perc — Congas",
            logic_pro: "Latin Percussion — Congas",
            ableton: "Congas (Sampler)",
            bandlab: "Congas",
            pro_tools: "Structure Free — Congas",
            reason: "Redrum — Congas",
            cubase: "HALion — Congas"
          }
        },
        {
          id: "timpani",
          label: "Timpani",
          dawMappings: {
            garageband_ios: "Timpani",
            garageband_mac: "Timpani",
            fl_studio: "Orchestral — Timpani",
            fl_studio_mobile: "Perc — Timpani",
            logic_pro: "Timpani",
            ableton: "Timpani (Sampler)",
            bandlab: "Timpani",
            pro_tools: "Structure Free — Timpani",
            reason: "NN-XT — Timpani",
            cubase: "HALion — Timpani"
          }
        }
      ]
    },
    {
      name: "Effects",
      instruments: [
        {
          id: "vinyl_crackle",
          label: "Vinyl Crackle",
          dawMappings: {
            garageband_ios: "Vintage Vinyl — Crackle",
            garageband_mac: "Vinyl Crackle",
            fl_studio: "FPC — Vinyl Noise",
            fl_studio_mobile: "FX — Vinyl Crackle",
            logic_pro: "Vintage Vinyl Crackle",
            ableton: "Vinyl Distortion",
            bandlab: "Lo-Fi Vinyl",
            pro_tools: "Structure Free — Vinyl Crackle",
            reason: "NN-XT — Vinyl Noise",
            cubase: "HALion — Vinyl Crackle"
          }
        },
        {
          id: "ambient_noise",
          label: "Ambient Noise",
          dawMappings: {
            garageband_ios: "White Noise",
            garageband_mac: "Ambient Noise",
            fl_studio: "3xOsc — White Noise",
            fl_studio_mobile: "FX — Ambient",
            logic_pro: "Noise Generator",
            ableton: "Noise (Analog)",
            bandlab: "Ambient Noise",
            pro_tools: "Hybrid — Noise",
            reason: "Thor — Noise",
            cubase: "Retrologue — Noise"
          }
        }
      ]
    }
  ]
};

export type InstrumentMaps = typeof instrumentMaps;
