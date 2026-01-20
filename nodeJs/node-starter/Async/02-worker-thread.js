import express from "express";

const app = express();

function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

app.get("/blocking", (req, res) => {
  const start = Date.now();
  const result = fib(45); // CPU heavy
  const duration = Date.now() - start;

  res.json({
    result,
    durationMs: duration,
    note: "This blocks the event loop",
  });
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(3000, () => {
  console.log(" Server running on port 3000");
});
