export function printCwd() {
  console.log(`You are currently in ${process.cwd()}`);
}

export function invalidInputMessage() {
  console.log("Invalid input")
}

export function operationFailedMessage() {
  console.log("Operation failed");
}