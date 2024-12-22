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

const screen = blessed.screen({
  cursor: {
    artificial: true,
    shape: "block",
    blink: true,
    color: "green",
  },
  smartCSR: true,
  dockBorders: true,
  autoPadding: true,
});
screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

const loadingLog = blessed.log({
  top: "50%",
  left: "20%",
  width: "40%",
  height: "50%",
  label: "Loading Log",
  content: "",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "green",
    border: {
      fg: "white",
    },
  },
  scrollable: true,
});

const errorLog = blessed.log({
  top: "50%",
  right: 0,
  width: "40%",
  height: "50%",
  label: "Error Log",
  content: "",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "red",
    border: {
      fg: "white",
    },
  },
});

const loadedCog = blessed.box({
  top: "50%",
  left: 0,
  width: "20%",
  height: "50%",
  label: "Loaded Cogs",
  content: "- Loading...",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "blue",
    border: {
      fg: "white",
    },
  },
});

const title = blessed.box({
  top: 0,
  left: 0,
  width: "100%",
  height: "50%",
  align: "center",
  valign: "middle",
  content:
    figlet.textSync("DisCogs", {
      font: "Small Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    }) + `\nv${version}`,
  tags: true,
  border: {
    type: "line",
  },
  style: {
    border: {
      fg: "white",
    },
    fg: "red",
  },
});

screen.append(loadingLog);
screen.append(errorLog);
screen.append(loadedCog);
screen.append(title);

screen.render();

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
client.cogs = new Collection();

// Set the bot owner
client.owner = process.env.OWNERID!;

const cogsBasePath = path.join(__dirname, "cogs");
const cogFiles = fs.readdirSync(cogsBasePath, "utf-8");

for (const cogFile of cogFiles) {
  const cogPath = path.join(cogsBasePath, cogFile);
  const cog = require(cogPath).default;
  if (cog && cog instanceof Cog) {
    if (!client.cogs.has(cog.name)) {
      client.cogs = client.cogs.set(cog.name, cog);
    }
    cog.legacyCommands.forEach((command) =>
      client.commands.set(command.name, command)
    );
    cog.slashCommands.forEach((command) =>
      client.slashCommands.set(command.name, command)
    );
  }

  continue;
}

log(`Loaded ${client.commands.size} legacy commands`, loadingLog);

const eventsPath = path.join(__dirname, "events.js");
try {
  const eventCog = require(eventsPath).default;

  if (eventCog && eventCog instanceof EventCog) {
    eventCog.events.forEach((event) => {
      if (event.once) {
        client.once(event.name as keyof ClientEvents, (...args: any[]) => {
          // If the event is ClientReady, then add loadedCog
          if (event.name === Events.ClientReady) {
            return event.execute(...args, client, {
              loadingLog,
              errorLog,
              loadedCog,
            });
          }
          return event.execute(...args, client, { loadingLog, errorLog });
        });
      } else {
        client.on(event.name as keyof ClientEvents, (...args: any[]) =>
          event.execute(...args, client, { loadingLog, errorLog })
        );
      }
    });
  }
} catch (error) {
  log("Could not find events.ts file!", errorLog);
}

try {
  client.login(token).catch(() => {
    log("Invalid token was provided!", errorLog);
  });
} catch (error: any) {
  log("Error logging in with the given token!", errorLog);
  log(error.message, errorLog);
}
