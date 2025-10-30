import { readdir } from "node:fs/promises";
import path from "path";
import os from "os";
import readline from "readline";

const cliArgs = process.argv.slice(2);

let username = null;

for (const arg of cliArgs) {
  if (arg.startsWith("--username=")) {
    username = arg.split("=")[1] || null;
  }
}

if (!username) {
  console.error("Invalid input");
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
          console.log("Invalid input");
        } else {
          const target = args[0];
          const resolved = path.resolve(process.cwd(), target);
          if (resolved.startsWith(home)) {
            process.chdir(resolved);
          } else {
            console.log("Operation failed");
          }
        }
        break;
      }
      default:
        console.log("Invalid input");
    }
  } catch (err) {
    console.log("Operation failed");
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
