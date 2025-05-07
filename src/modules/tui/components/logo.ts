import figlet from "figlet";
import { TUIComponentSchemaType } from "../tui-types";
import { version } from "../../../../package.json";

export default {
  name: "logo",
  type: "box",
  properties: {
    top: 0,
    left: 0,
    width: "50%",
    height: "50%",
    align: "center",
    valign: "middle",
    content:
      figlet.textSync("Dis-Cogs", {
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
  },
} as TUIComponentSchemaType;
