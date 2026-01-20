import express from "express";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

/* ---------------- CONFIG ---------------- */
const JWT_SECRET = "super-secret-key";
const JWT_EXPIRES_IN = "15m";
const SALT_ROUNDS = 10;

/* ---------------- DB ---------------- */
const db = new Database("app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

/* ---------------- REGISTER ---------------- */
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    db.prepare(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`
    ).run(email, hash, "user");

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({
    accessToken: token,
    expiresIn: JWT_EXPIRES_IN,
  });
});

function authenticate(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = auth.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/me", authenticate, (req, res) => {
  res.json({
    message: "JWT is valid",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
