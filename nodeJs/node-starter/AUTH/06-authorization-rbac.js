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
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        error: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}

const app = express();
app.use(express.json());

/* Fake login (user or admin) */
app.post("/login", (req, res) => {
  const { role = "user" } = req.body;

  const user = {
    id: role === "admin" ? 99 : 1,
    email: `${role}@example.com`,
    role,
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

/* User-only route */
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user,
  });
});

/* Admin-only route */
app.get("/admin", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({
    message: "Admin dashboard",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
