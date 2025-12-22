function processId(id: string | number | boolean): string {
  if (typeof id === "string") {
    return id.toUpperCase();
  } else if (typeof id === "number") {
    return id.toString();
  } else {
    return id ? "TRUE" : "FALSE";
  }
}
console.log(processId("abc"));
console.log(processId(123));
console.log(processId(true));
console.log(processId(false));
