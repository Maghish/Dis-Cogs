import { TUIComponentSchemaType } from "../types";

export default {
  name: "general_log",
  type: "log",
  properties: {
    top: 0,
    left: "50%",
    width: "30%",
    height: "50%",
    scrollable: true,
    label: "General Log",
    style: {
      border: { fg: "white" },
      fg: "green",
    },
    border: {
      type: "line",
    },
  },
} as TUIComponentSchemaType;
