import { readdir } from "node:fs/promises";
import path from "path";
import os from "os";
import readline from "readline";
import { invalidInputMessage, operationFailedMessage } from "./messages.js";
import {
  cmd_add,
  cmd_cat,
  cmd_cp,
  cmd_mkdir,
  cmd_mv,
  cmd_rm,
  cmd_rn,
} from "./commands/files.js";
import { cmd_os } from "./commands/os.js";

const cliArgs = process.argv.slice(2);

let username = null;

for (const arg of cliArgs) {
  if (arg.startsWith("--username=")) {
    username = arg.split("=")[1] || null;
  }
}

if (!username) {
  invalidInputMessage();
  process.exit(1);
}

const home = os.homedir();
process.chdir(home);

function printCwd() {
  console.log(`You are currently in ${process.cwd()}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.on("line", async (line) => {
  const input = (line || "").trim();
  if (!input) {
    rl.prompt();
    printCwd();
    return;
  }

  if (input === ".exit") {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  }

  const parts = input.split(" ");
  const cmd = parts[0];
  const args = parts.slice(1);

  try {
    switch (cmd) {
      case "ls": {
        const filesAndFolders = await readdir(process.cwd(), {
          withFileTypes: true,
        });
        const folders = filesAndFolders
          .filter((el) => el.isDirectory())
          .map((el) => el.name);
        const files = filesAndFolders
          .filter((el) => el.isFile())
          .map((el) => el.name);
        folders.sort().forEach((folder) => console.log(`<DIR> ${folder}`));

        files.sort().forEach((file) => console.log(`<file> ${file}`));
        break;
      }

      case "up": {
        const parent = path.resolve(process.cwd(), "..");

        if (process.cwd() !== home) {
          process.chdir(parent);
        }
        break;
      }

      case "cd": {
        if (args.length !== 1) {
          invalidInputMessage();
        } else {
          const target = args[0];
          const resolved = path.resolve(process.cwd(), target);
          if (resolved.startsWith(home)) {
            process.chdir(resolved);
          } else {
            operationFailedMessage();
          }
        }
        break;
      }

      case "cat": {
        if (args.length !== 1) {
          invalidInputMessage();
        }

        await cmd_cat(args[0]);
        break;
      }

      case "add": {
        if (args.length !== 1) {
          invalidInputMessage();
        } else {
          await cmd_add(args[0]);
        }
        break;
      }

      case "mkdir": {
        if (args.length !== 1) {
          invalidInputMessage();
        } else {
          await cmd_mkdir(args[0]);
        }
        break;
      }

      case "rn": {
        if (args.length !== 2) {
          invalidInputMessage();
        }

        await cmd_rn(args[0], args[1]);
        break;
      }

      case "cp": {
        if (args.length !== 2) {
          invalidInputMessage();
        }

        await cmd_cp(args[0], args[1]);
        break;
      }

      case "mv": {
        if (args.length !== 2) {
          invalidInputMessage();
        }

        await cmd_mv(args[0], args[1]);
        break;
      }

      case "rm": {
        if (args.length !== 1) {
          invalidInputMessage();
        }

        await cmd_rm(args[0]);
      }

      case "os": {
        if (args.length !== 1) {
          invalidInputMessage();
        }
        cmd_os(args[0]);
        break;
      }

      default:
        invalidInputMessage();
    }
  } catch (err) {
    operationFailedMessage();
  }

  printCwd();
  rl.prompt();
});

console.log(`Welcome to the File Manager, ${username}!`);
printCwd();

rl.on("close", () => {
  console.log("\n" + `Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

process.on("SIGINT", () => {
  rl.close();
});

rl.prompt();
