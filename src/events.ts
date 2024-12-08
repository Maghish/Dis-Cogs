import { Events } from "discord.js";
import { EventCog } from "./cogs";
import { EventFunction, Client } from "./types";
import log from "./util/log";
import buildEmbed from "./util/embed";

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
  async execute(message: any, modifiedClient) {
    if (message.author.bot) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!cmd.startsWith(PREFIX)) return;

    const commandName = cmd.split(new RegExp(`^${PREFIX}`))[1];

    let command = message.client.commands.get(commandName);
    if (!command) {
      return message.channel.send(
        `No such command! Please use \`${PREFIX}help\` to list all available commands.`
      );
    }

    if (!command.execute) {
      log(
        `Command exists but no execute function found for "${commandName}"`,
        "WARNING"
      );
      return;
    }

    if (command.ownerOnly && message.author.id !== modifiedClient.owner) {
      const embed = buildEmbed(
        "Command not executable!",
        "You don't have the permissions to execute this command! This command is exclusive for the bot owners only.",
        "Red",
        message.client
      );

      return message.reply({ embeds: [embed] });
    }

    await command.execute(message, args);

    return;
  },
} as EventFunction);

/** InteractionCreate Event Function **/
cog.addEvent({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: any, modifiedClient: Client) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.slashCommands.get(
      interaction.commandName
    );

    if (command.ownerOnly && interaction.user.id !== modifiedClient.owner) {
      const embed = buildEmbed(
        "Command not executable!",
        "You don't have the permissions to execute this command! This command is exclusive for the bot owners only.",
        "Red",
        interaction.client
      );
      return interaction.reply({ embeds: [embed] });
    }

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
