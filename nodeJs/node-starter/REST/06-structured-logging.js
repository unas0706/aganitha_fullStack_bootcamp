import express from "express";
import pino from "pino";
import crypto from "crypto";

const app = express();
app.use(express.json());

// ----------------------------------
// ENV-BASED LOGGER CONFIG
// ----------------------------------
const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  level: isProd ? "info" : "debug",
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true },
      },
});

// ----------------------------------
// IN-MEMORY STORE
// ----------------------------------
let tasks = [];
let nextId = 1;

// ----------------------------------
// REQUEST ID MIDDLEWARE
// ----------------------------------
app.use((req, res, next) => {
  req.id = Math.random().toString().substring(2, 10);
  res.setHeader("X-Request-Id", req.id);
  next();
});

// ----------------------------------
// REQUEST LOGGING MIDDLEWARE
// ----------------------------------
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
      },
      "request completed"
    );
  });

  next();
});

// ----------------------------------
// ROUTES WITH BUSINESS LOGGING
// ----------------------------------

/**
 * GET /tasks
 */
app.get("/tasks", (req, res) => {
  logger.debug({ requestId: req.id }, "fetching all tasks");

  res.status(200).json({ data: tasks });
});

/**
 * POST /tasks
 */
app.post("/tasks", (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);

  // BUSINESS EVENT LOG
  logger.info(
    {
      requestId: req.id,
      event: "TASK_CREATED",
      taskId: task.id,
      title: task.title,
    },
    "task created"
  );

  res.status(201).json({ data: task });
});

/**
 * PUT /tasks/:id
 */
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    logger.warn(
      {
        requestId: req.id,
        event: "TASK_NOT_FOUND",
        taskId: id,
      },
      "task not found"
    );

    return res.status(404).json({ error: "Task not found" });
  }

  task.title = req.body.title;
  task.completed = req.body.completed;

  logger.info(
    {
      requestId: req.id,
      event: "TASK_UPDATED",
      taskId: id,
    },
    "task updated"
  );

  res.status(200).json({ data: task });
});

/**
 * DELETE /tasks/:id
 */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    logger.warn(
      {
        requestId: req.id,
        event: "TASK_NOT_FOUND",
        taskId: id,
      },
      "task not found"
    );

    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);

  logger.info(
    {
      requestId: req.id,
      event: "TASK_DELETED",
      taskId: id,
    },
    "task deleted"
  );

  res.status(204).end();
});

app.use((err, req, res, next) => {
  logger.error(
    {
      requestId: req.id,
      err,
    },
    "unhandled error"
  );

  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
  logger.info("Running on port 3000");
});
