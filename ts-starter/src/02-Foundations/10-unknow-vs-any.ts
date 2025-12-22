let a: any;

a = 10;
a.toUpperCase();
console.log(a);

let u: unknown;

// u.toUpperCase();

if (typeof u === "string") {
  console.log(u.toUpperCase());
}
