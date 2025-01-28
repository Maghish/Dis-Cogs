import { Events, GuildMember, PermissionsBitField } from "discord.js";
import { EventCog } from "./cogs";
import {
  EventFunction,
  LegacyCommand,
  SlashCommand,
  Client,
} from "../../types";
import buildEmbed from "./util/embed";

const cog = new EventCog();

const DEFAULT_PREFIX = "!";
const PREFIX = process.env.PREFIX || DEFAULT_PREFIX;

/** OnReady Event Function **/
cog.addEvent({
  name: Events.ClientReady,
  once: true,
  async execute(client, modifiedClient: Client) {
    modifiedClient.logger.log(`Logged in as ${client.user.tag}!`, "bot_log");
    modifiedClient.logger.log(
      modifiedClient.cogs.map((cog) => `- ${cog.name} ✅\n`).join(", "),
      "bot_cogs"
    );
  },
} as EventFunction);

/** MessageCreate Event Function **/
cog.addEvent({
  name: Events.MessageCreate,
  once: false,
  async execute(message: any, modifiedClient: Client) {
    if (message.author.bot) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!cmd.startsWith(PREFIX)) return;

    const commandName = cmd.split(PREFIX)[1];

    let command: LegacyCommand = message.client.commands.get(commandName);
    if (!command) {
      message.client.commands.forEach((cmd: LegacyCommand) => {
        if (cmd.aliases && cmd.aliases.includes(commandName)) {
          command = cmd;
        }
      });
      if (!command) {
        return;
      }
    }

    if (!command.execute) {
      modifiedClient.logger.log(
        `Command exists but no execute function found for "${commandName}"`,
        "bot_error"
      );
      return;
    }

    const isDM = message.channel.isDMBased();
    const dmOnly = command.dmOnly;

    if (dmOnly === "GUILD_ONLY" && !isDM) {
      const embed = buildEmbed(
        "Command not executable!",
        `This command can only be used in DMs! Please use \`${PREFIX}help\` to list all available commands.`,
        "Red",
        message.client
      );
      return message.reply({ embeds: [embed] });
    }
    if (dmOnly === "DM_ONLY" && isDM) {
      const embed = buildEmbed(
        "Command not executable!",
        `This command can only be used in guilds! Please use \`${PREFIX}help\` to list all available commands.`,
        "Red",
        message.client
      );
      return message.reply({ embeds: [embed] });
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

    if (message.guild && command.selfPermissions.length > 0) {
      const bot: GuildMember = message.guild.members.cache.get(
        message.client.user.id
      );
      const missingSelfPerms = bot.permissions.missing(command.selfPermissions);
      if (missingSelfPerms && missingSelfPerms.length > 0) {
        const embed = buildEmbed(
          "Permissions Missing ❌",
          `I don't have the following permissions to execute this command: \`\`\`${missingSelfPerms.join(
            ", "
          )}\`\`\``,
          "Red",
          message.client
        );
        return message.reply({ embeds: [embed] });
      }
    }
    if (message.guild && command.userPermissions?.length > 0) {
      const user: GuildMember = message.guild.members.cache.get(
        message.author.id
      );
      const missingUserPerms = user.permissions.missing(
        command.userPermissions
      );
      if (missingUserPerms && missingUserPerms.length > 0) {
        const embed = buildEmbed(
          "Permissions Missing ❌",
          `You don't have the following permissions to execute this command: \`\`\`${missingUserPerms.join(
            ", "
          )}\`\`\``,
          "Red",
          message.client
        );
        return message.reply({ embeds: [embed] });
      }
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

    const command: SlashCommand = interaction.client.slashCommands.get(
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

    if (interaction.guild && command.selfPermissions?.length > 0) {
      const bot: GuildMember = interaction.guild.members.cache.get(
        interaction.client.user.id
      );
      const missingSelfPerms = bot.permissions.missing(command.selfPermissions);
      if (missingSelfPerms && missingSelfPerms.length > 0) {
        const embed = buildEmbed(
          "Permissions Missing ❌",
          `I don't have the following permissions to execute this command: \`\`\`${missingSelfPerms.join(
            ", "
          )}\`\`\``,
          "Red",
          interaction.client
        );
        return interaction.reply({ embeds: [embed] });
      }
    }
    if (interaction.guild && command.userPermissions?.length > 0) {
      const user: GuildMember = interaction.guild.members.cache.get(
        interaction.user.id
      );
      const missingUserPerms = user.permissions.missing(
        command.userPermissions
      );
      if (missingUserPerms && missingUserPerms.length > 0) {
        const embed = buildEmbed(
          "Permissions Missing ❌",
          `You don't have the following permissions to execute this command: \`\`\`${missingUserPerms.join(
            ", "
          )}\`\`\``,
          "Red",
          interaction.client
        );
        return interaction.reply({ embeds: [embed] });
      }
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
