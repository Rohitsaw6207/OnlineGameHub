import { users, gameScores, type User, type InsertUser, type GameScore, type InsertGameScore } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Game score operations
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getUserGameScores(userId: number): Promise<GameScore[]>;
  getGameHighScores(gameType: string, limit?: number): Promise<GameScore[]>;
  getUserGameScoresByType(userId: number, gameType: string): Promise<GameScore[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameScores: Map<number, GameScore>;
  private currentUserId: number;
  private currentScoreId: number;

  constructor() {
    this.users = new Map();
    this.gameScores = new Map();
    this.currentUserId = 1;
    this.currentScoreId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }

    const updatedUser: User = {
      ...existingUser,
      ...updates,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deleted = this.users.delete(id);
    
    // Also delete user's game scores
    if (deleted) {
      for (const [scoreId, score] of this.gameScores.entries()) {
        if (score.userId === id) {
          this.gameScores.delete(scoreId);
        }
      }
    }
    
    return deleted;
  }

  // Game score operations
  async createGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentScoreId++;
    const score: GameScore = {
      ...insertScore,
      id,
      createdAt: new Date()
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getUserGameScores(userId: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(score => score.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getGameHighScores(gameType: string, limit: number = 10): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(score => score.gameType === gameType)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getUserGameScoresByType(userId: number, gameType: string): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(score => score.userId === userId && score.gameType === gameType)
      .sort((a, b) => b.score - a.score);
  }
}

export const storage = new MemStorage();
