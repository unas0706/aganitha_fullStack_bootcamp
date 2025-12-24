import {
  calculateTaskStats,
  createTaskCollection,
  TaskCollection,
  TaskStats,
} from "./collection";
import { createTask } from "./operations";
import { PluginHooks } from "./plugins";
import { SortDirection, SortKey, TaskQuery } from "./query";
import { queryTasks } from "./queryEngine";
import { Task } from "./types";
import { generateId } from "./utils";
// import { generateId } from "./utils/id";
// src/TaskManager.ts
export class TaskManager {
  private tasks: Map<string, Task>;
  private hooks: PluginHooks[] = [];

  // private listeners: Set<TaskEventListener>;

  registerHooks(hooks: PluginHooks) {
    this.hooks.push(hooks);
  }

  private trigger(event: keyof PluginHooks, taskId: string) {
    this.hooks.forEach((h) => h[event]?.(taskId));
  }

  constructor(initialTasks?: Task[]) {
    this.tasks = new Map<string, Task>();
    if (initialTasks) {
      for (const task of initialTasks) {
        this.tasks.set(task.id, task);
      }
    }
  }

  add(task: Omit<Task, "id" | "createdAt">): Task {
    const newTask: Task = createTask(generateId(), task.title, task.priority);
    this.tasks.set(newTask.id, newTask);
    this.trigger("onAdd", newTask.id);
    return newTask;
  }
  update(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    const updatedTask: Task = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    this.trigger("onUpdate", id);
    return updatedTask;
  }
  delete(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    this.trigger("onDelete", id);
    return this.tasks.delete(id);
  }

  getall(): Task[] {
    return Array.from(this.tasks.values());
  }

  getStats(): TaskStats {
    return calculateTaskStats(this.export());
  }
  export(): TaskCollection {
    return createTaskCollection(this.getall());
  }

  query(
    query: TaskQuery,
    options?: {
      sortBy?: SortKey;
      direction?: SortDirection;
      page?: number;
      pageSize?: number;
    }
  ) {
    return queryTasks(this.getall(), query, options);
  }
}
