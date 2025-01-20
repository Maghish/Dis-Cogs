import { workerData } from "worker_threads";
import blessed from "blessed";
import express from "express";
import cors from "cors";
import { log } from "blessed-contrib";

const port = workerData.port;
const app = express();
const screen = blessed.screen();

screen.key(["escape", "q", "C-c"], () => {
  process.exit(0);
});

screen.append(
  log({
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
    border: {
      type: "line",
    },
  })
);
screen.render();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/log", (req, res) => {
  // console.log(req.body.content);
  res.status(200);
});

app.listen(port, () => {
  console.log(`TUI listening on port ${port}`);
});
