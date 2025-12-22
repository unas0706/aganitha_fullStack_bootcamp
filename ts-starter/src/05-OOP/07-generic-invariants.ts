class SafeStore<T> {
  private map = new Map<string, T>();
  private open = true;

  private requireOpen() {
    if (!this.open) {
      throw new Error("Store is closed");
    }
  }

  close() {
    this.open = false;
  }

  get(key: string): T | undefined {
    this.requireOpen();
    return this.map.get(key);
  }

  set(key: string, value: T) {
    this.requireOpen();
    this.map.set(key, value);
  }
}
