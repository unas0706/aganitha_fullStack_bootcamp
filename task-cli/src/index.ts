import {
  calculateTaskStats,
  createTaskCollection,
  TaskCollection,
} from "./collection";
import {
  createTask,
  filterByStatus,
  markCompleted,
  sortByPriority,
} from "./operations";
import reportingPlugin from "./plugins/reporting";
import { FileStorage } from "./storage";
import { TaskSyncManager } from "./sync";
import { TaskManager } from "./TaskManager";
import { Task } from "./types";
import { generateId, groupBy } from "./utils";

// import { generateId } from "./utils.ts";

let task1: Task = createTask(generateId(), "Sample Task", "high");
let task2: Task = createTask(generateId(), "Another Task", "low");
let task3: Task = createTask(generateId(), "Third Task", "medium");

// task1 = markCompleted(task1);

// console.log(filterByStatus([task1, task2, task3], true));

// console.log(sortByPriority([task1, task2, task3]));

// console.log(createTaskCollection([task1, task2, task3]));

// const collection = createTaskCollection([task1, task2, task3]);
// console.log(calculateTaskStats(collection));

const manager = new TaskManager([task1, task2, task3]);
manager.registerHooks(reportingPlugin.hooks ?? {});

// manager.add({ title: "Fourth Task", priority: "medium", completed: false });
// manager.update(task2.id, { priority: "high" });
// manager.delete(task3.id);

// console.log(manager.export());

// console.log(manager.getStats());

// const storage = new FileStorage("data");

// async function demoStorage() {
//   await storage.save("tasks", manager.export());
//   const loaded = await storage.load("tasks");
//   const list = await storage.list();
//   console.log("Stored files:", list);
//   console.log("Loaded from file:", loaded);

//   const grouped = groupBy(manager.getall(), "priority");
//   console.log("Grouped by priority:", grouped);
// }

// demoStorage();

// const result = manager.query(
//   { completed: false },
//   { sortBy: "priority", direction: "asc" }
// );

// console.log(result);
//

const storage = new FileStorage<TaskCollection>("./data");

const sync = new TaskSyncManager(storage, "tasks");

async function sychronization() {
  const saved = await sync.load();

  if (saved) {
    saved.tasks.forEach((t) => manager.add(t));
  }

  manager.add({ title: "Fifth Task", priority: "medium", completed: true });

  await sync.save(manager.export());
  console.log("Final tasks:", manager.export());
}

sychronization();

// Register plugin hooks

// const manager = new TaskManager();
// const task = manager.add({
//   title: "Test Task",
//   completed: false,
//   priority: "medium",
// });

// // Test updating a task
// manager.update(task.id, { completed: true });

// // Test deleting a task
// manager.delete(task.id);
