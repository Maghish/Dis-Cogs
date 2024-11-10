export default function log(content: string, type: string) {
  try {
    console.log(`[${type}] ${content}`);
  } catch (error) {
    console.log(`[ERROR] Error when trying to log a (${type}) message`);
  }
}
