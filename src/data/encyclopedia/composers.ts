export interface ComposerEncyclopediaEntry {
  id: string;
  name: string;
  aliases: string[];
  yearsActive: string;
  country: string;
  type: "film" | "game" | "classical" | "songwriting" | "hybrid";
  biography: string;
  careerOverview: string;
  harmonicLanguage: string;
  orchestrationStyle: string;
  signatureMotifs: string[];
  rhythmicTendencies: string[];
  lyricStyle?: string;
  tempoPreference: string;
  favoriteKeys: string[];
  signatureProgressions: { name: string; chords: string[]; desc: string }[];
  compositionWorkflow: string;
  learningExercises: string[];
  recommendedStudies: string[];
  relatedCreators: string[];
  similarCreators: string[];
  essentialWorks: {
    scores: string[];
    songs?: string[];
  };
  awards: string[];
  timeline: { year: string; event: string }[];
  historicalImpact: string;
  legacy: string;
  difficulty: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  quizzes: {
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }[];
}

export const COMPOSERS_ENCYCLOPEDIA: ComposerEncyclopediaEntry[] = [
  {
    id: "koji_kondo",
    name: "Koji Kondo",
    aliases: ["The Maestro of Nintendo", "Kondo-san"],
    yearsActive: "1984 - Present",
    country: "Japan",
    type: "game",
    biography: "Koji Kondo is a Japanese music composer, pianist, and music director. He is best known for his legendary compositions for various Nintendo video game franchises, including Super Mario Bros. and The Legend of Zelda, widely recognized as some of the most memorable themes in gaming history.",
    careerOverview: "Hired by Nintendo in 1984 as their first dedicated sound composer, Kondo had to work within the severe technical limitations of the Famicom/NES (which had only 3 pulse channels, 1 noise channel, and 1 DPCM channel). His ability to write deeply memorable, interactive, rhythmically infectious themes transformed video game music from simple noise to an active narrative layer.",
    harmonicLanguage: "Jazz and Latin crossover. Kondo utilizes major 7th chords, secondary dominants, chromatic passing notes, and diminished turnarounds, blending standard ragtime patterns with classical modal progressions.",
    orchestrationStyle: "Chiptune and Adaptive Orchestration. In his early career, he orchestrated for the 8-bit sound chip, assigning distinct roles to each channel: Channel 1 for lead melody, Channel 2 for counterpoint harmony, Channel 3 (triangle wave) for basslines, and Channel 4 (noise) for snare/hi-hat percussion. Later, he pioneered full-orchestra adaptive symphonic scores.",
    signatureMotifs: [
      "Overworld themes featuring syncopated trumpet fanfares",
      "Triadic arpeggio fanfares that denote triumph or collecting items",
      "Chromatic descending bass lines that signify danger or underground areas"
    ],
    rhythmicTendencies: [
      "Syncopated Latin rhythms (Bossa Nova, Calypso, Samba)",
      "Driving Ragtime swing and stride-piano walking patterns",
      "Dynamic 3/4 waltz structures for calm or underwater scenes"
    ],
    tempoPreference: "110 BPM to 140 BPM",
    favoriteKeys: ["C Major", "G Major", "F Major", "A Minor"],
    signatureProgressions: [
      { name: "Mario Overworld Jump", chords: ["C", "F", "G", "C"], desc: "Bright, ragtime syncopated cadential sequence with chromatic passing notes." },
      { name: "Zelda Heroic Climb", chords: ["Bbm", "Gb", "Ab", "Db", "F7"], desc: "Epically rising minor-major sequence that evokes vast, heroic landscapes." }
    ],
    compositionWorkflow: "Kondo begins with the game's actual screen action and character movement. He studies Mario's running speed and jump curves, or Zelda's horse-riding trot, and crafts a tempo that matches the physical pacing of the gameplay. He then designs melodies that react dynamically to the player's actions (e.g., getting a power-up or running out of time).",
    learningExercises: [
      "Compose an 8-bar melody with a 3-voice restriction: Lead, Counterpoint, Bass, using only standard square and triangle waves.",
      "Write a short musical motif that dynamically speeds up by 30% when a virtual timer reaches 10 seconds."
    ],
    recommendedStudies: [
      "Scott Joplin's Ragtime Piano works",
      "Latin Bossa Nova chord shapes and fingerpicking patterns",
      "Classical polyphonic counterpoint (J.S. Bach)"
    ],
    relatedCreators: ["Shigeru Miyamoto", "Nobuo Uematsu", "Yasunori Mitsuda", "Yoko Shimomura"],
    similarCreators: ["David Wise", "Jake Kaufman", "Hirokazu Tanaka"],
    essentialWorks: {
      scores: ["Super Mario Bros. (1985)", "The Legend of Zelda (1986)", "Super Mario World (1990)", "The Legend of Zelda: Ocarina of Time (1998)"]
    },
    awards: ["D.I.C.E. Awards Lifetime Achievement Award", "GDC Lifetime Achievement Award Nominee", "Classic FM Hall of Fame Inductee"],
    timeline: [
      { year: "1984", event: "Joined Nintendo Co., Ltd. as their first professional audio programmer and composer." },
      { year: "1985", event: "Composed the Super Mario Bros. theme, the most recognizable video game track in history." },
      { year: "1986", event: "Wrote the iconic Legend of Zelda Overworld Theme, establishing symphonic fantasy in games." },
      { year: "1998", event: "Utilized real-world instrument synthesis to compose the rich, cultural soundtrack for Ocarina of Time." }
    ],
    historicalImpact: "Koji Kondo established video game music as a respected, interactive art form. He proved that melodies could be highly functional—telling players where they are, when they are in danger, and reinforcing the physical physics of the gameplay.",
    legacy: "His themes have been performed by prestigious symphony orchestras worldwide, influencing generations of game developers, film composers, and synth-pop artists.",
    difficulty: {
      beginner: "Understand 8-bit limitations and write simple major scale motifs.",
      intermediate: "Syncopation of Latin-jazz rhythmic elements over standard 4/4 structures.",
      advanced: "Develop dynamic, interactive, branching video game scores that shift seamlessly based on game state flags."
    },
    quizzes: [
      {
        question: "How many audio channels did the standard NES console support for music composition?",
        options: ["5 Channels", "4 Channels", "8 Channels", "12 Channels"],
        correct: "5 Channels",
        explanation: "The NES supported 5 channels: 2 square waves for lead/harmonies, 1 triangle wave for bass, 1 noise channel for percussion, and 1 DPCM channel for low-quality samples."
      },
      {
        question: "Which iconic scale is the Legend of Zelda Overworld Theme written in to convey adventure?",
        options: ["Bb Major", "C Minor", "D Major", "F Dorian"],
        correct: "Bb Major",
        explanation: "The main overworld theme of Zelda is written in a soaring Bb Major scale, starting with a powerful triadic brass fanfare."
      }
    ]
  },
  {
    id: "max_martin",
    name: "Max Martin (Karl Martin Sandberg)",
    aliases: ["Max Martin", "Martin Sandberg", "The King of Pop Songwriting"],
    yearsActive: "1993 - Present",
    country: "Sweden",
    type: "songwriting",
    biography: "Karl Martin Sandberg, known professionally as Max Martin, is a Swedish songwriter, record producer, and singer. He rose to public prominence in the late 1990s and has since written or co-written some of the biggest pop hits in history, holding the record for the third-most Billboard Hot 100 number-one singles (25) as a songwriter, behind only Paul McCartney and John Lennon.",
    careerOverview: "Mentored by Denniz Pop at Cheiron Studios in Stockholm, Max Martin revolutionized pop music with hits for Backstreet Boys, Britney Spears, and *NSYNC. He later adapted his sound for the 2010s, producing defining anthems for Kelly Clarkson, Katy Perry, Taylor Swift, Maroon 5, and The Weeknd.",
    harmonicLanguage: "Melodic Math and Minor-Major Crossover. Martin crafts progressions that blend dark minor verses with triumphant, soaring major choruses, avoiding complex jazz extensions to keep the melodies highly immediate and accessible.",
    orchestrationStyle: "Wall-of-Sound Pop Production. Combining heavy rock-guitar power chords, clean dance synthesizers, and perfectly synchronized double-tracked vocal stacks to create an energetic, aggressive, commercial frequency block.",
    signatureMotifs: [
      "The 'Melodic Math' concept—making sure the syllable count and rhythmic emphasis of the lyric matches the vocal melody perfectly",
      "Introductory hooks that play a simplified version of the chorus melody immediately in the first 5 seconds",
      "Pre-chorus vocal drop-outs right before the main chorus hits to build explosive release"
    ],
    rhythmicTendencies: [
      "Relentless driving eighth-note synthesizer pulses",
      "Heavy four-on-the-floor kick patterns paired with trap-inflected snare rolls",
      "Staccato vocal phrasing that acts as an additional percussion layer"
    ],
    lyricStyle: "Universal, direct, and emotionally resonant. Martin prioritizes the phonetics and rhythmic bounce of words over complex literal meanings (e.g., 'Hit me baby one more time', where 'hit' simply sounded rhythmically superior to 'call').",
    tempoPreference: "115 BPM to 128 BPM",
    favoriteKeys: ["A Minor", "C Major", "F# Minor", "E Minor"],
    signatureProgressions: [
      { name: "Swedish Pop Minor-Major Shift", chords: ["Am", "F", "C", "G"], desc: "The ubiquitous pop-punk-dance progression that balances minor tension with major resolution." },
      { name: "Dramatic Pre-Chorus Lift", chords: ["F", "G", "Am", "Em"], desc: "A rising progression that elevates vocal energy before dropping into the chorus." }
    ],
    compositionWorkflow: "Martin always starts with the chorus melody. He hums melodies over basic keyboard chords, searching for the most immediate, catchy contour. He then maps out the verse, pre-chorus, and chorus as a unified structural puzzle, ensuring the syllable structure is mathematically symmetric. Lyrics are written last, selected purely for how comfortably they sing on the notes.",
    learningExercises: [
      "Write a pop chorus melody where each line has exactly 7 syllables, aligning with a driving 120 BPM beat.",
      "Arrange a pre-chorus that completely mutes all drums and bass on the final bar, leaving only a dry vocal stack."
    ],
    recommendedStudies: [
      "Swedish folk music and choral arrangements (for harmonic choruses)",
      "Classic 1980s synth-pop (Depeche Mode, Eurythmics)",
      "ABBA's vocal arrangement and structural song templates"
    ],
    relatedCreators: ["Denniz Pop", "Shellback", "Dr. Luke", "Taylor Swift", "The Weeknd", "Britney Spears"],
    similarCreators: ["Ryan Tedder", "Stargate", "Benny Blanco"],
    essentialWorks: {
      scores: [],
      songs: ["...Baby One More Time (Britney Spears)", "I Want It That Way (Backstreet Boys)", "Since U Been Gone (Kelly Clarkson)", "Blinding Lights (The Weeknd)", "Shake It Off (Taylor Swift)"]
    },
    awards: ["5x ASCAP Songwriter of the Year", "Polar Music Prize (2016)", "Grammy Producer of the Year (2015)", "Songwriters Hall of Fame Inductee"],
    timeline: [
      { year: "1993", event: "Joined Cheiron Studios, apprenticing under Swedish pioneer Denniz Pop." },
      { year: "1998", event: "Wrote and produced '...Baby One More Time', launching Britney Spears into superstardom." },
      { year: "2012", event: "Co-wrote Taylor Swift's 'We Are Never Ever Getting Back Together', beginning a historic multi-album partnership." },
      { year: "2019", event: "Produced and co-wrote 'Blinding Lights' for The Weeknd, which became the longest-charting song of all time." }
    ],
    historicalImpact: "Max Martin established Sweden as the global engine of modern pop music, proving that songwriting is a highly structured, melodic science that can cross all linguistic and cultural boundaries with absolute certainty.",
    legacy: "His 'Melodic Math' principles have become the universal template for top-40 pop, R&B, and dance songwriting, defining the sound of radio for three consecutive decades.",
    difficulty: {
      beginner: "Understand basic pop verse-chorus-bridge structures and write simple 4-bar vocal melodies.",
      intermediate: "Apply phonetic lyric writing and align syllable structures with dynamic chord turnarounds.",
      advanced: "Orchestrate complex pop vocal stacks with micro-tuned doubles, harmonies, and whisper tracks."
    },
    quizzes: [
      {
        question: "What term describes Max Martin's design principle matching syllable structure and vocal melody rhythm?",
        options: ["Melodic Math", "Swedish Grid", "Lyric Symmetry", "Pop Algebra"],
        correct: "Melodic Math",
        explanation: "Max Martin's 'Melodic Math' is the practice of structuring syllables, vocal stresses, and note values into a perfectly balanced rhythmic hook."
      },
      {
        question: "Which legendary Swedish pop studio did Max Martin apprentice at in the 1990s?",
        options: ["Cheiron Studios", "Polar Studios", "Abba Sound", "Stockholm Beats"],
        correct: "Cheiron Studios",
        explanation: "Cheiron Studios, founded by Denniz Pop, was the legendary incubator where Max Martin perfected his signature pop formulas."
      }
    ]
  }
];
