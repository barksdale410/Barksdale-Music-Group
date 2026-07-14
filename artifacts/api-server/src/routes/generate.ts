import { Router, type IRouter } from "express";
import { templates } from "../data/templates";
import { engines } from "../data/engines";

const router: IRouter = Router();

type Layer = {
  name: string;
  instrument: string;
  gainDb: number;
  pan: number;
  notes?: string;
};

type GeneratedBeat = {
  id: string;
  chordProgression: string;
  key: string;
  bpm: number;
  mood: string;
  layers: Layer[];
  drumPattern: {
    id: string;
    name: string;
    bpm: number;
    swing: number;
    kick: number[];
    snare: number[];
    hihat: number[];
    perc: number[];
  };
  masteringChain: string;
  structure: string;
  voiceLeading: string;
  gainStaging: Record<string, string>;
};

const defaultDrumPattern = (bpm: number, swing = 54) => ({
  id: `drum-${Date.now()}`,
  name: "Generated Pattern",
  bpm,
  swing,
  kick:  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
  perc:  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
});

const gainStaging = {
  kick: "-14dB peak",
  sub_bass: "-12dB peak",
  snare: "-14dB peak",
  hihat: "-20dB peak",
  melody: "-18dB peak",
  strings: "-18dB peak",
  vocal_lead: "-12dB peak",
  vocal_doubles: "-20dB peak",
};

const masteringChain = "Slot 1: Scaler EQ — Scale Locked, Width 110%, Harmonic Peak +1dB @ 2kHz | Slot 2: Stock Visual EQ — HPF 20Hz / LPF 19kHz | Slot 3: Brickwall Limiter — -1.0dB / -9 LUFS | Export: 24-bit WAV / 44.1kHz | Target: -9 LUFS / -1.0dB True Peak / DR8-DR10";

const progressionsByGenreEmotion: Record<string, Record<string, string>> = {
  "Hip Hop": {
    "Loyalty": "Cm7, Fm9, Abmaj7, Bb7",
    "Revenge": "Fm7, Gm7b5, Abmaj7, Eb7",
    "Power": "Gm9, Cm7, Ebmaj7, D7",
    "Hustle": "Dm7, Am7, Bbmaj7, C7",
    "Legacy": "Ebm7, Dbmaj7, Gbmaj7, Ab7",
    "default": "Cm7, Fm7, Abmaj7, Bb7",
  },
  "Gospel": {
    "Joy": "Bbmaj9, Gm7, Cm9, F7",
    "Praise": "Abmaj9, Fm11, Dbmaj7, Eb7",
    "Worship": "Ebmaj9, Cm7, Fm9, Bb7sus4",
    "Redemption": "Gbmaj7, Ebm7, Abm9, Db7",
    "default": "Abmaj9, Fm7, Bbm7, Eb7",
  },
  "R&B": {
    "Love": "Abmaj9, Fm11, Bbm9, Eb7",
    "Heartbreak": "Fm9, Bbm7, Dbmaj7, Ab7",
    "Desire": "Dbmaj9, Bbm7, Ebm9, Ab7sus4",
    "Vulnerability": "Ebm9, Abm7, Cbmaj7, Bb7",
    "default": "Abmaj9, Fm7, Bbm9, Eb7",
  },
  "Jazz": {
    "Contemplation": "Dm9, G7#11, Cmaj7, Bm7b5",
    "Freedom": "Fmaj9, Em7, Dm9, G7alt",
    "Sophistication": "Bbmaj9, Am7b5, D7, Gm9",
    "default": "Dm9, G7#11, Cmaj7, Em7",
  },
  "Lo-Fi": {
    "Calm": "Fmaj9, Em7, Am7, Dm9",
    "Nostalgia": "Dm9, Am7, Bbmaj7, C9",
    "Focus": "Abmaj9, Fm7, Bbm9, Eb7",
    "default": "Fmaj9, Em7, Dm9, C9",
  },
  "Trap": {
    "Rage": "F#m7, Amaj7, Bm7, E7",
    "Flex": "Am9, Gmaj7, Fmaj7, Em7",
    "Grind": "Cm9, Gm7, Abmaj7, Bb7",
    "default": "F#m7, Amaj7, Bm7, E7",
  },
  "Orchestral": {
    "Epic": "Dm, Bb, F, C",
    "Sorrow": "Dm7, Am7, Gm7, A7",
    "Victory": "Fmaj, Dm, Bb, C7",
    "Mystery": "Dm9, Em7b5, Fmaj7, C7",
    "default": "Dm, Bb, C, Am",
  },
  "Boom Bap Cinema": {
    "Cinematic": "Cm9, Fm7, Abmaj7, Bb7",
    "Street Poetry": "Gm9, Cm7, Ebmaj7, D7",
    "Legacy": "Ebm9, Dbmaj7, Gbmaj7, Ab7",
    "default": "Cm7, Fm9, Abmaj7, Bb7",
  },
};

function getProgression(genre: string, emotion: string): string {
  const genreMap = progressionsByGenreEmotion[genre] || progressionsByGenreEmotion["Hip Hop"];
  return genreMap[emotion] || genreMap["default"] || "Cm7, Fm7, Abmaj7, Bb7";
}

function buildLayers(producer: string, genre: string, daw = "garageband_ios"): Layer[] {
  return [
    { name: "Soul Choir Stab", instrument: "Gospel Choir", gainDb: -18, pan: 0, notes: "Beat 1, release beat 3, LPF 4kHz, LFO ±8¢" },
    { name: "Rhodes", instrument: "Classic Electric Piano", gainDb: -18, pan: -30, notes: "Tape sat +2-3dB, 3-5 notes/bar, pan L30" },
    { name: "String Pad", instrument: "Studio Strings", gainDb: -20, pan: 0, notes: "Attack 800ms, release 2s, below 800Hz" },
    { name: "Sub Bass", instrument: "Hip-Hop Bass", gainDb: -12, pan: 0, notes: "HPF 80Hz, mono below 130Hz" },
  ];
}

function generateBeat(producer: string, genre: string, emotion: string, key: string, bpm: number, daw = "garageband_ios", customChords?: string): GeneratedBeat {
  const chordProgression = customChords || getProgression(genre, emotion);
  const mood = emotion;
  const structure = "Intro(8) → V1(16) → Hook(8) → V2(16) → Hook(8) → Bridge(8) → V3(16) → Outro(8) = 88 bars";

  return {
    id: `generated-${Date.now()}`,
    chordProgression,
    key,
    bpm,
    mood,
    layers: buildLayers(producer, genre, daw),
    drumPattern: defaultDrumPattern(bpm),
    masteringChain,
    structure,
    voiceLeading: "Smooth voice leading applied. Common tones held, other voices move by step.",
    gainStaging,
  };
}

// Advanced generation
router.post("/generate/advanced", async (req, res): Promise<void> => {
  const { producer = "Conductor Williams", genre = "Hip Hop", emotion = "Legacy", key = "C Minor", bpm = 78, chords: customChords, daw } = req.body as {
    producer?: string; genre?: string; emotion?: string; key?: string; bpm?: number; chords?: string; daw?: string; mode?: string;
  };

  const beat = generateBeat(producer, genre, emotion, key, bpm, daw, customChords);
  res.json(beat);
});

// Engine-specific generators
const engineGeneratorHandler = (engineId: string) => async (req: Parameters<Parameters<typeof router.post>[1]>[0], res: Parameters<Parameters<typeof router.post>[1]>[1]): Promise<void> => {
  const engine = engines.find(e => e.id === engineId);
  const { emotion, key = "C Minor", bpm, daw } = req.body as { emotion?: string; key?: string; bpm?: number; daw?: string; engine?: string };

  const effectiveBpm = bpm || engine?.defaultBpm || 85;
  const effectiveKey = key || engine?.defaultKey || "C Minor";
  const effectiveEmotion = emotion || (engine?.emotions[0] ?? "Legacy");

  const genreMap: Record<string, string> = {
    "mafiascore": "Hip Hop",
    "gospel": "Gospel",
    "jazz": "Jazz",
    "lofi": "Lo-Fi",
    "trap": "Trap",
    "orchestral": "Orchestral",
    "rb": "R&B",
    "boom-bap-cinema": "Boom Bap Cinema",
  };

  const beat = generateBeat(engine?.name || "Producer", genreMap[engineId] || "Hip Hop", effectiveEmotion, effectiveKey, effectiveBpm, daw);
  res.json(beat);
};

router.post("/generate/mafiascore", engineGeneratorHandler("mafiascore"));
router.post("/generate/gospel", engineGeneratorHandler("gospel"));
router.post("/generate/jazz", engineGeneratorHandler("jazz"));
router.post("/generate/lofi", engineGeneratorHandler("lofi"));
router.post("/generate/trap", engineGeneratorHandler("trap"));
router.post("/generate/orchestral", engineGeneratorHandler("orchestral"));
router.post("/generate/rb", engineGeneratorHandler("rb"));
router.post("/generate/boom-bap-cinema", engineGeneratorHandler("boom-bap-cinema"));

export default router;
