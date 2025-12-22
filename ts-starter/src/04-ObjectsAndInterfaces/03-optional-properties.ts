type PersonOptional = {
  name: string;
  middleName?: string;
  age: number;
};

const p4: PersonOptional = {
  name: "Unas",
  age: 22,
};

console.log(p4.middleName?.toUpperCase());
// console.log(p4.middleName.toUpperCase());
