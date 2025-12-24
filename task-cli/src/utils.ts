export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function groupBy<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]> {
  return items.reduce((result, item) => {
    const groupKey = String(item[key]);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}
