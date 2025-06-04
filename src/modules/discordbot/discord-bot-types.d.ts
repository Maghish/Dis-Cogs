import * as Discord from "discord.js";
import { Cog } from "./cogs";
import Log from "./modules/discordbot/util/log";

export interface Client extends Discord.Client {
  commands: Discord.Collection<string, LegacyCommand>;
  slashCommands: Discord.Collection<string, SlashCommand>;
  owner: string;
  cogs: Discord.Collection<string, Cog>;
  logger: Log;
}

export interface SlashCommand {
  name: string;
  data:
    | Discord.SlashCommandBuilder
    | Discord.SlashCommandOptionsOnlyBuilder
    | Discord.SlashCommandSubcommandBuilder
    | Discord.SlashCommandSubcommandGroupBuilder
    | Discord.SlashCommandUserPermissionsBuilder;
  ownerOnly?: boolean;
  selfPermissions: Discord.PermissionsBitField.Flags[] | never[];
  userPermissions: Discord.PermissionsBitField.Flags[] | never[];
  execute(
    interaction: Discord.CommandInteraction,
    modifiedClient: Client
  ): any | Promise<any>;
}
export interface LegacyCommand {
  name: string;
  description: string;
  usage: string;
  cog?: string;
  aliases?: string[];
  ownerOnly?: boolean;
  dmOnly: "BOTH" | "GUILD_ONLY" | "DM_ONLY";
  selfPermissions: Discord.PermissionsBitField.Flags[] | never[];
  userPermissions: Discord.PermissionsBitField.Flags[] | never[];
  execute(
    message: Discord.Message,
    args: string[],
    modifiedClient: Client
  ): any | Promise<any>;
}

export interface EventFunction {
  name: Discord.Events;
  once: boolean;
  execute(...args: any): any | Promise<any>;
}
