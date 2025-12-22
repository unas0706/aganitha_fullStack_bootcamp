class Semaphore {
  private queue: (() => void)[] = [];
  private count: number;

  constructor(count: number) {
    this.count = count;
  }

  async acquire() {
    if (this.count > 0) {
      this.count--;
      return;
    }
    await new Promise<void>((res) => this.queue.push(res));
  }

  release() {
    this.count++;
    this.queue.shift()?.();
  }
}

async function runWithLimit<T>(
  limit: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const sem = new Semaphore(limit);
  const results: T[] = [];

  await Promise.all(
    tasks.map(async (task, i) => {
      await sem.acquire();
      try {
        results[i] = await task();
      } finally {
        sem.release();
      }
    })
  );

  return results;
}
