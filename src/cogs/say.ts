import { Cog } from "../cogs";
import { LegacyCommand } from "../types";

const cog = new Cog("say");

cog.addLegacy({
  name: "say",
  execute(message, args) {
    message.reply(args.join(" "));
  },
} as LegacyCommand);

export default cog;
