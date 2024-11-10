import { Cog } from "../cogs";
import { LegacyCommand } from "../types";

const cog = new Cog("example");

cog.addLegacy({
  name: "ping",
  execute(message, args) {
    message.reply("Pong!");
  },
} as LegacyCommand);

cog.addLegacy({
  name: "pong",
  execute(message, args) {
    message.reply("Ping!");
  },
});

export default cog;
