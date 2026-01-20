import express from "express";
import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://admin:unas@localhost:5432/taskapp_dev",

  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  allowExitOnIdle: false,
});

async function connectWithRetry(retries = 5, delay = 2000): Promise<void> {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      client.release();
      console.log("✅ Database ready");
      return;
    } catch (err) {
      retries--;
      console.error(`DB not ready, retries left: ${retries}`);
      if (!retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function checkDbHealth() {
  try {
    await pool.query("SELECT 1");
    return { status: "ok", db: "up" };
  } catch {
    return { status: "degraded", db: "down" };
  }
}

const app = express();
app.use(express.json());

app.get("/health", async (_req: express.Request, res: express.Response) => {
  const health = await checkDbHealth();
  res.status(health.db === "up" ? 200 : 503).json(health);
});

async function shutdown() {
  console.log("Shutting down...");
  await pool.end();
  console.log("💤 Database connections closed");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function start() {
  try {
    const pool = new pg.Pool({
      connectionString:
        process.env.DATABASE_URL ||
        "postgresql://admin:admin123@localhost:5432/mydb",

      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      allowExitOnIdle: false,
    });

    async function connectWithRetry(retries = 5, delay = 2000): Promise<void> {
      while (retries > 0) {
        try {
          const client = await pool.connect();
          client.release();
          console.log("Database ready");
          return;
        } catch (err) {
          retries--;
          console.error(` DB not ready, retries left: ${retries}`);
          if (!retries) throw err;
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    async function checkDbHealth() {
      try {
        await pool.query("SELECT 1");
        return { status: "ok", db: "up" };
      } catch {
        return { status: "degraded", db: "down" };
      }
    }

    const app = express();
    app.use(express.json());

    app.get("/health", async (_req, res) => {
      const health = await checkDbHealth();
      res.status(health.db === "up" ? 200 : 503).json(health);
    });

    async function shutdown() {
      console.log(" Shutting down...");
      await pool.end();
      console.log("Database connections closed");
      process.exit(0);
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    async function start() {
      try {
        await connectWithRetry();
        app.listen(3000, () => console.log("Server running on port 3000"));
      } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
      }
    }

    start();

    await connectWithRetry();
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
