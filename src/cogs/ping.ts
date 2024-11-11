import { SlashCommandBuilder } from "discord.js";
import { Cog } from "../cogs";
import { LegacyCommand, SlashCommand } from "../types";

const cog = new Cog("basic");

cog.addLegacy({
  name: "ping",
  execute(message) {
    message.reply(`Pong! ${message.client.ws.ping}ms`);
  },
} as LegacyCommand);

cog.addSlash({
  name: "ping",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute(interaction) {
    interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  },
} as SlashCommand);

export default cog;
