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

class BoundedCounter extends Counter {
  constructor(initial: number, private max: number) {
    super(initial);
  }

  inc(): this {
    if (this.value() < this.max) super.inc();
    return this;
  }

  dec(): this {
    if (this.value() > 0) super.dec();
    return this;
  }
}

class BoundedCounterComp {
  constructor(private inner: Counter, private max: number) {}

  inc() {
    if (this.inner.value() < this.max) {
      this.inner.inc();
    }
  }

  dec() {
    if (this.inner.value() > 0) {
      this.inner.dec();
    }
  }

  value() {
    return this.inner.value();
  }
}
