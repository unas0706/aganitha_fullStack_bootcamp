import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.get("/ok", (req, res) => {
  res.status(200).json({ success: true });
});

app.get("/created", (req, res) => {
  res.status(201).json({ created: true });
});

app.get("/bad", (req, res) => {
  res.status(400).json({ error: "Bad Request" });
});

app.get("/header", (req, res) => {
  res.set("X-Custom-Header", "ExpressApp");
  res.send("Header set");
});

app.get("/text", (req, res) => {
  res.send("Plain text response");
});

app.get("/file", (req, res) => {
  res.sendFile("./sample.txt");
});

app.get("/redirect", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
