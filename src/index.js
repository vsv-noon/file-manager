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
});

rl.on("line", (line) => {
  const input = (line || "").trim();

  if (input === ".exit") {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  }
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
