import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const db = new Database("app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function createUser(email, passwordHash, role) {
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, role)
    VALUES (?, ?, ?)
  `);

  return stmt.run(email, passwordHash, role);
}

function getUserByEmail(email) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE email = ?
  `);

  return stmt.get(email);
}

async function runTest() {
  const email = "test@example.com";
  const password = "secret123";

  console.log("Hashing password...");
  const hash = await hashPassword(password);

  console.log("Creating user...");
  createUser(email, hash, "user");

  const user = getUserByEmail(email);

  console.log("Correct password check:");
  console.log(await comparePassword("secret123", user.password_hash));

  console.log("Wrong password check:");
  console.log(await comparePassword("wrongpassword", user.password_hash));
}

runTest();

process.on("exit", () => db.close());
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
