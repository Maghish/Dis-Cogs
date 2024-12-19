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

const loadingLog = blessed.box({
  top: 0,
  left: 0,
  width: "50%",
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
      fg: "black",
    },
  },
  scrollable: true,
});

const errorLog = blessed.box({
  top: 0,
  right: 0,
  width: "50%",
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
      fg: "black",
    },
  },
});

const loadedCog = blessed.box({
  top: "50%",
  left: 0,
  width: "15%",
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
      fg: "black",
    },
  },
});

const title = blessed.box({
  top: "50%",
  right: 0,
  width: "35%",
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
      fg: "black",
    },
    fg: "red",
  },
});

// const activeProcesses = contrib.table({
//   top: "50%",
//   left: "20%",
//   width: "30%",
//   height: "50%",
//   keys: true,
//   fg: "green",
//   label: "Active Processes",
//   columnSpacing: 2,
//   columnWidth: [8, 8, 8, 8],
//   border: {
//     type: "line",
//     fg: "black",
//   },
//   vi: true,
//   alwaysScroll: true,
//   mouse: true,
// });

// activeProcesses.focus();

// // Fetch and set table data

// setInterval(() => {
//   exec("ps -eo pid,comm,%mem,%cpu --sort=-%cpu", (err, stdout, stderr) => {
//     if (err) {
//       log(`Error fetching processes: ${stderr}`,   errorLog);
//       return;
//     }

//     const lines = stdout.trim().split("\n");
//     const headers = lines[0].split(/\s+/);
//     const data = lines.slice(1).map((line) => {
//       const parts = line.trim().split(/\s+/);
//       if (parts.length > 4) {
//         return [
//           parts[0],
//           parts[1],
//           parts.slice(2, -1).join(" "),
//           parts[parts.length - 1],
//         ];
//       }
//       return parts;
//     });

//     activeProcesses.setData({
//       headers: headers,
//       data: data,
//     });
//   });
// }, 500);

const resourceChart = contrib.line({
  top: "50%",
  left: "15%",
  width: "25%",
  height: "50%",
  label: "Memory and CPU Usage",
  showLegend: true,
  legend: { width: 10 },
  border: {
    type: "line",
    fg: 0x000000,
  },
});

const memUsage: { title: string; x: any[]; y: any[]; style: any } = {
  title: "MEM",
  x: [],
  y: [],
  style: {
    line: "yellow",
  },
};

const cpuUsage: { title: string; x: any[]; y: any[]; style: any } = {
  title: "CPU",
  x: [],
  y: [],
  style: {
    line: "red",
  },
};

function updateChartData() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = (usedMem / totalMem) * 100;

  const cpus = os.cpus();
  const cpuPercent =
    cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce(
        (acc, time) => acc + time,
        0
      );
      const idle = cpu.times.idle;
      return acc + (1 - idle / total) * 100;
    }, 0) / cpus.length;

  const currentTime = new Date().toLocaleTimeString();

  if (memUsage.x.length >= 10) {
    memUsage.x.shift();
    memUsage.y.shift();
    cpuUsage.x.shift();
    cpuUsage.y.shift();
  }

  memUsage.x.push(currentTime);
  memUsage.y.push(memPercent);
  cpuUsage.x.push(currentTime);
  cpuUsage.y.push(cpuPercent);

  resourceChart.setData([memUsage, cpuUsage]);
}

// Create a line chart for Bot Latency
const latencyChart = contrib.line({
  top: "50%",
  left: "40%",
  width: "25%",
  height: "50%",
  label: "Bot Latency",
  showLegend: true,
  legend: { width: 10 },
  border: {
    type: "line",
    fg: 0x000000,
  },
  style: {
    line: "blue",
  },
});

const botLatency: { title: string; x: any[]; y: any[] } = {
  title: "Bot",
  x: [],
  y: [],
};

async function updateLatencyChartData() {
  if (client.ws.ping) {
    const currentTime = new Date().toLocaleTimeString();

    // Fetch real bot latency
    const simulatedBotLatency = client.ws.ping;

    if (botLatency.x.length >= 10) {
      botLatency.x.shift();
      botLatency.y.shift();
    }

    botLatency.x.push(currentTime);
    botLatency.y.push(simulatedBotLatency);

    latencyChart.setData([botLatency]);
  } else {
    botLatency.x.push(new Date().toLocaleTimeString());
    botLatency.y.push(0);
    latencyChart.setData([botLatency]);
  }
}

setInterval(updateChartData, 500);
setInterval(updateLatencyChartData, 1000);

screen.append(loadingLog);
screen.append(errorLog);
screen.append(loadedCog);
screen.append(title);
screen.append(resourceChart);
screen.append(latencyChart);

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
