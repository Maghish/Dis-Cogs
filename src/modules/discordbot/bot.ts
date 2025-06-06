import {
  Client,
  GatewayIntentBits,
  Collection,
  ClientEvents,
  Events,
} from "discord.js";
import dotenv, { config } from "dotenv";
import path from "path";
import fs from "fs";
import * as TYPES from "./discord-bot-types";
import { Cog, EventCog } from "./cogs";
import express from "express";
import { workerData } from "worker_threads";
import Log from "./util/log";
import cors from "cors";
import { Deploy } from "./deploy";

class Bot {
  private client: TYPES.Client;
  private port: number;
  private app: express.Express;
  private logger: Log;

  constructor() {
    this.port = workerData.port;
    const app = express();
    this.app = app;
    this.app.use(express.json());
    this.app.use(cors());

    // @ts-ignore
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.logger = new Log(workerData.modules);
    this.client.logger = this.logger;

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
          cog.hybridCommands.forEach((command) => {
            this.client.commands.set(command.name, command);
            this.client.slashCommands.set(command.name, command);
          });
        }

        continue;
      }

      this.logger.log(
        `Loaded ${this.client.commands.size} legacy commands`,
        "bot_log"
      );

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
                    return event.execute(...args, this.client, this.logger);
                  }
                  return event.execute(...args, this.client, this.logger);
                }
              );
            } else {
              this.client.on(
                event.name as keyof ClientEvents,
                (...args: any[]) =>
                  event.execute(...args, this.client, this.logger)
              );
            }
          });
        }
      } catch (error) {
        this.logger.log("Could not find events.ts file!", "bot_error");
      }

      this.app.listen(this.port, async () => {
        this.logger.log(
          `Module Server ready & listening on port ${this.port}!`,
          "general_log"
        );
      });

      const deploy = new Deploy(this.client);
      await deploy.registerCommands();

      await this.client.login(process.env.TOKEN);
    } catch (error: any) {
      this.logger.log("Error logging in with the given token!", "bot_error");
      this.logger.log(error.message, "bot_error");
    }
  }
}

const bot = new Bot();
bot._start();
