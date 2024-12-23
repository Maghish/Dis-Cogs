import {
  Client,
  GatewayIntentBits,
  Collection,
  ClientEvents,
} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import * as TYPES from "./types";
import log from "./util/log";
import { Cog, EventCog } from "./cogs";

dotenv.config();

require("./deploy");

const token = process.env.TOKEN;

// @ts-ignore
const client: TYPES.Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command Handler
client.commands = new Collection();
client.slashCommands = new Collection();

// Set the bot owner
client.owner = process.env.OWNERID!;

const cogsBasePath = path.join(__dirname, "cogs");
const cogFiles = fs.readdirSync(cogsBasePath, "utf-8");

for (const cogFile of cogFiles) {
  const cogPath = path.join(cogsBasePath, cogFile);
  const cog = require(cogPath).default;
  if (cog && cog instanceof Cog) {
    cog.legacyCommands.forEach((command) =>
      client.commands.set(command.name, command)
    );
    cog.slashCommands.forEach((command) =>
      client.slashCommands.set(command.name, command)
    );
  }

  continue;
}

log(`Loaded ${client.commands.size} legacy commands`, "LOAD");

const eventsPath = path.join(__dirname, "events.js");
try {
  const eventCog = require(eventsPath).default;

  if (eventCog && eventCog instanceof EventCog) {
    eventCog.events.forEach((event) => {
      if (event.once) {
        client.once(event.name as keyof ClientEvents, (...args: any[]) =>
          event.execute(...args, client)
        );
      } else {
        client.on(event.name as keyof ClientEvents, (...args: any[]) =>
          event.execute(...args, client)
        );
      }
    });
  }
} catch (error) {
  log("Could not find events.ts file!", "ERROR");
}

try {
  client.login(token).catch(() => {
    log("Invalid token was provided!", "ERROR");
  });
} catch (error) {
  log("Error logging in with the given token!", "ERROR");
}
