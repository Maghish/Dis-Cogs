import { Events } from "discord.js";
import { EventCog } from "./cogs";
import { EventFunction } from "./types";
import log from "./util/log";

const cog = new EventCog();

const DEFAULT_PREFIX = "!";
const PREFIX = process.env.PREFIX || DEFAULT_PREFIX;

/** OnReady Event Function **/
cog.addEvent({
  name: Events.ClientReady,
  once: true,
  async execute(...args: any) {
    log(`Logged in as ${args[0].user.tag}!`, "READY");
  },
} as EventFunction);

/** MessageCreate Event Function **/
cog.addEvent({
  name: Events.MessageCreate,
  once: false,
  async execute(message: any) {
    if (message.author.bot) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!cmd.startsWith(PREFIX)) return;

    const commandName = cmd.split(new RegExp(`^${PREFIX}`))[1];

    let command = message.client.commands.get(commandName);
    if (!command) {
      return message.channel.send(
        `No such command! Please use \`${PREFIX}help\` to list all available commands.`,
      );
    }

    if (!command.execute) {
      log(
        `Command exists but no execute function found for "${commandName}"`,
        "WARNING",
      );
      return;
    }

    command.execute(message, args);

    return;
  },
} as EventFunction);

/** InteractionCreate Event Function **/
cog.addEvent({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.slashCommands.get(
      interaction.commandName,
    );

    try {
      await command.execute(interaction);
    } catch (error) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content:
            "Unexpected error occurred while executing the command, please try again later",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Unexpected error occurred while executing the command, please try again later",
          ephemeral: true,
        });
      }
    }
  },
});

export default cog;
