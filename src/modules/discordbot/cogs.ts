import {
  LegacyCommand,
  SlashCommand,
  EventFunction,
} from "./discord-bot-types";

export class Cog {
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

export class EventCog {
  events: EventFunction[];

  constructor() {
    this.events = [];
  }

  addEvent(event: EventFunction) {
    this.events.push(event);
  }
}
