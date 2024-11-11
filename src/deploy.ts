import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "path";
import log from "./util/log";
import { Cog } from "./cogs";

const clientID = process.env.CLIENTID;
const token = process.env.TOKEN;

const commands: any = [];

const cogsFolderPath = path.join(__dirname, "cogs");
const cogFiles = fs
  .readdirSync(cogsFolderPath)
  .filter((file) => file.endsWith(".js"));

for (const file of cogFiles) {
  const filePath = path.join(cogsFolderPath, file);
  const cog = require(filePath).default;
  if (cog && cog instanceof Cog) {
    cog.slashCommands.forEach((command) => {
      commands.push(command.data.toJSON());
    });
  }
}

try {
  const rest = new REST().setToken(token!);
  (async () => {
    try {
      log(`Loaded ${commands.length} slash commands`, "LOAD");

      const data: any = await rest.put(Routes.applicationCommands(clientID!), {
        body: commands,
      });

      log(`Reloaded ${data.length} slash commands`, "LOAD");
    } catch (error) {
      log(
        "Unexpected error occurred while registerinig slash commands.",
        "ERROR",
      );
    }
  })();
} catch (error) {
  log("Invalid token was provided!", "ERROR");
}
