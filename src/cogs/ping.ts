import { Cog } from "../cogs";
import { LegacyCommand } from "../types";

const cog = new Cog("basic");

cog.addLegacy({
  name: "ping",
  execute(message) {
    message.reply(`Pong! ${message.client.ws.ping}ms`);
  },
} as LegacyCommand);

cog.addLegacy({
  name: "pong",
  execute(message) {
    message.reply(`Ping! ${message.client.ws.ping}ms`);
  },
} as LegacyCommand);

export default cog;
