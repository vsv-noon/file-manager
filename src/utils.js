import path from "path";
import fs from "fs";

export function resolvePath(p) {
  return path.resolve(process.cwd(), p);
}

export function fileExists(p) {
  return fs.existsSync(p);
}
