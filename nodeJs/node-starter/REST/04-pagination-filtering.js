import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn JS",
    completed: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    title: "Learn Express",
    completed: false,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: 3,
    title: "Learn Zod",
    completed: true,
    createdAt: new Date("2024-01-03"),
  },
  {
    id: 4,
    title: "Build API",
    completed: false,
    createdAt: new Date("2024-01-04"),
  },
];

const tasksQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => Math.max(1, Number(val) || 1)),

  limit: z
    .string()
    .optional()
    .transform((val) => Math.min(50, Math.max(1, Number(val) || 10))),

  completed: z
    .string()
    .optional()
    .transform((val) => val === "true"),

  sort: z.enum(["createdAt", "title"]).optional().default("createdAt"),

  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: result.error.flatten(),
    });
  }

  req.query = result.data;
  next();
};

app.get("/tasks", validateQuery(tasksQuerySchema), (req, res) => {
  let result = [...tasks];

  if (req.query.completed !== undefined) {
    result = result.filter((task) => task.completed === req.query.completed);
  }

  const { sort, order } = req.query;

  result.sort((a, b) => {
    if (a[sort] < b[sort]) return order === "asc" ? -1 : 1;
    if (a[sort] > b[sort]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const { page, limit } = req.query;
  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  res.status(200).json({
    data: paginated,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
