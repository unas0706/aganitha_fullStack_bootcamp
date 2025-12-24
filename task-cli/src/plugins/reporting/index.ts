import { TaskPlugin } from "../index";

const reportingPlugin: TaskPlugin = {
  name: "reporting",
  version: "1.0.0",

  commands: [
    {
      name: "report",
      description: "Show task summary",
      handler(manager) {
        const tasks = manager.export();
        console.log("📊 Task Report", tasks);
      },
    },
  ],
  hooks: {
    onAdd(taskId) {
      console.log(`A task was added: ${taskId}`);
    },
    onUpdate(taskId) {
      console.log(`A task was updated: ${taskId}`);
    },
    onDelete(taskId) {
      console.log(`A task was deleted: ${taskId}`);
    },
  },
};

export default reportingPlugin;
