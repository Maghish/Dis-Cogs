import blessed from "blessed";

export default function log(
  content: string,
  logTab: blessed.Widgets.BoxElement
) {
  try {
    logTab.setContent(
      logTab.getContent() + `\n[${new Date().toLocaleTimeString()}] ${content}`
    );
  } catch (error) {
    logTab.setContent(
      logTab.getContent() + `[ERROR] Error when trying to log a message\n`
    );
  }
}
