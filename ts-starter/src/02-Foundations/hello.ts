function hello(name: string, age?: number): void {
  if (age !== undefined) {
    console.log(`Hello ${name}, you are ${age} years old`);
  } else {
    console.log(`Hello ${name}`);
  }
}

hello("Unas");
hello("Unas", 22);
