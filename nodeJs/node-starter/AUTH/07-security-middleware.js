import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

// Public route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/login", loginLimiter, (req, res) => {
  res.json({ message: "Login attempt accepted" });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
