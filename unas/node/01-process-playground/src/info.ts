import "dotenv/config";

const args = process.argv.slice(2);
const isDebug = args.includes("--debug");

if (isDebug) {
  console.log("Debug mode enabled");
}

console.log("PID:", process.pid);
console.log("Node:", process.version);
console.log("CWD:", process.cwd());

const config = {
  apiKey: process.env.API_KEY ?? "default-key",
  port: process.env.PORT ?? "3000",
};

console.log("Config:", config);
console.log(
  "Args:",
  args.filter((a) => a !== "--debug")
);

process.on("SIGINT", () => {
  console.log("Shutting down");
  process.exit(0);
});
