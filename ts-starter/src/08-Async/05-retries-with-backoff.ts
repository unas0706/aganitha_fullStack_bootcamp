function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function retry<T>(
  op: () => Promise<T>,
  attempts = 2,
  backoffMs = 250
): Promise<T> {
  try {
    return await op();
  } catch (err: any) {
    if (!err?.retryable || attempts <= 0) throw err;
    await sleep(backoffMs);
    return retry(op, attempts - 1, backoffMs * 2);
  }
}
