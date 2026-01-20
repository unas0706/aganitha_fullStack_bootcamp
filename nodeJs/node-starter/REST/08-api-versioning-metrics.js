import express from "express";

const app = express();
app.use(express.json());

let tasksV1 = [{ id: 1, title: "Learn API Versioning", completed: false }];
let nextIdV1 = 2;

const metrics = {
  totalRequests: 0,
  routes: {},
};

app.use((req, res, next) => {
  const start = Date.now();
  metrics.totalRequests++;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const key = `${req.method} ${req.route?.path || req.path}`;

    if (!metrics.routes[key]) {
      metrics.routes[key] = {
        count: 0,
        success: 0,
        error: 0,
        totalDuration: 0,
      };
    }

    const routeMetric = metrics.routes[key];
    routeMetric.count++;
    routeMetric.totalDuration += duration;

    if (res.statusCode >= 200 && res.statusCode < 400) {
      routeMetric.success++;
    } else {
      routeMetric.error++;
    }
  });

  next();
});

const v1Router = express.Router();

v1Router.get("/tasks", (req, res) => {
  res.status(200).json({ data: tasksV1 });
});

v1Router.post("/tasks", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = {
    id: nextIdV1++,
    title: req.body.title,
    completed: false,
  };

  tasksV1.push(task);
  res.status(201).json({ data: task });
});

v1Router.get("/tasks/:id", (req, res) => {
  const task = tasksV1.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(200).json({ data: task });
});

const v2Router = express.Router();

v2Router.get("/tasks", (req, res) => {
  res.status(501).json({
    message: "v2 not implemented yet",
  });
});

app.use("/v1", v1Router);
app.use("/v2", v2Router);

app.get("/metrics", (req, res) => {
  const formattedRoutes = {};

  for (const [route, data] of Object.entries(metrics.routes)) {
    formattedRoutes[route] = {
      requests: data.count,
      success: data.success,
      errors: data.error,
      avgResponseTimeMs:
        data.count === 0 ? 0 : Math.round(data.totalDuration / data.count),
    };
  }

  res.status(200).json({
    totalRequests: metrics.totalRequests,
    routes: formattedRoutes,
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
  console.log("Metrics available at http://localhost:3000/metrics");
});
