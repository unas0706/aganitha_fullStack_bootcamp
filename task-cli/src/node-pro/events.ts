// src/events.ts
import { EventEmitter } from "events";
import { logger } from "./logger";

export class TaskEventEmitter extends EventEmitter {
  emitTaskCreated(task: any): void {
    logger.info({ taskId: task.id }, "Task created");
    this.emit("task:created", task);
  }

  emitTaskUpdated(task: any): void {
    logger.info({ taskId: task.id }, "Task updated");
    this.emit("task:updated", task);
  }

  emitTaskDeleted(id: string): void {
    logger.info({ taskId: id }, "Task deleted");
    this.emit("task:deleted", id);
  }
}
