function identity<T>(arg: T): T {
  return arg;
}

const n = identity(42);
const s = identity("hello");
const o = identity({ id: 1 });

const explicit = identity<string>("TypeScript");

function badIdentity<T>(arg: T): any {
  return arg;
}

const x = badIdentity(10);
x.toUpperCase();
