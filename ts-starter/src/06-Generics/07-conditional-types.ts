type IsString<T> = T extends string ? true : false;

type A = IsString<string>;
type B = IsString<number>;

type ElementType<T> = T extends (infer U)[] ? U : T;

type E1 = ElementType<string[]>;
type E2 = ElementType<number[]>;
type E3 = ElementType<boolean>;
