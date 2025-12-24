import { TaskManager } from "../TaskManager";

export type CommandHandler = (manager: TaskManager) => void | Promise<void>;

export interface PluginCommand {
  name: string;
  description: string;
  handler: CommandHandler;
}

export interface PluginHooks {
  onAdd?: (taskId: string) => void;
  onUpdate?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export interface TaskPlugin {
  name: string;
  version: string;
  commands?: PluginCommand[];
  hooks?: PluginHooks;
}
