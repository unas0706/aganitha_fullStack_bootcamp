import express from "express";
import request from "supertest";
import Database from "better-sqlite3";
import { describe, it, expect, beforeEach } from "vitest";

let db;
let app;

beforeEach(() => {
  db = new Database(":memory:");

  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );
  `);

  const seed = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)");
  seed.run("seed1@test.com", "Seed One");
  seed.run("seed2@test.com", "Seed Two");
  seed.run("seed3@test.com", "Seed Three");

  app = express();
  app.use(express.json());

  app.post("/users", (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO users (email, name)
        VALUES (?, ?)
      `);
      const result = stmt.run(email, name);

      res.status(201).json({
        id: result.lastInsertRowid,
        email,
        name,
      });
    } catch (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Email already exists" });
      }
      throw err;
    }
  });

  app.get("/users/:id", (req, res) => {
    const user = db
      .prepare("SELECT id, email, name FROM users WHERE id = ?")
      .get(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  });

  app.get("/users", (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 2);
    const offset = (page - 1) * limit;

    const users = db
      .prepare(
        `
      SELECT id, email, name
      FROM users
      ORDER BY id
      LIMIT ? OFFSET ?
    `
      )
      .all(limit, offset);

    res.json(users);
  });
});

describe("API + DB Integration", () => {
  it("POST /users → 201 + created user", async () => {
    const res = await request(app).post("/users").send({
      email: "new@test.com",
      name: "New User",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.com");
    expect(res.body.id).toBeDefined();
  });

  it("GET /users/:id → returns seeded user", async () => {
    const res = await request(app).get("/users/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      email: "seed1@test.com",
      name: "Seed One",
    });
  });

  it("GET /users/:id → 404 if missing", async () => {
    const res = await request(app).get("/users/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  it("GET /users with pagination", async () => {
    const res = await request(app).get("/users").query({ page: 2, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].email).toBe("seed3@test.com");
  });
});
