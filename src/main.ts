import { ModuleConfigType } from "./types";
import { Worker } from "worker_threads";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

class Prime {
  public modules: ModuleConfigType[];
  private workerMap: Map<string, Worker>;
  public mainModules: any[];
  public TUI: any;
  private lastBuildTime: number = 0;
  private buildInProgress: boolean = false;

  constructor() {
    this.modules = [];
    this.workerMap = new Map();
    this.mainModules = [];
  }

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
    this.modules.sort((a, b) => a.layer - b.layer);

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

        this.workerMap.set(module.name, thread);

        // Set up file watching for the module
        this.watchModule(module);
      }
    });
  }

  public async restartWorker(moduleName: string) {
    const module = this.modules.find((m) => m.name === moduleName);

    if (!module) {
      const errorMsg = `Cannot restart worker: Module ${moduleName} not found`;
      if (this.TUI) {
        this.TUI.appendGeneralLog(errorMsg);
      } else {
        console.error(errorMsg);
      }
      return;
    }

    const worker = this.workerMap.get(moduleName);

    if (!worker) {
      const errorMsg = `Cannot restart worker: Worker for ${moduleName} not found`;
      if (this.TUI) {
        this.TUI.appendGeneralLog(errorMsg);
      } else {
        console.error(errorMsg);
      }
      return;
    }

    // Terminate the existing worker
    await worker.terminate();

    // Create a new worker
    const newWorker = await this.createThread(module.path, module.port);

    // Update the worker map
    this.workerMap.set(moduleName, newWorker);

    const logMsg = `Worker for module ${moduleName} has been restarted`;
    if (this.TUI) {
      this.TUI.appendGeneralLog(logMsg);
    } else {
      console.log(logMsg);
    }
  }

  private watchModule(module: ModuleConfigType) {
    if (module.type !== "THREAD") return;

    // Check if this is the Discord bot module
    const isDiscordBot = module.name === "mainbot";

    // Determine the directories to watch
    const modulePath = path.resolve(__dirname, module.path);
    let jsDir: string;
    let tsDir: string;

    if (isDiscordBot) {
      // For the Discord bot, watch both TS source and JS dist
      jsDir = path.join(__dirname, "modules", "discordbot");
      tsDir = path.join(process.cwd(), "src", "modules", "discordbot");
    } else {
      // For other modules, just watch the module directory
      jsDir = path.dirname(modulePath);
      tsDir = path.join(
        process.cwd(),
        "src",
        path.relative(__dirname, path.dirname(modulePath))
      );
    }

    // Separate debounce timers for TS and JS changes
    let jsDebouncerTimer: NodeJS.Timeout | null = null;
    let tsDebouncerTimer: NodeJS.Timeout | null = null;
    const debounceTime = 300; // milliseconds

    // Keep track of watched directories
    const watchedDirs = new Set<string>();

    const watchDirectory = (dir: string, isTypeScript: boolean) => {
      if (watchedDirs.has(dir)) return;
      watchedDirs.add(dir);

      try {
        const watcher = fs.watch(
          dir,
          { persistent: true, recursive: true },
          (eventType, filename) => {
            if (!filename) return;

            // Check for valid event types
            if (eventType !== "change" && eventType !== "rename") return;

            // Handle TypeScript files
            if (isTypeScript && filename.endsWith(".ts")) {
              if (tsDebouncerTimer) {
                clearTimeout(tsDebouncerTimer);
              }

              tsDebouncerTimer = setTimeout(async () => {
                // Skip if build already in progress
                if (this.buildInProgress) {
                  const skipMsg = `TypeScript file changed: ${filename}. Build already in progress, skipping.`;
                  if (this.TUI) {
                    this.TUI.appendGeneralLog(skipMsg);
                  } else {
                    console.log(skipMsg);
                  }
                  return;
                }

                // Skip if change happened too soon after last build
                const now = Date.now();
                const timeSinceLastBuild = now - this.lastBuildTime;
                if (timeSinceLastBuild < 1000) {
                  const throttleMsg = `TypeScript file changed: ${filename}. Too soon after last build (${timeSinceLastBuild}ms), skipping.`;
                  if (this.TUI) {
                    this.TUI.appendGeneralLog(throttleMsg);
                  } else {
                    console.log(throttleMsg);
                  }
                  return;
                }

                // Set build in progress flag
                this.buildInProgress = true;

                const logMsg = `TypeScript file changed: ${filename}. Running build...`;
                if (this.TUI) {
                  this.TUI.appendGeneralLog(logMsg);
                } else {
                  console.log(logMsg);
                }

                // Run the TypeScript build
                exec(
                  "npm run build",
                  (error: any, stdout: string, stderr: string) => {
                    // Update build time and reset flag
                    this.lastBuildTime = Date.now();
                    this.buildInProgress = false;

                    if (error) {
                      const errorMsg = `Build error: ${error.message}`;
                      if (this.TUI) {
                        this.TUI.appendGeneralLog(errorMsg);
                      } else {
                        console.error(errorMsg);
                      }
                      return;
                    }
                    const buildMsg = `Build completed successfully`;
                    if (this.TUI) {
                      this.TUI.appendGeneralLog(buildMsg);
                    } else {
                      console.log(buildMsg);
                    }
                    // Restart the worker after successful build
                    this.restartWorker(module.name);
                  }
                );
              });
            }

            // Handle JavaScript files
            if (!isTypeScript && filename.endsWith(".js")) {
              if (jsDebouncerTimer) {
                clearTimeout(jsDebouncerTimer);
              }

              jsDebouncerTimer = setTimeout(async () => {
                const logMsg = `JavaScript file changed: ${filename}. Restarting module: ${module.name}`;
                if (this.TUI) {
                  this.TUI.appendGeneralLog(logMsg);
                } else {
                  console.log(logMsg);
                }

                await this.restartWorker(module.name);
              }, debounceTime);
            }
          }
        );

        // Add error handler
        watcher.on("error", (error) => {
          const errorMsg = `Watcher error for ${dir}: ${error.message}. Attempting to restart watcher...`;
          if (this.TUI) {
            this.TUI.appendGeneralLog(errorMsg);
          } else {
            console.error(errorMsg);
          }

          // Try to restart the watcher after a brief delay
          setTimeout(() => {
            watchedDirs.delete(dir);
            watchDirectory(dir, isTypeScript);
          }, 5000);
        });

        // Add close handler
        watcher.on("close", () => {
          const closeMsg = `Watcher closed for ${dir}. Attempting to restart watcher...`;
          if (this.TUI) {
            this.TUI.appendGeneralLog(closeMsg);
          } else {
            console.log(closeMsg);
          }

          // Try to restart the watcher after a brief delay
          setTimeout(() => {
            watchedDirs.delete(dir);
            watchDirectory(dir, isTypeScript);
          }, 5000);
        });

        const logMsg = `Watching directory: ${dir} for ${isTypeScript ? "TypeScript" : "JavaScript"} changes`;
        if (this.TUI) {
          this.TUI.appendGeneralLog(logMsg);
        } else {
          console.log(logMsg);
        }
      } catch (error) {
        const errorMsg = `Error setting up watcher for ${dir}: ${error instanceof Error ? error.message : String(error)}`;
        if (this.TUI) {
          this.TUI.appendGeneralLog(errorMsg);
        } else {
          console.error(errorMsg);
        }
      }
    };

    // Watch both TS source and JS dist directories
    watchDirectory(jsDir, false); // Watch for JS changes
    watchDirectory(tsDir, true); // Watch for TS changes

    // If this is the Discord bot, watch subdirectories recursively
    if (isDiscordBot) {
      const watchRecursively = (dir: string, isTypeScript: boolean) => {
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith(".")) {
              const subDir = path.join(dir, entry.name);
              watchDirectory(subDir, isTypeScript);
              watchRecursively(subDir, isTypeScript);
            }
          }
        } catch (error) {
          const errorMsg = `Error scanning directory ${dir}: ${error instanceof Error ? error.message : String(error)}`;
          if (this.TUI) {
            this.TUI.appendGeneralLog(errorMsg);
          } else {
            console.error(errorMsg);
          }
        }
      };

      watchRecursively(jsDir, false); // Watch JS directories recursively
      watchRecursively(tsDir, true); // Watch TS directories recursively
    }
  }

  private async createThread(modulePath: string, port: number) {
    const worker = new Worker(path.resolve(__dirname, modulePath), {
      workerData: { port: port, modules: this.modules },
    });

    // Send a start message to the worker
    worker.postMessage("start");

    // Handle messages from the worker
    worker.addListener("message", (event) => {
      if (this.TUI) {
        this.TUI.appendGeneralLog(event.data);
      } else console.log(event.data);
    });

    // Handle errors
    worker.addListener("error", (error) => {
      if (this.TUI) {
        this.TUI.appendGeneralLog("Error in worker: " + error.message);
      } else console.error("Error in worker:", error.message);

      const moduleName = modulePath.split("./modules/")[1].split("/")[0];
      this.restartWorker(moduleName);
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
      name: "discordbot",
      path: "./modules/discordbot/bot.js",
      layer: 2,
      port: 3000,
      type: "THREAD",
    },
  ];

  await prime.importMainModules();

  prime.mainModules.forEach(async (module) => {
    await module._start();
    prime.TUI = module;
  });

  await prime.run();
}

main();
