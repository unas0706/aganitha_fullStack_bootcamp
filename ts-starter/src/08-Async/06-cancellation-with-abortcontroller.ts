function withTimeoutSignal(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, signal: controller.signal, timer };
}

function mockFetch(signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject(new Error("Aborted")));
    setTimeout(() => resolve("ok"), 1000);
  });
}

const { signal } = withTimeoutSignal(200);
await mockFetch(signal);
