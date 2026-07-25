export interface TheoryEncyclopediaEntry {
  id: string;
  name: string;
  category: "scales" | "modes" | "chords" | "progressions" | "rhythm";
  difficulty: "beginner" | "intermediate" | "advanced";
  explanation: string;
  formula: string;
  intervals: number[]; // semitone offsets from root (e.g. [0, 4, 7] for Major Triad)
  chordVoicingNotes: number[]; // MIDI notes starting at middle C (60)
  romanNumerals?: string;
  application: string;
  learningTips: string[];
  examplesInSongs: string[];
  quizzes: {
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }[];
}

export const THEORY_ENCYCLOPEDIA: TheoryEncyclopediaEntry[] = [
  {
    id: "major_triad",
    name: "Major Triad",
    category: "chords",
    difficulty: "beginner",
    explanation: "A major triad is a three-note chord consisting of a root note, a major third above the root, and a perfect fifth above the root. It is the foundational building block of Western harmony, sounding stable, bright, and consonant.",
    formula: "Root + Major 3rd + Perfect 5th",
    intervals: [0, 4, 7],
    chordVoicingNotes: [60, 64, 67], // C, E, G
    application: "Used to establish strong tonality, resolution, and optimistic/bright emotional states in pop, classical, rock, and country.",
    learningTips: [
      "To play a major triad, select any root note on the keyboard, count up 4 semitones (the third), and then up 3 more semitones (the fifth).",
      "Practicing playing major triads in all 12 keys using standard root-position inversions."
    ],
    examplesInSongs: [
      "Let It Be (The Beatles)",
      "Imagine (John Lennon)"
    ],
    quizzes: [
      {
        question: "What is the semitone interval formula for a Major Triad in root position?",
        options: ["0 - 4 - 7 semitones", "0 - 3 - 7 semitones", "0 - 4 - 8 semitones", "0 - 3 - 6 semitones"],
        correct: "0 - 4 - 7 semitones",
        explanation: "A major triad is composed of a root (0), a major third (+4 semitones), and a perfect fifth (+7 semitones)."
      }
    ]
  },
  {
    id: "dorian_mode",
    name: "Dorian Mode",
    category: "modes",
    difficulty: "intermediate",
    explanation: "The Dorian mode is a minor-type diatonic scale. It is identical to the natural minor scale (Aeolian Mode) but features a raised sixth scale degree. This single note difference gives the mode a unique, sophisticated, spacey, or nostalgic quality that is less melancholic than natural minor.",
    formula: "1 - 2 - b3 - 4 - 5 - 6 - b7",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    chordVoicingNotes: [60, 62, 63, 65, 67, 69, 70, 72], // C, D, Eb, F, G, A, Bb, C
    application: "Extensively used in funk, jazz fusion, West Coast G-funk, classic rock, and electronic music to establish a cool, moody, yet driving groove.",
    learningTips: [
      "To turn a natural minor scale into Dorian, raise the 6th note by one semitone.",
      "The characteristic chord progression is a minor i to a major IV (e.g. Am to D), highlighting the raised 6th."
    ],
    examplesInSongs: [
      "Oye Como Va (Santana)",
      "Breathe (Pink Floyd)",
      "Get Lucky (Daft Punk)"
    ],
    quizzes: [
      {
        question: "What is the single scale degree difference between Dorian Mode and Natural Minor?",
        options: ["Raised 6th", "Lowered 2nd", "Raised 7th", "Lowered 5th"],
        correct: "Raised 6th",
        explanation: "Dorian Mode features a raised (major) 6th degree, whereas Natural Minor has a lowered (minor) 6th degree."
      },
      {
        question: "Which of the following chord progressions highlights the Dorian Mode?",
        options: ["Im7 - IV7", "Im7 - Vm7", "Im7 - bVImaj7", "Im7 - bIIm7"],
        correct: "Im7 - IV7",
        explanation: "The progression of minor i to major IV (e.g., Am7 to D7) is the iconic Dorian harmonic marker, featuring the characteristic major 6th interval."
      }
    ]
  },
  {
    id: "negative_harmony",
    name: "Negative Harmony",
    category: "progressions",
    difficulty: "advanced",
    explanation: "Negative Harmony is an advanced harmonic concept derived from Ernst Levy's music theory. It involves mirroring chords and melodies across an axis running through the center of a key (between the minor third and major third of the key's root). In C Major, this axis is between Eb and E. Mirroring standard chords across this axis generates unique, highly emotional 'negative' chords that preserve their voice-leading attraction but with inverted tonal gravity.",
    formula: "Mirroring across C-G / Eb-E Axis",
    intervals: [0, -1, -3, -5, -7], // descending mirrored intervals
    chordVoicingNotes: [60, 56, 53, 50], // C, Ab, F, D (Negative G7 in C Major)
    application: "Used in modern jazz, Neo-Soul, and epic film scores to create highly unpredictable, lush, beautifully dark, yet perfect harmonic resolutions.",
    learningTips: [
      "Under negative harmony, a standard G7 (V7) dominant chord mirrors to a half-diminished Fm6 (or Dm7b5) chord, resolving perfectly to C Major.",
      "Use negative harmony to re-harmonize simple pop ballads, replacing standard dominants with their mirrored counterparts."
    ],
    examplesInSongs: [
      "In the Real Early Morning (Jacob Collier)",
      "Film scores of Danny Elfman"
    ],
    quizzes: [
      {
        question: "In Negative Harmony, what chord does a standard G7 (V7 dominant) mirror to in the key of C Major?",
        options: ["Fm6 (or Dm7b5)", "Dbmaj7", "Am7", "E7alt"],
        correct: "Fm6 (or Dm7b5)",
        explanation: "In C Major, mirroring a G7 dominant chord across the Eb-E axis yields an Fm6 (or D-F-Ab-C), which resolves beautifully to C Major with inverted melodic lines."
      }
    ]
  }
];
