import { TUIComponentSchemaType } from "../types";

export default {
  name: "bot_log",
  type: "log",
  properties: {
    top: "50%",
    left: "20%",
    width: "40%",
    height: "50%",
    scrollable: true,
    label: "Log (Discord Bot)",
    style: {
      border: { fg: "white" },
      fg: "blue",
    },
    border: {
      type: "line",
    },
  },
} as TUIComponentSchemaType;
