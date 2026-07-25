export interface EncyclopediaEntry {
  id: string;
  name: string;
  role: 'producer' | 'composer' | 'songwriter' | 'engineer' | 'director';
  aliases: string[];
  yearsActive: string;
  biography: string;
  signatureTechniques: string[];
  influences: string[];
  influenced: string[];
  keyWorks: { title: string; year: number; roleInWork: string }[];
  educationalFocus: string;
  gearUsed: string[];
}

export const ENCYCLOPEDIA_ENTRIES: EncyclopediaEntry[] = [
  {
    id: 'quincy-jones',
    name: 'Quincy Jones',
    role: 'producer',
    aliases: ['Q', 'The Dude'],
    yearsActive: '1951 - 2024',
    biography: 'One of the most decorated and influential producers in music history, Quincy Jones rose from a jazz trumpeter and arranger to become the mastermind behind Michael Jackson\'s multi-platinum albums Thriller, Off the Wall, and Bad. His career spanned big band jazz, film scoring, pop production, and multi-media entrepreneurship, earning him 28 Grammy Awards.',
    signatureTechniques: [
      'Orchestral layering with hybrid analog synth pads',
      'Intense focus on dynamic groove spacing and bass separation',
      'The "Sonic Splendor" wall of sound vocal stacking technique',
      'Live-to-tape session direction utilizing elite studio musicians'
    ],
    influences: ['Duke Ellington', 'Count Basie', 'Ray Charles', 'Nadia Boulanger'],
    influenced: ['Michael Jackson', 'Dr. Dre', 'Teddy Riley', 'Pharrell Williams'],
    keyWorks: [
      { title: 'Thriller (Michael Jackson)', year: 1982, roleInWork: 'Producer & Arranger' },
      { title: 'Off the Wall (Michael Jackson)', year: 1979, roleInWork: 'Producer' },
      { title: 'The Color Purple OST', year: 1985, roleInWork: 'Composer & Producer' }
    ],
    educationalFocus: 'How to manage massive arrangement dynamics and balance physical acoustic elements with early digital synthesis.',
    gearUsed: ['Harrison 4032 Console', 'Synclavier II', 'Moog IIIc Synthesizer', 'Ampex 24-Track Tape Machine']
  },
  {
    id: 'dr-dre',
    name: 'Dr. Dre',
    role: 'producer',
    aliases: ['Andre Young', 'The Doctor'],
    yearsActive: '1984 - Present',
    biography: 'A pioneer of West Coast hip hop and G-Funk, Dr. Dre revolutionized hip-hop production by replacing simple sampled breakbeats with rich, replayed instrumentations, heavy G-Funk Moog basslines, and crisp, punchy percussion layers. He founded Aftermath Entertainment and signed Eminem, 50 Cent, and Kendrick Lamar.',
    signatureTechniques: [
      'Heavy sub-harmonic G-Funk synthesizer glide lines (Moog lead)',
      'Acoustic drum loop replay and tight transient gating',
      'Stochastic percussion layering to build stereo wide layouts',
      'Vocal comping across hundreds of takes for pristine alignment'
    ],
    influences: ['George Clinton', 'Parliament-Funkadelic', 'Quincy Jones', 'Isaac Hayes'],
    influenced: ['Eminem', 'Snoop Dogg', 'Scott Storch', 'Kanye West'],
    keyWorks: [
      { title: 'The Chronic', year: 1992, roleInWork: 'Producer & Primary Artist' },
      { title: '2001', year: 1999, roleInWork: 'Producer & Primary Artist' },
      { title: 'Doggystyle (Snoop Dogg)', year: 1993, roleInWork: 'Producer & Arranger' }
    ],
    educationalFocus: 'Mastering the art of transient gating and synthesis of sub-bass foundations with low-end headroom alignment.',
    gearUsed: ['SSL 4000G+ Console', 'E-mu SP-1200', 'Akai MPC3000', 'Minimoog Model D']
  },
  {
    id: 'j-dilla',
    name: 'J Dilla',
    role: 'producer',
    aliases: ['Jay Dee', 'James Yancey'],
    yearsActive: '1993 - 2006',
    biography: 'James Yancey, known professionally as J Dilla or Jay Dee, changed the rhythmic feel of modern music forever. By intentionally disabling auto-quantization on the Akai MPC, Dilla introduced "lazy drumming" or swung micro-timing, creating warm, human, off-grid beats that influenced hip-hop, neo-soul, jazz, and modern electronic musicians.',
    signatureTechniques: [
      'Non-quantized "lazy drum" micro-timing swings',
      'Warm vinyl sample chopping using custom filter envelopes',
      'Lowpass filtered bassline sweeps extracted directly from old soul records',
      'Micro-chop vocal pads integrated as rhythmic synth leads'
    ],
    influences: ['Pete Rock', 'Marley Marl', 'Madlib', 'Q-Tip'],
    influenced: ['The Roots', 'Erykah Badu', 'Common', 'Flying Lotus', 'Kaytranada'],
    keyWorks: [
      { title: 'Donuts', year: 2006, roleInWork: 'Producer & Primary Artist' },
      { title: 'Fantastic, Vol. 2 (Slum Village)', year: 2000, roleInWork: 'Producer & Group Member' },
      { title: 'Like Water for Chocolate (Common)', year: 2000, roleInWork: 'Producer & Arranger' }
    ],
    educationalFocus: 'Rhythmic pocket theory: How disabling step-quantization and letting notes fall early/late creates swing and human groove.',
    gearUsed: ['Akai MPC3000', 'E-mu SP-1200', 'Minimoog', 'Technics SL-1200 Turntables']
  },
  {
    id: 'hans-zimmer',
    name: 'Hans Zimmer',
    role: 'composer',
    aliases: ['The Dark Knight of Score'],
    yearsActive: '1977 - Present',
    biography: 'Hans Zimmer is a legendary German film composer who revolutionized Hollywood scoring by integrating rich classical orchestral arrangements with massive analog synthesizer sound design. His work with directors like Christopher Nolan, Ridley Scott, and Denis Villeneuve has redefined cinematic action and drama atmospheres.',
    signatureTechniques: [
      'Massive custom synth drone textures supporting traditional strings',
      'Sub-bass clockwork pulses tracking visual script frame intervals',
      'Dynamic orchestral mic mixing with direct stereo proximity layers',
      'Shepard tone auditory illusions to create endless rising tension'
    ],
    influences: ['Ennio Morricone', 'Bernard Herrmann', 'Kraftwerk', 'Richard Wagner'],
    influenced: ['Ramin Djawadi', 'Benjamin Wallfisch', 'Ludwig Göransson', 'Steve Jablonsky'],
    keyWorks: [
      { title: 'Inception', year: 2010, roleInWork: 'Lead Composer & Sound Designer' },
      { title: 'Gladiator', year: 2000, roleInWork: 'Lead Composer' },
      { title: 'The Lion King', year: 1994, roleInWork: 'Composer & Arranger' }
    ],
    educationalFocus: 'Hybrid scoring: Constructing dense analog synthesizer pads that lock with micro-timed acoustic arrangements.',
    gearUsed: ['Waldorf Wave Synthesizer', 'Moog Modular System', 'Cubase DAW', 'Custom Spitfire Sample Libraries']
  },
  {
    id: 'john-williams',
    name: 'John Williams',
    role: 'composer',
    aliases: ['Maestro Williams'],
    yearsActive: '1952 - Present',
    biography: 'With a career spanning over seven decades, John Williams is the composer behind the most iconic cinematic themes of all time, including Star Wars, Indiana Jones, Jurassic Park, Jaws, and Harry Potter. He has received 54 Academy Award nominations, making him the second most nominated individual in history.',
    signatureTechniques: [
      'Richard Wagner-style leitmotif themes for specific characters and items',
      'High-contrast brass stabs aligned precisely with action beats',
      'Fluid woodwind runs outlining magical and ethereal events',
      'Full symphonic arrangement without synthesizers to maintain absolute classic warmth'
    ],
    influences: ['Richard Wagner', 'Igor Stravinsky', 'Gustav Holst', 'Pyotr Ilyich Tchaikovsky'],
    influenced: ['Michael Giacchino', 'Danny Elfman', 'Alexandre Desplat', 'Alan Silvestri'],
    keyWorks: [
      { title: 'Star Wars: A New Hope', year: 1977, roleInWork: 'Composer & Conductor' },
      { title: 'Jaws', year: 1975, roleInWork: 'Composer & Conductor' },
      { title: 'Schindler\'s List', year: 1993, roleInWork: 'Composer & Orchestrator' }
    ],
    educationalFocus: 'The power of leitmotif: Mapping specific scales and harmonic progressions to represent physical dramatic elements.',
    gearUsed: ['Steinway & Sons Grand Piano', 'Pencil and Manuscript Paper', 'Conductor\'s Baton']
  },
  {
    id: 'max-martin',
    name: 'Max Martin',
    role: 'songwriter',
    aliases: ['Martin Sandberg'],
    yearsActive: '1993 - Present',
    biography: 'Swedish songwriter and producer Max Martin has written the third-most Billboard Hot 100 number-one singles in history, trailing only Paul McCartney and John Lennon. He pioneered the concept of "Melodic Math"—a songwriting system based on rhythmic syllable matching, symmetrical structures, and continuous harmonic momentum.',
    signatureTechniques: [
      '"Melodic Math": strict syllable count matching across song layouts',
      'Continuous dynamic verse-pre-chorus contrast mapping',
      'Vocal "track-and-stack" layering to create colossal choruses',
      'Early hook placement: delivering the chorus vocal hook within the first 45 seconds'
    ],
    influences: ['Denniz PoP', 'ABBA', 'Def Leppard', 'Prince'],
    influenced: ['Dr. Luke', 'Shellback', 'Savon Kotecha', 'Taylor Swift', 'The Weeknd'],
    keyWorks: [
      { title: '...Baby One More Time (Britney Spears)', year: 1998, roleInWork: 'Songwriter & Producer' },
      { title: 'Blinding Lights (The Weeknd)', year: 2019, roleInWork: 'Songwriter & Producer' },
      { title: 'It\'s My Life (Bon Jovi)', year: 2000, roleInWork: 'Songwriter & Producer' }
    ],
    educationalFocus: 'Vocal math structures: How tracking syllable ratios and verse-chorus melodic inversions builds catchy pop anthems.',
    gearUsed: ['Pro Tools', 'Yamaha NS-10 Studio Monitors', 'Roland JD-800', 'SSL G-Series Mixer']
  },
  {
    id: 'bruce-swedien',
    name: 'Bruce Swedien',
    role: 'engineer',
    aliases: ['The Acorn', 'True Stereo Master'],
    yearsActive: '1953 - 2020',
    biography: 'Bruce Swedien was the legendary audio engineer behind the best-selling album of all time, Thriller. He is famous for inventing the "Acusonic Recording Process"—a technique of recording stereo tracks on multi-track recorders to capture true natural room ambience and stereo width instead of relying on mono panning and artificial reverbs.',
    signatureTechniques: [
      'The "Acusonic Recording Process": true stereo microphone pairs on every stem',
      'Refusing to use compression on the master track to preserve full transient pop',
      'Custom acoustic baffle builds to isolate low-end reflections',
      'Double-tracking brass setups at progressive distances from microphones'
    ],
    influences: ['Bill Putnam', 'Duke Ellington', 'Les Paul'],
    influenced: ['Dave Pensado', 'Manny Marroquin', 'Chris Lord-Alge', 'MixedByAli'],
    keyWorks: [
      { title: 'Thriller (Michael Jackson)', year: 1982, roleInWork: 'Lead Recording & Mix Engineer' },
      { title: 'Bad (Michael Jackson)', year: 1987, roleInWork: 'Lead Recording & Mix Engineer' },
      { title: 'Give Me the Night (George Benson)', year: 1980, roleInWork: 'Recording & Mix Engineer' }
    ],
    educationalFocus: 'Natural acoustic panning: How capturing stereophonic spatial reflections inside the studio outperforms artificial digital delay racks.',
    gearUsed: ['SSL 4000 Console', 'Neumann U47', 'Shure SM7', 'Studer A800 Tape Recorder']
  },
  {
    id: 'steven-spielberg',
    name: 'Steven Spielberg',
    role: 'director',
    aliases: ['The King of Entertainment'],
    yearsActive: '1963 - Present',
    biography: 'Steven Spielberg is the most commercially successful director in cinematic history. He pioneered the modern Hollywood blockbuster with Jaws and went on to direct legendary films like E.T., Schindler\'s List, Saving Private Ryan, and Jurassic Park. His blocking techniques and use of visual awe changed visual storytelling forever.',
    signatureTechniques: [
      'Dynamic multi-subject blocking within single deep-focus long takes',
      'The "Spielberg Face": high-impact slow zoom-ins on characters observing awe',
      'Low-angle dolly moves to establish physical grandeur and scale',
      'Seamless choreography linking character motions directly to diegetic soundtrack beats'
    ],
    influences: ['John Ford', 'Alfred Hitchcock', 'Akira Kurosawa', 'David Lean'],
    influenced: ['J.J. Abrams', 'Denis Villeneuve', 'Christopher Nolan', 'Peter Jackson'],
    keyWorks: [
      { title: 'Jaws', year: 1975, roleInWork: 'Director' },
      { title: 'Saving Private Ryan', year: 1998, roleInWork: 'Director' },
      { title: 'Schindler\'s List', year: 1993, roleInWork: 'Director' }
    ],
    educationalFocus: 'Cinematic blocking: Arranging camera moves and multiple character nodes in a physical space without cutting shots.',
    gearUsed: ['Panavision Panaflex Gold', 'Kodak 35mm Film Stock', 'Steadicam Rigs']
  },
  {
    id: 'hype-williams',
    name: 'Hype Williams',
    role: 'director',
    aliases: ['The Neon Visionary'],
    yearsActive: '1991 - Present',
    biography: 'Hype Williams revolutionized music video production in the 1990s and 2000s. He introduced cinematic storytelling, high-fidelity neon colors, anamorphic fisheye lenses, and high-fashion lighting rigs to hip-hop and R&B, defining the visual style of legendary artists like Missy Elliott, Busta Rhymes, Tupac Shakur, and Kanye West.',
    signatureTechniques: [
      'Ultra-wide anamorphic fisheye lens angles to exaggerate character scales',
      'High-contrast monochromatic neon color grading sheets (teals, hot pinks, yellows)',
      'Cinematic letterbox crop adjustments during high-energy verse shifts',
      'Ring light visual highlights reflected directly in character pupils'
    ],
    influences: ['Stanley Kubrick', 'Fellini', 'Gordon Parks'],
    influenced: ['Director X', 'Dave Meyers', 'Cole Bennett', 'Melina Matsoukas'],
    keyWorks: [
      { title: 'Belly', year: 1998, roleInWork: 'Director & Writer' },
      { title: 'California Love (Tupac Shakur)', year: 1995, roleInWork: 'Music Video Director' },
      { title: 'The Rain (Supa Dupa Fly) (Missy Elliott)', year: 1997, roleInWork: 'Music Video Director' }
    ],
    educationalFocus: 'Music video pacing: How integrating custom fisheye scales, neon color grades, and strobe-light sequences enhances vocal tempo.',
    gearUsed: ['Arriflex 35mm Cameras', 'Fisheye Lenses', 'High-Output Ring Lights']
  }
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const QUIZZES: Record<'beginner' | 'intermediate' | 'professional', QuizQuestion[]> = {
  beginner: [
    {
      id: 'b1',
      question: 'Which visual cue is famously known as the "Spielberg Face"?',
      options: [
        'A fast pans away from characters to focus on landscapes.',
        'A slow zoom-in on characters in static awe as they witness an off-screen spectacle.',
        'An extreme close-up of a character crying.',
        'An over-the-shoulder shot looking down at the street.'
      ],
      correct: 'A slow zoom-in on characters in static awe as they witness an off-screen spectacle.',
      explanation: 'Steven Spielberg famously uses a slow dolly-in zoom on a character\'s face to convey wonder, fear, or realization, setting the emotion for the audience.'
    },
    {
      id: 'b2',
      question: 'What rhythm technique is J Dilla most famous for introducing to modern drum sequencers?',
      options: [
        'Perfect 1/16-step grid quantization.',
        'Intentionally unquantized, swung "lazy drumming" pocket loops.',
        'Four-on-the-floor kick drum rolls.',
        'Triple-time hi-hat trap sequences.'
      ],
      correct: 'Intentionally unquantized, swung "lazy drumming" pocket loops.',
      explanation: 'J Dilla bypassed automatic quantization on his Akai MPC, letting notes fall slightly early or late, establishing the famous human "swung" pocket of neo-soul.'
    }
  ],
  intermediate: [
    {
      id: 'i1',
      question: 'What is Bruce Swedien\'s trademark "Acusonic Recording Process"?',
      options: [
        'Recording mono microphones with extreme digital compression.',
        'Using dedicated stereo microphone configurations for every individual sound stem to capture true room acoustics.',
        'Feeding vocals through guitar amplifiers.',
        'A technique of sampling vinyl at twice the regular playback speed.'
      ],
      correct: 'Using dedicated stereo microphone configurations for every individual sound stem to capture true room acoustics.',
      explanation: 'Bruce Swedien used pairs of high-fidelity microphones to capture natural left-right acoustic spatial alignment for each stem, producing a wider, deeper stereo field.'
    },
    {
      id: 'i2',
      question: 'In film scoring, what auditory illusion did Hans Zimmer use in "Inception" and "Dunkirk" to create perpetual rising tension?',
      options: [
        'The Doppler effect on strings.',
        'The Shepard Tone: overlapping tones that sound as if they are continuously ascending.',
        'Reverse reverb vocal gates.',
        'Sub-audible 7Hz sine waves.'
      ],
      correct: 'The Shepard Tone: overlapping tones that sound as if they are continuously ascending.',
      explanation: 'The Shepard Tone consists of several sine waves separated by octaves, rising in pitch while some fade out and others fade in, creating an illusion of infinite pitch ascent.'
    }
  ],
  professional: [
    {
      id: 'p1',
      question: 'Max Martin\'s songwriting philosophy of "Melodic Math" focuses primarily on which parameter?',
      options: [
        'Writing chord sequences based on the Fibonacci mathematical spiral.',
        'Ensuring strict syllable symmetry and balance between verse vocal patterns and chorus hooks.',
        'Using purely relational database fields to generate verses.',
        'Replacing standard acoustic drums with exact sine wave oscillations.'
      ],
      correct: 'Ensuring strict syllable symmetry and balance between verse vocal patterns and chorus hooks.',
      explanation: 'Max Martin aligns vocal syllable counts and melodic contours between song sections, ensuring the melody has predictable mathematical balance that grabs attention instantly.'
    },
    {
      id: 'p2',
      question: 'Why did Bruce Swedien famously refuse to use a brickwall limiter or heavy bus compression on Michael Jackson\'s "Thriller"?',
      options: [
        'Because the tape recorder would explode from thermal overload.',
        'To preserve the pristine transient peaks of the drum and percussion transients, maximizing "pop" and punch.',
        'Because limiters were not invented until 1995.',
        'To make the recording sound quieter than radio broadcasts.'
      ],
      correct: 'To preserve the pristine transient peaks of the drum and percussion transients, maximizing "pop" and punch.',
      explanation: 'Heavy compression squashes the rapid transients (initial bursts of sound) of kicks and claps. Bruce preserved full headroom to make the rhythm feel explosive and physically punchy.'
    }
  ]
};
