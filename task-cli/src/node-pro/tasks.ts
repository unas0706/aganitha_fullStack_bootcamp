// src/routes/tasks.ts
import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { TaskEventEmitter } from "./events";
import { logger } from "./logger";
import {
  createTaskSchema,
  paginationSchema,
  updateTaskSchema,
} from "./task.schemas";

import { TaskCollection } from "../collection";
import { FileStorage } from "../storage";
import { TaskSyncManager } from "../sync";
import { Task } from "../types";

export const taskRouter = Router();

const events = new TaskEventEmitter();

async function loadTasks(): Promise<TaskCollection | null> {
  return await sync.load();
  // return (tasks?.tasks ?? null) as Task[] | null;
}

const storage = new FileStorage<TaskCollection>(".././data");
const sync = new TaskSyncManager(storage, "tasks");

taskRouter.get("/:id", async (req: Request, res: Response) => {
  const tasks = await loadTasks();
  if (!tasks?.tasks) {
    return res.status(500).json({ error: "Failed to load tasks" });
  }
  const task = tasks?.tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: "Task not found",
    });
  }

  res.json(task);
});

taskRouter.get("/", async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);

  const tasks = await loadTasks();
  logger.info({ condditionn: tasks }, "Loaded tasks");
  if (!tasks) {
    return res.status(500).json({ error: "Failed to load tasks" });
  }
  const start = (page - 1) * limit;
  const paginated = tasks?.tasks.slice(start, start + limit);

  res.json({
    data: paginated,
    meta: {
      page,
      limit,
      total: tasks?.tasks.length,
    },
  });
});

taskRouter.post("/", async (req: Request, res: Response) => {
  const input = createTaskSchema.parse(req.body);
  const tasks = await loadTasks();
  if (!tasks) {
    return res.status(500).json({ error: "Failed to load tasks" });
  }

  const now = new Date();

  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    completed: false,
    priority: input.priority,
    createdAt: now,
    updatedAt: now,
  };

  tasks?.tasks.push(task);
  await sync.save(tasks);
  events.emitTaskCreated(task);

  res.status(201).json(task);
});

taskRouter.put("/:id", async (req: Request, res: Response) => {
  const input = updateTaskSchema.parse(req.body);
  const tasks = await loadTasks();
  if (!tasks?.tasks) {
    return res.status(500).json({ error: "Failed to load tasks" });
  }

  const index = tasks?.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: "Task not found",
    });
  }

  const updated: Task = {
    ...tasks?.tasks[index],
    ...input,
    updatedAt: new Date(),
  };

  tasks.tasks[index] = updated;
  await sync.save(tasks);
  events.emitTaskUpdated(updated);

  res.json(updated);
});

taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const tasks = await loadTasks();
  if (!tasks?.tasks) {
    return res.status(500).json({ error: "Failed to load tasks" });
  }
  const index = tasks?.tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: "Task not found",
    });
  }

  const [removed] = tasks?.tasks.splice(index, 1);
  await sync.save(tasks);
  events.emitTaskDeleted(removed.id);

  res.status(204).send();
});
