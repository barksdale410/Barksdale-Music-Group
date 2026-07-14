import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  collabRoomsTable,
  battlesTable,
  microGigsTable,
} from "@workspace/db";
import { legendaryPairings } from "../data/legendaryPairings";

const router: IRouter = Router();

// Default roles for a collab room
function defaultRoles() {
  return [
    { role: "Drummer", userId: null, username: null },
    { role: "Bassist", userId: null, username: null },
    { role: "Keys", userId: null, username: null },
    { role: "Melody", userId: null, username: null },
    { role: "Arranger", userId: null, username: null },
    { role: "Mixer", userId: null, username: null },
  ];
}

// Collab Rooms
router.get("/collab/rooms", async (_req, res): Promise<void> => {
  try {
    const rooms = await db.select().from(collabRoomsTable).orderBy(collabRoomsTable.createdAt);
    res.json(rooms.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      roles: r.roles as object[],
      participants: r.participants,
      isLive: r.isLive,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch {
    res.json([]);
  }
});

router.post("/collab/rooms", async (req, res): Promise<void> => {
  const { name, type = "public", password, role } = req.body as { name?: string; type?: string; password?: string; role?: string };
  if (!name) { res.status(400).json({ error: "name is required" }); return; }

  const roles = defaultRoles();
  if (role) {
    const matchIdx = roles.findIndex(r => r.role.toLowerCase() === role.toLowerCase());
    if (matchIdx >= 0) roles[matchIdx] = { role: roles[matchIdx].role, userId: "user-1", username: "You" };
  }

  try {
    const [room] = await db.insert(collabRoomsTable).values({
      name,
      type,
      password: password || null,
      isLive: true,
      participants: 1,
      roles,
    }).returning();
    res.status(201).json({
      id: room.id,
      name: room.name,
      type: room.type,
      roles: room.roles as object[],
      participants: room.participants,
      isLive: room.isLive,
      createdAt: room.createdAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Failed to create room" });
  }
});

router.get("/collab/rooms/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const [room] = await db.select().from(collabRoomsTable).where(
      (await import("drizzle-orm")).eq(collabRoomsTable.id, id)
    );
    if (!room) { res.status(404).json({ error: "Room not found" }); return; }
    res.json({
      id: room.id,
      name: room.name,
      type: room.type,
      roles: room.roles as object[],
      participants: room.participants,
      isLive: room.isLive,
      createdAt: room.createdAt.toISOString(),
    });
  } catch {
    res.status(404).json({ error: "Room not found" });
  }
});

// Skill test
router.post("/collab/skill-test", async (req, res): Promise<void> => {
  const { scores } = req.body as { scores?: { drums?: number; bass?: number; keys?: number; sampling?: number; arrangement?: number; mixing?: number; melody?: number } };
  if (!scores) { res.status(400).json({ error: "scores required" }); return; }

  const s = scores;
  const allScores = [s.drums || 5, s.bass || 5, s.keys || 5, s.sampling || 5, s.arrangement || 5, s.mixing || 5, s.melody || 5];
  const maxScore = Math.max(...allScores);
  const minScore = Math.min(...allScores);

  const skillNames: Record<string, number> = {
    drums: s.drums || 5,
    bass: s.bass || 5,
    keys: s.keys || 5,
    sampling: s.sampling || 5,
    arrangement: s.arrangement || 5,
    mixing: s.mixing || 5,
    melody: s.melody || 5,
  };

  const strengths = Object.entries(skillNames).filter(([, v]) => v >= maxScore - 1).map(([k]) => k);
  const weaknesses = Object.entries(skillNames).filter(([, v]) => v <= minScore + 1).map(([k]) => k);

  res.json({
    drums: s.drums || 5,
    bass: s.bass || 5,
    keys: s.keys || 5,
    sampling: s.sampling || 5,
    arrangement: s.arrangement || 5,
    mixing: s.mixing || 5,
    melody: s.melody || 5,
    strengths: strengths.length ? strengths : ["drums"],
    weaknesses: weaknesses.length ? weaknesses : ["sampling"],
  });
});

// Skill match
router.get("/collab/skill-match", async (_req, res): Promise<void> => {
  const matches = [
    { producerId: "the-alchemist", producerName: "The Alchemist", compatibility: 94, complementarySkills: ["sampling", "drums"], rating: 4.9 },
    { producerId: "metro-boomin", producerName: "Metro Boomin", compatibility: 88, complementarySkills: ["mixing", "arrangement"], rating: 4.8 },
    { producerId: "robert-glasper", producerName: "Robert Glasper", compatibility: 85, complementarySkills: ["keys", "melody"], rating: 4.9 },
    { producerId: "conductor-williams", producerName: "Conductor Williams", compatibility: 91, complementarySkills: ["arrangement", "melody"], rating: 4.7 },
    { producerId: "questlove", producerName: "Questlove", compatibility: 82, complementarySkills: ["drums", "arrangement"], rating: 4.8 },
  ];
  res.json(matches);
});

// Battles
router.get("/collab/battles", async (_req, res): Promise<void> => {
  try {
    const battles = await db.select().from(battlesTable).orderBy(battlesTable.createdAt);
    res.json(battles.map(b => ({
      id: b.id,
      prompt: b.prompt,
      chords: b.chords,
      challenger: b.challenger,
      opponent: b.opponent,
      status: b.status,
      timeRemaining: b.timeRemaining,
      votesA: b.votesA,
      votesB: b.votesB,
      winner: b.winner,
      expiresAt: b.expiresAt.toISOString(),
    })));
  } catch {
    res.json([]);
  }
});

router.post("/collab/battles", async (req, res): Promise<void> => {
  const { prompt, opponentId } = req.body as { prompt?: string; opponentId?: string };
  if (!prompt) { res.status(400).json({ error: "prompt required" }); return; }

  const battleChords = "Cm7, Fm7, Abmaj7, Bb7";
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    const [battle] = await db.insert(battlesTable).values({
      prompt,
      chords: battleChords,
      challenger: "You",
      opponent: opponentId || null,
      status: "open",
      timeRemaining: 600,
      votesA: 0,
      votesB: 0,
      winner: null,
      expiresAt,
    }).returning();
    res.status(201).json({
      id: battle.id,
      prompt: battle.prompt,
      chords: battle.chords,
      challenger: battle.challenger,
      opponent: battle.opponent,
      status: battle.status,
      timeRemaining: battle.timeRemaining,
      votesA: battle.votesA,
      votesB: battle.votesB,
      winner: battle.winner,
      expiresAt: battle.expiresAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Failed to create battle" });
  }
});

router.post("/collab/battles/:id/vote", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { vote } = req.body as { vote?: "a" | "b" };
  if (!vote || !["a", "b"].includes(vote)) { res.status(400).json({ error: "vote must be 'a' or 'b'" }); return; }

  const { eq, sql } = await import("drizzle-orm");
  try {
    const field = vote === "a" ? battlesTable.votesA : battlesTable.votesB;
    const [battle] = await db.update(battlesTable)
      .set({ [vote === "a" ? "votesA" : "votesB"]: sql`${field} + 1` })
      .where(eq(battlesTable.id, id))
      .returning();
    if (!battle) { res.status(404).json({ error: "Battle not found" }); return; }
    res.json({
      id: battle.id,
      prompt: battle.prompt,
      chords: battle.chords,
      challenger: battle.challenger,
      opponent: battle.opponent,
      status: battle.status,
      timeRemaining: battle.timeRemaining,
      votesA: battle.votesA,
      votesB: battle.votesB,
      winner: battle.winner,
      expiresAt: battle.expiresAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Failed to vote" });
  }
});

// Leaderboard
router.get("/collab/leaderboard", async (req, res): Promise<void> => {
  const { category } = req.query as { category?: string };
  const leaderboard = [
    { rank: 1, userId: "u1", username: "ConductorBeats", score: 9840, category: "overall", badges: ["Drum Master", "Mix Genius"], rating: 4.9 },
    { rank: 2, userId: "u2", username: "MelodicDave", score: 9210, category: "overall", badges: ["Bass Wizard", "Drum Master"], rating: 4.8 },
    { rank: 3, userId: "u3", username: "SoulSampler99", score: 8750, category: "overall", badges: ["Mix Genius"], rating: 4.7 },
    { rank: 4, userId: "u4", username: "BeatCipher", score: 8100, category: "overall", badges: ["Drum Master"], rating: 4.6 },
    { rank: 5, userId: "u5", username: "TrapGod215", score: 7890, category: "overall", badges: ["Bass Wizard"], rating: 4.5 },
    { rank: 6, userId: "u6", username: "GospelKeys", score: 7500, category: "overall", badges: [], rating: 4.4 },
    { rank: 7, userId: "u7", username: "NycGrinder", score: 7100, category: "overall", badges: [], rating: 4.3 },
    { rank: 8, userId: "u8", username: "SoulfoodBeats", score: 6800, category: "overall", badges: [], rating: 4.2 },
    { rank: 9, userId: "u9", username: "ChordMaster", score: 6400, category: "overall", badges: [], rating: 4.1 },
    { rank: 10, userId: "u10", username: "LayerStack", score: 6000, category: "overall", badges: [], rating: 4.0 },
  ];
  const filtered = category ? leaderboard.filter(e => e.category === category || category === "all") : leaderboard;
  res.json(filtered);
});

// Micro gigs
router.get("/collab/micro-gigs", async (_req, res): Promise<void> => {
  try {
    const gigs = await db.select().from(microGigsTable).orderBy(microGigsTable.createdAt);
    if (gigs.length > 0) {
      res.json(gigs.map(g => ({
        id: g.id,
        sellerId: g.sellerId,
        sellerName: g.sellerName,
        title: g.title,
        description: g.description,
        pricePerQuarterHour: Number(g.pricePerQuarterHour),
        pricePerHour: Number(g.pricePerHour),
        rating: Number(g.rating),
        reviewCount: g.reviewCount,
        isAvailable: g.isAvailable,
        skills: g.skills as string[],
      })));
      return;
    }
  } catch { /* fall through to mock data */ }

  res.json([
    { id: "mg1", sellerId: "u1", sellerName: "ConductorBeats", title: "Boom Bap Collab Session", description: "Full production session in the Conductor Williams style. Gospel chords, boom bap drums.", pricePerQuarterHour: 5, pricePerHour: 20, rating: 4.9, reviewCount: 47, isAvailable: true, skills: ["Drums", "Arrangement", "Mixing"] },
    { id: "mg2", sellerId: "u2", sellerName: "MelodicDave", title: "Neo-Soul Keys & Melody Session", description: "Extended chord voicings, voice leading, Robert Glasper style arrangements.", pricePerQuarterHour: 5, pricePerHour: 20, rating: 4.8, reviewCount: 31, isAvailable: true, skills: ["Keys", "Melody", "Arrangement"] },
    { id: "mg3", sellerId: "u3", sellerName: "SoulSampler99", title: "Sample Flip & Chop Session", description: "Let's dig through crates and find the perfect sample. I'll chop and loop it for you.", pricePerQuarterHour: 5, pricePerHour: 20, rating: 4.7, reviewCount: 22, isAvailable: false, skills: ["Sampling"] },
  ]);
});

router.post("/collab/micro-gigs", async (req, res): Promise<void> => {
  const { title, description, pricePerQuarterHour, pricePerHour, skills = [] } = req.body as { title?: string; description?: string; pricePerQuarterHour?: number; pricePerHour?: number; skills?: string[] };
  if (!title || pricePerQuarterHour == null || pricePerHour == null) {
    res.status(400).json({ error: "title, pricePerQuarterHour, and pricePerHour are required" });
    return;
  }
  try {
    const [gig] = await db.insert(microGigsTable).values({
      sellerId: "user-1",
      sellerName: "You",
      title,
      description: description || null,
      pricePerQuarterHour: String(pricePerQuarterHour),
      pricePerHour: String(pricePerHour),
      isAvailable: true,
      skills,
    }).returning();
    res.status(201).json({
      id: gig.id,
      sellerId: gig.sellerId,
      sellerName: gig.sellerName,
      title: gig.title,
      description: gig.description,
      pricePerQuarterHour: Number(gig.pricePerQuarterHour),
      pricePerHour: Number(gig.pricePerHour),
      rating: Number(gig.rating),
      reviewCount: gig.reviewCount,
      isAvailable: gig.isAvailable,
      skills: gig.skills as string[],
    });
  } catch {
    res.status(500).json({ error: "Failed to create gig" });
  }
});

// Daily challenge
router.get("/collab/daily-challenge", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const challenges = [
    { pairing: "Jazzy Jeff × The Alchemist", prompt: "Make a beat in the style of Jazzy Jeff × The Alchemist", chords: "Em7, Am7, Cmaj7, Bm7", key: "E Minor", bpm: 88 },
    { pairing: "Madlib × J Dilla", prompt: "Create a dusty, hazy loop in the Madlib × J Dilla tradition", chords: "Dm9, G7#11, Cmaj7, Bbmaj9", key: "D Minor", bpm: 78 },
    { pairing: "Timbaland × Neptunes", prompt: "Build a syncopated R&B banger fusing Timbaland and Neptunes styles", chords: "F#m9, D9, E7, C#m7", key: "F# Minor", bpm: 100 },
    { pairing: "Dr. Dre × Scott Storch", prompt: "Drop a West Coast melodic banger with G-Funk keys", chords: "Gm9, Cm7, Dm7, Bb7", key: "G Minor", bpm: 94 },
    { pairing: "Conductor Williams × Daringer", prompt: "Craft a dark, spiritual boom bap in the Conductor × Daringer tradition", chords: "Cm7, Fm9, Abmaj7, Bb7", key: "C Minor", bpm: 80 },
    { pairing: "Babyface × D'Mile", prompt: "Write an intimate neo-soul R&B production", chords: "Ebmaj9, Cm7, Fm9, Bb7", key: "Eb Major", bpm: 75 },
    { pairing: "Robert Glasper × Terrace Martin", prompt: "Blend jazz piano and jazz-funk into a modern hip-hop context", chords: "Abmaj9, Fm11, Bbm9, Eb7#11", key: "Ab Major", bpm: 82 },
  ];
  const idx = new Date().getDate() % challenges.length;
  res.json({ date: today, ...challenges[idx], submissions: Math.floor(Math.random() * 200) + 50 });
});

// Credit history
router.get("/collab/credits", async (_req, res): Promise<void> => {
  res.json([
    {
      id: "cr1",
      trackName: "The Congregation (Remix)",
      collaborators: [
        { name: "You", role: "Producer", split: 50 },
        { name: "ConductorBeats", role: "Co-Producer", split: 35 },
        { name: "GospelKeys", role: "Keys", split: 15 },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "cr2",
      trackName: "Mediterranean Dust Collab",
      collaborators: [
        { name: "You", role: "Beat Maker", split: 60 },
        { name: "SoulSampler99", role: "Sample Selection", split: 40 },
      ],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
});

export default router;
