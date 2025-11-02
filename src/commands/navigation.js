import path from "path";
import os from "os";
import { readdir } from "fs/promises";
import { chdir } from "process";
import { operationFailedMessage } from "../messages.js";

export async function cmd_cd(path) {
  try {
    chdir(path);
  } catch (error) {
    console.error("Error navigation to:", error.message);
    operationFailedMessage();
  }
}

export async function cmd_up() {
  const currentDir = process.cwd();
  const parentDir = path.join(currentDir, "..");

  try {
    if (parentDir !== currentDir) {
      process.chdir(parentDir);
    } else {
      console.log("You are already in the root directory");
    }
  } catch (error) {
    console.error("Error navigation up", error);
    operationFailedMessage();
  }
}

export async function cmd_ls() {
  try {
    const filesAndFolders = await readdir(process.cwd(), {
      withFileTypes: true,
    });

    const list = filesAndFolders
      .map((item) => ({
        Name: item.name,
        Type: item.isDirectory() ? "directory" : "file",
      }))
      .sort((a, b) => {
        if (a.Type !== b.Type) {
          return a.Type === "Directory" ? -1 : 1;
        }

        return a.Name.localeCompare(b.Name);
      });

    console.log("\n");
    console.table(list);
  } catch (error) {
    console.error(error);
    operationFailedMessage();
  }
}
