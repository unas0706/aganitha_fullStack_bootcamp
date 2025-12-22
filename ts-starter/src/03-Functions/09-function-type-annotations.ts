type Calculator = (a: number, b: number) => number;
type Validator = (input: string) => boolean;

const addCalc: Calculator = (a, b) => a + b;

const isEmail: Validator = (input) => input.includes("@");

function runCalculation(calc: Calculator, x: number, y: number): number {
  return calc(x, y);
}
console.log(runCalculation(addCalc, 5, 10));
