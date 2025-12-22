type PartialUser = {
  id?: string;
  name?: string;
};

type FullUser = Required<PartialUser>;

type FrozenUser = Readonly<{
  id: string;
  name: string;
}>;

// frozen.id = "x";

type Union = "a" | "b" | "c";

type OnlyA = Extract<Union, "a" | "d">;
type WithoutA = Exclude<Union, "a">;

type Result = Exclude<"a" | "b" | "c", "a">;
