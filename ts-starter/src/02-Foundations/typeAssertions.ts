let value: unknown = "hello";

let len = (value as string).length;
console.log(len);

let num = value as number;

console.log(num + 10);

function getLength(input: unknown): number {
  return (input as string).length;
}

console.log(getLength("TypeScript"));
console.log(getLength(123));
