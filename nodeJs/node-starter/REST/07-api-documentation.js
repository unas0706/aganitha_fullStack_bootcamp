import express from "express";

const app = express();
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn OpenAPI",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];
let nextId = 2;

app.get("/tasks", (req, res) => {
  res.status(200).json({ data: tasks });
});

app.post("/tasks", (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json({ data: task });
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(200).json({ data: task });
});

const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Tasks API",
    version: "1.0.0",
    description: "Simple Tasks API with CRUD operations",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  paths: {
    "/tasks": {
      get: {
        summary: "List all tasks",
        responses: {
          200: {
            description: "List of tasks",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskListResponse",
                },
                example: {
                  data: [
                    {
                      id: 1,
                      title: "Learn OpenAPI",
                      completed: false,
                      createdAt: "2024-01-01T10:00:00Z",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTaskRequest",
              },
              example: {
                title: "Build REST API",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Task created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskResponse",
                },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        summary: "Get task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Single task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskResponse",
                },
              },
            },
          },
          404: {
            description: "Task not found",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          completed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      TaskResponse: {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/Task" },
        },
      },
      TaskListResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Task" },
          },
        },
      },
      CreateTaskRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: {
            type: "string",
            example: "Learn Express",
          },
        },
      },
    },
  },
};

app.get("/docs/openapi.json", (req, res) => {
  res.json(openapiSpec);
});

app.listen(3000, () => {
  console.log("Documentation running on port 3000");
  console.log("OpenAPI spec at http://localhost:3000/docs/openapi.json");
});
