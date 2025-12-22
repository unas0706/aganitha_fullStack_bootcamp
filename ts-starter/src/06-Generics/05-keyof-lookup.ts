type Keys<T> = keyof T;

interface User {
  id: string;
  age: number;
}

type UserKeys = Keys<User>;
