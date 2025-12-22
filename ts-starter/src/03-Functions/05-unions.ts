function format(input: string | number | boolean): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  if (typeof input === "number") {
    return input.toFixed(2);
  }
  return input ? "TRUE" : "FALSE";
}
console.log(format("hello"));
console.log(format(3.14159));
console.log(format(true));
console.log(format(false));
