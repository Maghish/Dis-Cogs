import { exit } from "process";
import { ModuleConfigType } from "./types";
import { Worker } from "worker_threads";
import path from "path";

class Prime {
  public modules: ModuleConfigType[];
  private threads: any[];

  constructor() {
    this.modules = [];
    this.threads = [];
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

  public async run() {
    this.modules.forEach(async (modulePath) => {
      const thread = await this.createThread(modulePath.path, modulePath.port);
      console.log("Thread created for module:", modulePath.path);
      this.threads.push(thread);
    });
  }

  private async createThread(modulePath: string, port: number) {
    const worker = new Worker(path.resolve(__dirname, modulePath), {
      workerData: { port: port },
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
      path: "./modules/discordbot/bot.js",
      layer: 1,
      port: 3000,
    },
  ];

  await prime.run();
}

main();
