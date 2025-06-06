import {
  LegacyCommand,
  SlashCommand,
  EventFunction,
  HybridCommand,
} from "./discord-bot-types";

export class Cog {
  name: string;
  legacyCommands: LegacyCommand[];
  slashCommands: SlashCommand[];
  hybridCommands: HybridCommand[];

  constructor(name: string) {
    this.name = name;
    this.legacyCommands = [];
    this.slashCommands = [];
    this.hybridCommands = [];
  }

  addLegacy(command: LegacyCommand) {
    command.cog = this.name;
    this.legacyCommands.push(command);
  }

  addSlash(command: SlashCommand) {
    command.cog = this.name;
    this.slashCommands.push(command);
  }

  addHybrid(command: HybridCommand) {
    command.cog = this.name;
    this.hybridCommands.push(command);
  }
}

export class EventCog {
  events: EventFunction[];

  constructor() {
    this.events = [];
  }

  addEvent(event: EventFunction) {
    this.events.push(event);
  }
}
