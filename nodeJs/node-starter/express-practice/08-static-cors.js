import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.use(cors());

app.get("/public-api", cors(), (req, res) => {
  res.json({ message: "Public API (any origin allowed)" });
});

app.get("/restricted-api", cors({ origin: "http://127.0.0.1" }), (req, res) => {
  res.json({ message: "Restricted API " });
});

app.options("*", cors());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
