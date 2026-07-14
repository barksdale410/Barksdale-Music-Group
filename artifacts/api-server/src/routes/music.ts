import { Router, type IRouter } from "express";
import { templates } from "../data/templates";
import { producers, producerDetails } from "../data/producers";
import { engines } from "../data/engines";
import { instrumentMaps } from "../data/instrumentMaps";
import { circleOfFifths } from "../data/circleOfFifths";
import { legendaryPairings } from "../data/legendaryPairings";
import { chords } from "../data/chords";

const router: IRouter = Router();

// Templates
router.get("/templates", async (req, res): Promise<void> => {
  const { genre, search } = req.query as { genre?: string; search?: string };
  let result = [...templates];
  if (genre) result = result.filter(t => t.genre.toLowerCase().includes(genre.toLowerCase()));
  if (search) result = result.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.producer.toLowerCase().includes(search.toLowerCase()) ||
    t.mood.toLowerCase().includes(search.toLowerCase())
  );
  res.json(result);
});

router.get("/templates/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const template = templates.find(t => t.id === id);
  if (!template) { res.status(404).json({ error: "Template not found" }); return; }
  res.json(template);
});

// Producers
router.get("/producers", async (req, res): Promise<void> => {
  const { category, search } = req.query as { category?: string; search?: string };
  let result = [...producers];
  if (category) result = result.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  if (search) result = result.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.style.toLowerCase().includes(search.toLowerCase())
  );
  res.json(result);
});

router.get("/producers/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const producer = producers.find(p => p.id === id);
  if (!producer) { res.status(404).json({ error: "Producer not found" }); return; }
  const detail = producerDetails[id] || {};
  res.json({ ...producer, ...detail });
});

// Producer chords
router.get("/producer-chords/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const detail = producerDetails[id] as { chordLibrary?: object[] } | undefined;
  if (detail?.chordLibrary) {
    res.json(detail.chordLibrary);
    return;
  }
  // Generate chord progressions based on producer's style
  const producer = producers.find(p => p.id === id);
  const fallback = [
    { id: `${id}-c1`, name: "Signature Move 1", chords: "Cm7, Fm7, Abmaj7, Bb7", key: "C Minor", emotion: "Dark", genre: producer?.category || "Hip-Hop", description: "Core progression in this producer's style." },
    { id: `${id}-c2`, name: "Signature Move 2", chords: "Ebmaj9, Cm11, Fm9, Bb7sus4", key: "Eb Major", emotion: "Lush", genre: producer?.category || "Hip-Hop", description: "Extended chord voicing from this producer's approach." },
    { id: `${id}-c3`, name: "Signature Move 3", chords: "Dm9, Gm7, Bbmaj7, A7", key: "D Minor", emotion: "Introspective", genre: producer?.category || "Hip-Hop", description: "Jazz-influenced progression in this producer's style." },
  ];
  res.json(fallback);
});

// Chords encyclopedia
router.get("/chords", async (req, res): Promise<void> => {
  const { root, type } = req.query as { root?: string; type?: string };
  let result = [...chords];
  if (root) result = result.filter(c => c.root === root);
  if (type) result = result.filter(c => c.type.toLowerCase().includes(type.toLowerCase()));
  res.json(result);
});

// Circle of fifths
router.get("/circle-of-fifths", async (_req, res): Promise<void> => {
  res.json(circleOfFifths);
});

// Engines
router.get("/engines", async (_req, res): Promise<void> => {
  res.json(engines);
});

// Instrument maps
router.get("/instrument-maps", async (req, res): Promise<void> => {
  const { daw } = req.query as { daw?: string };
  if (daw) {
    // Filter dawMappings to only show the requested DAW
    const filtered = {
      daws: instrumentMaps.daws,
      categories: instrumentMaps.categories.map(cat => ({
        ...cat,
        instruments: cat.instruments.map(inst => ({
          ...inst,
          dawMappings: daw in inst.dawMappings ? { [daw]: inst.dawMappings[daw as keyof typeof inst.dawMappings] } : inst.dawMappings
        }))
      }))
    };
    res.json(filtered);
    return;
  }
  res.json(instrumentMaps);
});

// Legendary pairings
router.get("/legendary-pairings", async (_req, res): Promise<void> => {
  res.json(legendaryPairings);
});

// Daily drill
router.get("/daily-drill", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  res.json({
    date: today,
    title: "15-Minute Daily Production Drill",
    exercises: [
      { duration: 3, title: "Warm-Up: Scale Run", instruction: "Play the C Minor scale ascending and descending for 3 minutes. Focus on voice leading between notes. Use your selected DAW's piano roll." },
      { duration: 3, title: "Chord Voicing Practice", instruction: "Play Cm7 → Fm7 → Abmaj7 → Bb7 in 3 different inversions each. Identify which inversion creates the smoothest voice leading." },
      { duration: 4, title: "Drum Programming", instruction: "Program a basic boom bap pattern: Kick on beat 1 and the 'and' of 3. Snare on beats 2 and 4. Hi-hat ghosted every 8th note. Set swing to 54%." },
      { duration: 3, title: "Bass Line Construction", instruction: "Create a bass line that follows your Cm7 chord progression. Start on the root, add chromatic passing tones on the 'and' beats. Keep it below 200Hz on the low notes." },
      { duration: 2, title: "Mix Check", instruction: "Play your full beat and listen for frequency conflicts. Kick should punch at 60Hz. Sub bass at 40Hz. Make sure they don't compete. Mute one element at a time and listen for the difference." }
    ],
    tip: "The best beats come from restraint. Add one element at a time. If it doesn't serve the groove, cut it."
  });
});

// Hall of fame tip
router.get("/hall-of-fame-tip", async (_req, res): Promise<void> => {
  const tips = [
    { producer: "Jazzy Jeff", quote: "The pocket is everything. Don't rush the snare. Let it breathe. The spaces between the notes are just as important as the notes themselves.", tutorial: "Today's lesson: Swing. Set your DAW's quantize to 16th notes but set swing to 54-60%. The slight delay on off-beats creates that human feel that makes people nod their heads. Program your hi-hat strictly on-grid first, then gradually add swing until it locks in." },
    { producer: "J Dilla", quote: "Drunk beats. Put the kick slightly behind the grid. Not a mistake — intentional. It creates weight, like gravity pulling the groove down.", tutorial: "The Dilla Technique: After programming your drum pattern perfectly on-grid, nudge your kick drum 15-20ms behind the grid. Don't quantize it. Leave the snare on the grid. The tension between the loose kick and the locked snare creates that unmistakable Dilla pocket." },
    { producer: "Dr. Dre", quote: "Bass is everything. If the bass doesn't hit right, nothing else matters. Build your mix around the low end.", tutorial: "G-Funk Bass Lesson: Start every beat by programming the bass line first, before anything else. Make sure your sub bass (40Hz) and your kick (60Hz) are on different pitches and don't clash. Use the Scaler EQ to cut competing frequencies. Then build your melody on top of a solid low-end foundation." },
    { producer: "Timbaland", quote: "I listen to music from other cultures. African rhythms, Indian rhythms — they have patterns Western producers never think of. That's where the originality comes from.", tutorial: "Polyrhythm Lesson: Take your standard 4/4 beat. Now add a percussion element in 3 — a shaker or tambourine that cycles every 3 notes. The interplay between the 4/4 foundation and the 3-note cycle creates that Timbaland restlessness. Try it with a hi-hat pattern that doesn't line up with your kick grid." },
    { producer: "The Alchemist", quote: "Sample selection is 80% of the work. The right sample already has emotion baked in. Your job is to not mess it up.", tutorial: "Sample Selection Masterclass: Don't use the most obvious part of a record. Listen for 2-3 bar sections that most people would skip — an interlude, a breakdown, a single note that trails off. The character in those moments is pure gold. Chop it, loop it, add your drums around it." },
    { producer: "Pete Rock", quote: "Every sample tells a story. Learn the story of what you're sampling — the era, the artist, the feeling. Then flip it into something new that honors where it came from.", tutorial: "Sample Flip Technique: After you find your sample, slow it down by 5-10%. This changes the pitch and feel in a way that makes it sound like a completely different record. Add your drums, then bring the sample back up just slightly so the combined result hits at your target BPM." },
    { producer: "Conductor Williams", quote: "I grew up in the church. Gospel harmony is the deepest harmony there is. Those chord extensions — the 9ths, the 11ths — that's where God lives in music.", tutorial: "Gospel Chord Masterclass: Instead of plain Cm7, try Cm9 or Cm11. The 9th adds warmth. The 11th adds transcendence. In the church, the choir would stack these extended voicings across different voice parts. In your production, use multiple samples of the same chord in different inversions to recreate that choir effect." },
  ];
  const today = new Date();
  const tipIndex = today.getDate() % tips.length;
  const tip = tips[tipIndex];
  res.json({ date: today.toISOString().split("T")[0], ...tip, audioExample: null });
});

// Voice leading
router.post("/voice-leading", async (req, res): Promise<void> => {
  const { chords: chordStr, key } = req.body as { chords?: string; key?: string; instrument?: string };
  if (!chordStr) { res.status(400).json({ error: "chords is required" }); return; }

  const chordArr = chordStr.split(",").map((c: string) => c.trim());
  const suggestions = chordArr.map((chord: string, i: number) => {
    const nextChord = chordArr[(i + 1) % chordArr.length];
    return {
      chord,
      inversion: i % 3 === 0 ? "Root position" : i % 3 === 1 ? "First inversion" : "Second inversion",
      grade: i % 3 === 0 ? "A" : i % 3 === 1 ? "B+" : "B",
      notes: `Voice leading from ${chord} to ${nextChord}: use common tones. Move other voices by step where possible.`
    };
  });

  res.json({ original: chordStr, suggestions });
});

// Harmonic fingerprint
router.post("/harmonic-fingerprint", async (req, res): Promise<void> => {
  const { producerId } = req.body as { producerId?: string };
  if (!producerId) { res.status(400).json({ error: "producerId is required" }); return; }

  const fingerprints: Record<string, object> = {
    "conductor-williams": { producerId, drums: 85, bass: 70, keys: 90, sampling: 80, arrangement: 95, mixing: 85, melody: 75 },
    "metro-boomin": { producerId, drums: 95, bass: 85, keys: 70, sampling: 75, arrangement: 80, mixing: 90, melody: 65 },
    "dr-dre": { producerId, drums: 90, bass: 95, keys: 75, sampling: 70, arrangement: 85, mixing: 100, melody: 80 },
    "madlib": { producerId, drums: 85, bass: 65, keys: 80, sampling: 100, arrangement: 90, mixing: 70, melody: 85 },
    "robert-glasper": { producerId, drums: 80, bass: 85, keys: 100, sampling: 60, arrangement: 95, mixing: 85, melody: 95 },
  };

  const result = fingerprints[producerId] || {
    producerId,
    drums: Math.floor(Math.random() * 40) + 60,
    bass: Math.floor(Math.random() * 40) + 60,
    keys: Math.floor(Math.random() * 40) + 60,
    sampling: Math.floor(Math.random() * 40) + 60,
    arrangement: Math.floor(Math.random() * 40) + 60,
    mixing: Math.floor(Math.random() * 40) + 60,
    melody: Math.floor(Math.random() * 40) + 60,
  };

  res.json(result);
});

export default router;
