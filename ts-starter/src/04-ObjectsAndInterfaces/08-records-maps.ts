interface Person {
  id: string;
  name: string;
  age: number;
}

const prices: Record<string, number> = {
  apple: 100,
  banana: 40,
};

const peopleMap = new Map<string, Person>();

peopleMap.set("u1", { id: "u1", name: "Ali", age: 25 });
peopleMap.set("u2", { id: "u2", name: "Sara", age: 28 });
