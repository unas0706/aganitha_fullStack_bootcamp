function processData(data: unknown): string {
  if (typeof data === "string") return data.toUpperCase();
  if (typeof data === "number") return data.toString();
  return "Unsupported data";
}

function logError(msg: string): void {
  console.error(msg);
}

function throwError(message: string): never {
  throw new Error(message);
}

console.log(processData("test"));
console.log(processData(123));
// console.log(processData(true));
logError("This is an error message.");
// throwError("This is a fatal error.");
