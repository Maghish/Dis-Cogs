import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import * as TYPES from "./types";
import log from "./util/log";

dotenv.config();

const token = process.env.TOKEN;

// require("./deploy");

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

client.owners = [];

const cogsBasePath = path.join(__dirname, "cogs");
const cogFiles = fs.readdirSync(cogsBasePath, "utf-8");

for (const cogFile of cogFiles) {
  const cogPath = path.join(cogsBasePath, cogFile);
  const cog = require(cogPath).default;

  if (cog && cog instanceof TYPES.Cog) {
    cog.legacyCommands.forEach((command) =>
      client.commands.set(command.name, command)
    );
    cog.slashCommands.forEach((command) =>
      client.slashCommands.set(command.name, command)
    );
  }

  continue;
}

// const commandSubFolders = fs.readdirSync(commandTypeFolderPath, "utf-8");
// for (const commandSubFolderName of commandSubFolders) {
//   const commandSubFolderPath = path.join(
//     ,
//     commandSubFolderName
//   );
//   const commandFiles = fs
//     .readdirSync(commandSubFolderPath, "utf-8")
//     .filter((file) => file.endsWith(".js"));

//   for (const commandFileName of commandFiles) {
//     const command = require(path.join(
//       commandSubFolderPath,
//       commandFileName
//     )).default;

//     continue;
//   }
// }

log(`Loaded ${client.commands.size} legacy commands`, "LOAD");

const eventsPath = path.join(__dirname, "events.ts");
try {
  const eventCog = require(eventsPath);

  if (eventCog && eventCog instanceof TYPES.EventCog) {
    eventCog.events.forEach((event) => {
      if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
      } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
      }
    });
  }
} catch (error) {
  console.log("Could not find events.ts file!");
}

// for (const eventFile of eventFiles) {
//   const eventFilePath = path.join(eventsPath, eventFile);

//   const event = require(eventFilePath).default;

//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args));
//   } else {
//     client.on(event.name, (...args) => event.execute(...args));
//   }
// }

try {
  client.login(token).catch(() => {
    log("Invalid token was provided!", "ERROR");
  });
} catch (error) {
  log("Error logging in with the given token!", "ERROR");
}
