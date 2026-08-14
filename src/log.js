import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const LOG_PATH = path.resolve("data/tweet-log.json");
const MAX_HISTORY = 30;
const MAX_RECENT_FOR_PROMPT = 8;

export async function readLog() {
  try {
    const raw = await readFile(LOG_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export function recentTexts(log) {
  return log.slice(-MAX_RECENT_FOR_PROMPT).map((entry) => entry.text);
}

export async function appendLog(log, entry) {
  const next = [...log, entry].slice(-MAX_HISTORY);
  await mkdir(path.dirname(LOG_PATH), { recursive: true });
  await writeFile(LOG_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}
