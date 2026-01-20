import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/echo", (req, res) => {
  res.json({ body: req.body });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Malformed JSON" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
