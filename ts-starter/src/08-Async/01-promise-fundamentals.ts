const p: Promise<number> = new Promise((resolve) => {
  resolve(42);
});

async function add(a: number, b: number): Promise<number> {
  return a + b;
}

function readDataCb(cb: (err: Error | null, data?: string) => void) {
  setTimeout(() => cb(null, "data"), 500);
}

function readData(): Promise<string> {
  return new Promise((resolve, reject) => {
    readDataCb((err, data) => {
      if (err) reject(err);
      else resolve(data!);
    });
  });
}

const promise = add(1, 2);
const value = await add(1, 2);
