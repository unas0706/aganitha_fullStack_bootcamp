import dotenv from "dotenv";
dotenv.config({ path: "./Foundations/.env" });
console.log("API_KEY:", process.env.API_KEY);

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV ?? "production";

console.log("PORT:", PORT);
console.log("NODE_ENV:", NODE_ENV);

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

requireEnv("API_KEY");
requireEnv("PORT");
requireEnv("NODE_ENV");
