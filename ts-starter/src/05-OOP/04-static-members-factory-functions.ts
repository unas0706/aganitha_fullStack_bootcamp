class CounterWithStatics {
  private _value: number;
  static created = 0;

  constructor(initial = 0) {
    this._value = initial;
    CounterWithStatics.created++;
  }

  value() {
    return this._value;
  }

  static fromJSON(json: string): CounterWithStatics {
    const data = JSON.parse(json);
    return new CounterWithStatics(data.value);
  }
}

CounterWithStatics.created;

function makeCounter(initial = 0) {
  let value = initial;

  return {
    inc() {
      value++;
      return this;
    },
    dec() {
      value--;
      return this;
    },
    value() {
      return value;
    },
  };
}
