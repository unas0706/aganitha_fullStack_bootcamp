import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

let tasks = [{ id: 1, title: "Learn Error Handling", completed: false }];

const problem = ({
  status,
  title,
  detail,
  type = "about:blank",
  instance,
}) => ({
  type,
  title,
  status,
  detail,
  instance,
});

class ApiError extends Error {
  constructor(status, title, detail) {
    super(detail);
    this.status = status;
    this.title = title;
  }
}

const createTaskSchema = z.object({
  title: z.string().min(3),
  completed: z.boolean().optional(),
});

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(
      new ApiError(
        400,
        "Validation Error",
        JSON.stringify(result.error.flatten())
      )
    );
  }

  req.body = result.data;
  next();
};

app.post("/tasks", validateBody(createTaskSchema), (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: req.body.completed ?? false,
  };

  tasks.push(task);

  res.status(201).json({ data: task });
});

app.get("/tasks/:id", (req, res, next) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return next(new ApiError(404, "Not Found", "Task does not exist"));
  }

  res.status(200).json({ data: task });
});

app.get("/crash", () => {
  throw new Error("Unexpected failure");
});

app.use((err, req, res, next) => {
  console.error(err);

  // Known API error
  if (err instanceof ApiError) {
    return res.status(err.status).json(
      problem({
        status: err.status,
        title: err.title,
        detail: err.message,
        instance: req.originalUrl,
      })
    );
  }

  // Unknown / unhandled error
  res.status(500).json(
    problem({
      status: 500,
      title: "Internal Server Error",
      detail: "An unexpected error occurred",
      instance: req.originalUrl,
    })
  );
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
