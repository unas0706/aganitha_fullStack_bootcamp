import express from "express";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`Request took ${Date.now() - start}ms`);
  });
  next();
});

app.use((req, res, next) => {
  req.requestId = Math.random().toString().substring(2, 10);
  next();
});

app.get("/test", (req, res) => {
  res.json({ requestId: req.requestId });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
