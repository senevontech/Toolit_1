import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const mode = process.argv[2] ?? "all";

const targets =
  mode === "dev"
    ? [".next-dev"]
    : mode === "build"
      ? [".next"]
      : [".next", ".next-dev"];

for (const target of targets) {
  const nextDir = path.resolve(rootDir, target);
  if (existsSync(nextDir)) {
    rmSync(nextDir, { recursive: true, force: true });
    console.log(`Removed ${nextDir}`);
  }
}
