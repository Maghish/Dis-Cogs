import { Bot } from "./bot";
import { Deploy } from "./modules/discordbot/deploy";
import blessed from "blessed";
import figlet from "figlet";
import { version } from "../package.json";

class TUI {
  public screen: blessed.Widgets.Screen;

  constructor() {
    this.screen = blessed.screen({
      cursor: {
        artificial: true,
        shape: "block",
        blink: true,
        color: "green",
      },
      smartCSR: true,
      dockBorders: true,
      autoPadding: true,
    });
    this.screen.key(["escape", "q", "C-c"], function (ch, key) {
      return process.exit(0);
    });
  }

  public render() {
    this.screen.render();
  }
  public createElement(
    element: (
      options: blessed.Widgets.ElementOptions
    ) => blessed.Widgets.BlessedElement,
    properties: blessed.Widgets.ElementOptions
  ): blessed.Widgets.BlessedElement {
    const fullElement = element(properties);
    this.screen.append(fullElement);
    return fullElement;
  }
}

async function main() {
  const screen = new TUI();

  const loadingLog = screen.createElement(blessed.log, {
    top: "50%",
    left: "20%",
    width: "40%",
    height: "50%",
    label: "Loading Log",
    content: "",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "green",
      border: {
        fg: "white",
      },
    },
    scrollable: true,
  });

  const errorLog = screen.createElement(blessed.log, {
    top: "50%",
    right: 0,
    width: "40%",
    height: "50%",
    label: "Error Log",
    content: "",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "red",
      border: {
        fg: "white",
      },
    },
  });

  const loadedCog = screen.createElement(blessed.box, {
    top: "50%",
    left: 0,
    width: "20%",
    height: "50%",
    label: "Loaded Cogs",
    content: "- Loading...",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "blue",
      border: {
        fg: "white",
      },
    },
  });

  const title = screen.createElement(blessed.box, {
    top: 0,
    left: 0,
    width: "100%",
    height: "50%",
    align: "center",
    valign: "middle",
    content:
      figlet.textSync("DisCogs", {
        font: "Small Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      }) + `\nv${version}`,
    tags: true,
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: "white",
      },
      fg: "red",
    },
  });

  const deploy = new Deploy(loadingLog, errorLog, loadedCog);
  await deploy.registerCommands();

  const bot = new Bot(loadingLog, errorLog, loadedCog);
  await bot.start();
}

main().catch((error) => {
  console.error("An error occurred while starting the bot:", error);
});
