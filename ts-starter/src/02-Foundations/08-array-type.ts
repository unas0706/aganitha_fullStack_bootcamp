const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

const mixed: (string | number)[] = ["Alice", 42, "Bob"];

function getFirst(arr: string[]): string {
  const value = arr[0];
  return value ?? "Array is empty";
}
console.log(getFirst(names));
