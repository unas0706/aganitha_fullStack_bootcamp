// src/logger.ts
import pino from "pino";
import { loadConfig } from "./config";

const config = loadConfig();

export const logger = pino({
  level: config.logLevel,
  transport:
    config.env === "development"
      ? {
          target: "pino-pretty",
          options: { colorize: true },
        }
      : undefined,
});
