import path from "path";
import fs from "fs";

import { access, constants } from "fs/promises";

export function resolvePath(p) {
  return path.resolve(process.cwd(), p);
}

export function fileExists(p) {
  return fs.existsSync(p);
}
