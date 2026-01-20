import express from "express";
import Database from "better-sqlite3";

const app = express();
app.use(express.json());

const db = new Database("queue.db");

db.exec(`
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  idempotencyKey TEXT UNIQUE,
  status TEXT,
  attempts INTEGER,
  nextRunAt INTEGER
);

CREATE TABLE IF NOT EXISTS job_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jobId INTEGER,
  status TEXT,
  message TEXT,
  timestamp TEXT
);
`);

function log(jobId, status, message = "") {
  db.prepare(
    `
    INSERT INTO job_logs (jobId, status, message, timestamp)
    VALUES (?, ?, ?, datetime('now'))
  `
  ).run(jobId, status, message);
}

function backoff(attempts) {
  return 1000 * 2 ** attempts;
}

app.post("/email", (req, res) => {
  const { email, idempotencyKey } = req.body;

  const existing = db
    .prepare(
      `
    SELECT * FROM jobs WHERE idempotencyKey = ?
  `
    )
    .get(idempotencyKey);

  if (existing) {
    return res.json({ message: "Duplicate prevented", job: existing });
  }

  const result = db
    .prepare(
      `
    INSERT INTO jobs (email, idempotencyKey, status, attempts, nextRunAt)
    VALUES (?, ?, 'PENDING', 0, ?)
  `
    )
    .run(email, idempotencyKey, Date.now());

  log(result.lastInsertRowid, "CREATED");

  res.json({ message: "Job queued", jobId: result.lastInsertRowid });
});

async function worker() {
  const job = db
    .prepare(
      `
    SELECT * FROM jobs
    WHERE (status = 'PENDING' OR status = 'FAILED')
      AND nextRunAt <= ?
    ORDER BY id
    LIMIT 1
  `
    )
    .get(Date.now());

  if (!job) return;

  db.prepare(`UPDATE jobs SET status = 'PROCESSING' WHERE id = ?`).run(job.id);
  log(job.id, "PROCESSING");

  try {
    await fakeSendEmail(job.email);

    db.prepare(`UPDATE jobs SET status = 'COMPLETED' WHERE id = ?`).run(job.id);
    log(job.id, "COMPLETED");
  } catch (err) {
    const attempts = job.attempts + 1;

    if (attempts > 5) {
      db.prepare(
        `
        UPDATE jobs SET status = 'DEAD', attempts = ?
        WHERE id = ?
      `
      ).run(attempts, job.id);

      log(job.id, "DEAD", err.message);
    } else {
      const delay = backoff(attempts);

      db.prepare(
        `
        UPDATE jobs
        SET status = 'FAILED',
            attempts = ?,
            nextRunAt = ?
        WHERE id = ?
      `
      ).run(attempts, Date.now() + delay, job.id);

      log(job.id, "FAILED", `Retry in ${delay}ms`);
    }
  }
}

function fakeSendEmail(email) {
  return new Promise((resolve, reject) => {
    if (Math.random() < 0.4) return reject(new Error("SMTP failure"));
    setTimeout(resolve, 500);
  });
}

setInterval(worker, 1000);

app.listen(3000, () => console.log("Queue running on 3000"));
