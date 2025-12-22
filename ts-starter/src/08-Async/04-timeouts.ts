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

function timeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      }
    );
  });
}

await timeout(fetchUser("1"), 200);
