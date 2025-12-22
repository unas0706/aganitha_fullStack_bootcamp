function multiply(a: number, b: number): number {
  return a * b;
}

const multiplyArrow = (a: number, b: number): number => a * b;

const square = (n: number): number => n * n;

const nums = [1, 2, 3, 4];

const doubled = nums.map((n) => n * 2);
const evens = nums.filter((n) => n % 2 === 0);
const sum = nums.reduce((a, b) => a + b, 0);

console.log("Multiply:", multiply(3, 4));
console.log("Multiply Arrow:", multiplyArrow(3, 4));
console.log("Square:", square(5));
console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);
