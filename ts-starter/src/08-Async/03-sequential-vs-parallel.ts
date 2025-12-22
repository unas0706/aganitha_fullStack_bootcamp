type User = {
  id: string;
  name: string;
};

async function fetchUser(id: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Alice" });
    }, 500);
  });
}

async function sequential() {
  const a = await fetchUser("1");
  const b = await fetchUser("2");
  return [a, b];
}

async function parallel() {
  const [a, b] = await Promise.all([fetchUser("1"), fetchUser("2")]);
  return [a, b];
}

const results = await Promise.allSettled([fetchUser("1"), fetchUser("2")]);

results.forEach((r) => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});
