function processArray<T>(arr: T[], callback: (item: T) => void): void {
  arr.forEach(callback);
}

processArray<number>([1, 2, 3], (n) => console.log(n * 2));
processArray<string>(["a", "b"], (s) => console.log(s.toUpperCase()));
