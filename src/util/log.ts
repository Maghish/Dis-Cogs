export default function log(content: string, type: string) {
  try {
    console.log(`[${type}] ${content}`);
  } catch (error) {
    console.error(error);
  }
}
