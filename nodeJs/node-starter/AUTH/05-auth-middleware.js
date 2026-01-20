import express from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

const app = express();
app.use(express.json());

app.get("/public", (req, res) => {
  res.json({ message: "This is public" });
});

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    email: "user@example.com",
    role: "user",
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected profile",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

export default app;
