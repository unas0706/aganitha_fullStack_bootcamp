abstract class Store<T> {
  abstract get(key: string): T | undefined;
  abstract set(key: string, value: T): void;
  abstract has(key: string): boolean;
}

class MemoryStore<T> extends Store<T> {
  private map = new Map<string, T>();

  get(key: string) {
    return this.map.get(key);
  }

  set(key: string, value: T) {
    this.map.set(key, value);
  }

  has(key: string) {
    return this.map.has(key);
  }
}

interface IStore<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
}
