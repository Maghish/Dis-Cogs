import { TUIComponentSchemaType } from "../types";

export default {
  name: "bot_cogs",
  type: "box",
  properties: {
    top: "50%",
    left: 0,
    width: "20%",
    height: "50%",
    label: "Loaded Cogs (Discord Bot)",
    content: "Loading...",
    scrollable: true,
    style: {
      border: { fg: "white" },
      fg: "white",
    },
    border: {
      type: "line",
    },
  },
} as TUIComponentSchemaType;
