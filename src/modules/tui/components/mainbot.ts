import { TUIComponentSchemaType } from "../types";

export default {
  name: "mainbot",
  type: "log",
  properties: {
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
  },
} as TUIComponentSchemaType;
