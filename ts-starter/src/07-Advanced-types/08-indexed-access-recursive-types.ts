type User = {
  id: string;
  profile: {
    name: string;
    address: {
      city: string;
    };
  };
};

type City = User["profile"]["address"]["city"];

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue };

const data: JsonValue = {
  user: {
    name: "Unas",
    age: 22,
    skills: ["TS", "Node"],
    address: { city: "Hyderabad" },
  },
};
