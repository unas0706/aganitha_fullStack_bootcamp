import express from "express";
import crypto from "crypto";
import { z } from "zod";

const app = express();
const PORT = 3000;
const startTime = Date.now();

const tasks = new Map();

app.use(express.json());

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  const start = Date.now();

  res.on("finish", () => {
    console.log(
      JSON.stringify({
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        latencyMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      })
    );
  });

  next();
});

function problem(res, status, title, detail) {
  return res.status(status).type("application/problem+json").json({
    type: "about:blank",
    title,
    status,
    detail,
  });
}

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  status: z.enum(["open", "done"]).default("open"),
});

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(["open", "done"]).optional(),
  q: z.string().optional(),
  sortBy: z.enum(["createdAt", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/metrics", (req, res) => {
  res.json({
    uptimeSeconds: Math.floor(process.uptime()),
    taskCount: tasks.size,
  });
});

app.post("/api/tasks", (req, res) => {
  const parsed = TaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return problem(res, 400, "Validation Error", parsed.error.message);
  }

  const id = crypto.randomUUID();
  const task = {
    id,
    ...parsed.data,
    createdAt: Date.now(),
  };

  tasks.set(id, task);
  res.status(201).json(task);
});

app.get("/api/tasks", (req, res) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return problem(res, 400, "Invalid Query Parameters", parsed.error.message);
  }

  const { page, limit, status, q, sortBy, order } = parsed.data;

  let result = Array.from(tasks.values());

  if (status) result = result.filter((t) => t.status === status);
  if (q) result = result.filter((t) => t.title.includes(q));

  result.sort((a, b) => {
    if (order === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  const start = (page - 1) * limit;
  const paged = result.slice(start, start + limit);

  res.json({
    page,
    limit,
    total: result.length,
    data: paged,
  });
});

app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return problem(res, 404, "Not Found", "Task not found");
  }
  res.json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return problem(res, 404, "Not Found", "Task not found");
  }

  const parsed = TaskSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return problem(res, 400, "Validation Error", parsed.error.message);
  }

  const updated = { ...task, ...parsed.data };
  tasks.set(task.id, updated);
  res.json(updated);
});

app.delete("/api/tasks/:id", (req, res) => {
  if (!tasks.has(req.params.id)) {
    return problem(res, 404, "Not Found", "Task not found");
  }

  tasks.delete(req.params.id);
  res.status(204).end();
});

app.use((req, res) => {
  problem(res, 404, "Not Found", "Route does not exist");
});

const server = app.listen(PORT, () => {
  console.log(`Task Notes API running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down...");
  process.exit(0);
});
