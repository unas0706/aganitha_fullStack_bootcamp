function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);
first(["a", "b"]);

const mixed = first([1, "two"]);
