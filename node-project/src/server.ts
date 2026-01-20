import express, { Express } from "express";
import { Server } from "http";
import { AppConfig } from "./config";
import { logger } from "./logger";
import { taskRouter } from "./tasks";

export class TaskServer {
  private app: Express;
  private server?: Server;

  constructor(private config: AppConfig) {
    this.app = express();
    this.setupApp();
  }

  private setupApp(): void {
    this.app.use(express.json());

    this.app.use((req, _res, next) => {
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
      res.status(200).json({
        ready: true,
      });
    });

    this.app.use("/api/tasks", taskRouter);
  }

  async start(): Promise<void> {
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
