import blessed from "blessed";
import express from "express";
import cors from "cors";

// Components
import mainbot from "./components/mainbot";

class TUI {
  private screen: blessed.Widgets.Screen;
  private port: number;
  private app: express.Express;

  private components: { [key: string]: any };

  constructor(port: number) {
    this.screen = blessed.screen();
    this.screen.key(["escape", "q", "C-c"], () => {
      process.exit(0);
    });

    this.port = port;
    this.app = express();
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.setControllers();

    this.components = {};
    this.loadComponents([mainbot]);

    // this.components = {
    // mainbot: mainbot,
    // };

    // this.appendComponentsToScreen([mainbot]);
  }

  // appendComponentsToScreen(component: any[]) {
  //   component.forEach((component) => {
  //     this.screen.append(component);
  //   });
  // }

  loadComponents(components: any[]) {
    components.forEach((comp) => {
      var component = null;
      if (comp.type === "log") {
        component = blessed.log(comp.properties);
      }

      if (!component) {
        return;
      }

      this.components[comp.name] = component;
      this.screen.append(component);
    });
  }

  setControllers() {
    this.app.post("/log", (req, res) => {
      this.components.mainbot.setContent(
        this.components.mainbot.content + "\n" + req.body.content
      );
      this.screen.render();
      res.status(200);
    });
  }

  async _start() {
    this.app.listen(this.port, () => {
      console.log(`TUI listening on port ${this.port}`);
    });

    this.screen.render();
  }

  async appendContent(content: string) {
    this.components.mainbot.setContent(
      this.components.mainbot.content + "\n" + content
    );
    this.screen.render();
  }
}

export default TUI;
