import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Cog } from "../cogs";

const cog = new Cog("basic");

cog.addHybrid({
  name: "ping",
  description: "Replies with Pong!",
  usage: "",
  userPermissions: [],
  selfPermissions: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
  ],
  dmOnly: "BOTH",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute({ baseClient, interaction, message }) {
    if (message) return message.reply(`Pong! ${baseClient.ws.ping}ms`);
    else if (interaction) interaction.reply(`Pong! ${baseClient.ws.ping}ms`);
  },
});

export default cog;
