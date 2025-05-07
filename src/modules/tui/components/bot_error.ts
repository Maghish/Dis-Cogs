import { TUIComponentSchemaType } from "../tui-types";

export default {
  name: "bot_error",
  type: "log",
  properties: {
    top: "50%",
    left: "60%",
    width: "40%",
    height: "50%",
    scrollable: true,
    label: "Error Log (Discord Bot)",
    style: {
      border: { fg: "white" },
      fg: "red",
    },
    border: {
      type: "line",
    },
  },
} as TUIComponentSchemaType;
