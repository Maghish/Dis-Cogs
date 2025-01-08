import { exit } from "process";
import { ModuleConfigType, ModuleType } from "./types";

class Prime {
  public modules: ModuleConfigType[];
  public moduleCache: ModuleType[];
  private threads: any[];

  constructor() {
    this.modules = [];
    this.moduleCache = [];
    this.threads = [];
  }

  public import() {
    if (this.modules && this.modules.length > 0) {
      this.modules.sort((a, b) => (a!.layer > b!.layer ? 1 : -1));

      this.modules.forEach((module) => {
        const moduleClass = require(module.path).default;
        if (moduleClass.prototype._start) {
          this.moduleCache.push(moduleClass as ModuleType);
        } else {
          console.log("Module does not have a `_start` function! Skipping...");
        }
      });
    } else {
      console.log("No modules added to the Prime class!");
      exit(1);
    }
  }

  public async start() {
    for (const module of this.moduleCache) {
    }
  }

  private async createThread(workerFunction: () => any) {
    // Convert the function to a string
    const functionCode = workerFunction.toString();

    // Create a Blob with the worker code
    const blob = new Blob(
      [
        `
            self.onmessage = () => {
                (${functionCode})();
                self.postMessage("Task has finished execution");
            };
        `,
      ],
      { type: "application/javascript" }
    );

    // Create a URL for the Blob
    const workerURL = URL.createObjectURL(blob);

    // Create the Web Worker
    const worker = new Worker(workerURL);

    // Send a start message to the worker
    worker.postMessage("start");

    // Handle messages from the worker
    worker.onmessage = (event) => {
      console.log(event.data);
    };

    // Handle errors
    worker.onerror = (error) => {
      console.error("Error in worker:", error.message);
    };

    return worker;
  }
}

async function main() {
  const prime = new Prime();

  prime.modules = [
    {
      path: "./modules/discordbot/bot.js",
      layer: 1,
    },
  ];

  prime.import();
  console.log(prime.moduleCache);
}

main();
