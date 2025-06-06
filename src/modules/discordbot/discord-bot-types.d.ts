import * as Discord from "discord.js";
import { Cog } from "./cogs";
import Log from "./modules/discordbot/util/log";

export interface Client extends Discord.Client {
  commands: Discord.Collection<string, LegacyCommand | HybridCommand>;
  slashCommands: Discord.Collection<string, SlashCommand | HybridCommand>;
  owner: string;
  cogs: Discord.Collection<string, Cog>;
  logger: Log;
  loadedSlashCommands: Discord.Collection<string, string>;
}

export interface HybridCommand {
  name: string;
  aliases?: string[];
  description: string;
  ownerOnly?: boolean;
  usage: string;
  dmOnly: "BOTH" | "GUILD_ONLY" | "DM_ONLY";
  cog?: string;
  data:
    | Discord.SlashCommandBuilder
    | Discord.SlashCommandSubcommandsOnlyBuilder
    | Discord.SlashCommandSubcommandGroupBuilder
    | Discord.SlashCommandUserPermissionsBuilder;
  selfPermissions: Discord.PermissionsBitField.Flags[] | never[];
  userPermissions: Discord.PermissionsBitField.Flags[] | never[];
  execute({
    baseClient,
    modifiedClient,
    guild,
    args,
    message,
    interaction,
  }: {
    baseClient: Discord.Client;
    modifiedClient: Client;
    guild: Discord.Guild;
    args?: string[];
    message?: Discord.Message;
    interaction?: Discord.CommandInteraction;
  }): any | Promise<any>;
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
  cog?: string;
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
