import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server is running\n");
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received (Ctrl + C)");
  shutdown();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  shutdown();
});

function shutdown() {
  console.log("Closing server...");

  server.close(() => {
    console.log("Server closed");
    console.log("Goodbye");
    process.exit(0);
  });
}
