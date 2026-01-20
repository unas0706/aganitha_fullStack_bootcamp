import express from "express";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

const db = new Database("app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    const passwordHash = await hashPassword(password);

    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, role)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(email, passwordHash, "user");

    res.status(201).json({
      id: result.lastInsertRowid,
      email,
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const stmt = db.prepare(`
    SELECT * FROM users WHERE email = ?
  `);

  const user = stmt.get(email);

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const valid = await comparePassword(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

process.on("SIGINT", () => {
  console.log("Closing database...");
  db.close();
  process.exit(0);
});
