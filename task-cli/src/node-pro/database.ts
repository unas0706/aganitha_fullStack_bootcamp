// src/database.ts
import { Pool } from "pg";
import { User } from "./models/user";

export class UserDatabase {
  constructor(private pool: Pool) {}

  /* =========================
     Initialize table
  ========================== */
  async init(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }

  /* =========================
     Create user
  ========================== */
  async createUser(
    email: string,
    passwordHash: string,
    role: "user" | "admin"
  ): Promise<User> {
    const createdAt = new Date().toISOString();

    const result = await this.pool.query<User>(
      `
      INSERT INTO users (email, password_hash, role, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [email, passwordHash, role, createdAt]
    );

    return result.rows[0];
  }

  /* =========================
     Queries
  ========================== */
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] ?? null;
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await this.pool.query<User>(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }
}
