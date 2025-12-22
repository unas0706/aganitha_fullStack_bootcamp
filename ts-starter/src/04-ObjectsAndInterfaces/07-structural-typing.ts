interface PersonBase {
  name: string;
  age: number;
  location?: string;
}

function printPerson(p: PersonBase): void {
  console.log(p.name, p.age);
}

printPerson({
  name: "Ali",
  age: 30,
  location: "India", // extra property
});
