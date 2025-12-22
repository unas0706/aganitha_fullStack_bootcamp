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

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

async function safeFetch(): Promise<Result<User>> {
  try {
    return { ok: true, value: await fetchUser("1") };
  } catch {
    return { ok: false, error: "Failed" };
  }
}
