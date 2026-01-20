import { promises as fs } from "fs";
import { watch } from "fs";
import path from "path";
import { logger } from "./logger";

export class FileStorage {
  constructor(private dataPath: string) {}

  async loadNotes(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.dataPath, "utf-8");
      return JSON.parse(data);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        logger.warn("Notes file not found, starting with empty list");
        return [];
      }

      logger.error(err, "Failed to load notes");
      throw err;
    }
  }

  async saveNotes(notes: any[]): Promise<void> {
    const dir = path.dirname(this.dataPath);

    try {
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(
        this.dataPath,
        JSON.stringify(notes, null, 2),
        "utf-8"
      );

      logger.info("Notes saved to disk");
    } catch (err) {
      logger.error(err, "Failed to save notes");
      throw err;
    }
  }

  async watchChanges(callback: () => void): Promise<void> {
    watch(this.dataPath, (eventType) => {
      if (eventType === "change") {
        logger.info("Notes file changed, reloading");
        callback();
      }
    });
  }
}
