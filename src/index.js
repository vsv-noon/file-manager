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
import { cmd_hash } from "./commands/hash.js";
import { cmd_compress, cmd_decompress } from "./commands/compress.js";
import { cmd_cd, cmd_ls, cmd_up } from "./commands/navigation.js";

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
        cmd_ls();
        break;
      }

      case "up": {
        if (args.length > 0) {
          invalidInputMessage();
        }
        cmd_up();
        break;
      }

      case "cd": {
        if (args.length !== 1) {
          invalidInputMessage();
        }
        cmd_cd(args[0]);
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

      case "hash": {
        if (args.length !== 1) {
          invalidInputMessage();
        }
        cmd_hash(args[0]);
        break;
      }

      case "compress": {
        if (args.length !== 2) {
          invalidInputMessage();
        }
        cmd_compress(args[0], args[1]);
        break;
      }

      case "decompress": {
        if (args.length !== 2) {
          invalidInputMessage();
        }
        cmd_decompress(args[0], args[1]);
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
