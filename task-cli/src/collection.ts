import { Priority, Task } from "./types";

// src/collection.ts
export interface TaskCollection {
  tasks: Task[];
  metadata: {
    total: number;
    completed: number;
    lastModified: Date;
  };
}

export interface TaskStats {
  byPriority: Record<Priority, number>;
  byStatus: Record<"Completed" | "Pending", number>;
  averageAge: number;
}

export function createTaskCollection(tasks: Task[]): TaskCollection {
  return {
    tasks,
    metadata: {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      lastModified: new Date(),
    },
  };
}

export function calculateTaskStats(collection: TaskCollection): TaskStats {
  let tasks: Task[] = collection.tasks;
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  const byStatus: Record<"Completed" | "Pending", number> = {
    Completed: 0,
    Pending: 0,
  };
  let totalAge = 0;
  const now = new Date();

  for (const task of tasks) {
    byPriority[task.priority]++;
    byStatus[task.completed ? "Completed" : "Pending"]++;
    totalAge += now.getTime() - task.createdAt.getTime();
  }
  const averageAge = tasks.length ? totalAge / tasks.length : 0;
  return {
    byPriority,
    byStatus,
    averageAge,
  };
}
