interface PersonBase {
  name: string;
  age: number;
}

interface Employee extends PersonBase {
  role: string;
}

const emp: Employee = {
  name: "Unas",
  age: 22,
  role: "Developer",
};

// const emp2: Employee = {
//   name: "Unas",
//   role: "Developer"
// };

interface Employee {
  department?: string;
}

emp.department = "Engineering";
