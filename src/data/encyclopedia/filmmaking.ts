export interface FilmmakingEncyclopediaEntry {
  id: string;
  name: string;
  category: "camera" | "lighting" | "post_production" | "production" | "music_video_specific";
  difficulty: "beginner" | "intermediate" | "advanced";
  explanation: string;
  department: string;
  keyResponsibilities: string[];
  equipmentUsed: string[];
  typicalWorkflow: string[];
  worksWith: string[];
  commonMistakes: string[];
  learningExercises: string[];
  quizzes: {
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }[];
}

export const FILMMAKING_ENCYCLOPEDIA: FilmmakingEncyclopediaEntry[] = [
  {
    id: "digital_imaging_technician",
    name: "Digital Imaging Technician (DIT)",
    category: "camera",
    difficulty: "advanced",
    explanation: "The Digital Imaging Technician (DIT) is a highly specialized on-set role that bridges production cinematography with post-production. The DIT manages image quality control, digital camera setups, on-set color grading (LUT application), metadata logging, and secure data backup/delivery workflows.",
    department: "Camera Department",
    keyResponsibilities: [
      "Calibrate digital camera sensors, frame rates, and color spaces on set.",
      "Apply live Look-Up Tables (LUTs) in collaboration with the DP to monitor visual intent in real-time.",
      "Verify exposure and color balance across multiple cameras using waveform and vectorscope monitors.",
      "Coordinate secure offloads, verify checksums, and transcode digital master camera files for editors."
    ],
    equipmentUsed: [
      "High-performance portable Mac Pro/PC DIT workstation",
      "Calibrated OLED reference monitors (Flanders Scientific / Sony)",
      "Lacie/SanDisk professional RAID storage arrays and LTO tape drives",
      "Hardware video routers and LUT box interfaces (Teradek, Blackmagic Design)"
    ],
    typicalWorkflow: [
      "Pre-production: Collaborate with the DP and Colorist to build custom show LUTs and color pipelines.",
      "Set-up: Connect camera outputs to the DIT cart, routing feeds to the reference monitors.",
      "Live Shooting: Monitor waveforms for clipping/crushing and adjust live color grading feeds.",
      "Data Offload: Retrieve SSD cards, perform secure 3-point checksum backups, and transcode dailies."
    ],
    worksWith: ["Director of Photography", "Camera Operator", "Colorist", "First Assistant Camera (Focus Puller)", "Post Production Editor"],
    commonMistakes: [
      "Performing offloads without verifying checksum files, risking corrupted footage.",
      "Letting on-set monitoring screens get out of calibration, leading the DP to misexpose shots."
    ],
    learningExercises: [
      "Practice setting up a color-managed workflow inside DaVinci Resolve using ACES or DaVinci YRGB Color Managed.",
      "Simulate a secure offload workflow using a checksum utility (like Silverstack or hedge) to back up video folders."
    ],
    quizzes: [
      {
        question: "What is the primary role of a Digital Imaging Technician (DIT) on a movie set?",
        options: ["Pulling lens focus", "Operating the camera crane", "Managing camera data workflows and on-set color grading", "Writing the final script changes"],
        correct: "Managing camera data workflows and on-set color grading",
        explanation: "The DIT bridges cinematography and post-production, managing the digital data workflow, image quality control, and on-set LUT color applications."
      }
    ]
  },
  {
    id: "playback_operator",
    name: "Music Video Playback Operator",
    category: "music_video_specific",
    difficulty: "intermediate",
    explanation: "The Playback Operator is a critical specialized crew member on music video, commercial, and musical film sets. Their primary job is to play the audio track at precise speeds, starting from exact timecode cue points, so that the artist can lip-sync and dance in perfect synchronization with the camera.",
    department: "Sound Department / Production",
    keyResponsibilities: [
      "Manage professional audio playback rigs on active, high-volume production sets.",
      "Trigger audio tracks from exact cues instantly on the Director's command.",
      "Provide synced Timecode (LTC) feeds to the camera and slate for automatic multi-cam audio synchronization.",
      "Manipulate track speeds (e.g. playing at 200% speed for slow-motion performance captures)."
    ],
    equipmentUsed: [
      "Dedicated playback software (Pro Tools, Ableton Live, or QLab)",
      "High-power active PA speakers and portable monitor systems",
      "Timecode generators (Tentacle Sync, Deneke Slate)",
      "Remote wireless earpieces ('ear pro' transmitters) for quiet sets"
    ],
    typicalWorkflow: [
      "Pre-production: Receive official song mix stems, checking sample rates and creating labeled section markers.",
      "Set-up: Connect high-power PA speakers, slate timecode generators, and verify remote wireless audio monitors.",
      "Shooting: Trigger the audio track on command, calling out section counts for the crew and keeping artists on rhythm.",
      "Dynamic Shooting: Speed up or slow down the song track to support specialty high-frame-rate cameras."
    ],
    worksWith: ["Director", "Video Producer", "Cinematographer", "Artist", "Choreographer", "Sound Recordist"],
    commonMistakes: [
      "Failing to verify the correct sample rate or song version, leading to lip-sync drifts in post-production.",
      "Playing a track too loud on indoor sets, causing audio echoing that ruins adjacent spoken-dialogue captures."
    ],
    learningExercises: [
      "Set up an audio project in your DAW with timecode markers at the start of every verse, chorus, and bridge.",
      "Practice warping an audio track to play at exactly 150% speed while keeping the pitch constant for a 36fps slow-motion capture."
    ],
    quizzes: [
      {
        question: "Why does a Playback Operator play a track at double-speed (200%) on a music video set?",
        options: ["To finish the shoot day faster", "To capture a slow-motion performance where the lip-sync still matches at 24fps", "To help dancers move with high energy", "To test speaker frequency range limits"],
        correct: "To capture a slow-motion performance where the lip-sync still matches at 24fps",
        explanation: "When shooting performance at 48fps (slow motion), playing the music at 200% speed on set allows the artist's mouth shapes to sync perfectly when the footage is played back at a normal 24fps in post-production."
      }
    ]
  }
];
