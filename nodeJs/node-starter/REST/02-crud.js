import express from "express";

const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/tasks", (req, res) => {
  res.status(200).json({
    data: tasks,
    meta: {
      count: tasks.length,
    },
  });
});

app.post("/tasks", (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);

  res.status(201).json({
    data: task,
  });
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.status(200).json({
    data: task,
  });
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const updatedTask = {
    id,
    title: req.body.title,
    completed: req.body.completed,
    updatedAt: new Date(),
  };

  tasks[taskIndex] = updatedTask;

  res.status(200).json({
    data: updatedTask,
  });
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(204).end();
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
