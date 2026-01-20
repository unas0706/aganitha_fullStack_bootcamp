import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  completed: z.boolean().optional(),
});

const tasksQuerySchema = z.object({
  completed: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten(),
      });
    }

    req[property] = result.data;
    next();
  };
};

app.get("/tasks", validate(tasksQuerySchema, "query"), (req, res) => {
  let result = tasks;

  if (req.query.completed !== undefined) {
    result = result.filter((task) => task.completed === req.query.completed);
  }

  res.status(200).json({
    data: result,
    meta: { count: result.length },
  });
});

app.post("/tasks", validate(createTaskSchema), (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    completed: req.body.completed ?? false,
    createdAt: new Date(),
  };

  tasks.push(task);

  res.status(201).json({ data: task });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
