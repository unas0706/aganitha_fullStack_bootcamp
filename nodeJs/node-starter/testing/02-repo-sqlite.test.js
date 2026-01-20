import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";

/* --------------------------------
   Database Setup (In-Memory)
--------------------------------- */
let db;

/*
  beforeEach runs BEFORE EVERY TEST
  This ensures a clean database state
*/
beforeEach(() => {
  db = new Database(":memory:");

  // Migration (schema setup)
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );
  `);
});

function createUser({ email, name }) {
  const stmt = db.prepare(`
    INSERT INTO users (email, name)
    VALUES (?, ?)
  `);

  const result = stmt.run(email, name);

  return {
    id: result.lastInsertRowid,
    email,
    name,
  };
}

/*
  Fetch user by email
*/
function getUserByEmail(email) {
  const stmt = db.prepare(`
    SELECT id, email, name
    FROM users
    WHERE email = ?
  `);

  return stmt.get(email);
}

/* --------------------------------
   Integration Tests
--------------------------------- */

describe("Repo + DB Integration (SQLite)", () => {
  it("creates a user", () => {
    const user = createUser({
      email: "test@example.com",
      name: "Test User",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@example.com");
  });

  it("gets user by email", () => {
    createUser({
      email: "a@b.com",
      name: "Alice",
    });

    const user = getUserByEmail("a@b.com");

    expect(user).toEqual({
      id: 1,
      email: "a@b.com",
      name: "Alice",
    });
  });

  it("throws error on duplicate email", () => {
    createUser({
      email: "dup@test.com",
      name: "First",
    });

    expect(() => {
      createUser({
        email: "dup@test.com",
        name: "Second",
      });
    }).toThrow(/UNIQUE constraint failed/);
  });
});
