import { ModuleConfigType } from "./types";
import { Worker } from "worker_threads";
import path from "path";

class Prime {
  public modules: ModuleConfigType[];
  private threads: any[];
  public mainModules: any[];
  public TUI: any;

  constructor() {
    this.modules = [];
    this.threads = [];
    this.mainModules = [];
  }

  // public import() {
  //   if (this.modules && this.modules.length > 0) {
  //     this.modules.sort((a, b) => (a!.layer > b!.layer ? 1 : -1));

  //     this.modules.forEach((module) => {
  //       const moduleClass = require(module.path).default;
  //       if (moduleClass.prototype._start) {
  //         this.moduleCache.push(moduleClass as ModuleType);
  //       } else {
  //         console.log("Module does not have a `_start` function! Skipping...");
  //       }
  //     });
  //   } else {
  //     console.log("No modules added to the Prime class!");
  //     exit(1);
  //   }
  // }

  public async importMainModules() {
    this.modules.forEach(async (module) => {
      if (module.type === "MAIN") {
        const moduleClass = require(module.path).default;
        if (moduleClass.prototype._start) {
          const inst = new moduleClass(module.port);
          this.mainModules.push(inst);
        }
      }
    });
  }

  public async run() {
    this.modules.forEach(async (module) => {
      if (module.type === "THREAD") {
        const thread = await this.createThread(module.path, module.port);

        if (this.TUI) {
          this.TUI.appendModule(module.name);
          this.TUI.appendGeneralLog(
            "Thread created for module: " + module.path
          );
        } else {
          console.log("Thread created for module:", module.path);
        }

        this.threads.push(thread);
      }
    });
  }

  private async createThread(modulePath: string, port: number) {
    const worker = new Worker(path.resolve(__dirname, modulePath), {
      workerData: { port: port, modules: this.modules },
    });

    // Send a start message to the worker
    worker.postMessage("start");

    // Handle messages from the worker
    worker.addListener("message", (event) => {
      console.log(event.data);
    });

    // Handle errors
    worker.addListener("error", (error) => {
      console.error("Error in worker:", error.message);
    });

    return worker;
  }
}

async function main() {
  const prime = new Prime();

  prime.modules = [
    {
      name: "tui",
      path: "./modules/tui/main.js",
      layer: 1,
      port: 3001,
      type: "MAIN",
    },
    {
      name: "mainbot",
      path: "./modules/discordbot/bot.js",
      layer: 1,
      port: 3000,
      type: "THREAD",
    },
  ];

  // const screen = blessed.screen();

  // screen.key(["escape", "q", "C-c"], () => {
  //   process.exit(0);
  // });

  // screen.append(
  //   log({
  //     top: "center",
  //     left: "center",
  //     width: "50%",
  //     height: "50%",
  //     border: {
  //       type: "line",
  //     },
  //   })
  // );
  // screen.render();

  await prime.importMainModules();

  prime.mainModules.forEach(async (module) => {
    await module._start();
    prime.TUI = module;
  });

  await prime.run();
}

main();
