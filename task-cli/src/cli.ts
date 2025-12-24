import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import * as readline from "readline";
import { TaskManager } from "./TaskManager";
import reportingPlugin from "./plugins/reporting";

export class TaskCLI {
  private program = new Command();
  private manager = new TaskManager();

  constructor() {
    this.program.name("task").description("Task Management CLI");

    // Load plugin hooks
    [reportingPlugin].forEach((p) => this.manager.registerHooks(p.hooks ?? {}));

    // Register plugin commands (await handlers)
    [reportingPlugin].forEach((plugin) =>
      plugin.commands?.forEach((cmd) => {
        this.program
          .command(cmd.name)
          .description(cmd.description)
          .action(async (...args: any[]) => await cmd.handler(this.manager));
      })
    );

    this.setupCoreCommands();
  }

  private setupCoreCommands() {
    // Add task
    this.program
      .command("add <title>")
      .description("Add a new task")
      .option("-p, --priority <priority>", "Task priority", "medium")
      .action(async (title, options) => {
        const task = this.manager.add({
          title,
          priority: options.priority,
          completed: false,
        });
        console.log(chalk.green("✅ Task added:"), task.title);
      });

    // List tasks
    this.program
      .command("list")
      .description("List all tasks")
      .action(async () => {
        const tasks = this.manager.getall();
        if (!tasks.length) {
          console.log(chalk.yellow("No tasks found"));
          return;
        }
        tasks.forEach((t: any) =>
          console.log(
            t.completed
              ? chalk.gray(`✔ ${t.title}`)
              : chalk.blue(`✖ ${t.title}`)
          )
        );
      });

    // Interactive mode
    this.program
      .command("interactive")
      .description("Interactive mode")
      .action(async () => await this.interactive());
  }

  private async interactive() {
    const choices = ["Add Task", "List Tasks", "Report", "Sync GitHub", "Exit"];

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (q: string) =>
      new Promise<string>((resolve) => rl.question(q, (ans) => resolve(ans)));

    let exit = false;
    while (!exit) {
      console.log("\nSelect an action:");
      choices.forEach((c, i) => console.log(`${i + 1}) ${c}`));
      const ans = (await question("Choose number: ")).trim();
      const idx = parseInt(ans, 10) - 1;
      const action = choices[idx] ?? "Exit";

      switch (action) {
        case "Add Task": {
          const title = (await question("Task title: ")).trim();
          if (title) {
            this.manager.add({ title, completed: false, priority: "medium" });
            console.log(chalk.green("Task added!"));
          }
          break;
        }
        case "List Tasks": {
          const tasks = this.manager.getall();
          if (!tasks.length) {
            console.log(chalk.yellow("No tasks found"));
            break;
          }
          tasks.forEach((t: any) =>
            console.log(
              t.completed
                ? chalk.gray(` ${t.title}`)
                : chalk.blue(` ${t.title}`)
            )
          );
          break;
        }
        case "Report": {
          await reportingPlugin.commands?.[0].handler(this.manager);
          break;
        }
        case "Exit":
          exit = true;
          break;
      }
    }
    rl.close();
  }

  async run(argv: string[]) {
    // If no arguments provided, start interactive mode
    if (argv.length === 0) {
      await this.interactive();
    } else {
      await this.program.parseAsync(argv, { from: "user" });
    }
  }
}

// Create and run CLI
const cli = new TaskCLI();
cli.run(process.argv.slice(2)).catch(console.error);
