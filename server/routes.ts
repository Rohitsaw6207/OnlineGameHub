import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameScoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/users/firebase/:uid", async (req, res) => {
    try {
      const firebaseUid = req.params.uid;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const updateData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update user" });
      }
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Game score routes
  app.post("/api/scores", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.createGameScore(scoreData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create score" });
      }
    }
  });

  app.get("/api/scores/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const scores = await storage.getUserGameScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user scores" });
    }
  });

  app.get("/api/scores/game/:gameType", async (req, res) => {
    try {
      const gameType = req.params.gameType;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const scores = await storage.getGameHighScores(gameType, limit);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game scores" });
    }
  });

  app.get("/api/scores/user/:userId/game/:gameType", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const gameType = req.params.gameType;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const scores = await storage.getUserGameScoresByType(userId, gameType);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user game scores" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
