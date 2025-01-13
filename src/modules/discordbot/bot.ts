import {
  Client,
  GatewayIntentBits,
  Collection,
  ClientEvents,
  Events,
} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs, { appendFile } from "fs";
import * as TYPES from "../../types";
import log from "./util/log";
import { Cog, EventCog } from "./cogs";
import express from "express";

import { workerData } from "worker_threads";

class Bot {
  private client: TYPES.Client;
  private port: number;
  private app: express.Express;

  constructor() {
    this.port = workerData.port;
    const app = express();
    this.app = app;
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
  }

  public async _start() {
    try {
      dotenv.config();

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

      log(`Loaded ${this.client.commands.size} legacy commands`, "loadingLog");

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
                    return event.execute(...args, this.client);
                  }
                  return event.execute(...args, this.client);
                }
              );
            } else {
              this.client.on(
                event.name as keyof ClientEvents,
                (...args: any[]) => event.execute(...args, this.client)
              );
            }
          });
        }
      } catch (error) {
        log("Could not find events.ts file!", "errorLog");
      }

      this.app.listen(this.port, async () => {
        log(
          `Module Server ready & listening on port ${this.port}!`,
          "moduleLog"
        );
      });

      await this.client.login(process.env.TOKEN);
    } catch (error: any) {
      log("Error logging in with the given token!", "errorLog");
      log(error.message, "errorLog");
    }
  }
}

const bot = new Bot();
bot._start();
