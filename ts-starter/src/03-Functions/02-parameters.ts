function greet(name: string, age?: number): void {
  if (age !== undefined) {
    console.log(`Hello ${name}, age ${age}`);
  } else {
    console.log(`Hello ${name}`);
  }
}

greet("Unas");
greet("Unas", 22);

function greetWithDefault(name: string, age: number = 18): void {
  console.log(`Hello ${name}, age ${age}`);
}

greetWithDefault("Ali");
greetWithDefault("Ali", 30);
