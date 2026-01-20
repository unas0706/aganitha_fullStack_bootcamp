import express, { Express, Request, Response } from "express";
import { Server } from "http";

import { AppConfig } from "./config";
import { logger } from "./logger";

import { taskRouter } from "./tasks";
import { createAuthRouter } from "./routes/auth";

import { UserDatabase } from "./database";
import { AuthService } from "./auth/services";
import { authMiddleware } from "./auth/middleware";
import { pool } from "../db/connection";

export class TaskServer {
  private app: Express;
  private server?: Server;

  private userDb: UserDatabase;
  private authService: AuthService;

  constructor(private config: AppConfig) {
    this.app = express();

    this.userDb = new UserDatabase(pool);
    this.authService = new AuthService(this.userDb);
  }

  private setupApp(): void {
    this.app.use(express.json());

    this.app.use((req: Request, _res: Response, next) => {
      logger.info(
        {
          method: req.method,
          url: req.url,
        },
        "Incoming request"
      );
      next();
    });

    this.app.get("/health", (_req, res) => {
      res.status(200).json({
        status: "ok",
        env: this.config.env,
      });
    });

    this.app.get("/ready", (_req, res) => {
      res.status(200).json({ ready: true });
    });

    this.app.use("/api/auth", createAuthRouter(this.authService));

    this.app.use("/api/tasks", authMiddleware(this.authService), taskRouter);
  }

  async start(): Promise<void> {
    await this.userDb.init();

    this.setupApp();

    if (this.server) {
      logger.warn("Server already running");
      return;
    }

    await new Promise<void>((resolve) => {
      this.server = this.app.listen(this.config.port, () => {
        logger.info(
          {
            port: this.config.port,
            env: this.config.env,
          },
          "TaskServer started"
        );
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.server) {
      logger.warn("Server is not running");
      return;
    }

    logger.info("Stopping TaskServer");

    await new Promise<void>((resolve, reject) => {
      this.server!.close((err) => {
        if (err) {
          logger.error(err, "Error while stopping server");
          reject(err);
          return;
        }

        logger.info("TaskServer stopped");
        this.server = undefined;
        resolve();
      });
    });
  }
}
