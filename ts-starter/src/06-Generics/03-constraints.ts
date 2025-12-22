function lengthOf<T extends { length: number }>(x: T): number {
  return x.length;
}

lengthOf("hello");
lengthOf([1, 2, 3]);
lengthOf({ length: 10 });
// lengthOf(42);

type HasId = { id: string };
type HasName = { name: string };

function printEntity<T extends HasId & HasName>(e: T): string {
  return `${e.id}: ${e.name}`;
}

printEntity({ id: "u1", name: "Unas", age: 22 }); // ✅
