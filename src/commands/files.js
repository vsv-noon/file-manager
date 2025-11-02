import { createReadStream, createWriteStream } from "fs";
import {
  access,
  constants,
  mkdir,
  rename,
  unlink,
  writeFile,
} from "fs/promises";
import path from "path";
import { operationFailedMessage } from "../messages.js";
import { fileExists, resolvePath } from "../utils.js";
import { error } from "console";

export async function cmd_cat(file) {
  const p = resolvePath(file);

  try {
    await access(p, constants.F_OK);
    const stream = createReadStream(p, "utf8");
    stream.pipe(process.stdout);
  } catch (error) {
    console.error(error.message);
    operationFailedMessage();
  }
}

export async function cmd_add(name) {
  const p = resolvePath(name);

  try {
    await access(p, constants.F_OK);
    throw new Error("File already exists");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(p, "");
    } else {
      console.error(error.message);
      operationFailedMessage();
    }
  }
}

export async function cmd_mkdir(name) {
  const p = resolvePath(name);

  try {
    await access(p, constants.F_OK);
    throw new Error("Directory already exists");
  } catch (error) {
    if (error.code === "ENOENT") {
      await mkdir(p);
    } else {
      console.error(error.message);
      operationFailedMessage();
    }
  }
}

export async function cmd_rn(src, newName) {
  const oldPath = resolvePath(src);
  const newPath = path.join(path.dirname(oldPath), newName);

  try {
    await access(newPath, constants.F_OK);
    throw new Error("File already exists");
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await access(oldPath, constants.F_OK);
        await rename(oldPath, newName);
      } catch (error) {
        console.error(error.message);
        operationFailedMessage();
      }
    } else {
      console.error(error.message);
      operationFailedMessage();
    }
  }
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

  try {
    await access(destPath, constants.F_OK);
    throw new Error("File already exists");
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await access(srcPath, constants.F_OK);

        await copyStream(srcPath, destPath);
      } catch (error) {
        console.error(error.message);
        operationFailedMessage();
      }
    } else {
      operationFailedMessage();
    }
  }
}

export async function cmd_mv(src, destDir) {
  const srcPath = resolvePath(src);
  const destPath = path.join(resolvePath(destDir), path.basename(src));

  try {
    await access(destPath, constants.F_OK);
    throw new Error("File already exists");
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await access(srcPath, constants.F_OK);

        await copyStream(srcPath, destPath, true);
      } catch (error) {
        console.error(error.message);
        operationFailedMessage();
      }
    } else {
      operationFailedMessage();
    }
  }
}

export async function cmd_rm(src) {
  const p = resolvePath(src);

  try {
    await access(p, constants.F_OK);
    await unlink(p);
  } catch (error) {
    console.error(error.message);
    operationFailedMessage();
  }
}
