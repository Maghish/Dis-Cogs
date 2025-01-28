export interface TUIComponentSchemaType {
  name: string;
  type: "log" | "box";
  properties: { [key: string]: any };
}
