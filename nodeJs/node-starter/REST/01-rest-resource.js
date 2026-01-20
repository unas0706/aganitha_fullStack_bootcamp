import express from "express";

const app = express();
app.use(express.json());

app.get("/tasks", (req, res) => {
  res.status(200).json({
    data: [],
    meta: {
      count: 0,
    },
  });
});

app.post("/tasks", (req, res) => {
  res.status(201).json({
    data: {
      id: 1,
      title: req.body.title,
      completed: false,
      createdAt: new Date(),
    },
  });
});

app.get("/tasks/:id", (req, res) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      title: "Learn REST",
      completed: false,
      createdAt: new Date(),
    },
  });
});

app.put("/tasks/:id", (req, res) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      title: req.body.title,
      completed: req.body.completed,
    },
  });
});

app.delete("/tasks/:id", (req, res) => {
  res.status(204).end();
});

app.get("/users/:id/tasks", (req, res) => {
  res.status(200).json({
    userId: req.params.id,
    data: [],
    meta: {
      count: 0,
    },
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
