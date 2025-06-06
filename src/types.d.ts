export interface ModuleConfigType {
  name: string;
  path: string;
  layer: number;
  port: number;
  type: "THREAD" | "MAIN";
}
