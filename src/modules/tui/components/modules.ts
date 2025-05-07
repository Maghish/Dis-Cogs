import { TUIComponentSchemaType } from "../tui-types";

export default {
  name: "modules",
  type: "box",
  properties: {
    top: 0,
    right: 0,
    width: "20%",
    height: "50%",
    content: "- TUI ✅",
    label: "Loaded Modules",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: "white",
      },
      fg: "white",
    },
  },
} as TUIComponentSchemaType;
