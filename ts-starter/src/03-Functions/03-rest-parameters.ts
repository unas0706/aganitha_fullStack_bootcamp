function sumAll(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

console.log(sumAll(1, 2, 3));
console.log(sumAll(10, 20, 30, 40));
