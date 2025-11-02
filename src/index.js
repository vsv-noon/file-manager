import os from "os";
import readline from "readline";
import { printCwd } from "./messages.js";
import { handleCommand } from "./cli.js";

const username =
  process.argv.find((arg) => arg.startsWith("--username="))?.split("=")[1] ??
  "Anonym";

const home = os.homedir();
process.chdir(home);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.on("line", async (input) => {
  await handleCommand(input.trim(), username);

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
