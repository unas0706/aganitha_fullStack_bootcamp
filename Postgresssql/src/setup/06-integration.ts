import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: "C:/projects/aganitha/Postgresssql/.env",
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface User {
  id: number;
  email: string;
  created_at: Date;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
}

async function connectDB() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}

async function shutdownDB() {
  console.log("Closing database pool...");
  await pool.end();
}

async function getUser(id: number): Promise<User | null> {
  const res = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0] ?? null;
}

async function createTask(userId: number, title: string): Promise<Task> {
  const res = await pool.query<Task>(
    `INSERT INTO tasks (title, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [title, userId]
  );
  return res.rows[0];
}

async function getUserTasks(userId: number): Promise<Task[]> {
  const res = await pool.query<Task>("SELECT * FROM tasks WHERE user_id = $1", [
    userId,
  ]);
  return res.rows;
}

async function main() {
  await connectDB();

  const user = await getUser(1);
  if (!user) {
    console.log("User not found");
    return;
  }

  const task = await createTask(user.id, "Build serious backend");
  console.log("Task:", task);

  const tasks = await getUserTasks(user.id);
  console.log("User tasks:", tasks);
}

main();

process.on("SIGINT", async () => {
  console.log("\nSIGINT received");
  await shutdownDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nSIGTERM received");
  await shutdownDB();
  process.exit(0);
});
