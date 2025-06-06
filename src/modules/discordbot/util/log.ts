import { ModuleConfigType } from "../../../types";

export default class Log {
  private modules: ModuleConfigType[];

  constructor(modules: ModuleConfigType[]) {
    this.modules = modules;
  }

  public log(
    content: string,
    tab: "bot_error" | "bot_log" | "bot_cogs" | "general_log"
  ) {
    if (tab === "bot_error") {
      this.modules.forEach(async (module) => {
        if (module.name === "tui") {
          const res = await fetch(`http://localhost:${module.port}/boterror`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          });
        }
      });
    }

    if (tab === "bot_log") {
      this.modules.forEach(async (module) => {
        if (module.name === "tui") {
          const res = await fetch(`http://localhost:${module.port}/botlog`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          });
        }
      });
    }

    if (tab === "bot_cogs") {
      this.modules.forEach(async (module) => {
        if (module.name === "tui") {
          const res = await fetch(`http://localhost:${module.port}/setcogs`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          });
        }
      });
    }

    if (tab === "general_log") {
      this.modules.forEach(async (module) => {
        if (module.name === "tui") {
          const res = await fetch(
            `http://localhost:${module.port}/generallog`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content }),
            }
          );
        }
      });
    }
  }
}
