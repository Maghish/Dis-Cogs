import {
  Client,
  GatewayIntentBits,
  Collection,
  ClientEvents,
  Events,
} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import * as TYPES from "./types";
import log from "./util/log";
import { Cog, EventCog } from "./cogs";
import blessed from "blessed";
import contrib from "blessed-contrib";
import figlet from "figlet";
import { version } from "../package.json";
import { exec } from "child_process";
import os from "os";

export class Bot {
  private client: TYPES.Client;
  private loadingLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement;
  private errorLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement;
  private loadedCog:
    | blessed.Widgets.BoxElement
    | blessed.Widgets.BlessedElement;

  constructor(
    loadinglog: blessed.Widgets.Log | blessed.Widgets.BlessedElement,
    errorLog: blessed.Widgets.Log | blessed.Widgets.BlessedElement,
    loadedCog: blessed.Widgets.BoxElement | blessed.Widgets.BlessedElement
  ) {
    this.loadedCog = loadedCog;
    this.errorLog = errorLog;
    this.loadingLog = loadinglog;

    dotenv.config();

    // @ts-ignore
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // Command Handler
    this.client.commands = new Collection();
    this.client.slashCommands = new Collection();
    this.client.cogs = new Collection();

    // Set the bot owner
    this.client.owner = process.env.OWNERID!;

    const cogsBasePath = path.join(__dirname, "cogs");
    const cogFiles = fs.readdirSync(cogsBasePath, "utf-8");

    for (const cogFile of cogFiles) {
      const cogPath = path.join(cogsBasePath, cogFile);
      const cog = require(cogPath).default;
      if (cog && cog instanceof Cog) {
        if (!this.client.cogs.has(cog.name)) {
          this.client.cogs = this.client.cogs.set(cog.name, cog);
        }
        cog.legacyCommands.forEach((command) =>
          this.client.commands.set(command.name, command)
        );
        cog.slashCommands.forEach((command) =>
          this.client.slashCommands.set(command.name, command)
        );
      }

      continue;
    }

    log(`Loaded ${this.client.commands.size} legacy commands`, this.loadingLog);

    const eventsPath = path.join(__dirname, "events.js");
    try {
      const eventCog = require(eventsPath).default;

      if (eventCog && eventCog instanceof EventCog) {
        eventCog.events.forEach((event) => {
          if (event.once) {
            this.client.once(
              event.name as keyof ClientEvents,
              (...args: any[]) => {
                // If the event is ClientReady, then add loadedCog
                if (event.name === Events.ClientReady) {
                  return event.execute(...args, this.client, {
                    loadingLog: this.loadingLog,
                    errorLog: this.errorLog,
                    loadedCog: this.loadedCog,
                  });
                }
                return event.execute(...args, this.client, {
                  loadingLog: this.loadingLog,
                  errorLog: this.errorLog,
                });
              }
            );
          } else {
            this.client.on(event.name as keyof ClientEvents, (...args: any[]) =>
              event.execute(...args, this.client, {
                loadingLog: this.loadingLog,
                errorLog: this.errorLog,
              })
            );
          }
        });
      }
    } catch (error) {
      log("Could not find events.ts file!", this.errorLog);
    }
  }

  public async start() {
    try {
      await this.client.login(process.env.TOKEN);
    } catch (error: any) {
      log("Error logging in with the given token!", this.errorLog);
      log(error.message, this.errorLog);
    }
  }
}
