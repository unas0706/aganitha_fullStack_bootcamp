function add(a: number, b: number): number {
  return a + b;
}
function addInferred(a: number, b: number) {
  return a + b;
}
console.log(add(5, 10));
console.log(addInferred(15, 25));

function logMessage(msg: string): void {
  console.log(msg);
}
logMessage("Hello, TypeScript!");

function badVoid(): void {
  // return 10;
}
