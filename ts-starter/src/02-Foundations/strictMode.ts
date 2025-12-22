let age: number;

// console.log(age);

function add(a: number, b: number) {
  return a + b;
}
console.log(add(5, 10));

function addExplicit(a: number, b: number): number {
  return a + b;
}
console.log(addExplicit(15, 25));
