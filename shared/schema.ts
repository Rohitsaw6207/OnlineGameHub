import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  avatar: integer("avatar").default(1),
  firebaseUid: text("firebase_uid").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameType: text("game_type").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type GameScore = typeof gameScores.$inferSelect;
