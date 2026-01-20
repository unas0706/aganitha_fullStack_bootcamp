import express from "express";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://admin:unas@localhost:5432/taskapp_dev",
});

abstract class BaseRepository<T> {
  constructor(protected table: string, protected pool: Pool) {}

  async findAll(): Promise<T[]> {
    const { rows } = await this.pool.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async findById(id: number): Promise<T | null> {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return rows[0] ?? null;
  }

  async delete(id: number): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  }
}

interface User {
  id: number;
  email: string;
}

class UserRepository extends BaseRepository<User> {
  constructor(pool: Pool) {
    super("users", pool);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0] ?? null;
  }
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
}

class TaskRepository extends BaseRepository<Task> {
  constructor(pool: Pool) {
    super("tasks", pool);
  }

  async findByUser(userId: number): Promise<Task[]> {
    const { rows } = await this.pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [userId]
    );
    return rows;
  }

  async markComplete(taskId: number): Promise<void> {
    await this.pool.query("UPDATE tasks SET completed = true WHERE id = $1", [
      taskId,
    ]);
  }
}

function createApp(users: UserRepository, tasks: TaskRepository) {
  const app = express();
  app.use(express.json());

  app.get("/users/:id", async (req, res) => {
    const user = await users.findById(Number(req.params.id));
    res.json(user);
  });

  app.get("/users/:id/tasks", async (req, res) => {
    const list = await tasks.findByUser(Number(req.params.id));
    res.json(list);
  });

  app.post("/tasks/:id/complete", async (req, res) => {
    await tasks.markComplete(Number(req.params.id));
    res.json({ status: "done" });
  });

  return app;
}

const userRepo = new UserRepository(pool);
const taskRepo = new TaskRepository(pool);

const app = createApp(userRepo, taskRepo);
app.listen(3000, () => console.log(" Server running on port 3000"));

// const mockUsers = {
//   findById: async () => ({ id: 1, email: "mock@mail.com" }),
// };

// const mockTasks = {
//   findByUser: async () => [],
//   markComplete: async () => {},
// };

// const testApp = createApp(mockUsers as any, mockTasks as any);
