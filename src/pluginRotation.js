import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { CLAUDE_CODE_PLUGINS } from "./pluginCatalog.js";

// 「claude-code-plugins」トピックが選ばれるたびに、一覧を順番に1件ずつ
// 取り上げていくための回転インデックスを永続化する。
const STATE_PATH = path.resolve("data/plugin-rotation.json");

async function readIndex() {
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    const data = JSON.parse(raw);
    return Number.isInteger(data.index) ? data.index : 0;
  } catch (err) {
    if (err.code === "ENOENT") return 0;
    throw err;
  }
}

async function writeIndex(index) {
  await mkdir(path.dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify({ index }, null, 2) + "\n", "utf8");
}

// 現在の回転位置のプラグインを返しつつ、次回用にインデックスを1つ進めて保存する。
export async function pickNextPlugin() {
  const index = await readIndex();
  const plugin = CLAUDE_CODE_PLUGINS[index % CLAUDE_CODE_PLUGINS.length];
  await writeIndex((index + 1) % CLAUDE_CODE_PLUGINS.length);
  return plugin;
}
