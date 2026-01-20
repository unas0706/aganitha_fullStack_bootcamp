import Database from "better-sqlite3";

const db = new Database("app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

function createUser(email, passwordHash, role) {
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, role)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(email, passwordHash, role);

  return {
    id: result.lastInsertRowid,
    email,
    role,
  };
}

function getUserByEmail(email) {
  const stmt = db.prepare(`
    SELECT id, email, password_hash, role
    FROM users
    WHERE email = ?
  `);

  return stmt.get(email);
}

function closeDb() {
  console.log("Closing database...");
  db.close();
}

process.on("exit", closeDb);
process.on("SIGINT", () => {
  closeDb();
  process.exit(0);
});
process.on("SIGTERM", () => {
  closeDb();
  process.exit(0);
});

const user = createUser("admin1@example.com", "hashed_password_here", "admin");

console.log("User created:", user);

const fetched = getUserByEmail("admin@example.com");
console.log("Fetched user:", fetched);
