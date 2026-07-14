import { pgTable, text, integer, decimal, boolean, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";

export const savedBeatsTable = pgTable("saved_beats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  key: text("key").notNull(),
  bpm: integer("bpm").notNull(),
  mood: text("mood").notNull(),
  chordProgression: text("chord_progression").notNull(),
  producer: text("producer"),
  genre: text("genre"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collabRoomsTable = pgTable("collab_rooms", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // public, private, invite
  password: text("password"),
  isLive: boolean("is_live").default(true),
  participants: integer("participants").default(0),
  roles: jsonb("roles").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const battlesTable = pgTable("battles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  chords: text("chords").notNull(),
  challenger: text("challenger").notNull(),
  opponent: text("opponent"),
  status: text("status").notNull().default("open"), // open, active, voting, complete
  timeRemaining: integer("time_remaining"),
  votesA: integer("votes_a").default(0),
  votesB: integer("votes_b").default(0),
  winner: text("winner"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const microGigsTable = pgTable("micro_gigs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: text("seller_id").notNull(),
  sellerName: text("seller_name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  pricePerQuarterHour: decimal("price_per_quarter_hour", { precision: 10, scale: 2 }).notNull(),
  pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  reviewCount: integer("review_count").default(0),
  isAvailable: boolean("is_available").default(true),
  skills: jsonb("skills").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfilesTable = pgTable("user_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  daw: text("daw").notNull().default("garageband_ios"),
  tier: text("tier").notNull().default("free"), // free, pro, studio
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  skills: jsonb("skills").default({}),
  badges: jsonb("badges").default([]),
  beatsCreated: integer("beats_created").default(0),
  collabsCompleted: integer("collabs_completed").default(0),
  battlesWon: integer("battles_won").default(0),
  isAvailableForGigs: boolean("is_available_for_gigs").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedBeatSchema = createInsertSchema(savedBeatsTable).omit({ id: true, createdAt: true });
export const insertCollabRoomSchema = createInsertSchema(collabRoomsTable).omit({ id: true, createdAt: true });
export const insertBattleSchema = createInsertSchema(battlesTable).omit({ id: true, createdAt: true });
export const insertMicroGigSchema = createInsertSchema(microGigsTable).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfilesTable).omit({ id: true, createdAt: true });

export type InsertSavedBeat = z.infer<typeof insertSavedBeatSchema>;
export type SavedBeat = typeof savedBeatsTable.$inferSelect;
export type InsertCollabRoom = z.infer<typeof insertCollabRoomSchema>;
export type CollabRoom = typeof collabRoomsTable.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battlesTable.$inferSelect;
export type InsertMicroGig = z.infer<typeof insertMicroGigSchema>;
export type MicroGig = typeof microGigsTable.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfilesTable.$inferSelect;
