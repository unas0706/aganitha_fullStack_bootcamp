type User = {
  id: string;
  age: number;
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyUser = MyReadonly<User>;

const ru: ReadonlyUser = { id: "u1", age: 30 };

// ru.age = 31;

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

const pu: MyPartial<User> = {
  id: "u2",
};
