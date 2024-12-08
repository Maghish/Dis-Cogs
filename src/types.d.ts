import * as Discord from "discord.js";

export interface Client extends Discord.Client {
  commands: Discord.Collection<string, LegacyCommand>;
  slashCommands: Discord.Collection<string, SlashCommand>;
  owner: string;
}

export interface Message extends Discord.Message {
  client: Client;
}

export interface SlashCommand {
  name: string;
  data: Discord.SlashCommandBuilder;
  ownerOnly?: boolean;
  selfPermissions: Discord.PermissionsBitField.Flags[];
  userPermissions: Discord.PermissionsBitField.Flags[];
  execute(
    interaction: Discord.CommandInteraction & { client: Client }
  ): any | Promise<any>;
}
export interface LegacyCommand {
  name: string;
  aliases?: string[];
  ownerOnly?: boolean;
  selfPermissions: Discord.PermissionsBitField.Flags[];
  userPermissions: Discord.PermissionsBitField.Flags[];
  execute(message: Discord.Message, args: string[]): any | Promise<any>;
}

export interface EventFunction {
  name: Discord.Events;
  once: boolean;
  execute(...args: any): any | Promise<any>;
}
