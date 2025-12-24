import { TaskCollection } from "./collection";
import { Storage } from "./storage";

export class TaskSyncManager {
  constructor(
    private storage: Storage<TaskCollection>,
    private key: string,
    private remote?: RemoteSync
  ) {}

  async save(data: TaskCollection): Promise<void> {
    await this.storage.save(this.key, data);
  }

  async load(): Promise<TaskCollection | null> {
    return await this.storage.load(this.key);
  }

  async sync(local: TaskCollection) {
    if (!this.remote) return;

    await this.remote.push(local);
    const remote = await this.remote.pull();
    await this.save(remote);
  }
}

export interface RemoteSync {
  push(data: TaskCollection): Promise<void>;
  pull(): Promise<TaskCollection>;
}
