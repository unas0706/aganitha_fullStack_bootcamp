type Person = {
  id: string;
  name: string;
  age: number;
};

const partialPerson: Partial<Person> = {
  name: "Ali",
};

const nameOnly: Pick<Person, "name"> = {
  name: "Unas",
};

const noAge: Omit<Person, "age"> = {
  id: "P10",
  name: "Sara",
};

type EditablePerson = Partial<Omit<Person, "id">>;

const editPerson: EditablePerson = {
  name: "Updated",
};
