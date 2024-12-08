import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Cog } from "../cogs";
import { LegacyCommand, SlashCommand } from "../types";

const cog = new Cog("basic");

cog.addLegacy({
  name: "ping",
  userPermissions: [],
  selfPermissions: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
  ],
  execute(message) {
    message.reply(`Pong! ${message.client.ws.ping}ms`);
  },
} as LegacyCommand);

cog.addSlash({
  name: "ping",
  userPermissions: [],
  selfPermissions: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
  ],
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute(interaction) {
    interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  },
} as SlashCommand);

export default cog;
