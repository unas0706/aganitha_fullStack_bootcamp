import express from "express";
import "express-async-errors";

const app = express();
const PORT = 3000;

app.get("/sync-error", (req, res) => {
  throw new Error("Sync error");
});

app.get("/async-error", async (req, res) => {
  throw new Error("Async error");
});

app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: err.message,
    stack: isProd ? undefined : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
