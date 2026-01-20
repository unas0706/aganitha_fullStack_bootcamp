import { Pool } from "pg";
import { logger } from "../node-pro/logger";
import dotenv from "dotenv";
dotenv.config({
  path: "C:/projects/aganitha/task-cli/src/node-pro/.env",
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  logger.info("PostgreSQL connected");
});

pool.on("error", (err) => {
  logger.error(err, "PostgreSQL pool error");
  process.exit(1);
});
