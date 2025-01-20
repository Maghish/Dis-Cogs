import blessed from "blessed";
import { ModuleConfigType } from "../../../types";

export default class Log {
  private modules: ModuleConfigType[];

  constructor(modules: ModuleConfigType[]) {
    this.modules = modules;
  }

  public log(content: string, tab: string) {
    this.modules.forEach(async (module) => {
      if (module.name === "tui") {
        const res = await fetch(`http://localhost:${module.port}/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, tab }),
        });

        console.log(res.status);
      }
    });
  }
}
