import express from "express";

const app = express();
const PORT = 3000;

app.get("/users/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

app.get("/search", (req, res) => {
  res.json({ query: req.query.q });
});

app.get("/users/:id/posts", (req, res) => {
  res.json({
    userId: req.params.id,
    limit: req.query.limit,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
