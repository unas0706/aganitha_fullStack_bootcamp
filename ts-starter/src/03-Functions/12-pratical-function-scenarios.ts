function validateUser(name: string, age: number, email: string): boolean {
  return name.length > 0 && age >= 18 && email.includes("@");
}

function normalizeNumbers(...values: number[]): number[] {
  return values.map((v) => v / 100);
}

function createConfig(env: "dev" | "prod", debug: boolean = false) {
  return {
    env,
    debug,
    timestamp: Date.now(),
  };
}
