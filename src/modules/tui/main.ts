import blessed from "blessed";
import express from "express";
import cors from "cors";

// Components
import botCogsBox from "./components/bot_cogs";
import botErrorLog from "./components/bot_error";
import botLog from "./components/bot_log";
import modulesBox from "./components/modules";
import logoBox from "./components/logo";
import generalLog from "./components/general_log";

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
    this.loadComponents([
      botCogsBox,
      botErrorLog,
      botLog,
      modulesBox,
      logoBox,
      generalLog,
    ]);

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
      if (comp.type === "log") component = blessed.log(comp.properties);
      if (comp.type === "box") component = blessed.box(comp.properties);

      if (!component) {
        return;
      }

      this.components[comp.name] = component;
      this.screen.append(component);
    });
  }

  setControllers() {
    this.app.post("/botlog", (req, res) => {
      try {
        if (this.components.bot_log.content === "") {
          this.components.bot_log.setContent(req.body.content);
        } else {
          this.components.bot_log.setContent(
            this.components.bot_log.content + "\n" + req.body.content
          );
        }
        this.screen.render();
        res.status(200).send();
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("undefined")) {
          this.screen.destroy();
          console.error("Default components are missing");
          process.exit(1);
        } else {
          throw error;
        }
      }
    });

    this.app.post("/boterror", (req, res) => {
      try {
        if (this.components.bot_error.content === "") {
          this.components.bot_error.setContent(req.body.content);
        } else {
          this.components.bot_error.setContent(
            this.components.bot_error.content + "\n" + req.body.content
          );
        }
        this.screen.render();
        res.status(200).send();
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("undefined")) {
          this.screen.destroy();
          console.error("Default components are missing");
          process.exit(1);
        } else {
          throw error;
        }
      }
    });

    this.app.post("/setcogs", (req, res) => {
      try {
        this.components.bot_cogs.setContent(req.body.content);
        this.screen.render();
        res.status(200).send();
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("undefined")) {
          this.screen.destroy();
          console.error("Default components are missing");
          process.exit(1);
        } else {
          throw error;
        }
      }
    });

    this.app.post("/generallog", (req, res) => {
      try {
        if (this.components.general_log.content === "") {
          this.components.general_log.setContent(req.body.content);
        } else {
          this.components.general_log.setContent(
            this.components.general_log.content + "\n" + req.body.content
          );
        }
        this.screen.render();
        res.status(200).send();
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("undefined")) {
          this.screen.destroy();
          console.error("Default components are missing");
          process.exit(1);
        } else {
          throw error;
        }
      }
    });
  }

  async _start() {
    this.app.listen(this.port, () => {
      console.log(`TUI listening on port ${this.port}`);
    });

    this.screen.render();
  }

  async appendGeneralLog(content: string) {
    try {
      if (this.components.general_log.content === "") {
        this.components.general_log.setContent(content);
      } else {
        this.components.general_log.setContent(
          this.components.general_log.content + "\n" + content
        );
      }
      this.screen.render();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("undefined")) {
        this.screen.destroy();
        console.error("Default components are missing");
        process.exit(1);
      } else {
        throw error;
      }
    }
  }

  async appendModule(module: string) {
    try {
      if (this.components.modules.content === "Loading...") {
        this.components.modules.setContent(`- ${module} ✅`);
      } else {
        this.components.modules.setContent(
          this.components.modules.content + "\n" + `- ${module} ✅`
        );
      }
      this.screen.render();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("undefined")) {
        this.screen.destroy();
        console.error("Default components are missing");
        process.exit(1);
      } else {
        throw error;
      }
    }
  }
}

export default TUI;
