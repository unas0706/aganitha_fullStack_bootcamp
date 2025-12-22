type HasId = {
  id: string;
};

type HasTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type Entity = HasId & HasTimestamps;

const userEntity: Entity = {
  id: "u1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// const brokenEntity: Entity = {
//   id: "u2",
//   createdAt: new Date()
// };
