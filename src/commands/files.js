import { createReadStream, createWriteStream } from "fs";
import { mkdir, rename, unlink, writeFile } from "fs/promises";
import path from "path";
import { operationFailedMessage } from "../messages.js";
import { fileExists, resolvePath } from "../utils.js";

export async function cmd_cat(file) {
  const p = resolvePath(file);

  if (!fileExists(p)) {
    return operationFailedMessage();
  }

  const stream = createReadStream(p, "utf8");
  stream.pipe(process.stdout);
}

export async function cmd_add(name) {
  const p = resolvePath(name);

  if (fileExists(p)) {
    return operationFailedMessage();
  }

  await writeFile(p, "");
}

export async function cmd_mkdir(name) {
  const p = resolvePath(name);

  if (fileExists(p)) {
    return operationFailedMessage();
  }

  await mkdir(p);
}

export async function cmd_rn(src, newName) {
  const oldPath = resolvePath(src);
  const newPath = path.join(path.dirname(oldPath), newName);

  if (!fileExists(oldPath) || fileExists(newPath)) {
    return operationFailedMessage();
  }

  await rename(oldPath, newName);
}

function copyStream(src, dest, remove = false) {
  return new Promise((resolve, reject) => {
    const read = createReadStream(src);
    const write = createWriteStream(dest);

    read.on("error", reject);
    write.on("error", reject);

    write.on("finish", () => {
      if (remove) unlink(src);
      resolve();
    });

    read.pipe(write);
  });
}

export async function cmd_cp(src, destDir) {
  const srcPath = resolvePath(src);
  const destPath = path.join(resolvePath(destDir), path.basename(src));

  if (!fileExists(srcPath) || fileExists(destPath)) {
    return operationFailedMessage();
  }

  await copyStream(srcPath, destPath);
}

export async function cmd_mv(src, destDir) {
  const srcPath = resolvePath(src);
  const destPath = path.join(resolvePath(destDir), path.basename(src));

  if (!fileExists(srcPath) || fileExists(destPath)) {
    return operationFailedMessage();
  }

  await copyStream(srcPath, destPath, true);
}

export async function cmd_rm(src) {
  const p = resolvePath(src);

  if (!fileExists(p)) {
    return operationFailedMessage();
  }

  unlink(p);
}
