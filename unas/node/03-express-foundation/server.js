import express from "express";
import path from "path";
import process from "process";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${
        res.statusCode
      } - ${duration}ms`
    );
  });

  next();
});

const publicDir = path.join(process.cwd(), "public");
app.use("/", express.static(publicDir));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/info", (req, res) => {
  res.json({
    name: "noteserver",
    version: "1.0.0",
    uptimeSeconds: process.uptime(),
  });
});

app.post("/api/echo", (req, res) => {
  res.json({ received: req.body });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  process.exit(0);
});
