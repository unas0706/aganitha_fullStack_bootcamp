function toArray(x: string | number) {
  if (typeof x === "string") {
    return x.split("");
  }
  return [x];
}
console.log(toArray("hello"));
console.log(toArray(42));

// console.log(toArray(True));
