import * as Discord from "discord.js";

// export interface LegacyCommand {
//   name: string;
//   aliases?: string[];
//   group: string;
//   ownerOnly?: boolean = false;
//   execute(message: Message, args: string[]): any | Promise<any>;
// }

// export interface SlashCommand {
//   data: Discord.SlashCommandBuilder;
//   group: string;
//   ownerOnly?: boolean = false;
//   execute(
//     interaction: Discord.CommandInteraction & { client: Client }
//   ): any | Promise<any>;
// }

// export interface EventFunction {
//   name: any;
//   once: boolean;
//   execute(...args: any): any | Promsie<any>;
// }

export interface Client extends Discord.Client {
  commands: Discord.Collection<string, LegacyCommand>;
  slashCommands: Discord.Collection<string, SlashCommand>;
  owners: string[];
}

export interface Message extends Discord.Message {
  client: Client;
}

export declare class Cog {
  name: string;
  legacyCommands: LegacyCommand[];
  slashCommands: SlashCommand[];

  constructor(name: string) {
    this.name = name;
    this.legacyCommands = [];
    this.slashCommands = [];
  }

  addLegacy(command: LegacyCommand) {
    this.legacyCommands.push(command);
  }

  addSlash(command: SlashCommand) {
    this.slashCommands.push(command);
  }
}

export interface SlashCommand {
  name: string;
  data: Discord.SlashCommandBuilder;
  ownerOnly?: boolean;
  execute(
    interaction: Discord.CommandInteraction & { client: Client }
  ): any | Promise<any>;
}
export interface LegacyCommand {
  name: string;
  aliases?: string[];
  ownerOnly?: boolean;
  execute(message: Discord.Message, args: string[]): any | Promise<any>;
}

export declare class EventCog {
  name: string;
  events: EventFunction[];

  constructor(name: string) {
    this.name = name;
    this.events = [];
  }

  addEvent(event: EventFunction) {
    this.events.push(event);
  }
}

export interface EventFunction {
  name: any;
  once: boolean;
  execute(...args: any): any | Promise<any>;
}
