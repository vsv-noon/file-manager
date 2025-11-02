import os from "os";

export function cmd_os(flag) {
  switch (flag) {
    case "--EOL":
      console.log("default system End-Of-Line:", JSON.stringify(os.EOL));
      break;
    case "--cpus":
      const cpus = os.cpus();
      console.log("CPUs:", cpus.length);
      cpus.forEach((cpu) => console.log(cpu.model, cpu.speed / 1000 + "GHz"));
    case "--homedir":
      console.log("Home directory:", os.homedir());
      break;
    case "--username":
      console.log("System user name:", os.userInfo().username);
      break;
    case "--architecture":
      console.log("CPU architecture:", process.arch);
      break;
  }
}
