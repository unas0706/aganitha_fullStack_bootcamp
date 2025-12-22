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

async function main() {
  const user = await fetchUser("1");
}
