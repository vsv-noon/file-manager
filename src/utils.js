import path from "path";
import fs from "fs";

import { access, constants } from "fs/promises";

export function resolvePath(p) {
  return path.resolve(process.cwd(), p);
}

// export function fileExists(p) {
//   return fs.existsSync(p);
// }

export async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
