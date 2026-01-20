// src/routes/tasks.ts
import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { FileStorage } from "../storage";
import { TaskEventEmitter } from "../events";
import { Task } from "../models/task";
import {
  createTaskSchema,
  updateTaskSchema,
  paginationSchema,
} from "./task.schemas";

export const taskRouter = Router();

const storage = new FileStorage("./data/tasks.json");
const events = new TaskEventEmitter();

/* =========================
   Helper: Load tasks
========================= */
async function loadTasks(): Promise<Task[]> {
  return storage.loadNotes();
}

/* =========================
   GET /api/tasks
   Pagination
========================= */
taskRouter.get("/", async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);

  const tasks = await loadTasks();
  const start = (page - 1) * limit;
  const paginated = tasks.slice(start, start + limit);

  res.json({
    data: paginated,
    meta: {
      page,
      limit,
      total: tasks.length,
    },
  });
});

/* =========================
   POST /api/tasks
========================= */
taskRouter.post("/", async (req: Request, res: Response) => {
  const input = createTaskSchema.parse(req.body);
  const tasks = await loadTasks();

  const now = new Date().toISOString();

  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    completed: false,
    priority: input.priority,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  await storage.saveNotes(tasks);
  events.emitTaskCreated(task);

  res.status(201).json(task);
});

/* =========================
   GET /api/tasks/:id
========================= */
taskRouter.get("/:id", async (req: Request, res: Response) => {
  const tasks = await loadTasks();
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: "Task not found",
    });
  }

  res.json(task);
});

/* =========================
   PUT /api/tasks/:id
========================= */
taskRouter.put("/:id", async (req: Request, res: Response) => {
  const input = updateTaskSchema.parse(req.body);
  const tasks = await loadTasks();

  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: "Task not found",
    });
  }

  const updated: Task = {
    ...tasks[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  await storage.saveNotes(tasks);
  events.emitTaskUpdated(updated);

  res.json(updated);
});

/* =========================
   DELETE /api/tasks/:id
========================= */
taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const tasks = await loadTasks();
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: "Task not found",
    });
  }

  const [removed] = tasks.splice(index, 1);
  await storage.saveNotes(tasks);
  events.emitTaskDeleted(removed.id);

  res.status(204).send();
});
