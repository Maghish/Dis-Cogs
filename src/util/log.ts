import blessed from "blessed";

export default function log(
  content: string,
  logTab: blessed.Widgets.BoxElement
) {
  try {
    logTab.setContent(
      logTab.getContent() + `[${new Date().toLocaleTimeString()}] ${content}\n`
    );
  } catch (error) {
    logTab.setContent(
      logTab.getContent() + `[ERROR] Error when trying to log a message\n`
    );
  }
}
