interface User {
  id: string;
  age: number;
}

const scores: Record<string, number> = {
  alice: 90,
  bob: 85,
};

type UserId = Pick<User, "id">;
type UserWithoutAge = Omit<User, "age">;

function pluck<T, K extends keyof T>(objs: T[], key: K): T[K][] {
  return objs.map((o) => o[key]);
}

const users: User[] = [
  { id: "u1", age: 20 },
  { id: "u2", age: 30 },
];

pluck(users, "id");
pluck(users, "age");

// pluck(users, "name");
