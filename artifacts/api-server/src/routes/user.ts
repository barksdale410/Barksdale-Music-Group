import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { savedBeatsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const DEFAULT_PROFILE = {
  id: "user-1",
  username: "ProducerOS",
  avatarUrl: null,
  daw: "garageband_ios",
  tier: "free",
  rating: 5.0,
  skills: {
    drums: 7,
    bass: 6,
    keys: 8,
    sampling: 7,
    arrangement: 7,
    mixing: 6,
    melody: 8,
    strengths: ["keys", "melody"],
    weaknesses: ["mixing", "bass"],
  },
  badges: [],
  beatsCreated: 0,
  collabsCompleted: 0,
  battlesWon: 0,
  isAvailableForGigs: false,
};

const DEFAULT_BADGES = [
  { id: "b1", name: "First Beat", description: "Created your first beat", icon: "🎵", earnedAt: new Date().toISOString() },
  { id: "b2", name: "Studio Starter", description: "Opened the app for the first time", icon: "🎛️", earnedAt: new Date().toISOString() },
];

// User profile
router.get("/user/profile", async (_req, res): Promise<void> => {
  res.json(DEFAULT_PROFILE);
});

router.patch("/user/profile", async (req, res): Promise<void> => {
  const { username, daw, isAvailableForGigs } = req.body as { username?: string; daw?: string; isAvailableForGigs?: boolean };
  const updated = {
    ...DEFAULT_PROFILE,
    ...(username && { username }),
    ...(daw && { daw }),
    ...(isAvailableForGigs !== undefined && { isAvailableForGigs }),
  };
  res.json(updated);
});

// Saved beats
router.get("/user/beats", async (_req, res): Promise<void> => {
  try {
    const beats = await db.select().from(savedBeatsTable).orderBy(savedBeatsTable.createdAt);
    res.json(beats.map(b => ({
      id: b.id,
      name: b.name,
      key: b.key,
      bpm: b.bpm,
      mood: b.mood,
      chordProgression: b.chordProgression,
      producer: b.producer,
      genre: b.genre,
      createdAt: b.createdAt.toISOString(),
    })));
  } catch {
    res.json([]);
  }
});

router.post("/user/beats", async (req, res): Promise<void> => {
  const { name, key, bpm, mood, chordProgression, producer, genre } = req.body as {
    name?: string; key?: string; bpm?: number; mood?: string; chordProgression?: string; producer?: string; genre?: string;
  };

  if (!name || !key || bpm == null || !mood || !chordProgression) {
    res.status(400).json({ error: "name, key, bpm, mood, chordProgression are required" });
    return;
  }

  try {
    const [beat] = await db.insert(savedBeatsTable).values({
      name,
      key,
      bpm,
      mood,
      chordProgression,
      producer: producer || null,
      genre: genre || null,
    }).returning();
    res.status(201).json({
      id: beat.id,
      name: beat.name,
      key: beat.key,
      bpm: beat.bpm,
      mood: beat.mood,
      chordProgression: beat.chordProgression,
      producer: beat.producer,
      genre: beat.genre,
      createdAt: beat.createdAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Failed to save beat" });
  }
});

router.delete("/user/beats/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    await db.delete(savedBeatsTable).where(eq(savedBeatsTable.id, id));
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: "Failed to delete beat" });
  }
});

// Badges
router.get("/user/badges", async (_req, res): Promise<void> => {
  res.json(DEFAULT_BADGES);
});

export default router;
