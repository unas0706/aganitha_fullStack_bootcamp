import express from "express";
import { loadConfig } from "./config";
import { logger } from "./logger";
import { FileStorage } from "./storage";
import { TaskEventEmitter } from "./events";
import { TaskServer } from "./server";

const storage = new FileStorage("./data/notes.json");
const events = new TaskEventEmitter();

const config = loadConfig();
const server = new TaskServer(config);

server.start();

process.on("SIGINT", async () => {
  logger.info("SIGINT received");
  await server.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received");
  await server.stop();
  process.exit(0);
});

events.on("task:created", async () => {
  const notes = await storage.loadNotes();
  logger.info({ count: notes.length }, "Notes reloaded after create");
});
