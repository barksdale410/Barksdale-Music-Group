export interface EngineerEncyclopediaEntry {
  id: string;
  name: string;
  aliases: string[];
  yearsActive: string;
  country: string;
  specialty: "recording" | "mixing" | "mastering" | "studio_design" | "hybrid";
  biography: string;
  careerOverview: string;
  mixingPhilosophy: string;
  analogVsDigital: string;
  signatureSignalChains: { element: string; chain: string[]; desc: string }[];
  favoriteGear: string[];
  favoritePlugins: string[];
  compressorTechniques: string[];
  eqPhilosophy: string;
  reverbAndSpatialEffects: string[];
  sessionManagement: string;
  learningExercises: string[];
  recommendedReading: string[];
  relatedCreators: string[];
  similarCreators: string[];
  essentialCredits: {
    albums: string[];
    artists: string[];
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

export const ENGINEERS_ENCYCLOPEDIA: EngineerEncyclopediaEntry[] = [
  {
    id: "bruce_swedien",
    name: "Bruce Swedien",
    aliases: ["Svensk", "The Acusonic Pioneer"],
    yearsActive: "1953 - 2020",
    country: "United States",
    specialty: "recording",
    biography: "Bruce Swedien was an American audio engineer and music producer. He is best known as the recording engineer and mixer for Michael Jackson, working alongside producer Quincy Jones on the historic albums Off the Wall, Thriller, and Bad. His high-fidelity recordings and innovative stereo tracking techniques redefined the sound of modern popular music.",
    careerOverview: "Swedien began his career recording big band jazz at Universal Recording in Chicago, working with Count Basie, Duke Ellington, and Oscar Peterson. His deep classical training and knowledge of microphone acoustics led him to pioneer the 'Acusonic Recording Process'—tracking instruments in true stereo to preserve original phase relationships and space reflections.",
    mixingPhilosophy: "Capture it right at the source. Swedien believed that a great mix starts with microphone placement and room acoustics, not post-processing. He vehemently avoided over-compressing or heavily EQing tracks, claiming that compression kills the natural transient peaks and emotional dynamics of a performance.",
    analogVsDigital: "Pristine Analog and High-Bandwidth Digital. Swedien favored 24-track analog tape machines running at 30 ips (inches per second) without noise reduction, claiming it captured the richest low-end transients. He was also an early adopter of digital recording, praising its frequency linearity.",
    signatureSignalChains: [
      {
        element: "Michael Jackson Lead Vocals",
        chain: ["Shure SM7 dynamic microphone", "Neve 1073 Preamp", "Harrison 32C EQ", "Direct to Tape (No Compressor!)"],
        desc: "An incredibly clean, upfront vocal chain that preserved Michael's explosive transients and mouth-click details."
      },
      {
        element: "Wide Stereo Brass Sections",
        chain: ["Stereo Pair of Telefunken U47 microphones", "Neve Preamp", "Harrison Console Bus"],
        desc: "Brass tracked in wide stereo panned hard left/right in a highly reflective room to capture acoustic width."
      }
    ],
    favoriteGear: ["Shure SM7 / SM7B", "Telefunken U47", "Harrison 32C Mixing Console", "Neve 1073", "Studer A800 tape recorder"],
    favoritePlugins: ["Universal Audio Harrison 32C EQ", "UAD Lexicon 224 Reverb", "UAD Teletronix LA-2A"],
    compressorTechniques: [
      "Avoid master-bus compression completely to preserve natural transients",
      "Use compression only as a localized effect on specific dynamic tracks (e.g., bass guitar)",
      "Prefer optical compressors (LA-2A) for their smooth, program-dependent release curves"
    ],
    eqPhilosophy: "Additive EQ is a last resort. Use subtractive EQ to remove unwanted rumble, and always try to achieve brightness by moving the microphone closer to the source rather than boosting high-frequency EQ shelves.",
    reverbAndSpatialEffects: [
      "Pioneered the 'Acusonic Process' using natural chamber reverberation",
      "Using Lexicon 224 digital reverbs set to long decays but low wet-dry ratios",
      "Spatially panning stereo room double tracks to frame the dry lead vocals"
    ],
    sessionManagement: "Swedien was known for keeping an incredibly clean and organized session. He famously color-coded his multi-track tapes and maintained detailed channel strip notes on paper. He was highly disciplined, demanding absolute focus, silence, and professionalism from everyone in the studio.",
    learningExercises: [
      "Record an acoustic guitar using a stereo pair of microphones, ensuring there is zero phase cancellation when summed to mono.",
      "Mix a pop track without using any master bus compressors, focusing purely on manual fader automation to balance levels."
    ],
    recommendedReading: [
      "Make Mine Music (Bruce Swedien)",
      "In the Studio with Michael Jackson (Bruce Swedien)",
      "The Recording Engineer's Handbook (Bobby Owsinski)"
    ],
    relatedCreators: ["Michael Jackson", "Quincy Jones", "Rod Temperton", "James Ingram"],
    similarCreators: ["Al Schmitt", "Roger Nichols", "Tom Dowd", "Bob Clearmountain"],
    essentialCredits: {
      albums: ["Off the Wall (1979)", "Thriller (1982)", "Bad (1987)", "Dangerous (1991)"],
      artists: ["Michael Jackson", "Count Basie", "Duke Ellington", "Donna Summer", "Barbra Streisand"]
    },
    awards: ["5x Grammy Award Winner for Best Engineered Album", "Grammy Legend Award Nominee", "TEC Hall of Fame Inductee"],
    timeline: [
      { year: "1953", event: "Began his career at Universal Recording in Chicago, recording legendary jazz artists." },
      { year: "1978", event: "Met Quincy Jones while recording the soundtrack for 'The Wiz', beginning a historic collaboration." },
      { year: "1982", event: "Engineered and mixed 'Thriller', introducing his 'Acusonic' stereo process to the world." },
      { year: "1991", event: "Won a Grammy for engineering 'Dangerous', showcasing his mastery of hybrid digital-analog mixing." }
    ],
    historicalImpact: "Swedien elevated recording engineering to a high symphonic standard. He proved that stereo width and depth are natural acoustic phenomena that should be captured physically in a room, rather than simulated using electronic panning or digital processors.",
    legacy: "His recordings of Michael Jackson stand as the absolute, gold-standard benchmark for high-fidelity audio, studied by mixing engineers and acousticians across the globe.",
    difficulty: {
      beginner: "Understand microphone polar patterns and basic phase relationship alignment.",
      intermediate: "Execute true stereo instrument tracking, managing room acoustics and microphone distances.",
      advanced: "Mix complex pop-orchestral hybrid sessions, preserving transient impact without relying on dynamic compression."
    },
    quizzes: [
      {
        question: "What was Bruce Swedien's trademark stereo recording and mixing process called?",
        options: ["Acusonic Recording Process", "StereoSonic Method", "Harrison Phase Alignment", "Double-Track Spatial Process"],
        correct: "Acusonic Recording Process",
        explanation: "Bruce Swedien's 'Acusonic Recording Process' involved recording instruments in true stereo to capture original room acoustics and phase integrity."
      },
      {
        question: "Which legendary microphone did Bruce Swedien use to record Michael Jackson's lead vocals?",
        options: ["Shure SM7", "Neumann U87", "AKG C414", "Electro-Voice RE20"],
        correct: "Shure SM7",
        explanation: "Swedien famously chose the Shure SM7 dynamic microphone for Michael's vocals, praising its ability to handle immense dynamic vocal peaks."
      }
    ]
  }
];
