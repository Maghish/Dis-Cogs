import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { Client, SlashCommand } from "./discord-bot-types";

export class Deploy {
  private clientID: string;
  private token: string;
  private commands: any[];
  private client: Client;

  constructor(client: Client) {
    dotenv.config();

    this.client = client;
    this.clientID = process.env.CLIENTID!;
    this.token = process.env.TOKEN!;
    this.commands = [];

    client.slashCommands.forEach((command: SlashCommand) => {
      this.commands.push(command.data.toJSON());
    });
  }

  public async registerCommands() {
    try {
      const rest = new REST().setToken(this.token);
      try {
        const data: any = await rest.put(
          Routes.applicationCommands(this.clientID),
          {
            body: this.commands,
          }
        );
        this.client.logger.log(
          `Reloaded ${data.length} slash commands`,
          "bot_log"
        );
      } catch (error: any) {
        this.client.logger.log(
          "Unexpected error occurred while registering slash commands.\n" +
            error.message,
          "bot_error"
        );
      }
    } catch (error) {
      this.client.logger.log("Invalid token was provided!", "bot_error");
    }
  }
}
