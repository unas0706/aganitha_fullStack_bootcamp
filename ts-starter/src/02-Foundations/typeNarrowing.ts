function printValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(`String length: ${value.length}`);
  } else {
    console.log(`Number squared: ${value * value}`);
  }
}
printValue("Hello, World!");
printValue(7);

function printValue2(value: string | number | null): void {
  if (value === null) {
    console.log("Value is null");
  } else if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
printValue2(null);
printValue2("TypeScript");
printValue2(3.14159);

function handleInput(input: string | Date): void {
  if (input instanceof Date) {
    console.log(input.toISOString());
  } else {
    console.log(input.toUpperCase());
  }
}
handleInput("hello");
handleInput(new Date());

function processData(data: number | number[]): void {
  if (Array.isArray(data)) {
    console.log(
      "Array sum:",
      data.reduce((a, b) => a + b, 0)
    );
  } else {
    console.log("Single number:", data);
  }
}
processData(42);
processData([1, 2, 3, 4, 5]);
