import { workerData } from "worker_threads";
import blessed, { box } from "blessed";
import express from "express";
import cors from "cors";
import { log } from "blessed-contrib";

// const port = workerData.port;
const app = express();
const screen = blessed.screen();

screen.key(["escape", "q", "C-c"], () => {
  process.exit(0);
});

const s = log({
  top: "center",
  left: "center",
  width: "50%",
  height: "50%",
  style: {
    fg: "white",
  },
  border: {
    type: "line",
  },
});

screen.append(s);
screen.render();

class TUI {
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  async _start() {
    app.listen(this.port, () => {
      console.log(`TUI listening on port ${this.port}`);
    });

    screen.render();
  }

  async appendContent(content: string) {
    s.setContent(s.content + "\n" + content);
    screen.render();
  }
}

export default TUI;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/log", (req, res) => {
  s.setContent(s.content + "\n" + req.body.content);
  screen.render();
  res.status(200);
});
