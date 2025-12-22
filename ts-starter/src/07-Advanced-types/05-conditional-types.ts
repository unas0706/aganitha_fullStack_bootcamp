type PromiseType<T> = T extends Promise<infer U> ? U : T;

type A = PromiseType<Promise<string>>;
type B = PromiseType<Promise<number>>;
type C = PromiseType<boolean>;

type Nullable<T> = T | null;

type NonNullable<T> = T extends null | undefined ? never : T;

type Clean = NonNullable<string | null | undefined>;
