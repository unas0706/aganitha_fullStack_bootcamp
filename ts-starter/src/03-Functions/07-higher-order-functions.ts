function applyTwice(fn: (x: number) => number, val: number): number {
  return fn(fn(val));
}

applyTwice((n) => n * 2, 5);

// applyTwice((n: string) => n.length, 5);

function applyTwiceGeneric<T>(fn: (x: T) => T, val: T): T {
  return fn(fn(val));
}

applyTwiceGeneric((s: string) => s + "!", "Hi");
applyTwiceGeneric((n: number) => n + 1, 10);
