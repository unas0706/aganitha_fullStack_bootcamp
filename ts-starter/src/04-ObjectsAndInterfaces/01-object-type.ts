type Person = {
  name: string;
  age: number;
};
const p1: Person = {
  name: "Unas",
  age: 22,
};

// const p2: Person = {
//   name: "Unas",
//   age: "two"
// };

type PersonWithId = {
  readonly id: string;
  name: string;
  age: number;
};

const p3: PersonWithId = {
  id: "1",
  name: "Ali",
  age: 30,
};

// p3.id = "2";
