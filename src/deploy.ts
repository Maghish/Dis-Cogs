import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "path";
import log from "./util/log";

const clientID = process.env.CLIENTID;
const token = process.env.TOKEN;

const commands: any = [];
const foldersPath = path.join(__dirname, "commands/slash");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default;
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      log(
        `The slash command at "${filePath}" is missing a required "data" or "execute" property.`,
        "WARNING"
      );
    }
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
        "ERROR"
      );
    }
  })();
} catch (error) {
  log("Invalid token was provided!", "ERROR");
}
