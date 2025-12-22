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

class AdvancedCounter extends Counter {
  private _step = 1;

  get isZero(): boolean {
    return this.value() === 0;
  }

  set step(n: number) {
    if (n < 0) {
      throw new Error("Step cannot be negative");
    }
    this._step = n;
  }

  inc(): this {
    for (let i = 0; i < this._step; i++) super.inc();
    return this;
  }
}

const ac = new AdvancedCounter(0);
ac.step = 2;
ac.inc();
console.log(ac.value());
