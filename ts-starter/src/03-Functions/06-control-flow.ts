function isEven(n: number): boolean {
  return n % 2 === 0;
}

if (isEven(4)) {
  console.log("Even number");
}

let count = 3;

while (count > 0) {
  console.log(count);
  count--;
}

type Command = "start" | "stop";

function handleCommand(cmd: Command): void {
  switch (cmd) {
    case "start":
      console.log("Starting");
      break;
    case "stop":
      console.log("Stopping");
      break;
    default:
      const _exhaustive: never = cmd;
      throw new Error(`Unhandled: ${_exhaustive}`);
  }
}
handleCommand("start");
handleCommand("stop");
