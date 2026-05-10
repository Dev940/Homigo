import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src", "docs", "openapi");
const dest = path.join(root, "dist", "docs", "openapi");

if (!fs.existsSync(src)) {
  console.warn("copy-openapi: no openapi dir at", src);
  process.exit(0);
}
fs.mkdirSync(dest, { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log("copy-openapi:", src, "->", dest);
