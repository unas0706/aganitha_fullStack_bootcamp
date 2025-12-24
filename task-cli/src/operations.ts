import { Priority, Task } from "./types";

export function createTask(
  id: string,
  title: string,
  priority: Priority = "medium"
): Task {
  return {
    id,
    title,
    completed: false,
    priority,
    createdAt: new Date(),
  };
}

export function markCompleted(task: Task): Task {
  return { ...task, completed: true };
}
export function filterByStatus(tasks: Task[], status: boolean): Task[] {
  return tasks.filter((task) => task.completed === status);
}
export function sortByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Priority[] = ["high", "medium", "low"];
  return tasks.sort(
    (a, b) =>
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );
}
