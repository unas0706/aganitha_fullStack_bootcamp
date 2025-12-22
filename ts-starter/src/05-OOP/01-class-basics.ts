class Counter {
  private _value: number;

  constructor(initial: number = 0) {
    this._value = initial;
  }

  inc(): this {
    this._value++;
    return this;
  }

  dec(): this {
    this._value--;
    return this;
  }

  value(): number {
    return this._value;
  }
}

const c = new Counter(5).inc().inc().dec();
console.log(c.value());
