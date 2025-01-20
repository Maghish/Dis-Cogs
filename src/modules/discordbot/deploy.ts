import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "path";
import log from "./util/log";
import { Cog } from "./cogs";
import blessed from "blessed";
import dotenv from "dotenv";

export class Deploy {
  private clientID: string;
  private token: string;
  private commands: any[];
  private loadingLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement;
  private errorLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement;
  private loadedCog:
    | blessed.Widgets.BoxElement
    | blessed.Widgets.BlessedElement;

  constructor(
    loadingLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement,
    errorLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement,
    loadedCog: blessed.Widgets.BoxElement | blessed.Widgets.BlessedElement
  ) {
    dotenv.config();

    this.loadedCog = loadedCog;
    this.errorLog = errorLog;
    this.loadingLog = loadingLog;

    this.clientID = process.env.CLIENTID!;
    this.token = process.env.TOKEN!;
    this.commands = [];

    const cogsFolderPath = path.join(__dirname, "cogs");
    const cogFiles = fs
      .readdirSync(cogsFolderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of cogFiles) {
      const filePath = path.join(cogsFolderPath, file);
      const cog = require(filePath).default;
      if (cog && cog instanceof Cog) {
        cog.slashCommands.forEach((command) => {
          this.commands.push(command.data.toJSON());
        });
      }
    }
  }

  public async registerCommands() {
    try {
      const rest = new REST().setToken(this.token);
      try {
        const data: any = await rest.put(
          Routes.applicationCommands(this.clientID),
          {
            body: this.commands,
          }
        );
        // log(`Reloaded ${data.length} slash commands`, this.loadingLog);
      } catch (error: any) {
        // log(
        // "Unexpected error occurred while registering slash commands.\n" +
        // error.message,
        // this.errorLog
        // );
      }
    } catch (error) {
      //   log("Invalid token was provided!", this.errorLog);
    }
  }
}
